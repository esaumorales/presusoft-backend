import { test } from "node:test";
import assert from "node:assert";
import {
  calculateTaskTotal,
  calculateDependencyCost,
  calculateBudgetTotals,
} from "../src/utils/calculateBudget.js";
import { convertAmount } from "../src/utils/currency.js";

test("calculateTaskTotal - Hourly task", () => {
  const task = {
    hours: 10,
    hourlyRate: 50,
    quantity: 2,
    unitPrice: 0,
  };
  const total = calculateTaskTotal(task);
  assert.strictEqual(total, 1000); // 10 * 50 * 2
});

test("calculateTaskTotal - Flat rate task", () => {
  const task = {
    hours: 0,
    hourlyRate: 0,
    quantity: 3,
    unitPrice: 150,
  };
  const total = calculateTaskTotal(task);
  assert.strictEqual(total, 450); // 3 * 150
});

test("calculateDependencyCost - With plan price", () => {
  const dep = {
    quantity: 5,
    plan: {
      price: 20,
    },
  };
  const cost = calculateDependencyCost(dep);
  assert.strictEqual(cost, 100); // 5 * 20
});

test("calculateDependencyCost - Without plan price (fallback cost)", () => {
  const dep = {
    quantity: 2,
    cost: 40,
  };
  const cost = calculateDependencyCost(dep);
  assert.strictEqual(cost, 80); // 2 * 40
});

test("calculateBudgetTotals - Sum modules, apply conting, margin, tax, discount", () => {
  const modules = [
    {
      id: "mod-1",
      name: "Module 1",
      tasks: [
        { hours: 10, hourlyRate: 40, quantity: 1 }, // 400
        { hours: 0, hourlyRate: 0, quantity: 2, unitPrice: 50 }, // 100
      ],
      dependencies: [
        { quantity: 2, plan: { price: 25 } }, // 50
      ],
    },
    {
      id: "mod-2",
      name: "Module 2",
      tasks: [
        { hours: 5, hourlyRate: 60, quantity: 2 }, // 600
      ],
      dependencies: [],
    },
  ];

  // Subtotal = (400 + 100 + 50) + 600 = 550 + 600 = 1150
  // Contingency = 10% of 1150 = 115
  // Margin = 20% of 1150 = 230
  // SubtotalBase = 1150 + 115 + 230 = 1495
  // Tax = 18% of 1495 = 269.10
  // Discount = 5% of 1495 = 74.75
  // Total = 1495 + 269.10 - 74.75 = 1689.35

  const totals = calculateBudgetTotals({
    modules,
    contingencyPercentage: 10,
    marginPercentage: 20,
    taxPercentage: 18,
    discountPercentage: 5,
  });

  assert.strictEqual(totals.subtotal, 1150);
  assert.strictEqual(totals.contingencyAmount, 115);
  assert.strictEqual(totals.marginAmount, 230);
  assert.strictEqual(totals.taxAmount, 269.1);
  assert.strictEqual(totals.discountAmount, 74.75);
  assert.strictEqual(totals.total, 1689.35);
});

test("convertAmount - USD to PEN using fallback", async () => {
  // 100 USD to PEN. Since rates might fetch dynamically, we check if the result is in a realistic range
  const converted = await convertAmount(100, "USD", "PEN");
  assert.ok(converted > 300 && converted < 450); // should be around 375
});

test("convertAmount - EUR to USD using fallback", async () => {
  const converted = await convertAmount(100, "EUR", "USD");
  assert.ok(converted > 90 && converted < 120); // should be around 108
});
