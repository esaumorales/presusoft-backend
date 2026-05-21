import prisma from "../../config/prisma.js";

export const getTemplates = async () => {
  return prisma.template.findMany({ include: { modules: { include: { tasks: true } } } });
};

export const getTemplateById = async (id) => {
  const template = await prisma.template.findUnique({ where: { id }, include: { modules: { include: { tasks: true } } } });
  if (!template) throw new Error("Template not found");
  return template;
};

export const createTemplate = async (data) => {
  return prisma.template.create({
    data: {
      ...data,
      modules: data.modules ? {
        create: data.modules.map(module => ({
          ...module,
          tasks: module.tasks ? { create: module.tasks } : undefined
        }))
      } : undefined
    }
  });
};

export const updateTemplate = async (id, data) => {
  await getTemplateById(id);
  return prisma.template.update({ where: { id }, data });
};

export const deleteTemplate = async (id) => {
  await getTemplateById(id);
  return prisma.template.delete({ where: { id } });
};
