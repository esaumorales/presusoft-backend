import * as companiesService from "./companies.service.js";

export const getCompanies = async (req, res, next) => {
  try {
    const companies = await companiesService.getCompanies(req.user.id);
    res.json({ message: "Empresas obtenidas", data: companies });
  } catch (error) { next(error); }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const company = await companiesService.getCompanyById(req.user.id, req.params.id);
    res.json({ message: "Empresa obtenida", data: company });
  } catch (error) { next(error); }
};

export const createCompany = async (req, res, next) => {
  try {
    const company = await companiesService.createCompany(req.user.id, req.body);
    res.status(201).json({ message: "Empresa creada", data: company });
  } catch (error) { next(error); }
};

export const updateCompany = async (req, res, next) => {
  try {
    const company = await companiesService.updateCompany(req.user.id, req.params.id, req.body);
    res.json({ message: "Empresa actualizada", data: company });
  } catch (error) { next(error); }
};

export const deleteCompany = async (req, res, next) => {
  try {
    await companiesService.deleteCompany(req.user.id, req.params.id);
    res.json({ message: "Empresa eliminada" });
  } catch (error) { next(error); }
};
