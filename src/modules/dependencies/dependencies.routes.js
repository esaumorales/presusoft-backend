import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { createDependency, updateDependency, deleteDependency } from "./dependencies.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/modules/:moduleId", createDependency);
router.patch("/:id", updateDependency);
router.delete("/:id", deleteDependency);

export default router;
