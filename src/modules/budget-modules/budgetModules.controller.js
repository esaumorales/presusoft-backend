import * as budgetModulesService from "./budgetModules.service.js";

export const getBudgetModules = async (req, res, next) => {
  try {
    const modules = await budgetModulesService.getBudgetModules(req.params.budgetId);
    res.json({ message: "Módulos obtenidos", data: modules });
  } catch (error) { next(error); }
};

export const getBudgetModuleById = async (req, res, next) => {
  try {
    const module = await budgetModulesService.getBudgetModuleById(req.params.id);
    res.json({ message: "Módulo obtenido", data: module });
  } catch (error) { next(error); }
};

export const createBudgetModule = async (req, res, next) => {
  try {
    const module = await budgetModulesService.createBudgetModule(req.body);
    res.status(201).json({ message: "Módulo creado", data: module });
  } catch (error) { next(error); }
};

export const updateBudgetModule = async (req, res, next) => {
  try {
    const module = await budgetModulesService.updateBudgetModule(req.params.id, req.body);
    res.json({ message: "Módulo actualizado", data: module });
  } catch (error) { next(error); }
};

export const deleteBudgetModule = async (req, res, next) => {
  try {
    await budgetModulesService.deleteBudgetModule(req.params.id);
    res.json({ message: "Módulo eliminado" });
  } catch (error) { next(error); }
};
