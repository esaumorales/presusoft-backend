import { Router } from "express";
import { getClients, getClientById, createClient, updateClient, deleteClient } from "./clients.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", getClients);
router.post("/", createClient);
router.get("/:id", getClientById);
router.patch("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;
