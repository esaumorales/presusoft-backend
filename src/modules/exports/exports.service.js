import prisma from "../../config/prisma.js";

export const exportBudget = async (userId, budgetId, format) => {
  const budget = await prisma.budget.findFirst({ where: { id: budgetId, userId } });
  if (!budget) throw new Error("Budget not found");

  // TODO: Add actual PDF/Word/Excel generation logic
  const fileUrl = `https://storage.example.com/exports/budget_${budgetId}.${format}`;

  return prisma.budgetExport.create({
    data: {
      budgetId,
      format,
      fileUrl,
      exportedById: userId
    }
  });
};

export const getExports = async (budgetId) => {
  return prisma.budgetExport.findMany({ where: { budgetId }, orderBy: { exportedAt: "desc" } });
};
