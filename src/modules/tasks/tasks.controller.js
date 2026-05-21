import * as tasksService from "./tasks.service.js";

export const createTask = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const task = await tasksService.createTask(req.user, moduleId, req.body);
    res.status(201).json({
      message: "Tarea creada correctamente",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await tasksService.updateTask(req.user, id, req.body);
    res.json({
      message: "Tarea actualizada correctamente",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    await tasksService.deleteTask(req.user, id);
    res.json({
      message: "Tarea eliminada correctamente",
    });
  } catch (error) {
    next(error);
  }
};
