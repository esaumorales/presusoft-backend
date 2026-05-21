/**
 * Calculate the total cost for a single task.
 * If hours is set, we use hours * hourlyRate * quantity.
 * Otherwise, we use quantity * unitPrice.
 */
export const calculateTaskTotal = (task) => {
  const hours = Number(task.hours) || 0;
  const hourlyRate = Number(task.hourlyRate) || 0;
  const quantity = Number(task.quantity) || 1;
  const unitPrice = Number(task.unitPrice) || 0;

  if (hours > 0) {
    return hours * hourlyRate * quantity;
  }
  return quantity * unitPrice;
};

/**
 * Calculate the total cost for a single dependency.
 * cost = price * quantity
 */
export const calculateDependencyCost = (dependency) => {
  const price = Number(dependency.plan?.price || dependency.cost || 0);
  const quantity = Number(dependency.quantity) || 1;
  return price * quantity;
};

/**
 * Recalculates all budget financial summaries.
 * Formulas:
 * 1. subtotal_modulo = sum(tareas) + sum(dependencias)
 * 2. subtotal_proyecto = sum(subtotal_modulo)
 * 3. contingencyAmount = subtotal_proyecto * contingencyPercentage
 * 4. marginAmount = subtotal_proyecto * marginPercentage
 * 5. subtotal_base = subtotal_proyecto + contingencyAmount + marginAmount
 * 6. taxAmount = subtotal_base * taxPercentage
 * 7. discountAmount = subtotal_base * discountPercentage
 * 8. total = subtotal_base + taxAmount - discountAmount
 */
export const calculateBudgetTotals = ({
  modules = [],
  contingencyPercentage = 0,
  marginPercentage = 0,
  taxPercentage = 0,
  discountPercentage = 0,
}) => {
  let subtotal = 0;
  const modulesWithTotals = modules.map((mod) => {
    const tasks = mod.tasks || [];
    const dependencies = mod.dependencies || [];

    const tasksSum = tasks.reduce((sum, task) => sum + calculateTaskTotal(task), 0);
    const dependenciesSum = dependencies.reduce((sum, dep) => sum + calculateDependencyCost(dep), 0);
    const modSubtotal = tasksSum + dependenciesSum;

    subtotal += modSubtotal;

    return {
      ...mod,
      subtotal: modSubtotal,
      tasksSum,
      dependenciesSum,
    };
  });

  const contingencyAmount = subtotal * (Number(contingencyPercentage) || 0) / 100;
  const marginAmount = subtotal * (Number(marginPercentage) || 0) / 100;
  
  const subtotalBase = subtotal + contingencyAmount + marginAmount;

  const taxAmount = subtotalBase * (Number(taxPercentage) || 0) / 100;
  const discountAmount = subtotalBase * (Number(discountPercentage) || 0) / 100;

  const total = subtotalBase + taxAmount - discountAmount;

  return {
    modules: modulesWithTotals,
    subtotal: Math.round(subtotal * 100) / 100,
    contingencyAmount: Math.round(contingencyAmount * 100) / 100,
    marginAmount: Math.round(marginAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};
