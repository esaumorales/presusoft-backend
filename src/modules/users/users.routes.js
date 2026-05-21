import { Router } from "express";
import { getUsers, getUserById, updateUser, deleteUser } from "./users.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", roleMiddleware("admin"), getUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", roleMiddleware("admin"), deleteUser);

export default router;
