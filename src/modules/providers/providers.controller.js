import * as providersService from "./providers.service.js";

export const getProviders = async (req, res, next) => {
  try {
    const providers = await providersService.getProviders();
    res.json({
      message: "Proveedores obtenidos correctamente",
      data: providers,
    });
  } catch (error) {
    next(error);
  }
};

export const createProvider = async (req, res, next) => {
  try {
    const provider = await providersService.createProvider(req.user, req.body);
    res.status(201).json({
      message: "Proveedor creado correctamente",
      data: provider,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const provider = await providersService.updateProvider(req.user, id, req.body);
    res.json({
      message: "Proveedor actualizado correctamente",
      data: provider,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    await providersService.deleteProvider(req.user, id);
    res.json({
      message: "Proveedor eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const createProviderPlan = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const plan = await providersService.createProviderPlan(req.user, providerId, req.body);
    res.status(201).json({
      message: "Plan de proveedor creado correctamente",
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProviderPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plan = await providersService.updateProviderPlan(req.user, id, req.body);
    res.json({
      message: "Plan de proveedor actualizado correctamente",
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProviderPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    await providersService.deleteProviderPlan(req.user, id);
    res.json({
      message: "Plan de proveedor eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};
