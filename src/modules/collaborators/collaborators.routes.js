import { Router } from "express";
import * as controller from "./collaborators.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", controller.createCollaborator);
router.get("/", controller.getCollaborators);
router.put("/:id", controller.updateCollaborator);
router.delete("/:id", controller.deleteCollaborator);

export default router;
