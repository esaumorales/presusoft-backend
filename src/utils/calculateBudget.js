export const calculateBudgetTotals = ({ tasks = [], costs = [], taxPercentage = 0, discountPercentage = 0 }) => {
  const taskSubtotal = tasks.reduce((acc, task) => {
    return acc + Number(task.total || 0);
  }, 0);

  const costSubtotal = costs.reduce((acc, cost) => {
    return acc + Number(cost.total || 0);
  }, 0);

  const subtotal = taskSubtotal + costSubtotal;

  const taxAmount = subtotal * Number(taxPercentage || 0) / 100;

  const discountAmount = subtotal * Number(discountPercentage || 0) / 100;

  const total = subtotal + taxAmount - discountAmount;

  return {
    taskSubtotal,
    costSubtotal,
    subtotal,
    taxAmount,
    discountAmount,
    total,
  };
};
