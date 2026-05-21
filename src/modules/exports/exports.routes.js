import { Router } from "express";
import { exportBudgetPdf, exportBudgetWord, exportBudgetExcel, getExports } from "./exports.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

router.post("/budget/:budgetId/pdf", exportBudgetPdf);
router.post("/budget/:budgetId/word", exportBudgetWord);
router.post("/budget/:budgetId/excel", exportBudgetExcel);
router.get("/budget/:budgetId", getExports);

export default router;
