import * as budgetService from "./budgets.service.js";

export const createBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.createBudget(req.user.id, req.body);

    res.status(201).json({
      message: "Presupuesto creado correctamente",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const getBudgets = async (req, res, next) => {
  try {
    const budgets = await budgetService.getBudgets(req.user.id);

    res.json({
      message: "Presupuestos obtenidos correctamente",
      data: budgets,
    });
  } catch (error) {
    next(error);
  }
};

export const getBudgetById = async (req, res, next) => {
  try {
    const budget = await budgetService.getBudgetById(req.user.id, req.params.id);

    res.json({
      message: "Presupuesto obtenido correctamente",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.updateBudget(req.user.id, req.params.id, req.body);

    res.json({
      message: "Presupuesto actualizado correctamente",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    await budgetService.deleteBudget(req.user.id, req.params.id);

    res.json({
      message: "Presupuesto eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const calculateBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.calculateBudget(req.user.id, req.params.id);

    res.json({
      message: "Presupuesto calculado correctamente",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const changeBudgetStatus = async (req, res, next) => {
  try {
    const budget = await budgetService.changeBudgetStatus(
      req.user.id,
      req.params.id,
      req.body.status
    );

    res.json({
      message: "Estado actualizado correctamente",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const duplicateBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.duplicateBudget(req.user.id, req.params.id);

    res.status(201).json({
      message: "Presupuesto duplicado correctamente",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};
