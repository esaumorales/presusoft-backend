/**
 * ai.service.js
 *
 * Servicio que:
 * 1. Usa el modelo Naive Bayes local (budget.model.js) para clasificar el texto.
 * 2. Retorna la estructura de módulos + tareas según el tipo de proyecto detectado.
 * 3. Si se proporciona budgetId, inserta los módulos directamente en la BD.
 *
 * NO usa APIs externas. 100% local.
 */

import prisma from "../../config/prisma.js";
import { classifyProject, PROJECT_TYPES } from "./budget.model.js";

// ──────────────────────────────────────────────────────────
// PLANTILLAS DE MÓDULOS POR TIPO DE PROYECTO
// ──────────────────────────────────────────────────────────
const MODULE_TEMPLATES = {
  [PROJECT_TYPES.WEB]: [
    {
      name: "Diseño UI/UX",
      description: "Diseño de interfaces y experiencia de usuario",
      tasks: [
        { name: "Investigación y Wireframes", description: "[Meta:{\"role\":\"Diseñador\",\"priority\":\"Alta\"}]\nBocetos y flujos de navegación", hours: 8, hourlyRate: 30 },
        { name: "Diseño Visual en Figma", description: "Diseño final de pantallas responsivas", hours: 16, hourlyRate: 35 },
        { name: "Prototipo Interactivo", description: "Prototipo navegable para aprobación del cliente", hours: 6, hourlyRate: 30 },
      ]
    },
    {
      name: "Desarrollo Frontend",
      description: "Maquetación y lógica del cliente (React / Next.js)",
      tasks: [
        { name: "Estructura y Componentes Base", description: "[Meta:{\"role\":\"Frontend\",\"priority\":\"Alta\"}]\nSetup del proyecto y componentes reutilizables", hours: 12, hourlyRate: 35 },
        { name: "Páginas y Secciones", description: "Home, Servicios, Contacto, Blog (si aplica)", hours: 24, hourlyRate: 35 },
        { name: "Formulario de Contacto", description: "Validaciones y envío de email", hours: 6, hourlyRate: 30 },
        { name: "SEO y Optimización", description: "Meta tags, Open Graph, velocidad de carga", hours: 5, hourlyRate: 30 },
      ]
    },
    {
      name: "Despliegue y Configuración",
      description: "Subida al servidor, dominio y SSL",
      tasks: [
        { name: "Configuración de Hosting", description: "[Meta:{\"role\":\"DevOps\",\"priority\":\"Media\"}]\nConfiguracion de servidor o Vercel/Netlify", hours: 4, hourlyRate: 40 },
        { name: "Dominio y SSL", description: "Configuración de dominio personalizado con HTTPS", hours: 2, hourlyRate: 40 },
      ]
    }
  ],

  [PROJECT_TYPES.ECOMMERCE]: [
    {
      name: "Diseño UI/UX E-commerce",
      description: "Diseño de la tienda y flujo de compra",
      tasks: [
        { name: "Wireframes y Flujo de Compra", description: "[Meta:{\"role\":\"Diseñador\",\"priority\":\"Alta\"}]\nDiseño del carrito, checkout y catálogo", hours: 12, hourlyRate: 35 },
        { name: "Diseño Visual de la Tienda", description: "Pantallas completas en Figma", hours: 20, hourlyRate: 35 },
      ]
    },
    {
      name: "Frontend de la Tienda",
      description: "Catálogo, carrito y checkout",
      tasks: [
        { name: "Catálogo de Productos con Filtros", description: "[Meta:{\"role\":\"Frontend\",\"priority\":\"Alta\"}]\nListado con filtros y búsqueda", hours: 20, hourlyRate: 38 },
        { name: "Carrito de Compras", description: "Lógica de carrito con persistencia", hours: 15, hourlyRate: 38 },
        { name: "Checkout y Confirmación", description: "Flujo de pago completo", hours: 12, hourlyRate: 38 },
      ]
    },
    {
      name: "Backend & Pagos",
      description: "API, base de datos y pasarela de pago",
      tasks: [
        { name: "API de Productos y Órdenes", description: "[Meta:{\"role\":\"Backend\",\"priority\":\"Alta\"}]\nCRUD de productos, stock, órdenes", hours: 30, hourlyRate: 42 },
        { name: "Integración Pasarela de Pago", description: "Stripe o MercadoPago", hours: 15, hourlyRate: 45 },
        { name: "Panel de Administración", description: "CRUD de productos e inventario", hours: 20, hourlyRate: 40 },
      ]
    },
    {
      name: "Despliegue",
      tasks: [
        { name: "Configuración del Servidor", description: "[Meta:{\"role\":\"DevOps\",\"priority\":\"Media\"}]\nDocker, Nginx, SSL", hours: 6, hourlyRate: 45 },
      ]
    }
  ],

  [PROJECT_TYPES.MOBILE]: [
    {
      name: "Diseño UI/UX Mobile",
      description: "Diseño de pantallas para iOS y Android",
      tasks: [
        { name: "User Flow y Wireframes", description: "[Meta:{\"role\":\"Diseñador\",\"priority\":\"Alta\"}]\nFlujos de usuario y bocetos", hours: 10, hourlyRate: 35 },
        { name: "Diseño de Pantallas (Figma)", description: "Diseño completo con guía de estilos", hours: 25, hourlyRate: 38 },
      ]
    },
    {
      name: "Desarrollo App (React Native)",
      description: "App multiplataforma iOS y Android",
      tasks: [
        { name: "Estructura y Navegación", description: "[Meta:{\"role\":\"Mobile Dev\",\"priority\":\"Alta\"}]\nNavigation stack, tabs, drawer", hours: 15, hourlyRate: 45 },
        { name: "Pantallas Principales", description: "Home, perfil, listados, detalle", hours: 40, hourlyRate: 45 },
        { name: "Autenticación", description: "Login, registro, recuperación de contraseña", hours: 12, hourlyRate: 45 },
        { name: "Integración con Backend", description: "Llamadas a API REST, manejo de estado", hours: 20, hourlyRate: 45 },
        { name: "Notificaciones Push", description: "Firebase Cloud Messaging", hours: 8, hourlyRate: 45 },
      ]
    },
    {
      name: "Backend API para la App",
      description: "API REST que consumirá la aplicación",
      tasks: [
        { name: "API REST (Node.js)", description: "[Meta:{\"role\":\"Backend\",\"priority\":\"Alta\"}]\nEndpoints, autenticación, base de datos", hours: 35, hourlyRate: 42 },
      ]
    },
    {
      name: "QA & Publicación",
      tasks: [
        { name: "Testing en Dispositivos Reales", description: "[Meta:{\"role\":\"QA\",\"priority\":\"Media\"}]\nPruebas en iOS y Android", hours: 10, hourlyRate: 35 },
        { name: "Publicación App Stores", description: "Google Play y Apple App Store", hours: 5, hourlyRate: 40 },
      ]
    }
  ],

  [PROJECT_TYPES.SAAS]: [
    {
      name: "Arquitectura y Diseño",
      tasks: [
        { name: "Diseño de Arquitectura del Sistema", description: "[Meta:{\"role\":\"Arquitecto\",\"priority\":\"Alta\"}]\nDiagramas, modelado de datos, decisiones técnicas", hours: 12, hourlyRate: 55 },
        { name: "Diseño UI/UX del Dashboard", description: "Wireframes y diseño del panel en Figma", hours: 20, hourlyRate: 38 },
      ]
    },
    {
      name: "Backend & Base de Datos",
      tasks: [
        { name: "API REST + Autenticación y Roles", description: "[Meta:{\"role\":\"Backend\",\"priority\":\"Alta\"}]\nJWT, multi-tenant, permisos", hours: 40, hourlyRate: 45 },
        { name: "Módulo de Gestión de Usuarios", description: "CRUD, invitaciones, perfiles", hours: 15, hourlyRate: 42 },
        { name: "Módulo de Reporting y Analytics", description: "Métricas, dashboards, exportación CSV", hours: 20, hourlyRate: 45 },
      ]
    },
    {
      name: "Frontend del Panel",
      tasks: [
        { name: "Dashboard Principal", description: "[Meta:{\"role\":\"Frontend\",\"priority\":\"Alta\"}]\nGráficos, KPIs, tabla de datos", hours: 25, hourlyRate: 40 },
        { name: "Módulos de Gestión", description: "Pantallas CRUD principales", hours: 30, hourlyRate: 40 },
        { name: "Configuración y Perfil", description: "Settings, suscripción, notificaciones", hours: 10, hourlyRate: 38 },
      ]
    },
    {
      name: "Infraestructura y DevOps",
      tasks: [
        { name: "Docker + CI/CD", description: "[Meta:{\"role\":\"DevOps\",\"priority\":\"Media\"}]\nContenedores, pipelines, staging", hours: 15, hourlyRate: 55 },
      ]
    }
  ],

  [PROJECT_TYPES.API]: [
    {
      name: "Diseño de la API",
      tasks: [
        { name: "Diseño de Endpoints y Contratos", description: "[Meta:{\"role\":\"Arquitecto\",\"priority\":\"Alta\"}]\nOpenAPI / Swagger, modelado de datos", hours: 8, hourlyRate: 55 },
      ]
    },
    {
      name: "Desarrollo del Backend",
      tasks: [
        { name: "Setup del Servidor y Base de Datos", description: "[Meta:{\"role\":\"Backend\",\"priority\":\"Alta\"}]\nNode.js / Express, Prisma, PostgreSQL", hours: 10, hourlyRate: 45 },
        { name: "Autenticación y Autorización", description: "JWT, refresh tokens, roles", hours: 12, hourlyRate: 45 },
        { name: "Endpoints CRUD Principales", description: "Lógica de negocio principal", hours: 25, hourlyRate: 45 },
        { name: "Integraciones Externas", description: "APIs de terceros, webhooks", hours: 15, hourlyRate: 48 },
        { name: "Documentación Swagger", description: "Documentación completa de todos los endpoints", hours: 6, hourlyRate: 40 },
      ]
    },
    {
      name: "Testing y Despliegue",
      tasks: [
        { name: "Tests Unitarios e Integración", description: "[Meta:{\"role\":\"QA\",\"priority\":\"Alta\"}]\nJest, cobertura mínima del 80%", hours: 12, hourlyRate: 40 },
        { name: "Despliegue en la Nube", description: "AWS / GCP / Railway con Docker", hours: 8, hourlyRate: 50 },
      ]
    }
  ],

  [PROJECT_TYPES.ELEARNING]: [
    {
      name: "Diseño de Plataforma",
      tasks: [
        { name: "Wireframes y UX del Estudiante", description: "[Meta:{\"role\":\"Diseñador\",\"priority\":\"Alta\"}]\nFlujo de inscripción, clases, progreso", hours: 15, hourlyRate: 35 },
        { name: "Diseño Visual", description: "Pantallas completas de la plataforma", hours: 20, hourlyRate: 35 },
      ]
    },
    {
      name: "Frontend del Estudiante",
      tasks: [
        { name: "Catálogo y Detalle de Cursos", description: "[Meta:{\"role\":\"Frontend\",\"priority\":\"Alta\"}]\nListado, filtros, descripción del curso", hours: 18, hourlyRate: 38 },
        { name: "Reproductor de Video y Lecciones", description: "Player, progreso, materiales descargables", hours: 20, hourlyRate: 40 },
        { name: "Módulo de Evaluaciones y Quizzes", description: "Preguntas, respuestas, puntajes", hours: 15, hourlyRate: 38 },
        { name: "Certificados Digitales", description: "Generación automática de certificados PDF", hours: 8, hourlyRate: 38 },
      ]
    },
    {
      name: "Panel del Instructor y Admin",
      tasks: [
        { name: "Creador de Cursos (Instructor)", description: "[Meta:{\"role\":\"Full Stack\",\"priority\":\"Alta\"}]\nEditor de lecciones, subida de videos", hours: 25, hourlyRate: 42 },
        { name: "Panel Administrativo", description: "Usuarios, pagos, reportes", hours: 15, hourlyRate: 42 },
      ]
    },
    {
      name: "Backend y Pagos",
      tasks: [
        { name: "API REST + Autenticación", description: "[Meta:{\"role\":\"Backend\",\"priority\":\"Alta\"}]\nRoles: estudiante, instructor, admin", hours: 25, hourlyRate: 45 },
        { name: "Pasarela de Pago (Cursos de Pago)", description: "Stripe, suscripciones o pago único", hours: 12, hourlyRate: 45 },
      ]
    }
  ],

  [PROJECT_TYPES.BOOKING]: [
    {
      name: "Diseño UX de Reservas",
      tasks: [
        { name: "Flujo de Reserva y Wireframes", description: "[Meta:{\"role\":\"Diseñador\",\"priority\":\"Alta\"}]\nPaso a paso del proceso de reserva", hours: 10, hourlyRate: 35 },
        { name: "Diseño Visual", description: "Interfaces del calendario y confirmación", hours: 14, hourlyRate: 35 },
      ]
    },
    {
      name: "Frontend de Reservas",
      tasks: [
        { name: "Calendario Interactivo de Disponibilidad", description: "[Meta:{\"role\":\"Frontend\",\"priority\":\"Alta\"}]\nCalendario con slots disponibles en tiempo real", hours: 20, hourlyRate: 40 },
        { name: "Formulario de Reserva", description: "Selección de servicio, fecha, hora y pago", hours: 12, hourlyRate: 38 },
        { name: "Panel del Usuario (Mis Reservas)", description: "Historial, cancelación, recordatorios", hours: 10, hourlyRate: 38 },
      ]
    },
    {
      name: "Panel del Negocio / Admin",
      tasks: [
        { name: "Panel de Gestión de Citas", description: "[Meta:{\"role\":\"Full Stack\",\"priority\":\"Alta\"}]\nAgenda visual, confirmaciones, bloqueo de horarios", hours: 20, hourlyRate: 42 },
        { name: "Gestión de Servicios y Personal", description: "Configurar servicios, profesionales, horarios", hours: 10, hourlyRate: 42 },
      ]
    },
    {
      name: "Backend y Notificaciones",
      tasks: [
        { name: "API REST de Reservas", description: "[Meta:{\"role\":\"Backend\",\"priority\":\"Alta\"}]\nLógica de disponibilidad, conflictos, reglas", hours: 25, hourlyRate: 45 },
        { name: "Notificaciones Email/WhatsApp", description: "Recordatorios automáticos de citas", hours: 8, hourlyRate: 42 },
      ]
    }
  ]
};

