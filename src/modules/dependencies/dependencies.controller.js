import * as dependenciesService from "./dependencies.service.js";

export const createDependency = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const dependency = await dependenciesService.createDependency(req.user, moduleId, req.body);
    res.status(201).json({
      message: "Dependencia agregada correctamente",
      data: dependency,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDependency = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dependency = await dependenciesService.updateDependency(req.user, id, req.body);
    res.json({
      message: "Dependencia actualizada correctamente",
      data: dependency,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDependency = async (req, res, next) => {
  try {
    const { id } = req.params;
    await dependenciesService.deleteDependency(req.user, id);
    res.json({
      message: "Dependencia eliminada correctamente",
    });
  } catch (error) {
    next(error);
  }
};
