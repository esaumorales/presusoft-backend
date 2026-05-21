import { generateHeuristicBudget } from "./ai.service.js";

export const generateBudgetModel = async (req, res, next) => {
  try {
    const { prompt, budgetId } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ success: false, message: "El prompt es requerido" });
    }

    // Call the heuristic service
    const generatedData = await generateHeuristicBudget(prompt, budgetId);

    res.json({
      success: true,
      message: "Modelo de presupuesto generado exitosamente",
      data: generatedData
    });
  } catch (error) {
    next(error);
  }
};
