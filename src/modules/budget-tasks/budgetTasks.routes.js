import { Router } from "express";
import { getBudgetTasks, getBudgetTaskById, createBudgetTask, updateBudgetTask, deleteBudgetTask } from "./budgetTasks.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/module/:moduleId", getBudgetTasks);
router.get("/:id", getBudgetTaskById);
router.post("/", createBudgetTask);
router.patch("/:id", updateBudgetTask);
router.delete("/:id", deleteBudgetTask);

export default router;
