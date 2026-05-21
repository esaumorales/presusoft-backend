import prisma from "../../config/prisma.js";
import { getModuleById } from "../modules/modules.service.js";
import { checkProjectAccess } from "../projects/projects.service.js";
import { logAction } from "../../utils/auditLogger.js";
import { calculateDependencyCost } from "../../utils/calculateBudget.js";
import { recalculateProjectBudgets } from "../budgets/budgets.service.js";

export const getDependencyById = async (user, id) => {
  const dependency = await prisma.dependency.findUnique({
    where: { id },
    include: {
      module: {
        include: {
          project: true,
        },
      },
      plan: true,
    },
  });

  if (!dependency) {
    const error = new Error("Dependencia no encontrada");
    error.statusCode = 404;
    throw error;
  }

  checkProjectAccess(dependency.module.project, user, "read");
  return dependency;
};

export const createDependency = async (user, moduleId, data) => {
  const moduleItem = await getModuleById(user, moduleId);
  checkProjectAccess(moduleItem.project, user, "write");

  // Fetch plan to get the price
  const plan = await prisma.providerPlan.findUnique({ where: { id: data.planId } });
  if (!plan) {
    const error = new Error("Plan de proveedor no encontrado");
    error.statusCode = 404;
    throw error;
  }

  const quantity = Number(data.quantity) || 1;
  const cost = calculateDependencyCost({ plan, quantity });

  const dependency = await prisma.dependency.create({
    data: {
      moduleId,
      providerId: data.providerId,
      planId: data.planId,
      quantity,
      cost,
    },
    include: {
      provider: true,
      plan: true,
    },
  });

  await logAction(
    user.id,
    moduleItem.projectId,
    "CREATE_DEPENDENCY",
    "Dependency",
    dependency.id,
    `Dependencia agregada: Proveedor ${dependency.provider.name}, Plan ${dependency.plan.name}, Cantidad: ${quantity}`
  );

  await recalculateProjectBudgets(user, moduleItem.projectId);

  return dependency;
};

export const updateDependency = async (user, id, data) => {
  const dependency = await getDependencyById(user, id);
  checkProjectAccess(dependency.module.project, user, "write");

  let planId = dependency.planId;
  let plan = dependency.plan;
  let providerId = dependency.providerId;

  if (data.planId && data.planId !== dependency.planId) {
    planId = data.planId;
    plan = await prisma.providerPlan.findUnique({ where: { id: planId } });
    if (!plan) {
      const error = new Error("Plan de proveedor no encontrado");
      error.statusCode = 404;
      throw error;
    }
    providerId = plan.providerId;
  }

  const quantity = data.quantity !== undefined ? Number(data.quantity) : dependency.quantity;
  const cost = calculateDependencyCost({ plan, quantity });

  const updatedDependency = await prisma.dependency.update({
    where: { id },
    data: {
      providerId,
      planId,
      quantity,
      cost,
    },
    include: {
      provider: true,
      plan: true,
    },
  });

  await logAction(
    user.id,
    dependency.module.projectId,
    "UPDATE_DEPENDENCY",
    "Dependency",
    id,
    `Dependencia actualizada: Plan ${updatedDependency.plan.name}, Cantidad: ${quantity}`
  );

  await recalculateProjectBudgets(user, dependency.module.projectId);

  return updatedDependency;
};

export const deleteDependency = async (user, id) => {
  const dependency = await getDependencyById(user, id);
  checkProjectAccess(dependency.module.project, user, "write");

  await prisma.dependency.delete({ where: { id } });

  await logAction(
    user.id,
    dependency.module.projectId,
    "DELETE_DEPENDENCY",
    "Dependency",
    id,
    `Dependencia eliminada del módulo ${dependency.module.name}`
  );

  await recalculateProjectBudgets(user, dependency.module.projectId);

  return true;
};
