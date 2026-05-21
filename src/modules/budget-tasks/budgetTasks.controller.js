import * as budgetTasksService from "./budgetTasks.service.js";

export const getBudgetTasks = async (req, res, next) => {
  try {
    const tasks = await budgetTasksService.getBudgetTasks(req.params.moduleId);
    res.json({ message: "Tareas obtenidas", data: tasks });
  } catch (error) { next(error); }
};

export const getBudgetTaskById = async (req, res, next) => {
  try {
    const task = await budgetTasksService.getBudgetTaskById(req.params.id);
    res.json({ message: "Tarea obtenida", data: task });
  } catch (error) { next(error); }
};

export const createBudgetTask = async (req, res, next) => {
  try {
    const task = await budgetTasksService.createBudgetTask(req.body);
    res.status(201).json({ message: "Tarea creada", data: task });
  } catch (error) { next(error); }
};

export const updateBudgetTask = async (req, res, next) => {
  try {
    const task = await budgetTasksService.updateBudgetTask(req.params.id, req.body);
    res.json({ message: "Tarea actualizada", data: task });
  } catch (error) { next(error); }
};

export const deleteBudgetTask = async (req, res, next) => {
  try {
    await budgetTasksService.deleteBudgetTask(req.params.id);
    res.json({ message: "Tarea eliminada" });
  } catch (error) { next(error); }
};
