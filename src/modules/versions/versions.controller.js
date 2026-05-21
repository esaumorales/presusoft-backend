import * as versionsService from "./versions.service.js";

export const getBudgetVersions = async (req, res, next) => {
  try {
    const versions = await versionsService.getBudgetVersions(req.user, req.params.budgetId);
    res.json({ message: "Versiones obtenidas", data: versions });
  } catch (error) { next(error); }
};

export const createBudgetVersion = async (req, res, next) => {
  try {
    const version = await versionsService.createBudgetVersion(req.user, req.params.budgetId);
    res.status(201).json({ message: "Versión creada", data: version });
  } catch (error) { next(error); }
};

export const restoreBudgetVersion = async (req, res, next) => {
  try {
    const budget = await versionsService.restoreBudgetVersion(req.user, req.params.id);
    res.json({ message: "Versión restaurada", data: budget });
  } catch (error) { next(error); }
};

