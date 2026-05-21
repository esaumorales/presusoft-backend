import * as usersService from "./users.service.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await usersService.getUsers();
    res.json({ message: "Usuarios obtenidos", data: users });
  } catch (error) { next(error); }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await usersService.getUserById(req.params.id);
    res.json({ message: "Usuario obtenido", data: user });
  } catch (error) { next(error); }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await usersService.updateUser(req.params.id, req.body);
    res.json({ message: "Usuario actualizado", data: user });
  } catch (error) { next(error); }
};

export const deleteUser = async (req, res, next) => {
  try {
    await usersService.deleteUser(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (error) { next(error); }
};
