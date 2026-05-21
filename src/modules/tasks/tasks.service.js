import prisma from "../../config/prisma.js";
import { getModuleById } from "../modules/modules.service.js";
import { checkProjectAccess } from "../projects/projects.service.js";
import { logAction } from "../../utils/auditLogger.js";
import { calculateTaskTotal } from "../../utils/calculateBudget.js";
import { recalculateProjectBudgets } from "../budgets/budgets.service.js";

export const getTaskById = async (user, id) => {
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      module: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!task) {
    const error = new Error("Tarea no encontrada");
    error.statusCode = 404;
    throw error;
  }

  checkProjectAccess(task.module.project, user, "read");
  return task;
};

export const createTask = async (user, moduleId, data) => {
  const moduleItem = await getModuleById(user, moduleId);
  checkProjectAccess(moduleItem.project, user, "write");

  const taskTotal = calculateTaskTotal({
    hours: data.hours,
    hourlyRate: data.hourlyRate,
    quantity: data.quantity,
    unitPrice: data.unitPrice,
  });

  const task = await prisma.task.create({
    data: {
      moduleId,
      name: data.name,
      description: data.description,
      hours: data.hours !== undefined ? data.hours : 0,
      hourlyRate: data.hourlyRate !== undefined ? data.hourlyRate : 0,
      quantity: data.quantity !== undefined ? data.quantity : 1,
      unitPrice: data.unitPrice !== undefined ? data.unitPrice : 0,
      total: taskTotal,
      orderNumber: data.orderNumber || 1,
    },
  });

  await logAction(user.id, moduleItem.projectId, "CREATE_TASK", "Task", task.id, `Tarea creada: ${task.name}`);

  await recalculateProjectBudgets(user, moduleItem.projectId);

  return task;
};

export const updateTask = async (user, id, data) => {
  const task = await getTaskById(user, id);
  checkProjectAccess(task.module.project, user, "write");

  const hours = data.hours !== undefined ? data.hours : task.hours;
  const hourlyRate = data.hourlyRate !== undefined ? data.hourlyRate : task.hourlyRate;
  const quantity = data.quantity !== undefined ? data.quantity : task.quantity;
  const unitPrice = data.unitPrice !== undefined ? data.unitPrice : task.unitPrice;

  const taskTotal = calculateTaskTotal({
    hours,
    hourlyRate,
    quantity,
    unitPrice,
  });

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      name: data.name !== undefined ? data.name : task.name,
      description: data.description !== undefined ? data.description : task.description,
      hours,
      hourlyRate,
      quantity,
      unitPrice,
      total: taskTotal,
      orderNumber: data.orderNumber !== undefined ? data.orderNumber : task.orderNumber,
    },
  });

  await logAction(user.id, task.module.projectId, "UPDATE_TASK", "Task", id, `Tarea actualizada: ${updatedTask.name}`);

  await recalculateProjectBudgets(user, task.module.projectId);

  return updatedTask;
};

export const deleteTask = async (user, id) => {
  const task = await getTaskById(user, id);
  checkProjectAccess(task.module.project, user, "write");

  await prisma.task.delete({ where: { id } });

  await logAction(user.id, task.module.projectId, "DELETE_TASK", "Task", id, `Tarea eliminada: ${task.name}`);

  await recalculateProjectBudgets(user, task.module.projectId);

  return true;
};
