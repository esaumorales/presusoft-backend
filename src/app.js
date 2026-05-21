import express from "express";
import cors from "cors";
import morgan from "morgan";

import { env } from "./config/env.js";
import { swaggerUi, swaggerSpec } from "./config/swagger.js";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import companyRoutes from "./modules/companies/companies.routes.js";
import clientRoutes from "./modules/clients/clients.routes.js";
import budgetRoutes from "./modules/budgets/budgets.routes.js";
import projectRoutes from "./modules/projects/projects.routes.js";
import moduleRoutes from "./modules/modules/modules.routes.js";
import taskRoutes from "./modules/tasks/tasks.routes.js";
import dependencyRoutes from "./modules/dependencies/dependencies.routes.js";
import providerRoutes from "./modules/providers/providers.routes.js";
import templateRoutes from "./modules/templates/templates.routes.js";
import versionRoutes from "./modules/versions/versions.routes.js";
import exportRoutes from "./modules/exports/exports.routes.js";
import notificationRoutes from "./modules/notifications/notifications.routes.js";
import planRoutes from "./modules/plans/plans.routes.js";
import subscriptionRoutes from "./modules/subscriptions/subscriptions.routes.js";

import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.json({
    message: "PresuSoft Backend API",
    status: "running",
    docs: "/api/docs",
  });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dependencies", dependencyRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/versions", versionRoutes);
app.use("/api/exports", exportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
