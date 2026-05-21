import * as authService from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    res.json({
      message: "Inicio de sesión correcto",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const profile = async (req, res) => {
  res.json({
    message: "Perfil obtenido correctamente",
    data: req.user,
  });
};