// ──────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL: GENERAR PRESUPUESTO
// ──────────────────────────────────────────────────────────
export const generateHeuristicBudget = async (prompt, budgetId) => {
  // 1. Clasificar el tipo de proyecto con el modelo local
  const { type, confidence } = classifyProject(prompt);
  const modules = MODULE_TEMPLATES[type] || MODULE_TEMPLATES[PROJECT_TYPES.WEB];

  // 2. Si se proporciona budgetId, insertar módulos en la BD
  if (budgetId) {
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
      include: { project: { include: { modules: true } } }
    });

    if (budget && budget.project) {
      let startIndex = budget.project.modules.length;

      for (const mod of modules) {
        startIndex++;
        await prisma.module.create({
          data: {
            projectId: budget.project.id,
            name: mod.name,
            description: mod.description || "",
            orderNumber: startIndex,
            tasks: {
              create: (mod.tasks || []).map((t, idx) => ({
                name: t.name,
                description: t.description || "",
                hours: t.hours ?? 0,
                hourlyRate: t.hourlyRate ?? 0,
                quantity: 1,
                unitPrice: t.unitPrice ?? 0,
                orderNumber: idx + 1
              }))
            }
          }
        });
      }
    }
  }

  return {
    detectedType: type,
    confidence,
    totalModules: modules.length,
    modules
  };
};
