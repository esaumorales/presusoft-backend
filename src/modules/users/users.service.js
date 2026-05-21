import prisma from "../../config/prisma.js";

export const getUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true, phone: true, createdAt: true },
  });
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, status: true, phone: true, createdAt: true },
  });
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUser = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};

export const deleteUser = async (id) => {
  return prisma.user.delete({ where: { id } });
};
