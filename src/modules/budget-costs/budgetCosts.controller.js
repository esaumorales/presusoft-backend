import * as budgetCostsService from "./budgetCosts.service.js";

export const getBudgetCosts = async (req, res, next) => {
  try {
    const costs = await budgetCostsService.getBudgetCosts(req.params.budgetId);
    res.json({ message: "Costos obtenidos", data: costs });
  } catch (error) { next(error); }
};

export const getBudgetCostById = async (req, res, next) => {
  try {
    const cost = await budgetCostsService.getBudgetCostById(req.params.id);
    res.json({ message: "Costo obtenido", data: cost });
  } catch (error) { next(error); }
};

export const createBudgetCost = async (req, res, next) => {
  try {
    const cost = await budgetCostsService.createBudgetCost(req.body);
    res.status(201).json({ message: "Costo creado", data: cost });
  } catch (error) { next(error); }
};

export const updateBudgetCost = async (req, res, next) => {
  try {
    const cost = await budgetCostsService.updateBudgetCost(req.params.id, req.body);
    res.json({ message: "Costo actualizado", data: cost });
  } catch (error) { next(error); }
};

export const deleteBudgetCost = async (req, res, next) => {
  try {
    await budgetCostsService.deleteBudgetCost(req.params.id);
    res.json({ message: "Costo eliminado" });
  } catch (error) { next(error); }
};
