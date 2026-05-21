import prisma from "../../config/prisma.js";

export const getBudgetCosts = async (budgetId) => {
  return prisma.budgetCost.findMany({ where: { budgetId } });
};

export const getBudgetCostById = async (id) => {
  const cost = await prisma.budgetCost.findUnique({ where: { id } });
  if (!cost) throw new Error("Cost not found");
  return cost;
};

export const createBudgetCost = async (data) => {
  return prisma.budgetCost.create({ data });
};

export const updateBudgetCost = async (id, data) => {
  await getBudgetCostById(id);
  return prisma.budgetCost.update({ where: { id }, data });
};

export const deleteBudgetCost = async (id) => {
  await getBudgetCostById(id);
  return prisma.budgetCost.delete({ where: { id } });
};
