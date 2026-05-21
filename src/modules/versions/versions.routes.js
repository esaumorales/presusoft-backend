import { Router } from "express";
import { getBudgetVersions, createBudgetVersion, restoreBudgetVersion } from "./versions.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/budget/:budgetId", getBudgetVersions);
router.post("/budget/:budgetId", createBudgetVersion);
router.post("/:id/restore", restoreBudgetVersion);

export default router;
