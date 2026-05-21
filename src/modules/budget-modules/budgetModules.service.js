import prisma from "../../config/prisma.js";

export const getBudgetModules = async (budgetId) => {
  return prisma.budgetModule.findMany({ where: { budgetId }, include: { tasks: true } });
};

export const getBudgetModuleById = async (id) => {
  const module = await prisma.budgetModule.findUnique({ where: { id }, include: { tasks: true } });
  if (!module) throw new Error("Module not found");
  return module;
};

export const createBudgetModule = async (data) => {
  return prisma.budgetModule.create({ data });
};

export const updateBudgetModule = async (id, data) => {
  await getBudgetModuleById(id);
  return prisma.budgetModule.update({ where: { id }, data });
};

export const deleteBudgetModule = async (id) => {
  await getBudgetModuleById(id);
  return prisma.budgetModule.delete({ where: { id } });
};
