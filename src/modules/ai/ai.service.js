/**
 * ai.service.js
 *
 * Modelo predictivo local (Naive Bayes) para generación de presupuestos.
 * Sin APIs externas. 100% local.
 *
 * TARIFAS BASE (Perú, nivel Mid, en USD/h) — investigación de mercado 2024–2025:
 *   Junior dev:     $10–$25/h   (promedio $17/h)
 *   Mid dev:        $25–$45/h   (promedio $35/h)
 *   Senior dev:     $35–$60/h   (promedio $48/h)
 *   Latam (avg):    Junior $20–40 · Mid $30–60 · Senior $40–75
 *   España:         Junior $30–50 · Mid $45–80 · Senior $70–110
 *   USA/Europa:     Junior $40–70 · Mid $60–100 · Senior $90–150+
 *
 * Las plantillas usan tarifas de Perú Mid como BASE.
 * Los multiplicadores de mercado y seniority escalan las tarifas.
 */

import prisma from "../../config/prisma.js";
import { classifyProject, PROJECT_TYPES } from "./budget.model.js";

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: construir descripción con metadatos
// ─────────────────────────────────────────────────────────────────────────────
const meta = (role, priority, notes) =>
  `[Meta:{"role":"${role}","priority":"${priority}"}]\n${notes}`;

