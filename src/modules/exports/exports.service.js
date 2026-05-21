import prisma from "../../config/prisma.js";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

const EXPORTS_DIR = path.join(process.cwd(), "exports");

const getFullBudgetDetails = async (budgetId) => {
  return prisma.budget.findUnique({
    where: { id: budgetId },
    include: {
      user: {
        select: { name: true, email: true }
      },
      project: {
        include: {
          client: true,
          modules: {
            include: {
              tasks: { orderBy: { orderNumber: "asc" } },
              dependencies: {
                include: {
                  provider: true,
                  plan: true
                }
              }
            },
            orderBy: { orderNumber: "asc" }
          }
        }
      }
    }
  });
};

const generateExcelContent = (budget) => {
  let content = "\uFEFF"; // UTF-8 BOM
  content += `PRESUPUESTO - ${budget.code}\n`;
  content += `Título: ${budget.title}\n`;
  content += `Descripción: ${budget.description || ""}\n`;
  content += `Cliente: ${budget.project?.client?.name || "Sin cliente"}\n`;
  content += `Moneda: ${budget.currency}\n\n`;

  content += "Modulo;Tipo;Nombre/Descripción;Cantidad;Tarifa/Precio;Total\n";

  if (budget.project && budget.project.modules) {
    for (const mod of budget.project.modules) {
      content += `${mod.name};MODULO;Subtotal Módulo;;;${mod.subtotal}\n`;
      for (const task of mod.tasks) {
        content += `${mod.name};Tarea;${task.name};${task.quantity};${task.hourlyRate || task.unitPrice};${task.total}\n`;
      }
      for (const dep of mod.dependencies) {
        const planName = dep.plan ? `${dep.provider.name} - ${dep.plan.name}` : dep.provider.name;
        content += `${mod.name};Dependencia;${planName};${dep.quantity};${dep.plan?.price || dep.cost};${dep.cost}\n`;
      }
    }
  }

  content += "\n";
  content += `Subtotal;;;;;${budget.subtotal}\n`;
  content += `Contingencia (${budget.contingencyPercentage}%);;;;;${budget.contingencyAmount}\n`;
  content += `Margen (${budget.marginPercentage}%);;;;;${budget.marginAmount}\n`;
  content += `Impuestos (${budget.taxPercentage}%);;;;;${budget.taxAmount}\n`;
  if (parseFloat(budget.discountAmount) > 0) {
    content += `Descuento (${budget.discountPercentage}%);;;;;-${budget.discountAmount}\n`;
  }
  content += `TOTAL;;;;;${budget.total}\n`;

  return content;
};

