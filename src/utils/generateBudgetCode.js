export const generateBudgetCode = (count) => {
  const nextNumber = count + 1;
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PRES-${String(nextNumber).padStart(4, "0")}-${rand}`;
};

