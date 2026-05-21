import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  calculateBudget,
  changeBudgetStatus,
  duplicateBudget,
} from "./budgets.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createBudget);
router.get("/", getBudgets);
router.get("/:id", getBudgetById);
router.patch("/:id", updateBudget);
router.delete("/:id", deleteBudget);
router.post("/:id/calculate", calculateBudget);
router.patch("/:id/status", changeBudgetStatus);
router.post("/:id/duplicate", duplicateBudget);

export default router;
