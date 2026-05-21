import { Router } from "express";
import { getPlans, getPlanById, createPlan, updatePlan, deletePlan } from "./plans.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/", getPlans);
router.get("/:id", getPlanById);

router.use(authMiddleware);
router.post("/", roleMiddleware("admin"), createPlan);
router.patch("/:id", roleMiddleware("admin"), updatePlan);
router.delete("/:id", roleMiddleware("admin"), deletePlan);

export default router;
