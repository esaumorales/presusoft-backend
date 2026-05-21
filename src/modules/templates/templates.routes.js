import { Router } from "express";
import { getTemplates, getTemplateById, createTemplate, updateTemplate, deleteTemplate, applyTemplate } from "./templates.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", getTemplates);
router.get("/:id", getTemplateById);
router.post("/", createTemplate);
router.patch("/:id", updateTemplate);
router.delete("/:id", deleteTemplate);
router.post("/:id/apply/:budgetId", applyTemplate);

export default router;
