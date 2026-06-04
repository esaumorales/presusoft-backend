export const parseDurationToMonths = (durationStr) => {
  if (!durationStr) return 1;
  const str = durationStr.toLowerCase();
  if (str.includes('año') || str.includes('ano')) {
      return 12; 
  }
  const match = str.match(/(\d+)\s*mes/);
  if (match) {
      return parseInt(match[1], 10);
  }
  return 1;
};

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
 * 5. urgencyAmount = subtotal_proyecto * urgencyPercentage
 * 6. subtotal_base = subtotal_proyecto + contingencyAmount + marginAmount + urgencyAmount
 * 7. taxAmount = subtotal_base * taxPercentage
 * 8. discountAmount = subtotal_base * discountPercentage
 * 9. total = subtotal_base + taxAmount - discountAmount
 */
export const calculateBudgetTotals = ({
  modules = [],
  teamMembers = [],
  contingencyPercentage = 0,
  marginPercentage = 0,
  urgencyPercentage = 0,
  taxPercentage = 0,
  discountPercentage = 0,
  durationMultiplier = 1,
}) => {
  let subtotal = 0;
  
  // Calculate Base Team Cost
  const baseTeamCost = teamMembers.reduce((sum, tm) => {
    const hourly = Number(tm.hourlyRate) || 0;
    const qty = Number(tm.quantity) || 1;
    const monthlyCost = hourly * 160 * qty;
    return sum + (monthlyCost * durationMultiplier);
  }, 0);
  
  subtotal += baseTeamCost;

  const modulesWithTotals = modules.map((mod) => {
    const tasks = mod.tasks || [];
    const dependencies = mod.dependencies || [];

    const tasksHourlySum = tasks.reduce((sum, task) => {
      if (Number(task.hours) > 0) return sum + (Number(task.hours) * Number(task.hourlyRate) * (Number(task.quantity) || 1) * durationMultiplier);
      return sum;
    }, 0);

    const tasksFixedSum = tasks.reduce((sum, task) => {
      if (!(Number(task.hours) > 0)) return sum + (Number(task.unitPrice) * (Number(task.quantity) || 1) * durationMultiplier);
      return sum;
    }, 0);

    const tasksSum = tasksHourlySum + tasksFixedSum;
    const dependenciesSum = dependencies.reduce((sum, dep) => sum + (calculateDependencyCost(dep) * durationMultiplier), 0);
    
    // Solo las horas de módulos extra suman al presupuesto general.
    // Los costos fijos (unitPrice) y dependencias se suman siempre.
    const globalSubtotalAddition = (mod.isExtra ? tasksHourlySum : 0) + tasksFixedSum + dependenciesSum;
    subtotal += globalSubtotalAddition;

    // Para la vista (UI), queremos mostrar el valor de TODAS las tareas, aunque no se sume al total
    const displaySubtotal = tasksSum + dependenciesSum;

    return {
      ...mod,
      subtotal: displaySubtotal,
      tasksSum,
      dependenciesSum,
    };
  });

  const contingencyAmount = Number((subtotal * (Number(contingencyPercentage) / 100)).toFixed(2));
  const marginAmount = Number((subtotal * (Number(marginPercentage) / 100)).toFixed(2));
  
  const monthlyCost = durationMultiplier > 0 ? (subtotal / durationMultiplier) : subtotal;
  const urgencyAmount = Number((monthlyCost * Number(urgencyPercentage)).toFixed(2));
  
  const subtotalBase = subtotal + contingencyAmount + marginAmount + urgencyAmount;

  const taxAmount = subtotalBase * (Number(taxPercentage) || 0) / 100;
  const discountAmount = subtotalBase * (Number(discountPercentage) || 0) / 100;

  const total = subtotalBase + taxAmount - discountAmount;

  return {
    modules: modulesWithTotals,
    baseTeamCost: Math.round(baseTeamCost * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    contingencyAmount: Math.round(contingencyAmount * 100) / 100,
    marginAmount: Math.round(marginAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};
