import prisma from "../../config/prisma.js";
import { checkProjectAccess } from "../projects/projects.service.js";
import { logAction } from "../../utils/auditLogger.js";
import { createBudgetVersion as helperCreateVersion } from "../budgets/budgets.service.js";

export const getBudgetVersions = async (user, budgetId) => {
  const budget = await prisma.budget.findUnique({
    where: { id: budgetId },
    include: { project: true },
  });

  if (!budget) {
    const error = new Error("Presupuesto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  checkProjectAccess(budget.project, user, "read");

  return prisma.budgetVersion.findMany({
    where: { budgetId },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { versionNumber: "desc" },
  });
};

export const createBudgetVersion = async (user, budgetId) => {
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

  const newVersion = await helperCreateVersion(user.id, budgetId);

  await logAction(
    user.id,
    budget.projectId,
    "CREATE_VERSION",
    "BudgetVersion",
    newVersion.id,
    `Versión v${newVersion.versionNumber} creada manualmente para presupuesto ${budget.code}`
  );

  return newVersion;
};

export const restoreBudgetVersion = async (user, versionId) => {
  const version = await prisma.budgetVersion.findUnique({
    where: { id: versionId },
    include: {
      budget: {
        include: { project: true },
      },
    },
  });

  if (!version) {
    const error = new Error("Versión no encontrada");
    error.statusCode = 404;
    throw error;
  }

  checkProjectAccess(version.budget.project, user, "write");

  const snapshot = version.snapshotData;
  const projectId = version.budget.projectId;

  // Perform restore in a transaction to guarantee data integrity
  await prisma.$transaction(async (tx) => {
    // 1. Delete all current modules of this project (cascades to delete tasks and dependencies)
    await tx.module.deleteMany({
      where: { projectId },
    });

    // 2. Recreate project structure from snapshot
    if (snapshot.project && snapshot.project.modules) {
      for (const mod of snapshot.project.modules) {
        const createdModule = await tx.module.create({
          data: {
            id: mod.id, // Keep original ID for consistency if possible, or omit
            projectId,
            name: mod.name,
            description: mod.description,
            orderNumber: mod.orderNumber,
            subtotal: mod.subtotal,
          },
        });

        // Recreate tasks
        if (mod.tasks && mod.tasks.length > 0) {
          await tx.task.createMany({
            data: mod.tasks.map((task) => ({
              id: task.id,
              moduleId: createdModule.id,
              name: task.name,
              description: task.description,
              hours: task.hours,
              hourlyRate: task.hourlyRate,
              quantity: task.quantity,
              unitPrice: task.unitPrice,
              total: task.total,
              orderNumber: task.orderNumber,
            })),
          });
        }

        // Recreate dependencies
        if (mod.dependencies && mod.dependencies.length > 0) {
          await tx.dependency.createMany({
            data: mod.dependencies.map((dep) => ({
              id: dep.id,
              moduleId: createdModule.id,
              providerId: dep.providerId,
              planId: dep.planId,
              quantity: dep.quantity,
              cost: dep.cost,
            })),
          });
        }
      }
    }

    // 3. Restore project contingency & margin percentage configuration
    await tx.project.update({
      where: { id: projectId },
      data: {
        contingencyPercentage: snapshot.contingencyPercentage || 0,
        marginPercentage: snapshot.marginPercentage || 0,
      },
    });

    // 4. Restore budget parameters and calculations
    await tx.budget.update({
      where: { id: version.budgetId },
      data: {
        title: snapshot.title,
        description: snapshot.description,
        status: snapshot.status,
        currency: snapshot.currency,
        subtotal: snapshot.subtotal,
        contingencyPercentage: snapshot.contingencyPercentage,
        contingencyAmount: snapshot.contingencyAmount,
        marginPercentage: snapshot.marginPercentage,
        marginAmount: snapshot.marginAmount,
        taxPercentage: snapshot.taxPercentage,
        taxAmount: snapshot.taxAmount,
        discountPercentage: snapshot.discountPercentage,
        discountAmount: snapshot.discountAmount,
        total: snapshot.total,
        validityDays: snapshot.validityDays,
        paymentTerms: snapshot.paymentTerms,
        notes: snapshot.notes,
        clientNotes: snapshot.clientNotes,
      },
    });
  });

  // Log action
  await logAction(
    user.id,
    projectId,
    "RESTORE_VERSION",
    "BudgetVersion",
    versionId,
    `Presupuesto ${version.budget.code} restaurado a la versión v${version.versionNumber}`
  );

  return prisma.budget.findUnique({
    where: { id: version.budgetId },
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
};
