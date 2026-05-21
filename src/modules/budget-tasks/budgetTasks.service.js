import prisma from "../../config/prisma.js";

export const getBudgetTasks = async (moduleId) => {
  return prisma.budgetTask.findMany({ where: { moduleId } });
};

export const getBudgetTaskById = async (id) => {
  const task = await prisma.budgetTask.findUnique({ where: { id } });
  if (!task) throw new Error("Task not found");
  return task;
};

export const createBudgetTask = async (data) => {
  return prisma.budgetTask.create({ data });
};

export const updateBudgetTask = async (id, data) => {
  await getBudgetTaskById(id);
  return prisma.budgetTask.update({ where: { id }, data });
};

export const deleteBudgetTask = async (id) => {
  await getBudgetTaskById(id);
  return prisma.budgetTask.delete({ where: { id } });
};
