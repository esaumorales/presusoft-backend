import prisma from "../../config/prisma.js";

export const getPlans = async () => {
  return prisma.plan.findMany();
};

export const getPlanById = async (id) => {
  const plan = await prisma.plan.findUnique({ where: { id } });
  if (!plan) throw new Error("Plan not found");
  return plan;
};

export const createPlan = async (data) => {
  return prisma.plan.create({ data });
};

export const updatePlan = async (id, data) => {
  await getPlanById(id);
  return prisma.plan.update({ where: { id }, data });
};

export const deletePlan = async (id) => {
  await getPlanById(id);
  return prisma.plan.delete({ where: { id } });
};