const generateHtmlContent = (budget, format) => {
  const title = `Presupuesto ${budget.code}`;
  
  let modulesHtml = "";
  if (budget.project && budget.project.modules) {
    for (const mod of budget.project.modules) {
      let itemsHtml = "";
      for (const task of mod.tasks) {
        itemsHtml += `
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 12px 15px; color: #4b5563;">Tarea: ${task.name}</td>
            <td style="padding: 12px 15px; text-align: center; color: #6b7280;">${task.quantity}</td>
            <td style="padding: 12px 15px; text-align: right; color: #4b5563;">${budget.currency} ${task.hourlyRate || task.unitPrice}</td>
            <td style="padding: 12px 15px; text-align: right; font-weight: 600; color: #111827;">${budget.currency} ${task.total}</td>
          </tr>
        `;
      }
      for (const dep of mod.dependencies) {
        const planName = dep.plan ? `${dep.provider.name} - ${dep.plan.name}` : dep.provider.name;
        itemsHtml += `
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 12px 15px; color: #4b5563;">Dependencia: ${planName}</td>
            <td style="padding: 12px 15px; text-align: center; color: #6b7280;">${dep.quantity}</td>
            <td style="padding: 12px 15px; text-align: right; color: #4b5563;">${budget.currency} ${dep.plan?.price || dep.cost}</td>
            <td style="padding: 12px 15px; text-align: right; font-weight: 600; color: #111827;">${budget.currency} ${dep.cost}</td>
          </tr>
        `;
      }

      modulesHtml += `
        <div style="margin-bottom: 30px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e5e7eb;">
          <div style="background: linear-gradient(to right, #4f46e5, #3b82f6); padding: 15px 20px;">
            <h3 style="margin: 0; color: #ffffff; font-size: 1.25rem; font-weight: 600;">Módulo: ${mod.name}</h3>
            ${mod.description ? `<p style="margin: 5px 0 0; color: #e0e7ff; font-size: 0.9rem;">${mod.description}</p>` : ''}
          </div>
          <table style="width: 100%; border-collapse: collapse; margin: 0;">
            <thead>
              <tr style="background-color: #f9fafb; border-bottom: 2px solid #e5e7eb;">
                <th style="text-align: left; padding: 12px 15px; color: #6b7280; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Concepto</th>
                <th style="text-align: center; padding: 12px 15px; color: #6b7280; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; width: 10%;">Cant.</th>
                <th style="text-align: right; padding: 12px 15px; color: #6b7280; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; width: 20%;">Precio Unit.</th>
                <th style="text-align: right; padding: 12px 15px; color: #6b7280; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; width: 20%;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="background-color: #f3f4f6;">
                <td colspan="3" style="text-align: right; padding: 12px 15px; font-weight: 600; color: #374151;">Subtotal Módulo:</td>
                <td style="text-align: right; padding: 12px 15px; font-weight: 700; color: #4f46e5; font-size: 1.1rem;">${budget.currency} ${mod.subtotal}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      `;
    }
  }

  const clientName = budget.project?.client?.name || "Sin cliente";
  const clientEmail = budget.project?.client?.email || "";
  const clientPhone = budget.project?.client?.phone || "";
  
  const creatorName = budget.user?.name || "";
  const creatorEmail = budget.user?.email || "";

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Inter', sans-serif;
          color: #1f2937;
          line-height: 1.6;
          margin: 0;
          padding: 40px;
          background-color: #f9fafb;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: #ffffff;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.025);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 25px;
          margin-bottom: 35px;
        }
        .brand-title {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(to right, #4f46e5, #2563eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 5px;
        }
        .budget-code {
          display: inline-block;
          background: #e0e7ff;
          color: #4f46e5;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .header-meta {
          text-align: right;
          font-size: 0.9rem;
          color: #6b7280;
        }
        .header-meta p { margin: 3px 0; }
        .meta-val { font-weight: 600; color: #111827; }
        
        .parties-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 40px;
        }
        .party-card {
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .party-title {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin: 0 0 10px;
          font-weight: 700;
        }
        .party-name { font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0 0 5px; }
        .party-detail { margin: 2px 0; color: #475569; font-size: 0.9rem; }
        
        .project-overview {
          margin-bottom: 40px;
        }
        .project-title { font-size: 1.8rem; font-weight: 700; color: #111827; margin: 0 0 10px; }
        .project-desc { color: #4b5563; font-size: 1rem; }
        
        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin-top: 40px;
        }
        .totals-table {
          width: 350px;
          border-collapse: collapse;
        }
        .totals-table td { padding: 10px 15px; font-size: 0.95rem; color: #4b5563; }
        .totals-table .amount { text-align: right; font-weight: 600; color: #111827; }
        .totals-table .total-row td {
          font-size: 1.25rem;
          font-weight: 800;
          color: #4f46e5;
          border-top: 2px solid #e5e7eb;
          padding-top: 15px;
        }
        
        .terms-box {
          margin-top: 40px;
          padding: 20px;
          background: #fffbeb;
          border-left: 4px solid #f59e0b;
          border-radius: 0 8px 8px 0;
        }
        .terms-title { font-weight: 700; color: #b45309; margin: 0 0 8px; font-size: 1rem; }
        .terms-text { color: #92400e; margin: 0; font-size: 0.9rem; }
        
        .footer {
          margin-top: 50px;
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #9ca3af;
          font-size: 0.85rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <h1 class="brand-title">PRESUPUESTO</h1>
            <span class="budget-code">Ref: ${budget.code}</span>
          </div>
          <div class="header-meta">
            <p>Fecha Emisión: <span class="meta-val">${new Date(budget.createdAt).toLocaleDateString()}</span></p>
            <p>Validez: <span class="meta-val">${budget.validityDays} días</span></p>
            <p>Estado: <span class="meta-val">${budget.status.toUpperCase()}</span></p>
          </div>
        </div>

        <div class="parties-grid">
          <div class="party-card">
            <h3 class="party-title">Preparado para</h3>
            <p class="party-name">${clientName}</p>
            ${clientEmail ? `<p class="party-detail">${clientEmail}</p>` : ""}
            ${clientPhone ? `<p class="party-detail">${clientPhone}</p>` : ""}
          </div>
          <div class="party-card">
            <h3 class="party-title">Preparado por</h3>
            <p class="party-name">${creatorName}</p>
            <p class="party-detail">${creatorEmail}</p>
          </div>
        </div>

        <div class="project-overview">
          <h2 class="project-title">${budget.title}</h2>
          <p class="project-desc">${budget.description || ""}</p>
        </div>

        ${modulesHtml}

        <div class="totals-section">
          <table class="totals-table">
            <tr>
              <td>Subtotal</td>
              <td class="amount">${budget.currency} ${budget.subtotal}</td>
            </tr>
            <tr>
              <td>Contingencia (${budget.contingencyPercentage}%)</td>
              <td class="amount">${budget.currency} ${budget.contingencyAmount}</td>
            </tr>
            <tr>
              <td>Margen (${budget.marginPercentage}%)</td>
              <td class="amount">${budget.currency} ${budget.marginAmount}</td>
            </tr>
            <tr>
              <td>Impuestos (${budget.taxPercentage}%)</td>
              <td class="amount">${budget.currency} ${budget.taxAmount}</td>
            </tr>
            ${parseFloat(budget.discountAmount) > 0 ? `
            <tr>
              <td>Descuento (${budget.discountPercentage}%)</td>
              <td class="amount" style="color: #ef4444;">-${budget.currency} ${budget.discountAmount}</td>
            </tr>` : ""}
            <tr class="total-row">
              <td>TOTAL FINAL</td>
              <td class="amount" style="color: #4f46e5;">${budget.currency} ${budget.total}</td>
            </tr>
          </table>
        </div>

        ${budget.paymentTerms ? `
        <div class="terms-box">
          <h4 class="terms-title">Términos de Pago</h4>
          <p class="terms-text">${budget.paymentTerms.replace(/\n/g, '<br>')}</p>
        </div>` : ""}

        ${budget.notes ? `
        <div class="terms-box" style="background: #f3f4f6; border-left-color: #6b7280; margin-top: 20px;">
          <h4 class="terms-title" style="color: #374151;">Notas Adicionales</h4>
          <p class="terms-text" style="color: #4b5563;">${budget.notes.replace(/\n/g, '<br>')}</p>
        </div>` : ""}

        <div class="footer">
          <p>Documento generado con PresuSoft - La plataforma para agencias y freelancers.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const exportBudget = async (userId, budgetId, format) => {
  // Ensure target folder exists
  if (!fs.existsSync(EXPORTS_DIR)) {
    fs.mkdirSync(EXPORTS_DIR, { recursive: true });
  }

  const budget = await getFullBudgetDetails(budgetId);
  if (!budget) {
    const error = new Error("Presupuesto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  // Authorization checks
  if (budget.userId !== userId && budget.project.userId !== userId) {
    const error = new Error("No tienes acceso a este presupuesto");
    error.statusCode = 403;
    throw error;
  }

  let extension = "html";
  let content = "";
  let fileBuffer = null;

  if (format === "excel") {
    extension = "csv";
    content = generateExcelContent(budget);
    fileBuffer = Buffer.from(content, "utf8");
  } else if (format === "word") {
    extension = "doc";
    content = generateHtmlContent(budget, "word");
    fileBuffer = Buffer.from(content, "utf8");
  } else {
    extension = "pdf";
    content = generateHtmlContent(budget, "pdf");
    
    // Generar PDF usando puppeteer
    const browser = await puppeteer.launch({ 
      headless: "new", 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    await page.setContent(content, { waitUntil: 'networkidle0' });
    fileBuffer = await page.pdf({ 
      format: 'A4', 
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });
    await browser.close();
  }

  const fileName = `budget_${budgetId}_${Date.now()}.${extension}`;
  const filePath = path.join(EXPORTS_DIR, fileName);

  fs.writeFileSync(filePath, fileBuffer);

  const fileUrl = `/api/exports/download/${fileName}`;

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
  return prisma.budgetExport.findMany({
    where: { budgetId },
    include: {
      exportedBy: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { exportedAt: "desc" }
  });
};

