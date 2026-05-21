import express from "express";
import { generateBudgetModel } from "./ai.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateBudgetModel);

export default router;
