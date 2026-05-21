import { Router } from "express";
import { getBudgetCosts, getBudgetCostById, createBudgetCost, updateBudgetCost, deleteBudgetCost } from "./budgetCosts.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/budget/:budgetId", getBudgetCosts);
router.get("/:id", getBudgetCostById);
router.post("/", createBudgetCost);
router.patch("/:id", updateBudgetCost);
router.delete("/:id", deleteBudgetCost);

export default router;
