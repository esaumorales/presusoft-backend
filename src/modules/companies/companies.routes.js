import { Router } from "express";
import { getCompanies, getCompanyById, createCompany, updateCompany, deleteCompany } from "./companies.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", getCompanies);
router.post("/", createCompany);
router.get("/:id", getCompanyById);
router.patch("/:id", updateCompany);
router.delete("/:id", deleteCompany);

export default router;
