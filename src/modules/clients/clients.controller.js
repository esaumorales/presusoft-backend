import * as clientsService from "./clients.service.js";

export const getClients = async (req, res, next) => {
  try {
    const clients = await clientsService.getClients(req.user.id);
    res.json({ message: "Clientes obtenidos", data: clients });
  } catch (error) { next(error); }
};

export const getClientById = async (req, res, next) => {
  try {
    const client = await clientsService.getClientById(req.user.id, req.params.id);
    res.json({ message: "Cliente obtenido", data: client });
  } catch (error) { next(error); }
};

export const createClient = async (req, res, next) => {
  try {
    const client = await clientsService.createClient(req.user.id, req.body);
    res.status(201).json({ message: "Cliente creado", data: client });
  } catch (error) { next(error); }
};

export const updateClient = async (req, res, next) => {
  try {
    const client = await clientsService.updateClient(req.user.id, req.params.id, req.body);
    res.json({ message: "Cliente actualizado", data: client });
  } catch (error) { next(error); }
};

export const deleteClient = async (req, res, next) => {
  try {
    await clientsService.deleteClient(req.user.id, req.params.id);
    res.json({ message: "Cliente eliminado" });
  } catch (error) { next(error); }
};
