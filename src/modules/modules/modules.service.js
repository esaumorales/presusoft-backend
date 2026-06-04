import prisma from "../../config/prisma.js";
import { checkProjectAccess } from "../projects/projects.service.js";
import { logAction } from "../../utils/auditLogger.js";
import { recalculateProjectBudgets } from "../budgets/budgets.service.js";

export const getModuleById = async (user, id) => {
  const moduleItem = await prisma.module.findUnique({
    where: { id },
    include: {
      project: true,
      tasks: true,
      dependencies: {
        include: {
          provider: true,
          plan: true,
        },
      },
    },
  });

  if (!moduleItem) {
    const error = new Error("Módulo no encontrado");
    error.statusCode = 404;
    throw error;
  }

  checkProjectAccess(moduleItem.project, user, "read");
  return moduleItem;
};

export const createModule = async (user, projectId, data) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    const error = new Error("Proyecto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  checkProjectAccess(project, user, "write");

  const moduleItem = await prisma.module.create({
    data: {
      projectId,
      name: data.name,
      description: data.description,
      orderNumber: data.orderNumber || 1,
      isExtra: data.isExtra || false,
    },
  });

  await logAction(user.id, projectId, "CREATE_MODULE", "Module", moduleItem.id, `Módulo creado: ${moduleItem.name}`);

  return moduleItem;
};

export const updateModule = async (user, id, data) => {
  const moduleItem = await getModuleById(user, id);
  checkProjectAccess(moduleItem.project, user, "write");

  const updatedModule = await prisma.module.update({
    where: { id },
    data: {
      name: data.name !== undefined ? data.name : moduleItem.name,
      description: data.description !== undefined ? data.description : moduleItem.description,
      orderNumber: data.orderNumber !== undefined ? data.orderNumber : moduleItem.orderNumber,
      isExtra: data.isExtra !== undefined ? data.isExtra : moduleItem.isExtra,
    },
  });

  await logAction(user.id, moduleItem.projectId, "UPDATE_MODULE", "Module", id, `Módulo actualizado: ${updatedModule.name}`);

  return updatedModule;
};

export const deleteModule = async (user, id) => {
  const moduleItem = await getModuleById(user, id);
  checkProjectAccess(moduleItem.project, user, "write");

  await prisma.module.delete({ where: { id } });

  await logAction(user.id, moduleItem.projectId, "DELETE_MODULE", "Module", id, `Módulo eliminado: ${moduleItem.name}`);

  await recalculateProjectBudgets(user, moduleItem.projectId);

  return true;
};
