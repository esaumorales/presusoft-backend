import prisma from "../../config/prisma.js";
import fs from "fs";
import path from "path";

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
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">Tarea: ${task.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${task.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${budget.currency} ${task.hourlyRate || task.unitPrice}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${budget.currency} ${task.total}</td>
          </tr>
        `;
      }
      for (const dep of mod.dependencies) {
        const planName = dep.plan ? `${dep.provider.name} - ${dep.plan.name}` : dep.provider.name;
        itemsHtml += `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">Dependencia: ${planName}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${dep.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${budget.currency} ${dep.plan?.price || dep.cost}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${budget.currency} ${dep.cost}</td>
          </tr>
        `;
      }

      modulesHtml += `
        <div style="margin-bottom: 25px;">
          <h3 style="border-bottom: 2px solid #5c6bc0; padding-bottom: 5px; color: #3f51b5; margin-bottom: 10px; font-family: sans-serif;">Módulo: ${mod.name}</h3>
          <p style="font-size: 0.9rem; color: #555; margin-bottom: 10px; font-family: sans-serif;">${mod.description || ""}</p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-family: sans-serif;">
            <thead>
              <tr style="background-color: #f5f5f5; border-bottom: 1px solid #ddd;">
                <th style="text-align: left; padding: 8px;">Concepto</th>
                <th style="text-align: right; padding: 8px; width: 10%;">Cant.</th>
                <th style="text-align: right; padding: 8px; width: 20%;">Precio Unit.</th>
                <th style="text-align: right; padding: 8px; width: 20%;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr style="font-weight: bold; border-top: 1px solid #ddd;">
                <td colspan="3" style="text-align: right; padding: 8px;">Subtotal Módulo:</td>
                <td style="text-align: right; padding: 8px;">${budget.currency} ${mod.subtotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }
  }

  const clientName = budget.project?.client?.name || "Sin cliente";
  const clientEmail = budget.project?.client?.email || "";
  const clientPhone = budget.project?.client?.phone || "";
  const clientAddress = budget.project?.client?.address || "";
  
  const creatorName = budget.user?.name || "";
  const creatorEmail = budget.user?.email || "";

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.5;
          margin: 0;
          padding: 30px;
        }
        .header {
          border-bottom: 3px solid #3f51b5;
          padding-bottom: 15px;
          margin-bottom: 30px;
        }
        .header-title h1 {
          margin: 0;
          color: #3f51b5;
          font-size: 2.2rem;
        }
        .header-details {
          margin-top: 10px;
          font-size: 0.9rem;
          color: #666;
        }
        .section-info {
          margin-bottom: 30px;
        }
        .info-card {
          margin-bottom: 15px;
          background: #fdfdfd;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 15px;
        }
        .info-card h2 {
          margin-top: 0;
          font-size: 1.1rem;
          color: #3f51b5;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        .info-card p {
          margin: 5px 0;
          font-size: 0.9rem;
        }
        .totals-table {
          width: 40%;
          margin-left: auto;
          margin-top: 20px;
          border-collapse: collapse;
          font-family: sans-serif;
        }
        .totals-table td {
          padding: 6px 10px;
          border: none;
        }
        .totals-table tr.total-row {
          font-weight: bold;
          font-size: 1.1rem;
          color: #3f51b5;
          border-top: 2px solid #3f51b5;
        }
        .footer {
          margin-top: 50px;
          border-top: 1px solid #eee;
          padding-top: 15px;
          font-size: 0.8rem;
          color: #888;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-title">
          <h1>PRESUPUESTO</h1>
          <p style="font-weight: bold; color: #5c6bc0; margin: 5px 0;">Código: ${budget.code}</p>
        </div>
        <div class="header-details">
          <p style="margin: 3px 0;"><strong>Fecha Emisión:</strong> ${new Date(budget.createdAt).toLocaleDateString()}</p>
          <p style="margin: 3px 0;"><strong>Validez:</strong> ${budget.validityDays} días</p>
          <p style="margin: 3px 0;"><strong>Estado:</strong> ${budget.status.toUpperCase()}</p>
        </div>
      </div>

      <div class="section-info">
        <div class="info-card">
          <h2>Cliente</h2>
          <p><strong>Nombre:</strong> ${clientName}</p>
          ${clientEmail ? `<p><strong>Email:</strong> ${clientEmail}</p>` : ""}
          ${clientPhone ? `<p><strong>Teléfono:</strong> ${clientPhone}</p>` : ""}
          ${clientAddress ? `<p><strong>Dirección:</strong> ${clientAddress}</p>` : ""}
        </div>
        <div class="info-card">
          <h2>Detalles del Proyecto</h2>
          <p><strong>Proyecto:</strong> ${budget.project?.name || "N/A"}</p>
          <p><strong>Preparado por:</strong> ${creatorName} (${creatorEmail})</p>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 1.3rem; color: #333; margin-bottom: 10px; font-family: sans-serif;">${budget.title}</h2>
        <p style="font-size: 0.95rem; color: #555; white-space: pre-line; font-family: sans-serif;">${budget.description || "Sin descripción."}</p>
      </div>

      ${modulesHtml}

      <table class="totals-table">
        <tr>
          <td style="padding: 6px 10px;">Subtotal:</td>
          <td style="text-align: right; padding: 6px 10px;">${budget.currency} ${budget.subtotal}</td>
        </tr>
        <tr>
          <td style="padding: 6px 10px;">Contingencia (${budget.contingencyPercentage}%):</td>
          <td style="text-align: right; padding: 6px 10px;">${budget.currency} ${budget.contingencyAmount}</td>
        </tr>
        <tr>
          <td style="padding: 6px 10px;">Margen (${budget.marginPercentage}%):</td>
          <td style="text-align: right; padding: 6px 10px;">${budget.currency} ${budget.marginAmount}</td>
        </tr>
        <tr>
          <td style="padding: 6px 10px;">Impuestos (${budget.taxPercentage}%):</td>
          <td style="text-align: right; padding: 6px 10px;">${budget.currency} ${budget.taxAmount}</td>
        </tr>
        ${parseFloat(budget.discountAmount) > 0 ? `
        <tr>
          <td style="padding: 6px 10px;">Descuento (${budget.discountPercentage}%):</td>
          <td style="text-align: right; padding: 6px 10px; color: red;">-${budget.currency} ${budget.discountAmount}</td>
        </tr>` : ""}
        <tr class="total-row">
          <td style="padding: 6px 10px; border-top: 2px solid #3f51b5;">TOTAL:</td>
          <td style="text-align: right; padding: 6px 10px; border-top: 2px solid #3f51b5;">${budget.currency} ${budget.total}</td>
        </tr>
      </table>

      ${budget.paymentTerms ? `
      <div style="margin-top: 30px; background: #fafafa; padding: 15px; border-radius: 6px; border: 1px solid #eee;">
        <h4 style="margin-top: 0; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 3px; font-family: sans-serif;">Términos de Pago</h4>
        <p style="font-size: 0.85rem; color: #555; white-space: pre-line; margin: 5px 0; font-family: sans-serif;">${budget.paymentTerms}</p>
      </div>` : ""}

      ${budget.notes ? `
      <div style="margin-top: 20px; background: #fafafa; padding: 15px; border-radius: 6px; border: 1px solid #eee;">
        <h4 style="margin-top: 0; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 3px; font-family: sans-serif;">Notas adicionales</h4>
        <p style="font-size: 0.85rem; color: #555; white-space: pre-line; margin: 5px 0; font-family: sans-serif;">${budget.notes}</p>
      </div>` : ""}

      <div class="footer" style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 15px; font-size: 0.8rem; color: #888; text-align: center; font-family: sans-serif;">
        <p>Este documento fue generado automáticamente por PresuSoft.</p>
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

  if (format === "excel") {
    extension = "csv";
    content = generateExcelContent(budget);
  } else if (format === "word") {
    extension = "doc";
    content = generateHtmlContent(budget, "word");
  } else {
    extension = "html";
    content = generateHtmlContent(budget, "pdf");
  }

  const fileName = `budget_${budgetId}_${Date.now()}.${extension}`;
  const filePath = path.join(EXPORTS_DIR, fileName);

  fs.writeFileSync(filePath, content, "utf8");

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

