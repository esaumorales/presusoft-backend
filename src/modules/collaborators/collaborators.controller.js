import * as collaboratorsService from "./collaborators.service.js";

export const createCollaborator = async (req, res, next) => {
  try {
    const data = await collaboratorsService.createCollaborator(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCollaborators = async (req, res, next) => {
  try {
    const data = await collaboratorsService.getCollaborators(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateCollaborator = async (req, res, next) => {
  try {
    const data = await collaboratorsService.updateCollaborator(req.user.id, req.params.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteCollaborator = async (req, res, next) => {
  try {
    await collaboratorsService.deleteCollaborator(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: "Colaborador eliminado" });
  } catch (error) {
    next(error);
  }
};
