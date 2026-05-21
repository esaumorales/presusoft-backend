import prisma from "../../config/prisma.js";
import { logAction } from "../../utils/auditLogger.js";
import { convertAmount } from "../../utils/currency.js";

/**
 * Validates if the user has access to edit/delete the project.
 * - Admin has full access.
 * - Creator (userId === user.id) has access if their role is admin or editor.
 * - Viewers cannot write.
 */
export const checkProjectAccess = (project, user, actionType = "write") => {
  if (user.role === "admin") return;

  if (project.userId !== user.id) {
    const error = new Error("No tienes permisos para acceder a este proyecto");
    error.statusCode = 403;
    throw error;
  }

  if (actionType === "write" && user.role === "viewer") {
    const error = new Error("Los usuarios con rol 'viewer' no tienen permisos de edición");
    error.statusCode = 403;
    throw error;
  }
};

export const getProjects = async (user, filters = {}) => {
  const where = {};
  
  // If not admin, restrict to owner's projects
  if (user.role !== "admin") {
    where.userId = user.id;
  }

  if (filters.clientId) {
    where.clientId = filters.clientId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  const projects = await prisma.project.findMany({
    where,
    include: {
      client: true,
      budgets: {
        orderBy: { createdAt: "desc" },
        take: 1, // Get the latest active budget
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Dynamic currency conversion if ?currency=XXX is selected
  if (filters.currency) {
    for (const project of projects) {
      if (project.budgets && project.budgets[0]) {
        const budget = project.budgets[0];
        if (budget.currency.toUpperCase() !== filters.currency.toUpperCase()) {
          const fromCurrency = budget.currency;
          budget.subtotal = await convertAmount(budget.subtotal, fromCurrency, filters.currency);
          budget.contingencyAmount = await convertAmount(budget.contingencyAmount, fromCurrency, filters.currency);
          budget.marginAmount = await convertAmount(budget.marginAmount, fromCurrency, filters.currency);
          budget.taxAmount = await convertAmount(budget.taxAmount, fromCurrency, filters.currency);
          budget.discountAmount = await convertAmount(budget.discountAmount, fromCurrency, filters.currency);
          budget.total = await convertAmount(budget.total, fromCurrency, filters.currency);
          budget.currency = filters.currency.toUpperCase();
        }
      }
    }
  }

  return projects;
};

export const getProjectById = async (user, id, targetCurrency = null) => {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: true,
      modules: {
        include: {
          tasks: { orderBy: { orderNumber: "asc" } },
          dependencies: {
            include: {
              provider: true,
              plan: true,
            },
          },
        },
        orderBy: { orderNumber: "asc" },
      },
      budgets: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    const error = new Error("Proyecto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  // Access validation
  checkProjectAccess(project, user, "read");

  // Currency Conversion logic
  if (targetCurrency) {
    const target = targetCurrency.toUpperCase();
    for (const module of project.modules) {
      // 1. Convert Tasks
      for (const task of module.tasks) {
        // Assume tasks rates are set in project default or budget base currency, e.g. let's check:
        // For simplicity, tasks and dependencies are stored in the active budget currency.
        const baseCurrency = project.budgets[0]?.currency || "PEN";
        if (baseCurrency !== target) {
          task.hourlyRate = await convertAmount(task.hourlyRate, baseCurrency, target);
          task.unitPrice = await convertAmount(task.unitPrice, baseCurrency, target);
          task.total = await convertAmount(task.total, baseCurrency, target);
        }
      }
      // 2. Convert Dependencies
      for (const dep of module.dependencies) {
        // Provider plans price are in USD by default or custom, let's treat them as USD and convert to target
        const planCurrency = "USD"; // Catálogo de proveedores suele cotizarse en USD
        if (planCurrency !== target) {
          if (dep.plan) {
            dep.plan.price = await convertAmount(dep.plan.price, planCurrency, target);
          }
          dep.cost = await convertAmount(dep.cost, planCurrency, target);
        }
      }
      // 3. Convert Module subtotal
      const baseCurrency = project.budgets[0]?.currency || "PEN";
      if (baseCurrency !== target) {
        module.subtotal = await convertAmount(module.subtotal, baseCurrency, target);
      }
    }

    // 4. Convert Budgets
    for (const budget of project.budgets) {
      if (budget.currency.toUpperCase() !== target) {
        const fromCurrency = budget.currency;
        budget.subtotal = await convertAmount(budget.subtotal, fromCurrency, target);
        budget.contingencyAmount = await convertAmount(budget.contingencyAmount, fromCurrency, target);
        budget.marginAmount = await convertAmount(budget.marginAmount, fromCurrency, target);
        budget.taxAmount = await convertAmount(budget.taxAmount, fromCurrency, target);
        budget.discountAmount = await convertAmount(budget.discountAmount, fromCurrency, target);
        budget.total = await convertAmount(budget.total, fromCurrency, target);
        budget.currency = target;
      }
    }
  }

  return project;
};

export const createProject = async (user, data) => {
  if (user.role === "viewer") {
    const error = new Error("Los usuarios con rol 'viewer' no pueden crear proyectos");
    error.statusCode = 403;
    throw error;
  }

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      clientId: data.clientId || null,
      name: data.name,
      description: data.description,
      status: data.status || "active",
      contingencyPercentage: data.contingencyPercentage || 0,
      marginPercentage: data.marginPercentage || 0,
    },
  });

  // Log action
  await logAction(user.id, project.id, "CREATE_PROJECT", "Project", project.id, `Proyecto creado: ${project.name}`);

  return project;
};

export const updateProject = async (user, id, data) => {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    const error = new Error("Proyecto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  // Access validation
  checkProjectAccess(project, user, "write");

  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      clientId: data.clientId !== undefined ? data.clientId : project.clientId,
      name: data.name !== undefined ? data.name : project.name,
      description: data.description !== undefined ? data.description : project.description,
      status: data.status !== undefined ? data.status : project.status,
      contingencyPercentage: data.contingencyPercentage !== undefined ? data.contingencyPercentage : project.contingencyPercentage,
      marginPercentage: data.marginPercentage !== undefined ? data.marginPercentage : project.marginPercentage,
    },
  });

  // Log action
  await logAction(user.id, project.id, "UPDATE_PROJECT", "Project", project.id, `Proyecto actualizado: ${project.name}`);

  return updatedProject;
};

export const deleteProject = async (user, id) => {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    const error = new Error("Proyecto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  // Access validation
  checkProjectAccess(project, user, "write");

  await prisma.project.delete({ where: { id } });

  // Log action
  await logAction(user.id, id, "DELETE_PROJECT", "Project", id, `Proyecto eliminado: ${project.name}`);

  return true;
};
