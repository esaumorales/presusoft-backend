import { Router } from "express";
import { getBudgetModules, getBudgetModuleById, createBudgetModule, updateBudgetModule, deleteBudgetModule } from "./budgetModules.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/budget/:budgetId", getBudgetModules);
router.get("/:id", getBudgetModuleById);
router.post("/", createBudgetModule);
router.patch("/:id", updateBudgetModule);
router.delete("/:id", deleteBudgetModule);

export default router;
