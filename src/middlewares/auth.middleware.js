import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import prisma from "../config/prisma.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token no proporcionado",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token inválido",
      });
    }

    const decoded = jwt.verify(token, env.jwtSecret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({
        message: "Usuario no encontrado",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message: "Usuario inactivo",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "No autorizado",
    });
  }
};
