import prisma from "../../config/prisma.js";
import { checkProjectAccess } from "../projects/projects.service.js";
import { calculateBudget } from "../budgets/budgets.service.js";
import { logAction } from "../../utils/auditLogger.js";

export const getTemplates = async () => {
  return prisma.template.findMany({ include: { modules: { include: { tasks: true } } } });
};

export const getTemplateById = async (id) => {
  const template = await prisma.template.findUnique({
    where: { id },
    include: { modules: { include: { tasks: true } } }
  });
  if (!template) throw new Error("Template not found");
  return template;
};

export const createTemplate = async (data) => {
  return prisma.template.create({
    data: {
      name: data.name,
      category: data.category,
      description: data.description,
      isDefault: data.isDefault || false,
      userId: data.userId || null,
      modules: data.modules ? {
        create: data.modules.map(module => ({
          name: module.name,
          description: module.description,
          orderNumber: module.orderNumber || 1,
          tasks: module.tasks ? {
            create: module.tasks.map(task => ({
              name: task.name,
              description: task.description,
              estimatedHours: task.estimatedHours || 0,
              defaultRate: task.defaultRate || 0,
              orderNumber: task.orderNumber || 1
            }))
          } : undefined
        }))
      } : undefined
    },
    include: {
      modules: {
        include: {
          tasks: true
        }
      }
    }
  });
};

export const updateTemplate = async (id, data) => {
  const existing = await getTemplateById(id);

  await prisma.$transaction(async (tx) => {
    // Update basic fields
    await tx.template.update({
      where: { id },
      data: {
        name: data.name !== undefined ? data.name : existing.name,
        category: data.category !== undefined ? data.category : existing.category,
        description: data.description !== undefined ? data.description : existing.description,
        isDefault: data.isDefault !== undefined ? data.isDefault : existing.isDefault,
      },
    });

    if (data.modules) {
      // 1. Delete all current template modules
      await tx.templateModule.deleteMany({
        where: { templateId: id },
      });

      // 2. Recreate them
      for (const mod of data.modules) {
        const createdModule = await tx.templateModule.create({
          data: {
            templateId: id,
            name: mod.name,
            description: mod.description,
            orderNumber: mod.orderNumber || 1,
          },
        });

        if (mod.tasks && mod.tasks.length > 0) {
          await tx.templateTask.createMany({
            data: mod.tasks.map((task) => ({
              templateModuleId: createdModule.id,
              name: task.name,
              description: task.description,
              estimatedHours: task.estimatedHours || 0,
              defaultRate: task.defaultRate || 0,
              orderNumber: task.orderNumber || 1,
            })),
          });
        }
      }
    }
  });

  return getTemplateById(id);
};

export const deleteTemplate = async (id) => {
  await getTemplateById(id);
  return prisma.template.delete({ where: { id } });
};

export const applyTemplate = async (user, templateId, budgetId) => {
  const template = await prisma.template.findUnique({
    where: { id: templateId },
    include: {
      modules: {
        include: {
          tasks: true,
        },
      },
    },
  });

  if (!template) {
    const error = new Error("Plantilla no encontrada");
    error.statusCode = 404;
    throw error;
  }

  const budget = await prisma.budget.findUnique({
    where: { id: budgetId },
    include: { project: true },
  });

  if (!budget) {
    const error = new Error("Presupuesto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  checkProjectAccess(budget.project, user, "write");

  const projectId = budget.projectId;

  await prisma.$transaction(async (tx) => {
    // 1. Delete all current modules of this project (cascades to delete tasks and dependencies)
    await tx.module.deleteMany({
      where: { projectId },
    });

    // 2. Clone from template modules
    for (const mod of template.modules) {
      const createdModule = await tx.module.create({
        data: {
          projectId,
          name: mod.name,
          description: mod.description,
          orderNumber: mod.orderNumber,
          subtotal: 0,
        },
      });

      if (mod.tasks && mod.tasks.length > 0) {
        await tx.task.createMany({
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
  });

  // Recalculate budget
  const updatedBudget = await calculateBudget(user, budgetId);

  await logAction(
    user.id,
    projectId,
    "APPLY_TEMPLATE",
    "Template",
    templateId,
    `Plantilla "${template.name}" aplicada al presupuesto ${budget.code}`
  );

  return updatedBudget;
};
