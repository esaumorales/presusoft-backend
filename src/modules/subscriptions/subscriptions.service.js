import prisma from "../../config/prisma.js";

export const getSubscriptions = async (userId) => {
  return prisma.subscription.findMany({ where: { userId }, include: { plan: true } });
};

export const getSubscriptionById = async (userId, id) => {
  const sub = await prisma.subscription.findFirst({ where: { id, userId }, include: { plan: true } });
  if (!sub) throw new Error("Subscription not found");
  return sub;
};

export const createSubscription = async (userId, data) => {
  return prisma.subscription.create({ data: { ...data, userId } });
};

export const updateSubscription = async (userId, id, data) => {
  await getSubscriptionById(userId, id);
  return prisma.subscription.update({ where: { id }, data });
};

export const deleteSubscription = async (userId, id) => {
  await getSubscriptionById(userId, id);
  return prisma.subscription.delete({ where: { id } });
};
