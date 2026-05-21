import { test } from "node:test";
import assert from "node:assert";

const BASE_URL = "http://localhost:4000/api";

test("Full Integration Flow - PresuSoft Budget System", async () => {
  // 0. Register and Login a fresh test user
  const email = `testuser_${Date.now()}@example.com`;
  const password = "Password123!";

  console.log("0. Registering user...");
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "E2E Test User",
      email,
      password,
      phone: "+51999999999",
    }),
  });
  
  assert.strictEqual(regRes.status, 201, `Failed to register user: ${regRes.status}`);
  const regData = await regRes.json();
  const token = regData.data.token;
  assert.ok(token, "Token should be returned on registration");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 1. Create a Client
  console.log("1. Creating client...");
  const clientRes = await fetch(`${BASE_URL}/clients`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "E2E Test Client",
      email: "client@example.com",
      phone: "+51888888888",
    }),
  });
  assert.strictEqual(clientRes.status, 201);
  const clientData = await clientRes.json();
  const clientId = clientData.data.id;
  assert.ok(clientId, "Client ID should be present");

  // 2. Fetch providers (pre-seeded)
  console.log("2. Fetching pre-seeded providers...");
  const provRes = await fetch(`${BASE_URL}/providers`, { headers });
  assert.strictEqual(provRes.status, 200);
  const provData = await provRes.json();
  assert.ok(provData.data.length > 0, "No providers found. Make sure seed was run!");
  
  const resendProvider = provData.data.find(p => p.name === "Resend");
  assert.ok(resendProvider, "Resend provider should be seeded");
  const resendPlan = resendProvider.plans.find(pl => pl.name === "Pro");
  assert.ok(resendPlan, "Resend Pro plan should be seeded (Price: 20 USD)");

  // 3. Create a Project
  console.log("3. Creating project...");
  const projectRes = await fetch(`${BASE_URL}/projects`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "Test Project",
      clientId,
      contingencyPercentage: 10,
      marginPercentage: 15,
    }),
  });
  assert.strictEqual(projectRes.status, 201);
  const projectData = await projectRes.json();
  const projectId = projectData.data.id;
  assert.ok(projectId, "Project ID should be present");

  // 4. Create a Module
  console.log("4. Creating module...");
  const moduleRes = await fetch(`${BASE_URL}/modules/projects/${projectId}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "Core Module",
      description: "Primary components module",
      orderNumber: 1,
    }),
  });
  assert.strictEqual(moduleRes.status, 201);
  const moduleData = await moduleRes.json();
  const moduleId = moduleData.data.id;
  assert.ok(moduleId, "Module ID should be present");

  // 5. Create a Task
  console.log("5. Creating task...");
  const taskRes = await fetch(`${BASE_URL}/tasks/modules/${moduleId}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "Initial Development Task",
      hours: 20,
      hourlyRate: 50, // Total task cost = 1000 PEN
      orderNumber: 1,
    }),
  });
  assert.strictEqual(taskRes.status, 201);
  const taskData = await taskRes.json();
  const taskId = taskData.data.id;
  assert.ok(taskId, "Task ID should be present");

  // 6. Create a Dependency
  console.log("6. Creating dependency...");
  const depRes = await fetch(`${BASE_URL}/dependencies/modules/${moduleId}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      providerId: resendProvider.id,
      planId: resendPlan.id,
      quantity: 3, // Resend Pro price is 20 USD, so 3 * 20 USD = 60 USD
    }),
  });
  assert.strictEqual(depRes.status, 201);
  const depData = await depRes.json();
  const depId = depData.data.id;
  assert.ok(depId, "Dependency ID should be present");

  // 7. Create a Budget
  console.log("7. Creating budget...");
  const budgetRes = await fetch(`${BASE_URL}/budgets`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      projectId,
      title: "Main Project Proposal",
      description: "Detailed breakdown of the core project structure",
      currency: "PEN",
      taxPercentage: 18,
      discountPercentage: 0,
    }),
  });
  assert.strictEqual(budgetRes.status, 201);
  const budgetData = await budgetRes.json();
  const budgetId = budgetData.data.id;
  assert.ok(budgetId, "Budget ID should be present");

  // Let's verify details & calculations
  // Tasks total: 20 * 50 = 1000 PEN
  // Dependencies total: 3 * 20 USD = 60 USD. If USD rate is 3.75 fallback, then 60 * 3.75 = 225 PEN.
  // ModSubtotal = 1000 + 225 = 1225 PEN
  // Contingency = 10% of 1225 = 122.5 PEN
  // Margin = 15% of 1225 = 183.75 PEN
  // SubtotalBase = 1225 + 122.5 + 183.75 = 1531.25 PEN
  // Tax = 18% of 1531.25 = 275.625 PEN -> round to 275.63 PEN
  // Discount = 0
  // Total = 1531.25 + 275.625 = 1806.875 PEN -> round to 1806.88 PEN

  console.log("Checking initial budget totals...");
  const getBRes = await fetch(`${BASE_URL}/budgets/${budgetId}`, { headers });
  assert.strictEqual(getBRes.status, 200);
  const getBData = await getBRes.json();
  const budget = getBData.data;

  // Let's print out actual vs expected totals
  console.log(`Calculated Subtotal: ${budget.subtotal} (Expected: ~1225)`);
  console.log(`Calculated Contingency: ${budget.contingencyAmount} (Expected: ~122.5)`);
  console.log(`Calculated Margin: ${budget.marginAmount} (Expected: ~183.75)`);
  console.log(`Calculated Tax: ${budget.taxAmount} (Expected: ~275.63)`);
  console.log(`Calculated Total: ${budget.total} (Expected: ~1806.88)`);

  assert.ok(Math.abs(Number(budget.subtotal) - 1225) < 50); // allow dynamic API exchange rate differences
  assert.ok(Math.abs(Number(budget.total) - 1806.88) < 80);

  // 8. Create a Manual Budget Version (snapshot)
  console.log("8. Creating budget version snapshot...");
  const versionRes = await fetch(`${BASE_URL}/versions/budget/${budgetId}`, {
    method: "POST",
    headers,
  });
  assert.strictEqual(versionRes.status, 201);
  const versionData = await versionRes.json();
  const versionId = versionData.data.id;
  assert.ok(versionId, "Version ID should be present");

  // 9. Modify project/dependency (change quantity to 10 and recalculate)
  console.log("9. Updating dependency quantity to 10...");
  const updateDepRes = await fetch(`${BASE_URL}/dependencies/${depId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      quantity: 10, // 10 * 20 USD = 200 USD = 750 PEN
    }),
  });
  assert.strictEqual(updateDepRes.status, 200);

  console.log("Recalculating budget totals...");
  const recalcRes = await fetch(`${BASE_URL}/budgets/${budgetId}/calculate`, {
    method: "POST",
    headers,
  });
  assert.strictEqual(recalcRes.status, 200);
  const recalcData = await recalcRes.json();
  
  // New subtotal: 1000 + 750 = 1750 PEN
  assert.ok(Math.abs(Number(recalcData.data.subtotal) - 1750) < 100);

  // 10. Restore original version
  console.log("10. Restoring original budget version...");
  const restoreRes = await fetch(`${BASE_URL}/versions/${versionId}/restore`, {
    method: "POST",
    headers,
  });
  assert.strictEqual(restoreRes.status, 200);
  const restoreData = await restoreRes.json();
  
  console.log(`Restored Subtotal: ${restoreData.data.project.modules[0].subtotal} (Expected: ~1225)`);
  assert.ok(Math.abs(Number(restoreData.data.project.modules[0].subtotal) - 1225) < 50);

  // Check that the quantity is reverted to 3 in the DB
  const restoredGetB = await fetch(`${BASE_URL}/budgets/${budgetId}`, { headers });
  const restoredBData = await restoredGetB.json();
  const restoredDep = restoredBData.data.project.modules[0].dependencies[0];
  console.log(`Restored Dependency Quantity: ${restoredDep.quantity} (Expected: 3)`);
  assert.strictEqual(restoredDep.quantity, 3);

  // 11. Export Budget (Excel, PDF, Word)
  console.log("11. Exporting budget to Excel, PDF, and Word...");
  
  const exportExcelRes = await fetch(`${BASE_URL}/exports/budget/${budgetId}/excel`, { method: "POST", headers });
  assert.strictEqual(exportExcelRes.status, 200);
  const exportExcelData = await exportExcelRes.json();
  const excelUrl = exportExcelData.data.fileUrl;
  assert.ok(excelUrl.includes("/download/"), "Excel URL should link to the download endpoint");

  const exportPdfRes = await fetch(`${BASE_URL}/exports/budget/${budgetId}/pdf`, { method: "POST", headers });
  assert.strictEqual(exportPdfRes.status, 200);
  const exportPdfData = await exportPdfRes.json();
  const pdfUrl = exportPdfData.data.fileUrl;
  assert.ok(pdfUrl.includes("/download/"), "PDF URL should link to the download endpoint");

  const exportWordRes = await fetch(`${BASE_URL}/exports/budget/${budgetId}/word`, { method: "POST", headers });
  assert.strictEqual(exportWordRes.status, 200);
  const exportWordData = await exportWordRes.json();
  const wordUrl = exportWordData.data.fileUrl;
  assert.ok(wordUrl.includes("/download/"), "Word URL should link to the download endpoint");

  // 12. Download the exported file
  console.log("12. Downloading exported Excel (CSV) file...");
  // Extract filename from URL
  const filename = excelUrl.split("/").pop();
  const downloadRes = await fetch(`${BASE_URL}/exports/download/${filename}`, { headers });
  assert.strictEqual(downloadRes.status, 200);
  const fileText = await downloadRes.text();
  assert.ok(fileText.includes("PRESUPUESTO - "), "CSV output should contain budget header");
  assert.ok(fileText.includes("Core Module"), "CSV output should contain module name");
  assert.ok(fileText.includes("Initial Development Task"), "CSV output should contain task name");

  console.log("Integration Flow completed successfully!");
});
