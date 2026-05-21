import prisma from "../../config/prisma.js";

export const getBudgetVersions = async (budgetId) => {
  return prisma.budgetVersion.findMany({ where: { budgetId }, orderBy: { versionNumber: "desc" } });
};

export const createBudgetVersion = async (budgetId, userId) => {
  const budget = await prisma.budget.findUnique({
    where: { id: budgetId },
    include: { client: true, modules: { include: { tasks: true } }, costs: true }
  });
  if (!budget) throw new Error("Budget not found");

  const count = await prisma.budgetVersion.count({ where: { budgetId } });
  
  return prisma.budgetVersion.create({
    data: {
      budgetId,
      versionNumber: count + 1,
      snapshotData: budget,
      createdById: userId
    }
  });
};

export const restoreBudgetVersion = async (versionId) => {
  const version = await prisma.budgetVersion.findUnique({ where: { id: versionId } });
  if (!version) throw new Error("Version not found");
  
  const snapshotData = version.snapshotData;
  return prisma.budget.update({
    where: { id: version.budgetId },
    data: {
      subtotal: snapshotData.subtotal,
      taxAmount: snapshotData.taxAmount,
      discountAmount: snapshotData.discountAmount,
      total: snapshotData.total,
    }
  });
};
