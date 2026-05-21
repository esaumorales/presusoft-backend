/**
 * budget.model.js
 *
 * Modelo de clasificación de texto entrenado localmente (sin API externa).
 * Usa Naive Bayes de la librería `natural` (100% JavaScript, sin compilación).
 *
 * Flujo:
 *   1. Se entrena con frases de ejemplo etiquetadas por tipo de proyecto.
 *   2. Al recibir texto del usuario, lo clasifica y devuelve el tipo detectado.
 *   3. El servicio usa ese tipo para retornar la estructura de módulos adecuada.
 */

import natural from "natural";

const { BayesClassifier } = natural;

// ──────────────────────────────────────────────────────────
// TIPOS DE PROYECTO
// ──────────────────────────────────────────────────────────
export const PROJECT_TYPES = {
  WEB:       "web",
  ECOMMERCE: "ecommerce",
  MOBILE:    "mobile",
  SAAS:      "saas",
  API:       "api",
  ELEARNING: "elearning",
  BOOKING:   "booking",
};

// ──────────────────────────────────────────────────────────
// DATOS DE ENTRENAMIENTO
// ──────────────────────────────────────────────────────────
const TRAINING_SET = [
  // Aplicativo Web / Landing
  { text: "pagina web corporativa para empresa", type: PROJECT_TYPES.WEB },
  { text: "landing page para startup tecnologica", type: PROJECT_TYPES.WEB },
  { text: "sitio web de presentacion institucional", type: PROJECT_TYPES.WEB },
  { text: "web para bufete de abogados con blog", type: PROJECT_TYPES.WEB },
  { text: "pagina web personal de portafolio", type: PROJECT_TYPES.WEB },
  { text: "sitio vitrina para restaurante con menu", type: PROJECT_TYPES.WEB },
  { text: "website de presentacion de servicios", type: PROJECT_TYPES.WEB },

  // E-commerce / Tienda
  { text: "tienda online de ropa y accesorios", type: PROJECT_TYPES.ECOMMERCE },
  { text: "ecommerce de productos electronicos con carrito", type: PROJECT_TYPES.ECOMMERCE },
  { text: "tienda virtual con pasarela de pago stripe", type: PROJECT_TYPES.ECOMMERCE },
  { text: "catalogo de productos con pedidos online", type: PROJECT_TYPES.ECOMMERCE },
  { text: "shop de artesanias con pagos", type: PROJECT_TYPES.ECOMMERCE },
  { text: "plataforma de venta de productos digitales", type: PROJECT_TYPES.ECOMMERCE },
  { text: "mercado online tipo mercadolibre", type: PROJECT_TYPES.ECOMMERCE },

  // App Móvil
  { text: "app movil para android e ios", type: PROJECT_TYPES.MOBILE },
  { text: "aplicacion de delivery tipo rappi", type: PROJECT_TYPES.MOBILE },
  { text: "app tipo uber para servicios a domicilio", type: PROJECT_TYPES.MOBILE },
  { text: "aplicacion movil de gestion de tareas", type: PROJECT_TYPES.MOBILE },
  { text: "app android para restaurante con pedidos", type: PROJECT_TYPES.MOBILE },
  { text: "app ios para seguimiento de paquetes", type: PROJECT_TYPES.MOBILE },
  { text: "aplicacion movil social con chat", type: PROJECT_TYPES.MOBILE },

  // SaaS / Plataforma de gestión
  { text: "plataforma saas de gestion empresarial", type: PROJECT_TYPES.SAAS },
  { text: "dashboard de administracion con panel de control", type: PROJECT_TYPES.SAAS },
  { text: "sistema erp para gestion de inventarios", type: PROJECT_TYPES.SAAS },
  { text: "plataforma web con roles permisos y usuarios", type: PROJECT_TYPES.SAAS },
  { text: "sistema de gestion de proyectos tipo jira", type: PROJECT_TYPES.SAAS },
  { text: "admin panel para gestion de contenidos", type: PROJECT_TYPES.SAAS },

  // API / Backend
  { text: "api rest para integracion de servicios externos", type: PROJECT_TYPES.API },
  { text: "microservicio de autenticacion con jwt", type: PROJECT_TYPES.API },
  { text: "backend nodejs con base de datos postgresql", type: PROJECT_TYPES.API },
  { text: "servicio backend para consumo desde app movil", type: PROJECT_TYPES.API },
  { text: "integracion de pasarela de pago", type: PROJECT_TYPES.API },

  // E-learning
  { text: "plataforma de cursos online tipo udemy", type: PROJECT_TYPES.ELEARNING },
  { text: "sistema de educacion con videos quizzes y examenes", type: PROJECT_TYPES.ELEARNING },
  { text: "aula virtual para capacitacion de empleados", type: PROJECT_TYPES.ELEARNING },
  { text: "plataforma elearning con certificados digitales", type: PROJECT_TYPES.ELEARNING },
  { text: "escuela online con instructor y estudiantes", type: PROJECT_TYPES.ELEARNING },

  // Booking / Reservas / Citas
  { text: "sistema de citas medicas online", type: PROJECT_TYPES.BOOKING },
  { text: "plataforma de reservas de turnos para clinica", type: PROJECT_TYPES.BOOKING },
  { text: "agenda de citas para peluqueria o spa", type: PROJECT_TYPES.BOOKING },
  { text: "sistema de booking de habitaciones para hotel", type: PROJECT_TYPES.BOOKING },
  { text: "calendario de reservas para campo deportivo", type: PROJECT_TYPES.BOOKING },
];

// ──────────────────────────────────────────────────────────
// ENTRENAMIENTO DEL CLASIFICADOR
// ──────────────────────────────────────────────────────────
let classifier = null;

export const trainModel = () => {
  if (classifier) return classifier;

  classifier = new BayesClassifier();

  TRAINING_SET.forEach(({ text, type }) => {
    classifier.addDocument(text, type);
  });

  classifier.train();
  console.log("[BudgetModel] Clasificador Naive Bayes entrenado exitosamente (sin API externa).");
  return classifier;
};

/**
 * Clasifica el texto del usuario y retorna el tipo de proyecto detectado.
 * @param {string} text - Descripción del proyecto
 * @returns {{ type: string, confidence: string }}
 */
export const classifyProject = (text) => {
  const cls = trainModel();
  const type = cls.classify(text);
  return { type, confidence: "heuristica" };
};
