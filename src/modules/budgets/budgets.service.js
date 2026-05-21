import prisma from "../../config/prisma.js";
import { calculateBudgetTotals } from "../../utils/calculateBudget.js";
import { generateBudgetCode } from "../../utils/generateBudgetCode.js";
import { getIO } from "../../sockets/socket.js";

export const createBudget = async (userId, data) => {
  const count = await prisma.budget.count({
    where: { userId },
  });

  const code = generateBudgetCode(count);

  const budget = await prisma.budget.create({
    data: {
      userId,
      clientId: data.clientId || null,
      templateId: data.templateId || null,
      code,
      title: data.title,
      description: data.description,
      currency: data.currency || "PEN",
      taxPercentage: data.taxPercentage || 18,
      discountPercentage: data.discountPercentage || 0,
      validityDays: data.validityDays || 15,
      paymentTerms: data.paymentTerms,
      notes: data.notes,
      clientNotes: data.clientNotes,
    },
    include: {
      client: true,
      modules: true,
      tasks: true,
      costs: true,
    },
  });

  await prisma.budgetVersion.create({
    data: {
      budgetId: budget.id,
      versionNumber: 1,
      createdById: userId,
      snapshotData: budget,
    },
  });

  await prisma.notification.create({
    data: {
      userId,
      budgetId: budget.id,
      title: "Presupuesto creado",
      message: `Se creó el presupuesto ${budget.code}`,
      type: "budget_created",
    },
  });

  const io = getIO();
  io.to(`user:${userId}`).emit("budget:created", budget);

  return budget;
};

export const getBudgets = async (userId) => {
  return prisma.budget.findMany({
    where: { userId },
    include: {
      client: true,
      modules: true,
      tasks: true,
      costs: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getBudgetById = async (userId, id) => {
  const budget = await prisma.budget.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      client: true,
      modules: {
        include: {
          tasks: true,
        },
      },
      tasks: true,
      costs: true,
      versions: true,
      exports: true,
    },
  });

  if (!budget) {
    const error = new Error("Presupuesto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return budget;
};

export const updateBudget = async (userId, id, data) => {
  const existingBudget = await getBudgetById(userId, id);

  if (existingBudget.status === "accepted") {
    const error = new Error("Un presupuesto aceptado no puede ser editado sin crear una nueva versión");
    error.statusCode = 400;
    throw error;
  }

  const budget = await prisma.budget.update({
    where: { id },
    data,
    include: {
      client: true,
      modules: true,
      tasks: true,
      costs: true,
    },
  });

  await createBudgetVersion(userId, id);

  const io = getIO();
  io.to(`user:${userId}`).emit("budget:updated", budget);
  io.to(`budget:${id}`).emit("budget:updated", budget);

  return budget;
};

export const deleteBudget = async (userId, id) => {
  await getBudgetById(userId, id);

  await prisma.budget.delete({
    where: { id },
  });

  const io = getIO();
  io.to(`user:${userId}`).emit("budget:deleted", { id });

  return true;
};

export const calculateBudget = async (userId, id) => {
  const budget = await getBudgetById(userId, id);

  if (budget.status === "accepted") {
    const error = new Error("Un presupuesto aceptado no puede ser editado ni recalculado");
    error.statusCode = 400;
    throw error;
  }

  const totals = calculateBudgetTotals({
    tasks: budget.tasks,
    costs: budget.costs,
    taxPercentage: budget.taxPercentage,
    discountPercentage: budget.discountPercentage,
  });

  const updatedBudget = await prisma.budget.update({
    where: { id },
    data: {
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      discountAmount: totals.discountAmount,
      total: totals.total,
    },
    include: {
      client: true,
      modules: true,
      tasks: true,
      costs: true,
    },
  });

  await createBudgetVersion(userId, id);

  const io = getIO();
  io.to(`user:${userId}`).emit("budget:calculated", updatedBudget);
  io.to(`budget:${id}`).emit("budget:calculated", updatedBudget);

  return updatedBudget;
};

export const changeBudgetStatus = async (userId, id, status) => {
  await getBudgetById(userId, id);

  const validStatuses = ["draft", "sent", "accepted", "rejected", "expired"];

  if (!validStatuses.includes(status)) {
    const error = new Error("Estado de presupuesto inválido");
    error.statusCode = 400;
    throw error;
  }

  const budget = await prisma.budget.update({
    where: { id },
    data: { status },
  });

  await prisma.notification.create({
    data: {
      userId,
      budgetId: id,
      title: "Estado de presupuesto actualizado",
      message: `El presupuesto ${budget.code} cambió a ${status}`,
      type: "budget_updated",
    },
  });

  const io = getIO();
  io.to(`user:${userId}`).emit("budget:status-changed", budget);
  io.to(`budget:${id}`).emit("budget:status-changed", budget);

  return budget;
};

export const duplicateBudget = async (userId, id) => {
  const original = await getBudgetById(userId, id);

  const count = await prisma.budget.count({
    where: { userId },
  });

  const code = generateBudgetCode(count);

  const duplicated = await prisma.budget.create({
    data: {
      userId,
      clientId: original.clientId,
      templateId: original.templateId,
      code,
      title: `${original.title} - Copia`,
      description: original.description,
      currency: original.currency,
      taxPercentage: original.taxPercentage,
      discountPercentage: original.discountPercentage,
      validityDays: original.validityDays,
      paymentTerms: original.paymentTerms,
      notes: original.notes,
      clientNotes: original.clientNotes,
      modules: {
        create: original.modules.map((module) => ({
          name: module.name,
          description: module.description,
          orderNumber: module.orderNumber,
          subtotal: module.subtotal,
          tasks: {
            create: module.tasks.map((task) => ({
              userId,
              budgetId: undefined,
              name: task.name,
              description: task.description,
              hours: task.hours,
              hourlyRate: task.hourlyRate,
              quantity: task.quantity,
              unitPrice: task.unitPrice,
              total: task.total,
              orderNumber: task.orderNumber,
            })),
          },
        })),
      },
      costs: {
        create: original.costs.map((cost) => ({
          name: cost.name,
          type: cost.type,
          amount: cost.amount,
          quantity: cost.quantity,
          total: cost.total,
          description: cost.description,
        })),
      },
    },
    include: {
      modules: {
        include: {
          tasks: true,
        },
      },
      costs: true,
    },
  });

  return duplicated;
};

const createBudgetVersion = async (userId, budgetId) => {
  const budget = await prisma.budget.findUnique({
    where: { id: budgetId },
    include: {
      client: true,
      modules: {
        include: {
          tasks: true,
        },
      },
      costs: true,
    },
  });

  const versionCount = await prisma.budgetVersion.count({
    where: { budgetId },
  });

  return prisma.budgetVersion.create({
    data: {
      budgetId,
      versionNumber: versionCount + 1,
      createdById: userId,
      snapshotData: budget,
    },
  });
};
