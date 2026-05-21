import * as plansService from "./plans.service.js";

export const getPlans = async (req, res, next) => {
  try {
    const plans = await plansService.getPlans();
    res.json({ message: "Planes obtenidos", data: plans });
  } catch (error) { next(error); }
};

export const getPlanById = async (req, res, next) => {
  try {
    const plan = await plansService.getPlanById(req.params.id);
    res.json({ message: "Plan obtenido", data: plan });
  } catch (error) { next(error); }
};

export const createPlan = async (req, res, next) => {
  try {
    const plan = await plansService.createPlan(req.body);
    res.status(201).json({ message: "Plan creado", data: plan });
  } catch (error) { next(error); }
};

export const updatePlan = async (req, res, next) => {
  try {
    const plan = await plansService.updatePlan(req.params.id, req.body);
    res.json({ message: "Plan actualizado", data: plan });
  } catch (error) { next(error); }
};

export const deletePlan = async (req, res, next) => {
  try {
    await plansService.deletePlan(req.params.id);
    res.json({ message: "Plan eliminado" });
  } catch (error) { next(error); }
};
