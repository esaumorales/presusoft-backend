export const generateBudgetCode = (count) => {
  const nextNumber = count + 1;
  return `PRES-${String(nextNumber).padStart(4, "0")}`;
};
