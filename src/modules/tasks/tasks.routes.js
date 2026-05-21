import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { createTask, updateTask, deleteTask } from "./tasks.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/modules/:moduleId", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
