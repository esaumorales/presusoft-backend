import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { createModule, updateModule, deleteModule } from "./modules.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/projects/:projectId", createModule);
router.patch("/:id", updateModule);
router.delete("/:id", deleteModule);

export default router;
