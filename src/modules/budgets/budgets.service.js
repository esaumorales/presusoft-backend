import prisma from "../../config/prisma.js";
import { calculateBudgetTotals } from "../../utils/calculateBudget.js";
import { generateBudgetCode } from "../../utils/generateBudgetCode.js";
import { getIO } from "../../sockets/socket.js";
import { checkProjectAccess } from "../projects/projects.service.js";
import { convertAmount } from "../../utils/currency.js";
import { logAction } from "../../utils/auditLogger.js";

export const createBudget = async (userId, user, data) => {
  let projectId = data.projectId;

  // ── Si no viene projectId, crear un proyecto automáticamente ──
  if (!projectId) {
    const newProject = await prisma.project.create({
      data: {
        userId,
        clientId: data.clientId || null,
        name: data.title || "Proyecto sin nombre",
        description: data.description || "",
        status: "active",
      },
    });
    projectId = newProject.id;
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    const error = new Error("Proyecto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  checkProjectAccess(project, user, "write");

  const count = await prisma.budget.count();

  const code = generateBudgetCode(count);

  const budget = await prisma.budget.create({
    data: {
      projectId,
      userId,
      code,
      title: data.title,
      description: data.description,
      currency: data.currency || "PEN",
      contingencyPercentage: project.contingencyPercentage,
      marginPercentage: project.marginPercentage,
      taxPercentage: data.taxPercentage || 18,
      discountPercentage: data.discountPercentage || 0,
      validityDays: data.validityDays || 15,
      paymentTerms: data.paymentTerms,
      notes: data.notes,
      clientNotes: data.clientNotes,
    },
    include: {
      project: {
        include: {
          client: true,
        },
      },
    },
  });

  // If a template is selected, clone its modules and tasks into this project
  if (data.templateId) {
    const template = await prisma.template.findUnique({
      where: { id: data.templateId },
      include: {
        modules: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (template) {
      // Clear any empty modules on this project to start fresh
      await prisma.module.deleteMany({
        where: { projectId: project.id },
      });

      for (const mod of template.modules) {
        const createdModule = await prisma.module.create({
          data: {
            projectId: project.id,
            name: mod.name,
            description: mod.description,
            orderNumber: mod.orderNumber,
            subtotal: 0,
          },
        });

        if (mod.tasks && mod.tasks.length > 0) {
          await prisma.task.createMany({
            data: mod.tasks.map((task) => ({
              moduleId: createdModule.id,
              name: task.name,
              description: task.description,
              hours: task.estimatedHours,
              hourlyRate: task.defaultRate,
              quantity: 1,
              unitPrice: 0,
              total: Number(task.estimatedHours) * Number(task.defaultRate),
              orderNumber: task.orderNumber,
            })),
          });
        }
      }
    }
  }

  // Calculate initial totals (which will be based on current project modules if any exist)
  await calculateBudget(user, budget.id);

  // Fetch updated budget with calculations
  const updatedBudget = await prisma.budget.findUnique({
    where: { id: budget.id },
    include: {
      project: {
        include: {
          client: true,
        },
      },
    },
  });

  // Create initial version snapshot
  await createBudgetVersion(userId, budget.id);

  await prisma.notification.create({
    data: {
      userId,
      budgetId: budget.id,
      title: "Presupuesto creado",
      message: `Se creó el presupuesto ${budget.code}`,
      type: "budget_created",
    },
  });

  const io = getIO();
  io.to(`user:${userId}`).emit("budget:created", updatedBudget);

  await logAction(userId, projectId, "CREATE_BUDGET", "Budget", budget.id, `Presupuesto creado con código ${budget.code}`);

  return updatedBudget;
};


export const getBudgets = async (user, filters = {}) => {
  const where = {};
  
  if (user.role !== "admin") {
    where.userId = user.id;
  }

  if (filters.projectId) {
    where.projectId = filters.projectId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.clientId) {
    where.project = {
      clientId: filters.clientId,
    };
  }

  const budgets = await prisma.budget.findMany({
    where,
    include: {
      project: {
        include: {
          client: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Apply currency conversion if ?currency=XXX is queried
  if (filters.currency) {
    const targetCurrency = filters.currency.toUpperCase();
    for (const budget of budgets) {
      if (budget.currency.toUpperCase() !== targetCurrency) {
        const fromCurrency = budget.currency;
        budget.subtotal = await convertAmount(budget.subtotal, fromCurrency, targetCurrency);
        budget.contingencyAmount = await convertAmount(budget.contingencyAmount, fromCurrency, targetCurrency);
        budget.marginAmount = await convertAmount(budget.marginAmount, fromCurrency, targetCurrency);
        budget.taxAmount = await convertAmount(budget.taxAmount, fromCurrency, targetCurrency);
        budget.discountAmount = await convertAmount(budget.discountAmount, fromCurrency, targetCurrency);
        budget.total = await convertAmount(budget.total, fromCurrency, targetCurrency);
        budget.currency = targetCurrency;
      }
    }
  }

  return budgets;
};

export const getBudgetById = async (user, id, targetCurrency = null) => {
  const budget = await prisma.budget.findUnique({
    where: { id },
    include: {
      project: {
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
        },
      },
      versions: {
        orderBy: { versionNumber: "desc" },
      },
      exports: {
        orderBy: { exportedAt: "desc" },
      },
    },
  });

  if (!budget) {
    const error = new Error("Presupuesto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  checkProjectAccess(budget.project, user, "read");

  // Currency Conversion
  if (targetCurrency) {
    const target = targetCurrency.toUpperCase();
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

    // Convert modules and tasks/dependencies too
    for (const module of budget.project.modules) {
      const baseCurrency = budget.currency;
      if (baseCurrency !== target) {
        module.subtotal = await convertAmount(module.subtotal, baseCurrency, target);
      }
      for (const task of module.tasks) {
        if (baseCurrency !== target) {
          task.hourlyRate = await convertAmount(task.hourlyRate, baseCurrency, target);
          task.unitPrice = await convertAmount(task.unitPrice, baseCurrency, target);
          task.total = await convertAmount(task.total, baseCurrency, target);
        }
      }
      for (const dep of module.dependencies) {
        // Provider plans are in USD, convert to target
        if (dep.plan) {
          dep.plan.price = await convertAmount(dep.plan.price, "USD", target);
        }
        dep.cost = await convertAmount(dep.cost, "USD", target);
      }
    }
  }

  return budget;
};

export const updateBudget = async (user, id, data) => {
  const existingBudget = await prisma.budget.findUnique({
    where: { id },
    include: { project: true },
  });

  if (!existingBudget) {
    const error = new Error("Presupuesto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  checkProjectAccess(existingBudget.project, user, "write");

  if (existingBudget.status === "accepted") {
    const error = new Error("Un presupuesto aceptado no puede ser editado sin crear una nueva versión");
    error.statusCode = 400;
    throw error;
  }

  const updatedBudget = await prisma.budget.update({
    where: { id },
    data: {
      title: data.title !== undefined ? data.title : existingBudget.title,
      description: data.description !== undefined ? data.description : existingBudget.description,
      currency: data.currency !== undefined ? data.currency : existingBudget.currency,
      contingencyPercentage: data.contingencyPercentage !== undefined ? data.contingencyPercentage : existingBudget.contingencyPercentage,
      marginPercentage: data.marginPercentage !== undefined ? data.marginPercentage : existingBudget.marginPercentage,
      taxPercentage: data.taxPercentage !== undefined ? data.taxPercentage : existingBudget.taxPercentage,
      discountPercentage: data.discountPercentage !== undefined ? data.discountPercentage : existingBudget.discountPercentage,
      validityDays: data.validityDays !== undefined ? data.validityDays : existingBudget.validityDays,
      paymentTerms: data.paymentTerms !== undefined ? data.paymentTerms : existingBudget.paymentTerms,
      notes: data.notes !== undefined ? data.notes : existingBudget.notes,
      clientNotes: data.clientNotes !== undefined ? data.clientNotes : existingBudget.clientNotes,
    },
    include: {
      project: {
        include: {
          client: true,
        },
      },
    },
  });

  // Recalculate totals
  await calculateBudget(user, id);

  await logAction(user.id, existingBudget.projectId, "UPDATE_BUDGET", "Budget", id, `Presupuesto actualizado: ${updatedBudget.title}`);

  const io = getIO();
  io.to(`user:${user.id}`).emit("budget:updated", updatedBudget);

  return getBudgetById(user, id);
};

export const deleteBudget = async (user, id) => {
  const budget = await prisma.budget.findUnique({
    where: { id },
    include: { project: true },
  });

  if (!budget) {
    const error = new Error("Presupuesto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  checkProjectAccess(budget.project, user, "write");

  await prisma.budget.delete({
    where: { id },
  });

  await logAction(user.id, budget.projectId, "DELETE_BUDGET", "Budget", id, `Presupuesto eliminado: ${budget.title}`);

  const io = getIO();
  io.to(`user:${user.id}`).emit("budget:deleted", { id });

  return true;
};

export const calculateBudget = async (user, id) => {
  const budget = await prisma.budget.findUnique({
    where: { id },
    include: {
      project: {
        include: {
          modules: {
            include: {
              tasks: true,
              dependencies: {
                include: {
                  plan: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!budget) {
    const error = new Error("Presupuesto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  checkProjectAccess(budget.project, user, "write");

  if (budget.status === "accepted") {
    const error = new Error("Un presupuesto aceptado no puede ser editado ni recalculado");
    error.statusCode = 400;
    throw error;
  }

  // Convert dependency plan price to budget currency before calculation (since plans are in USD)
  const modulesCopy = JSON.parse(JSON.stringify(budget.project.modules));
  for (const module of modulesCopy) {
    for (const dep of module.dependencies) {
      if (dep.plan) {
        dep.plan.price = await convertAmount(dep.plan.price, "USD", budget.currency);
      } else {
        dep.cost = await convertAmount(dep.cost, "USD", budget.currency);
      }
    }
  }

  // Calculate totals
  const totals = calculateBudgetTotals({
    modules: modulesCopy,
    contingencyPercentage: budget.contingencyPercentage,
    marginPercentage: budget.marginPercentage,
    taxPercentage: budget.taxPercentage,
    discountPercentage: budget.discountPercentage,
  });

  // Update modules' subtotal in the DB too
  for (const moduleWithTotals of totals.modules) {
    await prisma.module.update({
      where: { id: moduleWithTotals.id },
      data: { subtotal: moduleWithTotals.subtotal },
    });
  }

  const updatedBudget = await prisma.budget.update({
    where: { id },
    data: {
      subtotal: totals.subtotal,
      contingencyAmount: totals.contingencyAmount,
      marginAmount: totals.marginAmount,
      taxAmount: totals.taxAmount,
      discountAmount: totals.discountAmount,
      total: totals.total,
    },
    include: {
      project: {
        include: {
          client: true,
        },
      },
    },
  });

  // Save historical snapshot
  await createBudgetVersion(user.id, id);

  const io = getIO();
  io.to(`user:${user.id}`).emit("budget:calculated", updatedBudget);

  return updatedBudget;
};

export const changeBudgetStatus = async (user, id, status) => {
  const budget = await prisma.budget.findUnique({
    where: { id },
    include: { project: true },
  });

  if (!budget) {
    const error = new Error("Presupuesto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  checkProjectAccess(budget.project, user, "write");

  const validStatuses = ["draft", "sent", "accepted", "rejected", "expired"];

  if (!validStatuses.includes(status)) {
    const error = new Error("Estado de presupuesto inválido");
    error.statusCode = 400;
    throw error;
  }

  const updatedBudget = await prisma.budget.update({
    where: { id },
    data: { status },
    include: {
      project: {
        include: {
          client: true,
        },
      },
    },
  });

  await prisma.notification.create({
    data: {
      userId: user.id,
      budgetId: id,
      title: "Estado de presupuesto actualizado",
      message: `El presupuesto ${updatedBudget.code} cambió a ${status}`,
      type: "budget_updated",
    },
  });

  const io = getIO();
  io.to(`user:${user.id}`).emit("budget:status-changed", updatedBudget);

  await logAction(user.id, budget.projectId, "CHANGE_BUDGET_STATUS", "Budget", id, `Estado del presupuesto cambiado a: ${status}`);

  return updatedBudget;
};

export const duplicateBudget = async (user, id) => {
  const original = await prisma.budget.findUnique({
    where: { id },
    include: { project: true },
  });

  if (!original) {
    const error = new Error("Presupuesto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  checkProjectAccess(original.project, user, "write");

  const count = await prisma.budget.count();

  const code = generateBudgetCode(count);

  const duplicated = await prisma.budget.create({
    data: {
      projectId: original.projectId,
      userId: user.id,
      code,
      title: `${original.title} - Copia`,
      description: original.description,
      currency: original.currency,
      contingencyPercentage: original.contingencyPercentage,
      contingencyAmount: original.contingencyAmount,
      marginPercentage: original.marginPercentage,
      marginAmount: original.marginAmount,
      taxPercentage: original.taxPercentage,
      taxAmount: original.taxAmount,
      discountPercentage: original.discountPercentage,
      discountAmount: original.discountAmount,
      total: original.total,
      validityDays: original.validityDays,
      paymentTerms: original.paymentTerms,
      notes: original.notes,
      clientNotes: original.clientNotes,
    },
    include: {
      project: {
        include: {
          client: true,
        },
      },
    },
  });

  await createBudgetVersion(user.id, duplicated.id);

  await logAction(user.id, original.projectId, "DUPLICATE_BUDGET", "Budget", duplicated.id, `Presupuesto duplicado. Original: ${original.code}, Nuevo: ${duplicated.code}`);

  return duplicated;
};

export const createBudgetVersion = async (userId, budgetId) => {
  // Capture complete snapshot of the project structure
  const budget = await prisma.budget.findUnique({
    where: { id: budgetId },
    include: {
      project: {
        include: {
          client: true,
          modules: {
            include: {
              tasks: true,
              dependencies: {
                include: {
                  provider: true,
                  plan: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const versionCount = await prisma.budgetVersion.count({
    where: { budgetId },
  });

  return prisma.budgetVersion.create({
    data: {
      budgetId,
      versionNumber: versionCount + 1,
      createdById: userId,
      snapshotData: JSON.parse(JSON.stringify(budget)), // deep clone JSON
    },
  });
};

export const recalculateProjectBudgets = async (user, projectId) => {
  const budgets = await prisma.budget.findMany({
    where: { projectId },
  });
  for (const budget of budgets) {
    if (budget.status !== "accepted") {
      await calculateBudget(user, budget.id);
    }
  }
};
