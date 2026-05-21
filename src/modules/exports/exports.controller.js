import * as exportsService from "./exports.service.js";
import path from "path";
import fs from "fs";

export const exportBudgetPdf = async (req, res, next) => {
  try {
    const data = await exportsService.exportBudget(req.user.id, req.params.budgetId, "pdf");
    res.json({ message: "Exportación a PDF exitosa", data });
  } catch (error) { next(error); }
};

export const exportBudgetWord = async (req, res, next) => {
  try {
    const data = await exportsService.exportBudget(req.user.id, req.params.budgetId, "word");
    res.json({ message: "Exportación a Word exitosa", data });
  } catch (error) { next(error); }
};

export const exportBudgetExcel = async (req, res, next) => {
  try {
    const data = await exportsService.exportBudget(req.user.id, req.params.budgetId, "excel");
    res.json({ message: "Exportación a Excel exitosa", data });
  } catch (error) { next(error); }
};

export const getExports = async (req, res, next) => {
  try {
    const exports = await exportsService.getExports(req.params.budgetId);
    res.json({ message: "Historial de exportaciones", data: exports });
  } catch (error) { next(error); }
};

export const downloadExportFile = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), "exports", filename);

    if (!fs.existsSync(filePath)) {
      const error = new Error("Archivo no encontrado");
      error.statusCode = 404;
      throw error;
    }

    res.download(filePath, filename);
  } catch (error) {
    next(error);
  }
};

