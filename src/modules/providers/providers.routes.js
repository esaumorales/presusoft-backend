import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  getProviders,
  createProvider,
  updateProvider,
  deleteProvider,
  createProviderPlan,
  updateProviderPlan,
  deleteProviderPlan,
} from "./providers.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getProviders);
router.post("/", createProvider);
router.patch("/:id", updateProvider);
router.delete("/:id", deleteProvider);

router.post("/:providerId/plans", createProviderPlan);
router.patch("/plans/:id", updateProviderPlan);
router.delete("/plans/:id", deleteProviderPlan);

export default router;
