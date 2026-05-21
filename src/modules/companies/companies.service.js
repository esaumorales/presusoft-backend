import prisma from "../../config/prisma.js";

export const getCompanies = async (userId) => {
  return prisma.company.findMany({ where: { userId } });
};

export const getCompanyById = async (userId, id) => {
  const company = await prisma.company.findFirst({ where: { id, userId } });
  if (!company) throw new Error("Company not found");
  return company;
};

export const createCompany = async (userId, data) => {
  return prisma.company.create({ data: { ...data, userId } });
};

export const updateCompany = async (userId, id, data) => {
  await getCompanyById(userId, id);
  return prisma.company.update({ where: { id }, data });
};

export const deleteCompany = async (userId, id) => {
  await getCompanyById(userId, id);
  return prisma.company.delete({ where: { id } });
};
