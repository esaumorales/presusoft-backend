import prisma from "../../config/prisma.js";
import { logAction } from "../../utils/auditLogger.js";

export const createCollaborator = async (userId, data) => {
  const collaborator = await prisma.collaborator.create({
    data: {
      userId,
      name: data.name,
      role: data.role,
      hourlyRate: data.hourlyRate || 0,
      currency: data.currency || "USD",
    },
  });

  await logAction(userId, null, "CREATE_COLLABORATOR", "Collaborator", collaborator.id, `Colaborador creado: ${collaborator.name}`);

  return collaborator;
};

export const getCollaborators = async (userId) => {
  return prisma.collaborator.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const updateCollaborator = async (userId, id, data) => {
  const existing = await prisma.collaborator.findUnique({
    where: { id },
  });

  if (!existing || existing.userId !== userId) {
    const error = new Error("Colaborador no encontrado");
    error.statusCode = 404;
    throw error;
  }

  const updated = await prisma.collaborator.update({
    where: { id },
    data: {
      name: data.name !== undefined ? data.name : existing.name,
      role: data.role !== undefined ? data.role : existing.role,
      hourlyRate: data.hourlyRate !== undefined ? data.hourlyRate : existing.hourlyRate,
      currency: data.currency !== undefined ? data.currency : existing.currency,
    },
  });

  await logAction(userId, null, "UPDATE_COLLABORATOR", "Collaborator", id, `Colaborador actualizado: ${updated.name}`);

  return updated;
};

export const deleteCollaborator = async (userId, id) => {
  const existing = await prisma.collaborator.findUnique({
    where: { id },
  });

  if (!existing || existing.userId !== userId) {
    const error = new Error("Colaborador no encontrado");
    error.statusCode = 404;
    throw error;
  }

  await prisma.collaborator.delete({
    where: { id },
  });

  await logAction(userId, null, "DELETE_COLLABORATOR", "Collaborator", id, `Colaborador eliminado: ${existing.name}`);

  return true;
};