// ─────────────────────────────────────────────────────────────────────────────
// PLANTILLAS DE MÓDULOS POR TIPO DE PROYECTO
// ─────────────────────────────────────────────────────────────────────────────
const MODULE_TEMPLATES = {

  // ════════════════════════════════════════════════════════════════════════════
  // 1. WEB — Sitio web corporativo / Landing
  // ════════════════════════════════════════════════════════════════════════════
  [PROJECT_TYPES.WEB]: [
    {
      name: "Gestión y Planificación del Proyecto",
      description: "Kick-off, levantamiento de requisitos, cronograma y comunicación con el cliente.",
      tasks: [
        { name: "Kick-off y Levantamiento de Requisitos", description: meta("PM", "Alta", "Reuniones iniciales, definición de alcance, entregables"), hours: 6, hourlyRate: 40 },
        { name: "Elaboración de Cronograma (Gantt)", description: meta("PM", "Alta", "Planificación de sprints y fechas de entrega"), hours: 4, hourlyRate: 40 },
        { name: "Seguimiento y Gestión de Cambios", description: meta("PM", "Media", "Control de avance, gestión de solicitudes de cambio"), hours: 8, hourlyRate: 38 },
      ]
    },
    {
      name: "Diseño UI/UX",
      description: "Investigación de usuarios, wireframes, diseño visual y prototipado.",
      tasks: [
        { name: "Investigación de Usuarios (UX Research)", description: meta("Diseñador Senior", "Alta", "Benchmarking, personas, mapa de empatía"), hours: 8, hourlyRate: 35 },
        { name: "Wireframes y Flujos de Navegación", description: meta("Diseñador Mid", "Alta", "Bocetos de todas las secciones en baja fidelidad"), hours: 10, hourlyRate: 28 },
        { name: "Diseño Visual en Figma (Alta Fidelidad)", description: meta("Diseñador Senior", "Alta", "Home, Servicios, Nosotros, Contacto, Blog — Responsive"), hours: 20, hourlyRate: 35 },
        { name: "Prototipo Interactivo y Validación", description: meta("Diseñador Mid", "Media", "Prototipo navegable para aprobación del cliente"), hours: 6, hourlyRate: 28 },
        { name: "Guía de Estilos y Design System", description: meta("Diseñador Senior", "Media", "Tipografía, colores, componentes reutilizables"), hours: 5, hourlyRate: 35 },
      ]
    },
    {
      name: "Desarrollo Frontend",
      description: "Maquetación responsiva, componentes y lógica del cliente en React / Next.js.",
      tasks: [
        { name: "Setup del Proyecto (Vite/Next.js + CI/CD)", description: meta("Frontend Senior", "Alta", "Configuración base, ESLint, Prettier, Git flow"), hours: 6, hourlyRate: 48 },
        { name: "Componentes Reutilizables (Design System)", description: meta("Frontend Mid", "Alta", "Botones, tarjetas, formularios, modales"), hours: 14, hourlyRate: 35 },
        { name: "Sección Hero y Animaciones", description: meta("Frontend Mid", "Alta", "Animaciones GSAP/Framer Motion, hero responsivo"), hours: 10, hourlyRate: 35 },
        { name: "Páginas Principales (Home, Servicios, Contacto)", description: meta("Frontend Junior", "Alta", "Maquetación de secciones estáticas con datos CMS"), hours: 18, hourlyRate: 22 },
        { name: "Blog y CMS Headless (Strapi/Contentful)", description: meta("Frontend Mid", "Media", "Integración con CMS, paginación, detalle de artículo"), hours: 12, hourlyRate: 35 },
        { name: "Formulario de Contacto con Validaciones", description: meta("Frontend Junior", "Media", "React Hook Form, envío de email con Resend/SendGrid"), hours: 6, hourlyRate: 22 },
        { name: "SEO On-Page y Optimización de Rendimiento", description: meta("Frontend Senior", "Media", "Meta tags, schema.org, Core Web Vitals, lazy loading"), hours: 8, hourlyRate: 48 },
        { name: "Internacionalización (i18n)", description: meta("Frontend Mid", "Baja", "Soporte multilingüe español/inglés"), hours: 6, hourlyRate: 35 },
      ]
    },
    {
      name: "QA y Pruebas",
      description: "Testing funcional, cross-browser y de rendimiento antes del lanzamiento.",
      tasks: [
        { name: "Pruebas Funcionales y de Regresión", description: meta("QA Mid", "Alta", "Casos de prueba, escenarios happy path y bordes"), hours: 10, hourlyRate: 28 },
        { name: "Pruebas Cross-Browser y Responsive", description: meta("QA Junior", "Alta", "Chrome, Firefox, Safari, Edge — Mobile/Tablet/Desktop"), hours: 6, hourlyRate: 22 },
        { name: "Auditoría de Rendimiento (Lighthouse)", description: meta("QA Mid", "Media", "Performance >90, Accesibilidad, Best Practices"), hours: 4, hourlyRate: 28 },
      ]
    },
    {
      name: "Infraestructura y Despliegue",
      description: "Configuración del servidor, dominio, SSL, CDN y pipelines de despliegue.",
      tasks: [
        { name: "Configuración de Hosting (Vercel/Netlify o VPS)", description: meta("DevOps Mid", "Alta", "Entorno de staging y producción separados"), hours: 5, hourlyRate: 48 },
        { name: "Configuración de Dominio y SSL (HTTPS)", description: meta("DevOps Junior", "Alta", "Dominio personalizado, certificado SSL gratuito (Let's Encrypt)"), hours: 2, hourlyRate: 30 },
        { name: "CDN y Optimización de Activos", description: meta("DevOps Mid", "Media", "CloudFlare CDN, compresión Brotli, caching de assets"), hours: 3, hourlyRate: 48 },
        { name: "Monitoreo y Alertas (Uptime + Errores)", description: meta("DevOps Mid", "Media", "Uptime Robot, Sentry para captura de errores en producción"), hours: 3, hourlyRate: 48 },
      ]
    }
  ],

  // ════════════════════════════════════════════════════════════════════════════
  // 2. ECOMMERCE — Tienda online
  // ════════════════════════════════════════════════════════════════════════════
  [PROJECT_TYPES.ECOMMERCE]: [
    {
      name: "Gestión y Planificación del Proyecto",
      description: "Definición de alcance, requisitos de negocio y cronograma.",
      tasks: [
        { name: "Kick-off y Análisis de Requisitos", description: meta("PM", "Alta", "Catálogo, logística, pasarela de pago, integraciones"), hours: 8, hourlyRate: 42 },
        { name: "Definición de Arquitectura Técnica", description: meta("Arquitecto", "Alta", "Stack, base de datos, microservicios vs monolito"), hours: 6, hourlyRate: 65 },
        { name: "Planificación de Sprints y Cronograma", description: meta("PM", "Alta", "Tablero Jira/Linear, épicas y tickets"), hours: 5, hourlyRate: 42 },
      ]
    },
    {
      name: "Diseño UI/UX E-commerce",
      description: "Diseño de la tienda: catálogo, ficha de producto, carrito y checkout.",
      tasks: [
        { name: "UX Research y Análisis de Competencia", description: meta("Diseñador Senior", "Alta", "Benchmarking de tiendas líderes, análisis de conversión"), hours: 10, hourlyRate: 38 },
        { name: "Wireframes: Catálogo, Producto, Carrito, Checkout", description: meta("Diseñador Mid", "Alta", "Flujos de compra completos en baja fidelidad"), hours: 14, hourlyRate: 30 },
        { name: "Diseño Visual (Alta Fidelidad)", description: meta("Diseñador Senior", "Alta", "Home, catálogo, ficha de producto, carrito, checkout, mis pedidos"), hours: 28, hourlyRate: 38 },
        { name: "Prototipo Interactivo y Pruebas de Usabilidad", description: meta("Diseñador Mid", "Media", "Tests con usuarios reales para optimizar conversión"), hours: 8, hourlyRate: 30 },
      ]
    },
    {
      name: "Frontend de la Tienda",
      description: "React / Next.js: catálogo, ficha de producto, carrito, checkout.",
      tasks: [
        { name: "Setup y Design System (Next.js + Tailwind)", description: meta("Frontend Senior", "Alta", "Arquitectura de carpetas, componentes base, temas"), hours: 8, hourlyRate: 50 },
        { name: "Home y Banners Dinámicos", description: meta("Frontend Mid", "Alta", "Carrusel de ofertas, categorías destacadas"), hours: 10, hourlyRate: 36 },
        { name: "Catálogo con Filtros y Búsqueda Avanzada", description: meta("Frontend Senior", "Alta", "Filtros por categoría, precio, talla, color — Paginación"), hours: 18, hourlyRate: 50 },
        { name: "Ficha de Producto (Product Detail Page)", description: meta("Frontend Mid", "Alta", "Galería, variantes, stock, valoraciones"), hours: 14, hourlyRate: 36 },
        { name: "Carrito de Compras Persistente", description: meta("Frontend Mid", "Alta", "Gestión de estado global (Zustand/Redux), coupons"), hours: 12, hourlyRate: 36 },
        { name: "Checkout Multi-paso", description: meta("Frontend Senior", "Alta", "Dirección, envío, pago — Validaciones completas"), hours: 16, hourlyRate: 50 },
        { name: "Panel de Usuario (Mis Pedidos, Favoritos, Perfil)", description: meta("Frontend Junior", "Media", "Dashboard del cliente con historial de compras"), hours: 12, hourlyRate: 22 },
        { name: "SEO Dinámico y Sitemap Automático", description: meta("Frontend Senior", "Media", "Open Graph, schema.org Product, sitemap.xml generado"), hours: 8, hourlyRate: 50 },
      ]
    },
    {
      name: "Backend y API",
      description: "API REST/GraphQL, gestión de catálogo, órdenes y stock.",
      tasks: [
        { name: "Diseño del Modelo de Datos (ER Diagram)", description: meta("Backend Senior", "Alta", "Productos, variantes, órdenes, clientes, pagos"), hours: 8, hourlyRate: 52 },
        { name: "API REST: Catálogo y Categorías", description: meta("Backend Mid", "Alta", "CRUD de productos, categorías, variantes, stock"), hours: 20, hourlyRate: 38 },
        { name: "API REST: Órdenes y Carrito", description: meta("Backend Senior", "Alta", "Creación de órdenes, actualización de stock, historial"), hours: 18, hourlyRate: 52 },
        { name: "Integración Pasarela de Pago (Stripe / MercadoPago)", description: meta("Backend Senior", "Alta", "Webhooks, pagos en cuotas, reembolsos, 3DS"), hours: 16, hourlyRate: 55 },
        { name: "Módulo de Envíos y Logística", description: meta("Backend Mid", "Alta", "Cálculo de flete, tracking, estados de envío"), hours: 14, hourlyRate: 38 },
        { name: "Panel de Administración (Next.js Admin)", description: meta("Backend Senior", "Alta", "Dashboard ventas, CRUD productos, gestión de órdenes"), hours: 24, hourlyRate: 52 },
        { name: "Sistema de Cupones y Descuentos", description: meta("Backend Mid", "Media", "Porcentaje, monto fijo, código único, fecha de expiración"), hours: 10, hourlyRate: 38 },
        { name: "Módulo de Reviews y Valoraciones", description: meta("Backend Junior", "Media", "CRUD de valoraciones con moderación"), hours: 6, hourlyRate: 22 },
      ]
    },
    {
      name: "QA y Pruebas",
      description: "Pruebas del flujo completo de compra y pagos.",
      tasks: [
        { name: "Plan y Casos de Prueba (E2E)", description: meta("QA Senior", "Alta", "Flujo de compra completo: búsqueda → checkout → confirmación"), hours: 10, hourlyRate: 32 },
        { name: "Pruebas de Pagos (Sandbox y Producción)", description: meta("QA Senior", "Alta", "Tarjetas de crédito, débito, rechazos, reembolsos"), hours: 8, hourlyRate: 32 },
        { name: "Pruebas de Carga y Estrés (k6 / JMeter)", description: meta("QA Mid", "Media", "Concurrencia de 500+ usuarios simultáneos"), hours: 6, hourlyRate: 28 },
        { name: "Testing Cross-Browser y Mobile", description: meta("QA Junior", "Media", "iOS Safari, Android Chrome, tablets"), hours: 6, hourlyRate: 22 },
      ]
    },
    {
      name: "Infraestructura y DevOps",
      description: "Servidores escalables, CDN, backups y pipelines de CI/CD.",
      tasks: [
        { name: "Arquitectura en AWS / GCP (VPC, RDS, S3)", description: meta("DevOps Senior", "Alta", "Instancias EC2, base de datos RDS PostgreSQL, almacenamiento S3"), hours: 12, hourlyRate: 58 },
        { name: "Contenedorización con Docker y Kubernetes", description: meta("DevOps Senior", "Alta", "Despliegue en K8s con auto-scaling horizontal"), hours: 14, hourlyRate: 58 },
        { name: "Pipeline CI/CD (GitHub Actions)", description: meta("DevOps Mid", "Alta", "Build, test, deploy automático en staging y producción"), hours: 8, hourlyRate: 48 },
        { name: "CDN Global (CloudFlare) + SSL", description: meta("DevOps Mid", "Alta", "Caché de assets, DDoS protection, SSL automático"), hours: 4, hourlyRate: 48 },
        { name: "Backups Automáticos y Plan de Recuperación", description: meta("DevOps Mid", "Media", "Snapshots diarios de BD, políticas de retención 30 días"), hours: 4, hourlyRate: 48 },
        { name: "Monitoreo (Datadog / New Relic)", description: meta("DevOps Mid", "Media", "APM, alertas de errores, métricas de negocio"), hours: 5, hourlyRate: 48 },
      ]
    }
  ],

  // ════════════════════════════════════════════════════════════════════════════
  // 3. MOBILE — Aplicación móvil iOS/Android
  // ════════════════════════════════════════════════════════════════════════════
  [PROJECT_TYPES.MOBILE]: [
    {
      name: "Gestión y Planificación",
      description: "Definición de alcance, user stories, roadmap de producto.",
      tasks: [
        { name: "Análisis de Requisitos y User Stories", description: meta("PM", "Alta", "Épicas, historias de usuario, criterios de aceptación"), hours: 10, hourlyRate: 42 },
        { name: "Definición de MVP y Roadmap", description: meta("PM", "Alta", "Priorización MoSCoW, sprints de 2 semanas"), hours: 5, hourlyRate: 42 },
        { name: "Selección del Stack (React Native vs Flutter)", description: meta("Arquitecto", "Alta", "Evaluación de rendimiento, costo y talento disponible"), hours: 4, hourlyRate: 68 },
      ]
    },
    {
      name: "Diseño UI/UX Mobile",
      description: "Diseño para iOS y Android siguiendo Human Interface Guidelines y Material Design.",
      tasks: [
        { name: "UX Research y Mapas de Usuario", description: meta("Diseñador Senior", "Alta", "Entrevistas, personas, Customer Journey Map"), hours: 10, hourlyRate: 38 },
        { name: "Wireframes en Figma (Flujos Completos)", description: meta("Diseñador Mid", "Alta", "Onboarding, home, búsqueda, detalle, perfil, notificaciones"), hours: 14, hourlyRate: 30 },
        { name: "Diseño Visual (iOS + Android)", description: meta("Diseñador Senior", "Alta", "Guía de estilos, dark mode, adaptaciones por plataforma"), hours: 30, hourlyRate: 38 },
        { name: "Micro-animaciones y Transiciones", description: meta("Diseñador Senior", "Media", "Animaciones de carga, transiciones entre pantallas"), hours: 8, hourlyRate: 38 },
        { name: "Prototipo Navegable y Pruebas con Usuarios", description: meta("Diseñador Mid", "Media", "Test de usabilidad con 5 usuarios reales"), hours: 8, hourlyRate: 30 },
      ]
    },
    {
      name: "Desarrollo Mobile (React Native / Flutter)",
      description: "App multiplataforma para iOS y Android.",
      tasks: [
        { name: "Setup del Proyecto, Configuración y Navegación", description: meta("Mobile Senior", "Alta", "React Navigation o Go Router, arquitectura de carpetas"), hours: 10, hourlyRate: 52 },
        { name: "Módulo de Autenticación", description: meta("Mobile Senior", "Alta", "Login, registro, OTP, Google/Apple Sign-In, biometría"), hours: 16, hourlyRate: 52 },
        { name: "Pantallas de Onboarding", description: meta("Mobile Mid", "Alta", "Swiper de bienvenida, permisos de la app"), hours: 6, hourlyRate: 38 },
        { name: "Home y Pantallas Principales", description: meta("Mobile Mid", "Alta", "Feed, listados, tarjetas, animaciones de scroll"), hours: 24, hourlyRate: 38 },
        { name: "Pantalla de Detalle y Acciones", description: meta("Mobile Mid", "Alta", "Vista detallada, botones de acción, compartir"), hours: 14, hourlyRate: 38 },
        { name: "Búsqueda y Filtros Avanzados", description: meta("Mobile Senior", "Alta", "Búsqueda en tiempo real, historial, filtros complejos"), hours: 16, hourlyRate: 52 },
        { name: "Perfil de Usuario y Configuración", description: meta("Mobile Junior", "Media", "Edición de perfil, preferencias, idioma"), hours: 10, hourlyRate: 22 },
        { name: "Integración con Backend API REST", description: meta("Mobile Senior", "Alta", "Axios/Dio, interceptors JWT, manejo de errores offline"), hours: 16, hourlyRate: 52 },
        { name: "Notificaciones Push (FCM + APNs)", description: meta("Mobile Mid", "Alta", "Notificaciones locales y remotas, deep links"), hours: 10, hourlyRate: 38 },
        { name: "Gestión de Estado (Zustand / BLoC / Riverpod)", description: meta("Mobile Senior", "Alta", "Estado global, caché local, sincronización offline"), hours: 12, hourlyRate: 52 },
        { name: "Mapa y Geolocalización (Google Maps SDK)", description: meta("Mobile Senior", "Media", "Seguimiento en tiempo real, polígonos, marcadores personalizados"), hours: 18, hourlyRate: 52 },
        { name: "Integración de Pagos In-App (Stripe / IAP)", description: meta("Mobile Senior", "Alta", "Pagos nativos iOS y Android, gestión de suscripciones"), hours: 14, hourlyRate: 55 },
      ]
    },
    {
      name: "Backend API (para la App)",
      description: "API REST en Node.js / Django que consume la aplicación.",
      tasks: [
        { name: "Diseño de API y Modelo de Datos", description: meta("Backend Senior", "Alta", "OpenAPI Spec, ERD, decisiones de escalabilidad"), hours: 8, hourlyRate: 55 },
        { name: "Autenticación JWT + Refresh Tokens", description: meta("Backend Senior", "Alta", "Seguridad, rotación de tokens, blacklist"), hours: 10, hourlyRate: 55 },
        { name: "Endpoints Core del Negocio", description: meta("Backend Mid", "Alta", "CRUD principal, paginación cursor-based, filtros"), hours: 30, hourlyRate: 40 },
        { name: "WebSockets para Chat / Tiempo Real", description: meta("Backend Senior", "Alta", "Socket.io, rooms, reconexión, presencia"), hours: 18, hourlyRate: 55 },
        { name: "Módulo de Notificaciones (FCM Server)", description: meta("Backend Mid", "Media", "Disparo de notificaciones por eventos del negocio"), hours: 8, hourlyRate: 40 },
        { name: "Panel de Administración Web (React)", description: meta("Backend Senior", "Media", "Dashboard métricas, gestión de usuarios y contenido"), hours: 20, hourlyRate: 52 },
      ]
    },
    {
      name: "QA y Pruebas",
      description: "Testing en dispositivos reales, emuladores y automatización.",
      tasks: [
        { name: "Pruebas en Dispositivos Reales (iOS + Android)", description: meta("QA Senior", "Alta", "iPhone, Pixel, Samsung — Múltiples versiones de OS"), hours: 12, hourlyRate: 32 },
        { name: "Pruebas de Regresión Automatizadas (Detox)", description: meta("QA Mid", "Alta", "Flujos críticos automatizados"), hours: 10, hourlyRate: 28 },
        { name: "Pruebas de Rendimiento y Memoria", description: meta("QA Senior", "Media", "Profiling, detección de memory leaks, framerate"), hours: 6, hourlyRate: 32 },
        { name: "Beta Testing (TestFlight + Google Play Console)", description: meta("QA Junior", "Media", "Distribución a 20–50 beta testers"), hours: 4, hourlyRate: 22 },
      ]
    },
    {
      name: "Publicación y Lanzamiento",
      description: "Configuración de App Stores, assets y proceso de revisión.",
      tasks: [
        { name: "Preparación de Assets para App Stores", description: meta("Diseñador Mid", "Alta", "Íconos, screenshots, banner, descripción optimizada (ASO)"), hours: 6, hourlyRate: 30 },
        { name: "Configuración de Certificados iOS (Xcode)", description: meta("Mobile Senior", "Alta", "Provisioning profiles, entitlements, push certs"), hours: 4, hourlyRate: 52 },
        { name: "Publicación en Google Play (producción)", description: meta("Mobile Mid", "Alta", "Subida de APK/AAB, configuración de releases"), hours: 3, hourlyRate: 38 },
        { name: "Publicación en Apple App Store", description: meta("Mobile Senior", "Alta", "Revisión de Apple, respuesta a rechazos"), hours: 4, hourlyRate: 52 },
      ]
    },
    {
      name: "Infraestructura y DevOps",
      description: "Backend en la nube, base de datos, CI/CD para apps móviles.",
      tasks: [
        { name: "Infraestructura en AWS / Railway", description: meta("DevOps Senior", "Alta", "EC2/Railway, RDS PostgreSQL, S3 para media"), hours: 10, hourlyRate: 58 },
        { name: "Pipeline CI/CD Mobile (Fastlane + GitHub Actions)", description: meta("DevOps Mid", "Alta", "Build automatizado, firma y distribución a stores"), hours: 10, hourlyRate: 50 },
        { name: "Crashlytics y Monitoreo de la App (Firebase)", description: meta("DevOps Mid", "Alta", "Firebase Analytics, Crashlytics, Performance Monitoring"), hours: 5, hourlyRate: 50 },
      ]
    }
  ],

  // ════════════════════════════════════════════════════════════════════════════
  // 4. SAAS — Plataforma SaaS / Dashboard de gestión
  // ════════════════════════════════════════════════════════════════════════════
  [PROJECT_TYPES.SAAS]: [
    {
      name: "Arquitectura y Planificación",
      description: "Diseño de arquitectura técnica, modelo de datos multi-tenant y roadmap.",
      tasks: [
        { name: "Análisis de Requisitos y Modelo de Negocio", description: meta("PM", "Alta", "Roles, planes de suscripción, flujos críticos"), hours: 10, hourlyRate: 45 },
        { name: "Diseño de Arquitectura Multi-tenant", description: meta("Arquitecto Lead", "Alta", "Schema-per-tenant vs Row-level security, escalabilidad"), hours: 12, hourlyRate: 70 },
        { name: "Diseño del Modelo de Datos (ERD)", description: meta("Backend Senior", "Alta", "Diagrama entidad-relación con normalización"), hours: 8, hourlyRate: 55 },
        { name: "Definición de Planes y Límites (Quota)", description: meta("PM", "Alta", "Free, Pro, Enterprise — límites por plan"), hours: 4, hourlyRate: 45 },
      ]
    },
    {
      name: "Diseño UI/UX del Panel",
      description: "Diseño del dashboard, módulos de gestión y onboarding del usuario.",
      tasks: [
        { name: "Investigación de Usuarios y Competencia (SaaS)", description: meta("Diseñador Senior", "Alta", "Análisis de Notion, Linear, Hubspot — mejores prácticas"), hours: 10, hourlyRate: 38 },
        { name: "Diseño del Dashboard Principal", description: meta("Diseñador Senior", "Alta", "KPIs, gráficos, notificaciones, accesos rápidos"), hours: 16, hourlyRate: 38 },
        { name: "Diseño de Módulos de Gestión", description: meta("Diseñador Mid", "Alta", "Tablas de datos, formularios, vistas kanban/lista"), hours: 20, hourlyRate: 30 },
        { name: "Flujo de Onboarding y Configuración Inicial", description: meta("Diseñador Senior", "Alta", "Wizard de configuración, tooltips de ayuda"), hours: 8, hourlyRate: 38 },
        { name: "Diseño de Página de Precios (Marketing)", description: meta("Diseñador Mid", "Media", "Tabla comparativa de planes, CTA, FAQs"), hours: 6, hourlyRate: 30 },
      ]
    },
    {
      name: "Backend y API",
      description: "API REST, autenticación avanzada, billing y lógica de negocio.",
      tasks: [
        { name: "Setup del Servidor (Node.js + Express/Fastify)", description: meta("Backend Senior", "Alta", "Estructura modular, middlewares, manejo de errores"), hours: 8, hourlyRate: 55 },
        { name: "Autenticación: JWT, OAuth (Google, GitHub) y 2FA", description: meta("Backend Senior", "Alta", "Refresh tokens, sesiones, magic links"), hours: 14, hourlyRate: 55 },
        { name: "Sistema de Roles y Permisos (RBAC)", description: meta("Backend Senior", "Alta", "Admin, Manager, Member — por workspace"), hours: 12, hourlyRate: 55 },
        { name: "Sistema de Workspaces / Organizaciones", description: meta("Backend Senior", "Alta", "Creación, invitaciones por email, gestión de miembros"), hours: 16, hourlyRate: 55 },
        { name: "Módulo Core del Negocio (CRUD Principal)", description: meta("Backend Mid", "Alta", "Lógica de negocio principal del SaaS"), hours: 30, hourlyRate: 42 },
        { name: "Módulo de Reportes y Analytics", description: meta("Backend Senior", "Alta", "Consultas agregadas, exportación CSV/PDF, gráficos"), hours: 18, hourlyRate: 55 },
        { name: "Integración de Billing (Stripe Subscriptions)", description: meta("Backend Senior", "Alta", "Planes, upgrades, downgrades, webhooks de pago, facturas"), hours: 20, hourlyRate: 58 },
        { name: "Sistema de Notificaciones (Email + In-App)", description: meta("Backend Mid", "Alta", "SendGrid, plantillas de email, notificaciones en tiempo real"), hours: 12, hourlyRate: 42 },
        { name: "API Pública y Webhooks (para integraciones)", description: meta("Backend Senior", "Media", "API keys, rate limiting, documentación pública"), hours: 14, hourlyRate: 55 },
        { name: "Documentación API (Swagger/OpenAPI)", description: meta("Backend Mid", "Media", "Documentación interactiva de todos los endpoints"), hours: 6, hourlyRate: 38 },
      ]
    },
    {
      name: "Frontend del Panel (React/Next.js)",
      description: "Dashboard principal, módulos de gestión y configuración.",
      tasks: [
        { name: "Setup Next.js App Router + Design System", description: meta("Frontend Senior", "Alta", "shadcn/ui, arquitectura de carpetas, tema dark/light"), hours: 10, hourlyRate: 52 },
        { name: "Autenticación Frontend (Login, Registro, OAuth)", description: meta("Frontend Mid", "Alta", "Next-Auth, rutas protegidas, redirecciones"), hours: 8, hourlyRate: 38 },
        { name: "Onboarding Wizard (Multi-step)", description: meta("Frontend Senior", "Alta", "Configuración inicial guiada paso a paso"), hours: 10, hourlyRate: 52 },
        { name: "Dashboard con Gráficos (Recharts / ApexCharts)", description: meta("Frontend Senior", "Alta", "KPIs, gráficos de líneas, barras, donut — Tiempo real"), hours: 16, hourlyRate: 52 },
        { name: "Módulos CRUD con Tabla de Datos Avanzada", description: meta("Frontend Mid", "Alta", "TanStack Table, paginación, filtros, exportar"), hours: 20, hourlyRate: 38 },
        { name: "Vista Kanban / Gantt (Drag & Drop)", description: meta("Frontend Senior", "Alta", "dnd-kit, columnas configurables, persistencia"), hours: 16, hourlyRate: 52 },
        { name: "Gestión de Miembros e Invitaciones", description: meta("Frontend Mid", "Media", "Tabla de usuarios, envío de invitaciones, roles"), hours: 10, hourlyRate: 38 },
        { name: "Configuración de Cuenta y Workspace", description: meta("Frontend Junior", "Media", "Perfil, contraseña, 2FA, preferencias, zona horaria"), hours: 8, hourlyRate: 22 },
        { name: "Página de Billing y Gestión de Suscripción", description: meta("Frontend Senior", "Alta", "Stripe Customer Portal, historial de facturas"), hours: 10, hourlyRate: 52 },
        { name: "Página Pública de Marketing y Precios", description: meta("Frontend Mid", "Media", "Landing del SaaS con hero, features y pricing"), hours: 12, hourlyRate: 38 },
      ]
    },
    {
      name: "QA y Seguridad",
      description: "Testing automatizado, auditorías de seguridad y pruebas de carga.",
      tasks: [
        { name: "Tests E2E Automatizados (Playwright)", description: meta("QA Senior", "Alta", "Flujos críticos: registro, billing, core features"), hours: 16, hourlyRate: 35 },
        { name: "Tests Unitarios y de Integración Backend (Jest)", description: meta("QA Mid", "Alta", "Cobertura >80% en lógica de negocio"), hours: 14, hourlyRate: 30 },
        { name: "Auditoría de Seguridad (OWASP Top 10)", description: meta("QA Senior", "Alta", "SQL Injection, XSS, CSRF, Rate Limiting, autenticación"), hours: 10, hourlyRate: 38 },
        { name: "Pruebas de Carga (k6)", description: meta("QA Mid", "Media", "1000 usuarios concurrentes, tiempo de respuesta <200ms"), hours: 6, hourlyRate: 30 },
      ]
    },
    {
      name: "Infraestructura y DevOps",
      description: "Cloud escalable, pipelines de CI/CD, monitoreo y alta disponibilidad.",
      tasks: [
        { name: "Arquitectura en AWS (ECS, RDS, ElastiCache, S3)", description: meta("DevOps Senior", "Alta", "Contenedores en ECS Fargate, BD RDS Multi-AZ, Redis"), hours: 16, hourlyRate: 62 },
        { name: "Kubernetes (EKS) + Auto-Scaling", description: meta("DevOps Senior", "Alta", "HPA, políticas de escalado, resource limits"), hours: 14, hourlyRate: 62 },
        { name: "Pipeline CI/CD (GitHub Actions + ArgoCD)", description: meta("DevOps Mid", "Alta", "Build, test, push ECR, deploy a K8s automático"), hours: 10, hourlyRate: 50 },
        { name: "Infraestructura como Código (Terraform)", description: meta("DevOps Senior", "Alta", "IaC para reproducibilidad, staging = prod"), hours: 12, hourlyRate: 62 },
        { name: "Observabilidad (Grafana + Prometheus + Loki)", description: meta("DevOps Mid", "Alta", "Métricas, logs centralizados, dashboards de negocio"), hours: 10, hourlyRate: 50 },
        { name: "Gestión de Secretos (AWS Secrets Manager)", description: meta("DevOps Senior", "Alta", "Variables de entorno seguras, rotación automática"), hours: 4, hourlyRate: 62 },
        { name: "Plan de Disaster Recovery y Backups", description: meta("DevOps Mid", "Media", "RTO <1h, RPO <15min, snapshots automatizados"), hours: 6, hourlyRate: 50 },
      ]
    }
  ],

  // ════════════════════════════════════════════════════════════════════════════
  // 5. API — Backend / Microservicio / Integración
  // ════════════════════════════════════════════════════════════════════════════
  [PROJECT_TYPES.API]: [
    {
      name: "Diseño y Arquitectura de la API",
      description: "Definición de contratos, endpoints y modelo de datos.",
      tasks: [
        { name: "Análisis de Requisitos y Casos de Uso", description: meta("Arquitecto", "Alta", "Identificación de recursos, operaciones y actores"), hours: 6, hourlyRate: 68 },
        { name: "Diseño de API (OpenAPI 3.0 / Swagger)", description: meta("Backend Senior", "Alta", "Endpoints, schemas, request/response, errores"), hours: 10, hourlyRate: 55 },
        { name: "Modelado de Datos (ERD + Decisiones Técnicas)", description: meta("Backend Senior", "Alta", "Normalización, índices, relaciones, decisiones de BD"), hours: 6, hourlyRate: 55 },
      ]
    },
    {
      name: "Desarrollo del Backend",
      description: "Implementación de la API con Node.js / FastAPI / Django REST Framework.",
      tasks: [
        { name: "Setup del Proyecto y Configuración de Entorno", description: meta("Backend Senior", "Alta", "Estructura de carpetas, Docker, variables de entorno"), hours: 5, hourlyRate: 55 },
        { name: "Base de Datos y Migraciones (Prisma / Alembic)", description: meta("Backend Mid", "Alta", "Schema, migraciones, seeds de datos iniciales"), hours: 6, hourlyRate: 40 },
        { name: "Autenticación y Autorización (JWT + RBAC)", description: meta("Backend Senior", "Alta", "Login, refresh tokens, roles, middleware de permisos"), hours: 12, hourlyRate: 55 },
        { name: "Endpoints CRUD Principales (Módulo 1)", description: meta("Backend Mid", "Alta", "Listado, detalle, creación, edición, eliminación"), hours: 16, hourlyRate: 40 },
        { name: "Endpoints CRUD Principales (Módulo 2)", description: meta("Backend Junior", "Alta", "Segundo recurso del dominio"), hours: 14, hourlyRate: 22 },
        { name: "Búsqueda, Filtros y Paginación", description: meta("Backend Mid", "Alta", "Query params, paginación cursor-based, full-text search"), hours: 8, hourlyRate: 40 },
        { name: "Integración con APIs de Terceros", description: meta("Backend Senior", "Alta", "Webhooks entrantes y salientes, SDKs externos"), hours: 14, hourlyRate: 55 },
        { name: "Sistema de Cola de Tareas (BullMQ / Celery)", description: meta("Backend Senior", "Media", "Jobs en background: emails, reportes, notificaciones"), hours: 10, hourlyRate: 55 },
        { name: "Rate Limiting y Throttling", description: meta("Backend Mid", "Media", "Límites por IP, por usuario, por plan"), hours: 5, hourlyRate: 40 },
        { name: "Documentación Swagger Completa y Postman Collection", description: meta("Backend Mid", "Media", "Ejemplos de requests/responses para todos los endpoints"), hours: 6, hourlyRate: 38 },
      ]
    },
    {
      name: "Seguridad",
      description: "Hardening de seguridad según OWASP.",
      tasks: [
        { name: "Validación y Sanitización de Entradas (Zod / Joi)", description: meta("Backend Senior", "Alta", "Schemas estrictos en todos los endpoints"), hours: 6, hourlyRate: 55 },
        { name: "CORS, Helmet, CSRF y Headers de Seguridad", description: meta("Backend Mid", "Alta", "Configuración estricta de seguridad HTTP"), hours: 4, hourlyRate: 40 },
        { name: "Auditoría de Seguridad (OWASP Top 10)", description: meta("QA Senior", "Alta", "Revisión manual + herramientas automáticas (OWASP ZAP)"), hours: 8, hourlyRate: 38 },
      ]
    },
    {
      name: "Testing",
      description: "Tests unitarios, de integración y E2E de la API.",
      tasks: [
        { name: "Tests Unitarios (Jest / Pytest)", description: meta("Backend Mid", "Alta", "Cobertura >80% en servicios y utilities"), hours: 14, hourlyRate: 38 },
        { name: "Tests de Integración de la API (Supertest)", description: meta("QA Mid", "Alta", "Todos los endpoints con escenarios reales"), hours: 10, hourlyRate: 30 },
        { name: "Tests de Carga (k6)", description: meta("QA Mid", "Media", "500 RPS sostenidos, tiempo de respuesta <100ms"), hours: 6, hourlyRate: 30 },
      ]
    },
    {
      name: "Infraestructura y Despliegue",
      description: "Servidor, contenedores, pipeline CI/CD y monitoreo.",
      tasks: [
        { name: "Dockerización de la Aplicación", description: meta("DevOps Mid", "Alta", "Dockerfile multi-stage, docker-compose para desarrollo"), hours: 5, hourlyRate: 50 },
        { name: "Despliegue en Nube (Railway / AWS ECS / GCP Cloud Run)", description: meta("DevOps Mid", "Alta", "Entornos de staging y producción"), hours: 6, hourlyRate: 50 },
        { name: "Pipeline CI/CD (GitHub Actions)", description: meta("DevOps Mid", "Alta", "Lint, test, build, deploy automático por rama"), hours: 6, hourlyRate: 50 },
        { name: "Logging Centralizado (ELK / Datadog)", description: meta("DevOps Mid", "Media", "Logs estructurados, trazabilidad de requests"), hours: 5, hourlyRate: 50 },
      ]
    }
  ],

  // ════════════════════════════════════════════════════════════════════════════
  // 6. ELEARNING — Plataforma educativa
  // ════════════════════════════════════════════════════════════════════════════
  [PROJECT_TYPES.ELEARNING]: [
    {
      name: "Planificación y Pedagogía",
      description: "Diseño instruccional, arquitectura de contenidos y planificación técnica.",
      tasks: [
        { name: "Análisis de Requisitos Pedagógicos", description: meta("PM", "Alta", "Tipos de contenido, gamificación, progresión de cursos"), hours: 8, hourlyRate: 42 },
        { name: "Arquitectura de Contenidos y Taxonomía", description: meta("PM", "Alta", "Categorías, cursos, módulos, lecciones, quizzes"), hours: 5, hourlyRate: 42 },
        { name: "Definición de Roles: Estudiante, Instructor, Admin", description: meta("Arquitecto", "Alta", "Permisos, capacidades y flujos por rol"), hours: 5, hourlyRate: 65 },
      ]
    },
    {
      name: "Diseño UI/UX",
      description: "Diseño enfocado en engagement y retención del estudiante.",
      tasks: [
        { name: "UX del Flujo de Aprendizaje", description: meta("Diseñador Senior", "Alta", "Progresión de cursos, checkpoint, motivación"), hours: 12, hourlyRate: 38 },
        { name: "Diseño del Catálogo de Cursos", description: meta("Diseñador Mid", "Alta", "Cards de cursos, filtros, buscador, precio"), hours: 10, hourlyRate: 30 },
        { name: "Diseño del Aula Virtual (Reproductor + Sidebar)", description: meta("Diseñador Senior", "Alta", "Player de video, progreso, notas, transcripción"), hours: 14, hourlyRate: 38 },
        { name: "Diseño del Panel del Instructor", description: meta("Diseñador Mid", "Media", "Creación de cursos, analítica de alumnos"), hours: 10, hourlyRate: 30 },
        { name: "Diseño de Certificados Digitales", description: meta("Diseñador Senior", "Media", "Plantilla premium personalizable con QR de verificación"), hours: 5, hourlyRate: 38 },
      ]
    },
    {
      name: "Frontend del Estudiante",
      description: "Catálogo, aula virtual, evaluaciones y certificados.",
      tasks: [
        { name: "Catálogo de Cursos con Filtros y Buscador", description: meta("Frontend Mid", "Alta", "Next.js, filtros por categoría/precio/nivel, ISR"), hours: 16, hourlyRate: 38 },
        { name: "Página de Detalle del Curso (Sales Page)", description: meta("Frontend Senior", "Alta", "Curriculum, instructor, valoraciones, CTA de compra"), hours: 12, hourlyRate: 52 },
        { name: "Reproductor de Video (Custom Player)", description: meta("Frontend Senior", "Alta", "HLS streaming, velocidad, subtítulos, marcadores de tiempo"), hours: 20, hourlyRate: 52 },
        { name: "Sidebar de Lecciones y Progreso", description: meta("Frontend Mid", "Alta", "Árbol de lecciones, check de completado, progreso %"), hours: 12, hourlyRate: 38 },
        { name: "Sistema de Notas y Preguntas (por lección)", description: meta("Frontend Mid", "Media", "Notas sincronizadas con el tiempo del video"), hours: 8, hourlyRate: 38 },
        { name: "Motor de Quizzes y Evaluaciones", description: meta("Frontend Senior", "Alta", "Preguntas opciones múltiples, verdadero/falso, puntaje, feedback"), hours: 14, hourlyRate: 52 },
        { name: "Generación y Verificación de Certificados", description: meta("Frontend Mid", "Media", "PDF generado automáticamente, URL de verificación con QR"), hours: 8, hourlyRate: 38 },
        { name: "Dashboard del Estudiante (Mi Aprendizaje)", description: meta("Frontend Junior", "Media", "Cursos en progreso, completados, horas totales"), hours: 8, hourlyRate: 22 },
      ]
    },
    {
      name: "Panel del Instructor",
      description: "Herramientas de creación de contenido y analítica.",
      tasks: [
        { name: "Editor de Cursos (Drag & Drop de lecciones)", description: meta("Frontend Senior", "Alta", "Creación de módulos, secciones, lecciones, publicación"), hours: 20, hourlyRate: 52 },
        { name: "Subida de Videos (Resumable, Progreso)", description: meta("Frontend Senior", "Alta", "Chunked upload a S3/Bunny CDN, transcoding en background"), hours: 14, hourlyRate: 52 },
        { name: "Analítica del Instructor (Inscritos, Completados, Rating)", description: meta("Frontend Mid", "Media", "Gráficos de retención, abandono por lección"), hours: 10, hourlyRate: 38 },
      ]
    },
    {
      name: "Backend y Pagos",
      description: "API REST, gestión de contenido, pagos y notificaciones.",
      tasks: [
        { name: "API de Cursos, Lecciones y Contenido", description: meta("Backend Senior", "Alta", "CRUD completo, control de acceso por inscripción"), hours: 20, hourlyRate: 55 },
        { name: "Sistema de Inscripciones y Control de Acceso", description: meta("Backend Senior", "Alta", "Free, de pago, con cupón, suscripción mensual"), hours: 12, hourlyRate: 55 },
        { name: "Pasarela de Pago (Stripe + PayPal)", description: meta("Backend Senior", "Alta", "Compra individual, bundles, suscripciones"), hours: 14, hourlyRate: 58 },
        { name: "Transcoding de Video (FFmpeg + AWS MediaConvert)", description: meta("Backend Senior", "Alta", "Conversión a HLS multi-calidad, thumbnails automáticos"), hours: 12, hourlyRate: 55 },
        { name: "Sistema de Progreso y Gamificación", description: meta("Backend Mid", "Alta", "Guardado de progreso, puntos, badges, leaderboard"), hours: 12, hourlyRate: 42 },
        { name: "Motor de Certificados (Puppeteer)", description: meta("Backend Mid", "Media", "Generación PDF, verificación por hash único"), hours: 8, hourlyRate: 42 },
        { name: "Sistema de Reviews y Valoraciones", description: meta("Backend Junior", "Media", "CRUD, moderación, cálculo de rating promedio"), hours: 6, hourlyRate: 22 },
      ]
    },
    {
      name: "Infraestructura y DevOps",
      description: "CDN de video, almacenamiento de media y cloud escalable.",
      tasks: [
        { name: "CDN de Video (Bunny.net / AWS CloudFront + S3)", description: meta("DevOps Senior", "Alta", "Streaming adaptativo, protección de contenido (token signing)"), hours: 10, hourlyRate: 60 },
        { name: "Servidor de Aplicación (AWS ECS / Fly.io)", description: meta("DevOps Mid", "Alta", "Despliegue en contenedores, auto-scaling"), hours: 8, hourlyRate: 50 },
        { name: "Cola de Trabajos para Transcoding (BullMQ + Redis)", description: meta("DevOps Mid", "Alta", "Workers de background para procesamiento de video"), hours: 6, hourlyRate: 50 },
        { name: "Pipeline CI/CD y Entornos (Staging + Prod)", description: meta("DevOps Mid", "Alta", "GitHub Actions, preview deployments"), hours: 6, hourlyRate: 50 },
      ]
    }
  ],

  // ════════════════════════════════════════════════════════════════════════════
  // 7. BOOKING — Sistema de reservas y citas
  // ════════════════════════════════════════════════════════════════════════════
  [PROJECT_TYPES.BOOKING]: [
    {
      name: "Planificación y Análisis",
      description: "Requisitos del negocio, lógica de disponibilidad y reglas de reserva.",
      tasks: [
        { name: "Análisis de Flujos y Reglas de Negocio", description: meta("PM", "Alta", "Tipos de servicio, duración, buffers entre citas, cancelaciones"), hours: 8, hourlyRate: 42 },
        { name: "Diseño de Modelo de Disponibilidad", description: meta("Arquitecto", "Alta", "Algoritmo de slots disponibles, zona horaria, excepciones"), hours: 6, hourlyRate: 68 },
      ]
    },
    {
      name: "Diseño UI/UX",
      description: "Flujo de reserva intuitivo para el cliente y panel de gestión para el negocio.",
      tasks: [
        { name: "Flujo de Reserva del Cliente (UX)", description: meta("Diseñador Senior", "Alta", "Selección de servicio → profesional → fecha → hora → pago"), hours: 12, hourlyRate: 38 },
        { name: "Diseño del Calendario de Disponibilidad", description: meta("Diseñador Senior", "Alta", "Vista mensual y semanal, slots disponibles, ocupados"), hours: 10, hourlyRate: 38 },
        { name: "Diseño del Panel del Negocio", description: meta("Diseñador Mid", "Alta", "Agenda diaria/semanal, gestión de servicios y staff"), hours: 12, hourlyRate: 30 },
        { name: "Diseño de Confirmaciones y Recordatorios", description: meta("Diseñador Mid", "Media", "Emails transaccionales, SMS, notificaciones push"), hours: 5, hourlyRate: 30 },
      ]
    },
    {
      name: "Frontend del Cliente",
      description: "Flujo de reserva y gestión de citas del usuario.",
      tasks: [
        { name: "Selector de Servicio y Profesional", description: meta("Frontend Mid", "Alta", "Catálogo de servicios con precios y duración"), hours: 10, hourlyRate: 38 },
        { name: "Calendario Interactivo de Disponibilidad", description: meta("Frontend Senior", "Alta", "React-calendar / FullCalendar, slots en tiempo real via API"), hours: 18, hourlyRate: 52 },
        { name: "Selección de Hora y Resumen de Reserva", description: meta("Frontend Mid", "Alta", "Paso de confirmación con detalle completo"), hours: 8, hourlyRate: 38 },
        { name: "Proceso de Pago (Stripe / Pagos en local)", description: meta("Frontend Senior", "Alta", "Stripe Elements, opción de pago presencial"), hours: 10, hourlyRate: 52 },
        { name: "Panel del Cliente (Mis Citas)", description: meta("Frontend Junior", "Media", "Historial, reagendamiento, cancelación"), hours: 10, hourlyRate: 22 },
      ]
    },
    {
      name: "Panel del Negocio y Admin",
      description: "Gestión completa de la agenda, servicios y equipo.",
      tasks: [
        { name: "Agenda Visual (Día / Semana / Mes)", description: meta("Frontend Senior", "Alta", "FullCalendar, arrastrar y soltar citas, colores por servicio"), hours: 20, hourlyRate: 52 },
        { name: "Gestión de Servicios y Precios", description: meta("Frontend Mid", "Alta", "CRUD de servicios, duración, categorías, imágenes"), hours: 10, hourlyRate: 38 },
        { name: "Gestión de Staff y Disponibilidad", description: meta("Frontend Mid", "Alta", "Horarios por profesional, días libres, breaks"), hours: 12, hourlyRate: 38 },
        { name: "Dashboard de Métricas (Ingresos, Ocupación)", description: meta("Frontend Senior", "Media", "Gráficos de citas por día/semana, tasa de no-show"), hours: 10, hourlyRate: 52 },
        { name: "Configuración Global (Horarios, Zona Horaria)", description: meta("Frontend Junior", "Media", "Horario de atención, días festivos, buffer entre citas"), hours: 6, hourlyRate: 22 },
      ]
    },
    {
      name: "Backend y Lógica de Reservas",
      description: "Motor de disponibilidad, API REST y notificaciones automáticas.",
      tasks: [
        { name: "Motor de Disponibilidad (Algoritmo de Slots)", description: meta("Backend Senior", "Alta", "Cálculo de slots libres considerando servicios, staff, breaks y timezone"), hours: 20, hourlyRate: 58 },
        { name: "API de Reservas (CRUD + Validaciones)", description: meta("Backend Senior", "Alta", "Creación, modificación, cancelación, conflictos"), hours: 16, hourlyRate: 58 },
        { name: "Integración de Pagos (Stripe)", description: meta("Backend Senior", "Alta", "Cobro por adelantado, depósito parcial, reembolsos"), hours: 12, hourlyRate: 58 },
        { name: "Sistema de Notificaciones (Email + SMS + WhatsApp)", description: meta("Backend Mid", "Alta", "Confirmación, recordatorio 24h antes, recordatorio 1h antes, cancelación"), hours: 12, hourlyRate: 42 },
        { name: "Integración con Google Calendar / Outlook", description: meta("Backend Senior", "Media", "Sincronización bidireccional de citas"), hours: 12, hourlyRate: 58 },
        { name: "Gestión de Política de Cancelación", description: meta("Backend Mid", "Media", "Reembolso según horas de anticipación configurables"), hours: 6, hourlyRate: 42 },
        { name: "API de Reportes y Exportación", description: meta("Backend Mid", "Media", "Exportación CSV de citas, ingresos por período"), hours: 6, hourlyRate: 42 },
      ]
    },
    {
      name: "Infraestructura y DevOps",
      description: "Servidor confiable con alta disponibilidad para no perder reservas.",
      tasks: [
        { name: "Despliegue en Railway / Render / AWS", description: meta("DevOps Mid", "Alta", "Entornos staging y producción, health checks"), hours: 6, hourlyRate: 50 },
        { name: "Base de Datos PostgreSQL con Backups Automáticos", description: meta("DevOps Mid", "Alta", "PgBouncer para pooling, backups cada 6h"), hours: 5, hourlyRate: 50 },
        { name: "Cola de Notificaciones (BullMQ + Redis)", description: meta("DevOps Mid", "Alta", "Reintentos automáticos de emails/SMS fallidos"), hours: 5, hourlyRate: 50 },
        { name: "Pipeline CI/CD (GitHub Actions)", description: meta("DevOps Mid", "Media", "Deploy automático a producción tras pasar tests"), hours: 5, hourlyRate: 50 },
        { name: "Monitoreo y Alertas (Sentry + Uptime Robot)", description: meta("DevOps Junior", "Media", "Alertas de caída, captura de excepciones en producción"), hours: 3, hourlyRate: 30 },
      ]
    }
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// TARIFAS POR MERCADO + SENIORITY (USD/h)
// Fuente: investigación de mercado 2024–2025
// Base actual de los templates = Perú Mid (~$35/h promedio)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Las plantillas tienen rates promedio de ~$35/h (Perú Mid).
 * El multiplicador final = MARKET_MULT[market] × SENIORITY_MULT[seniority]
 * Se aplica a cada hourlyRate de cada tarea antes de insertar.
 */
const MARKET_MULTIPLIERS = {
  peru:   1.00,   // Base: Perú (~$10–25/h junior, ~$25–45/h mid, ~$35–60/h senior)
  latam:  1.60,   // Latam promedio 60% más que Perú (~$20–40/h junior, ~$30–60/h mid)
  espana: 2.40,   // España: $30–50/h junior, $45–80/h mid, $70–110/h senior
  usa:    3.50,   // USA/Europa: $40–70/h junior, $60–100/h mid, $90–150/h senior
};

const SENIORITY_MULTIPLIERS = {
  junior: 0.55,   // Junior: 55% de la tarifa mid → rates más baratos
  mid:    1.00,   // Mid: tarifa base (default)
  senior: 1.55,   // Senior: 55% más caro → mayor experiencia y velocidad
};

const MARKET_LABELS = {
  peru:   'Perú',
  latam:  'Latinoamérica',
  espana: 'España',
  usa:    'USA / Europa',
};

const SENIORITY_LABELS = {
  junior: 'Junior (0–2 años)',
  mid:    'Intermedio / Mid (2–5 años)',
  senior: 'Senior (5+ años)',
};

// ─────────────────────────────────────────────────────────────────────────────
// AJUSTES FINANCIEROS RECOMENDADOS POR TIPO DE PROYECTO
// ─────────────────────────────────────────────────────────────────────────────
const FINANCIAL_ADJUSTMENTS = {
  [PROJECT_TYPES.WEB]:       { contingency: 5,  margin: 15 },
  [PROJECT_TYPES.ECOMMERCE]: { contingency: 10, margin: 20 },
  [PROJECT_TYPES.MOBILE]:    { contingency: 12, margin: 22 },
  [PROJECT_TYPES.SAAS]:      { contingency: 15, margin: 25 },
  [PROJECT_TYPES.API]:       { contingency: 8,  margin: 18 },
  [PROJECT_TYPES.ELEARNING]: { contingency: 10, margin: 20 },
  [PROJECT_TYPES.BOOKING]:   { contingency: 10, margin: 18 },
};
// ─────────────────────────────────────────────────────────────────────────────
// ALCANCE DEL EQUIPO (TEAM SCOPE)
// ─────────────────────────────────────────────────────────────────────────────
const SCOPE_LABELS = {
  full:     'Equipo Completo (Fullstack)',
  frontend: 'Solo Frontend y Diseño',
  backend:  'Solo Backend e Infraestructura',
};

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL: GENERAR PRESUPUESTO
// ─────────────────────────────────────────────────────────────────────────────
export const generateHeuristicBudget = async (prompt, budgetId, market = 'peru', scope = 'full', team = {}) => {
  // 1. Clasificar el tipo de proyecto con el modelo local
  const { type, confidence } = classifyProject(prompt);

  // 2. Fetch Team Members from DB if budgetId is provided
  let dbTeamMembers = [];
  if (budgetId) {
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
      include: { teamMembers: { include: { collaborator: true } } }
    });
    if (budget && budget.teamMembers) {
      dbTeamMembers = budget.teamMembers;
    }
  }

  // 3. Map real team members to categories
  const teamMapping = { ui: null, front: null, back: null, db: null, infra: null, pm: null, qa: null };
  dbTeamMembers.forEach(member => {
    const rolesStr = (member.projectRole || '').toLowerCase();
    const col = member.collaborator;
    if (!col) return;
    const memberData = { name: col.name, rate: parseFloat(col.hourlyRate), role: member.projectRole };
    
    if (/(diseñ|ui|ux)/.test(rolesStr)) teamMapping.ui = memberData;
    if (/(front|móvil|mobile|app|cliente|react)/.test(rolesStr)) teamMapping.front = memberData;
    if (/(back|api|lógica|node)/.test(rolesStr)) teamMapping.back = memberData;
    if (/(base de datos|datos|db|sql)/.test(rolesStr)) teamMapping.db = memberData;
    if (/(infra|devops|despliegue|nube|servidor|aws)/.test(rolesStr)) teamMapping.infra = memberData;
    if (/(qa|pruebas|tester)/.test(rolesStr)) teamMapping.qa = memberData;
    if (/(pm|product|project|gestor|scrum)/.test(rolesStr)) teamMapping.pm = memberData;
  });

  // Multiplicadores de mercado
  const marketMult = MARKET_MULTIPLIERS[market] || 1.00;

  // 3. Obtener plantillas
  let rawModules = MODULE_TEMPLATES[type] || MODULE_TEMPLATES[PROJECT_TYPES.WEB];

  // 4. Filtrar módulos según el alcance seleccionado
  if (scope === 'frontend') {
    rawModules = rawModules.filter(m => /(diseño|ui|ux|frontend|móvil|mobile|app|cliente)/i.test(m.name));
  } else if (scope === 'backend') {
    rawModules = rawModules.filter(m => /(backend|api|datos|infraestructura|despliegue|servidor|devops|nube)/i.test(m.name));
  }

  // 4.5. Añadir módulos fijos de Servicios Externos y Soporte según alcance
  const isWebOrApp = type === PROJECT_TYPES.WEB || type === PROJECT_TYPES.ECOMMERCE || type === PROJECT_TYPES.SAAS || type === PROJECT_TYPES.MOBILE;
  if (isWebOrApp) {
    const externalServicesTasks = [];
    const supportTasks = [];

    if (scope === 'full' || scope === 'frontend') {
      externalServicesTasks.push({ name: "Hosting Frontend (Vercel / Netlify) - Anual", description: "Despliegue CDN global, ancho de banda y SSL", hours: 0, hourlyRate: 0, quantity: 12, unitPrice: 20 });
      supportTasks.push({ name: "Soporte y Mantenimiento Frontend - Mensual", description: "Resolución de bugs, actualizaciones de dependencias de UI y React", hours: 10, hourlyRate: 35 });
    }

    if (scope === 'full' || scope === 'backend') {
      externalServicesTasks.push({ name: "Servidor / VPS Backend (AWS / DigitalOcean) - Anual", description: "Instancia de cómputo para la API REST/GraphQL", hours: 0, hourlyRate: 0, quantity: 12, unitPrice: 40 });
      externalServicesTasks.push({ name: "Base de Datos Gestionada (RDS / Supabase) - Anual", description: "Hosting de base de datos con backups automáticos", hours: 0, hourlyRate: 0, quantity: 12, unitPrice: 35 });
      externalServicesTasks.push({ name: "Almacenamiento de Archivos (Cloudinary / S3) - Anual", description: "Gestión y optimización de imágenes y documentos", hours: 0, hourlyRate: 0, quantity: 12, unitPrice: 25 });
      supportTasks.push({ name: "Soporte y Monitoreo Backend - Mensual", description: "Gestión de servidores, uptime, parches de seguridad y monitoreo de logs", hours: 15, hourlyRate: 45 });
    }

    if (externalServicesTasks.length > 0) {
      rawModules.push({
        name: "Licencias y Servicios Cloud (1er Año)",
        description: "Costos de infraestructura, dominios y servicios externos",
        tasks: externalServicesTasks
      });
    }

    if (supportTasks.length > 0) {
      rawModules.push({
        name: "Soporte, Mantenimiento y Garantía (Mensual opcional)",
        description: "Bolsa de horas para asegurar el correcto funcionamiento post-lanzamiento",
        tasks: supportTasks
      });
    }
  }

  // 5. Aplicar multiplicador dinámico y ajustar "Role" en el meta
  
  // Helpers para identificar categoría de la tarea
  const isUI = (str) => /(diseñ|ui|ux|figma|wireframe|prototipo|visual)/i.test(str);
  const isFront = (str) => /(front|móvil|mobile|app|cliente|maquetación|react|vista)/i.test(str);
  const isDB = (str) => /(base de datos|datos|db|sql|modelo|prisma|mongo)/i.test(str);
  const isInfra = (str) => /(infra|devops|despliegue|nube|hosting|ssl|cdn|servidor|aws|vercel)/i.test(str);
  const isBack = (str) => /(back|api|lógica|controlador|ruta|auth)/i.test(str);

  const getCategory = (role, taskName, modName) => {
    const fullText = `${role} ${taskName} ${modName}`;
    if (isUI(fullText)) return 'ui';
    if (isDB(fullText)) return 'db';
    if (isInfra(fullText)) return 'infra';
    if (isBack(fullText)) return 'back';
    if (isFront(fullText)) return 'front';
    if (/(pm|project|gestor)/i.test(fullText)) return 'pm';
    if (/(qa|pruebas|tester)/i.test(fullText)) return 'qa';
    return 'front'; // Default fallback
  };

  const hasAnyTeamMember = Object.values(teamMapping).some(m => m !== null);

  const modules = rawModules.map(mod => {
    const filteredTasks = (mod.tasks || []).map(t => {
      let role = t.name;
      let newDescription = t.description;
      let category = getCategory(role, t.name, mod.name);

      const metaMatch = t.description.match(/\[Meta:{"role":"([^"]+)"/);
      if (metaMatch) {
        role = metaMatch[1];
        category = getCategory(role, t.name, mod.name);
      }

      const mappedMember = teamMapping[category];

      // Filter out tasks if team is defined but no one is assigned to this category
      if (hasAnyTeamMember && !mappedMember) {
        return null;
      }

      let finalRate = parseFloat((t.hourlyRate * marketMult * 1.00).toFixed(2)); // Default to 'Mid' equivalent
      let finalRole = role;

      if (mappedMember && mappedMember.rate > 0) {
        finalRate = mappedMember.rate;
        finalRole = mappedMember.name;
      } else if (marketMult !== 1.00) {
        finalRole = `${role} (Mercado)`;
      }

      if (metaMatch) {
        newDescription = t.description.replace(`"role":"${role}"`, `"role":"${finalRole}"`);
      }
      
      const isFixedCost = t.hours === 0 && t.unitPrice > 0;

      return {
        ...t,
        description: newDescription,
        hourlyRate: isFixedCost ? 0 : finalRate
      };
    }).filter(t => t !== null);

    return {
      ...mod,
      tasks: filteredTasks
    };
  }).filter(mod => mod.tasks.length > 0);

  // 2. Ajustes financieros recomendados para este tipo de proyecto
  const financialAdj = FINANCIAL_ADJUSTMENTS[type] || { contingency: 10, margin: 20 };

  // 3. Si se proporciona budgetId, insertar módulos en la BD y recalcular
  if (budgetId) {
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
      include: { project: { include: { modules: true } } }
    });

    if (budget && budget.project) {
      let startIndex = budget.project.modules.length;

      // Insertar módulos y tareas con total calculado
      for (const mod of modules) {
        startIndex++;
        await prisma.module.create({
          data: {
            projectId: budget.project.id,
            name: mod.name,
            description: mod.description || "",
            orderNumber: startIndex,
            tasks: {
              create: (mod.tasks || []).map((t, idx) => {
                const hours = t.hours ?? 0;
                const hourlyRate = t.hourlyRate ?? 0;
                const quantity = t.quantity ?? 1;
                const unitPrice = t.unitPrice ?? 0;
                
                let total = 0;
                if (hours > 0 && hourlyRate > 0) {
                  total = parseFloat((hours * hourlyRate).toFixed(2));
                } else if (unitPrice > 0) {
                  total = parseFloat((quantity * unitPrice).toFixed(2));
                }

                return {
                  name: t.name,
                  description: t.description || "",
                  hours,
                  hourlyRate,
                  quantity,
                  unitPrice,
                  total,
                  orderNumber: idx + 1
                };
              })
            }
          }
        });
      }

      // Aplicar ajustes financieros recomendados al presupuesto Y al proyecto
      await prisma.budget.update({
        where: { id: budgetId },
        data: {
          contingencyPercentage: financialAdj.contingency,
          marginPercentage:      financialAdj.margin,
        }
      });

      await prisma.project.update({
        where: { id: budget.project.id },
        data: {
          contingencyPercentage: financialAdj.contingency,
          marginPercentage:      financialAdj.margin,
        }
      });

      // ─── Recalcular totales del presupuesto ────────────────────────────────
      // Obtenemos todos los módulos con sus tareas y dependencias actualizadas
      const freshBudget = await prisma.budget.findUnique({
        where: { id: budgetId },
        include: {
          project: {
            include: {
              modules: {
                include: {
                  tasks: true,
                  dependencies: { include: { plan: true } }
                }
              }
            }
          }
        }
      });

      if (freshBudget) {
        let grandSubtotal = 0;

        // Calcular subtotal de cada módulo y actualizar en BD
        for (const module of freshBudget.project.modules) {
          const taskTotal = module.tasks.reduce(
            (sum, t) => sum + parseFloat(t.total || 0), 0
          );
          const depTotal = module.dependencies.reduce(
            (sum, d) => sum + parseFloat(d.cost || 0), 0
          );
          const moduleSubtotal = parseFloat((taskTotal + depTotal).toFixed(2));

          await prisma.module.update({
            where: { id: module.id },
            data: { subtotal: moduleSubtotal }
          });

          grandSubtotal += moduleSubtotal;
        }

        // Calcular montos financieros
        const contingencyAmount  = parseFloat((grandSubtotal * financialAdj.contingency  / 100).toFixed(2));
        const marginAmount       = parseFloat((grandSubtotal * financialAdj.margin       / 100).toFixed(2));
        const taxBase            = grandSubtotal + contingencyAmount + marginAmount;
        const taxAmount          = parseFloat((taxBase * parseFloat(freshBudget.taxPercentage) / 100).toFixed(2));
        const discountAmount     = parseFloat((taxBase * parseFloat(freshBudget.discountPercentage) / 100).toFixed(2));
        const total              = parseFloat((taxBase + taxAmount - discountAmount).toFixed(2));

        await prisma.budget.update({
          where: { id: budgetId },
          data: {
            subtotal:             grandSubtotal,
            contingencyAmount,
            marginAmount,
            taxAmount,
            discountAmount,
            total,
          }
        });
      }
    }
  }

  return {
    detectedType:         type,
    confidence,
    totalModules:         modules.length,
    market,
    marketLabel:          MARKET_LABELS[market] || market,
    team: {
      ui: teamMapping.ui ? teamMapping.ui.name : (hasAnyTeamMember ? "No Incluido" : "Estándar"),
      front: teamMapping.front ? teamMapping.front.name : (hasAnyTeamMember ? "No Incluido" : "Estándar"),
      back: teamMapping.back ? teamMapping.back.name : (hasAnyTeamMember ? "No Incluido" : "Estándar"),
      db: teamMapping.db ? teamMapping.db.name : (hasAnyTeamMember ? "No Incluido" : "Estándar"),
      infra: teamMapping.infra ? teamMapping.infra.name : (hasAnyTeamMember ? "No Incluido" : "Estándar")
    },
    scope,
    scopeLabel:           SCOPE_LABELS[scope] || scope,
    financialAdjustments: financialAdj,
    modules
  };
};

