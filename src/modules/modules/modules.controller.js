import * as modulesService from "./modules.service.js";

export const createModule = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const moduleItem = await modulesService.createModule(req.user, projectId, req.body);
    res.status(201).json({
      message: "Módulo creado correctamente",
      data: moduleItem,
    });
  } catch (error) {
    next(error);
  }
};

export const updateModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const moduleItem = await modulesService.updateModule(req.user, id, req.body);
    res.json({
      message: "Módulo actualizado correctamente",
      data: moduleItem,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    await modulesService.deleteModule(req.user, id);
    res.json({
      message: "Módulo eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};
