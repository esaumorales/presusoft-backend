import prisma from "../../config/prisma.js";

const checkAdminOrEditor = (user) => {
  if (user.role === "viewer") {
    const error = new Error("No tienes permisos para modificar el catálogo de proveedores");
    error.statusCode = 403;
    throw error;
  }
};

export const getProviders = async () => {
  return prisma.provider.findMany({
    include: {
      plans: true,
    },
    orderBy: { name: "asc" },
  });
};

export const createProvider = async (user, data) => {
  checkAdminOrEditor(user);

  return prisma.provider.create({
    data: {
      name: data.name,
      description: data.description,
    },
  });
};

export const updateProvider = async (user, id, data) => {
  checkAdminOrEditor(user);

  return prisma.provider.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
    },
  });
};

export const deleteProvider = async (user, id) => {
  checkAdminOrEditor(user);

  await prisma.provider.delete({ where: { id } });
  return true;
};

// Provider Plans
export const createProviderPlan = async (user, providerId, data) => {
  checkAdminOrEditor(user);

  const provider = await prisma.provider.findUnique({ where: { id: providerId } });
  if (!provider) {
    const error = new Error("Proveedor no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return prisma.providerPlan.create({
    data: {
      providerId,
      name: data.name,
      price: data.price || 0,
      billingCycle: data.billingCycle || "monthly",
      description: data.description,
    },
  });
};

export const updateProviderPlan = async (user, id, data) => {
  checkAdminOrEditor(user);

  return prisma.providerPlan.update({
    where: { id },
    data: {
      name: data.name,
      price: data.price,
      billingCycle: data.billingCycle,
      description: data.description,
    },
  });
};

export const deleteProviderPlan = async (user, id) => {
  checkAdminOrEditor(user);

  await prisma.providerPlan.delete({ where: { id } });
  return true;
};
