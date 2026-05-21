import { Router } from "express";
import { getSubscriptions, getSubscriptionById, createSubscription, updateSubscription, deleteSubscription } from "./subscriptions.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", getSubscriptions);
router.get("/:id", getSubscriptionById);
router.post("/", createSubscription);
router.patch("/:id", updateSubscription);
router.delete("/:id", deleteSubscription);

export default router;
