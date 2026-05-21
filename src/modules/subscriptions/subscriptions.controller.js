import * as subscriptionsService from "./subscriptions.service.js";

export const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await subscriptionsService.getSubscriptions(req.user.id);
    res.json({ message: "Suscripciones obtenidas", data: subscriptions });
  } catch (error) { next(error); }
};

export const getSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await subscriptionsService.getSubscriptionById(req.user.id, req.params.id);
    res.json({ message: "Suscripción obtenida", data: subscription });
  } catch (error) { next(error); }
};

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await subscriptionsService.createSubscription(req.user.id, req.body);
    res.status(201).json({ message: "Suscripción creada", data: subscription });
  } catch (error) { next(error); }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await subscriptionsService.updateSubscription(req.user.id, req.params.id, req.body);
    res.json({ message: "Suscripción actualizada", data: subscription });
  } catch (error) { next(error); }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    await subscriptionsService.deleteSubscription(req.user.id, req.params.id);
    res.json({ message: "Suscripción eliminada" });
  } catch (error) { next(error); }
};
