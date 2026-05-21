import * as templatesService from "./templates.service.js";

export const getTemplates = async (req, res, next) => {
  try {
    const templates = await templatesService.getTemplates();
    res.json({ message: "Plantillas obtenidas", data: templates });
  } catch (error) { next(error); }
};

export const getTemplateById = async (req, res, next) => {
  try {
    const template = await templatesService.getTemplateById(req.params.id);
    res.json({ message: "Plantilla obtenida", data: template });
  } catch (error) { next(error); }
};

export const createTemplate = async (req, res, next) => {
  try {
    const template = await templatesService.createTemplate(req.body);
    res.status(201).json({ message: "Plantilla creada", data: template });
  } catch (error) { next(error); }
};

export const updateTemplate = async (req, res, next) => {
  try {
    const template = await templatesService.updateTemplate(req.params.id, req.body);
    res.json({ message: "Plantilla actualizada", data: template });
  } catch (error) { next(error); }
};

export const deleteTemplate = async (req, res, next) => {
  try {
    await templatesService.deleteTemplate(req.params.id);
    res.json({ message: "Plantilla eliminada" });
  } catch (error) { next(error); }
};
