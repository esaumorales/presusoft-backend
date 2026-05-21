import * as projectsService from "./projects.service.js";

export const getProjects = async (req, res, next) => {
  try {
    const filters = {
      clientId: req.query.clientId,
      status: req.query.status,
      currency: req.query.currency,
    };
    const projects = await projectsService.getProjects(req.user, filters);
    res.json({
      message: "Proyectos obtenidos correctamente",
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currency } = req.query;
    const project = await projectsService.getProjectById(req.user, id, currency);
    res.json({
      message: "Proyecto obtenido correctamente",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await projectsService.createProject(req.user, req.body);
    res.status(201).json({
      message: "Proyecto creado correctamente",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await projectsService.updateProject(req.user, id, req.body);
    res.json({
      message: "Proyecto actualizado correctamente",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    await projectsService.deleteProject(req.user, id);
    res.json({
      message: "Proyecto eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};
