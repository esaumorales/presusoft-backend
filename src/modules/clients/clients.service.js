import prisma from "../../config/prisma.js";

export const getClients = async (userId) => {
  return prisma.client.findMany({ where: { userId }, include: { company: true } });
};

export const getClientById = async (userId, id) => {
  const client = await prisma.client.findFirst({ where: { id, userId }, include: { company: true } });
  if (!client) throw new Error("Client not found");
  return client;
};

export const createClient = async (userId, data) => {
  return prisma.client.create({ data: { ...data, userId } });
};

export const updateClient = async (userId, id, data) => {
  await getClientById(userId, id);
  return prisma.client.update({ where: { id }, data });
};

export const deleteClient = async (userId, id) => {
  await getClientById(userId, id);
  return prisma.client.delete({ where: { id } });
};
