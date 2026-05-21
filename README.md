Aquí tienes un **README.md completo y grande** para tu backend de **PresuSoft**, solo backend, dockerizado, con PostgreSQL, Prisma ORM, Swagger, API REST por HTTP y tiempo real con WebSockets/Socket.IO.

Está alineado con tu documento técnico, donde PresuSoft se define como una plataforma SaaS para automatizar presupuestos y cotizaciones tecnológicas usando Node.js, Express, Prisma, PostgreSQL, Docker y despliegue en VPS.  También toma como base el modelo de datos propuesto con usuarios, empresas, clientes, presupuestos, módulos, tareas, costos, plantillas, versiones, exportaciones, notificaciones, planes y suscripciones. 

````md
# PresuSoft Backend

Backend oficial del sistema **PresuSoft**, una plataforma SaaS orientada a la automatización de presupuestos, cotizaciones y propuestas económicas para proyectos tecnológicos.

Este proyecto contiene únicamente el **backend**.  
No incluye frontend.

---

# 1. Descripción general

**PresuSoft** es un sistema diseñado para reemplazar la creación manual de presupuestos en Excel o Word, permitiendo que freelancers, empresas de software y equipos tecnológicos puedan crear, gestionar, calcular, versionar, exportar y compartir presupuestos de manera profesional.

El backend se encargará de:

- Gestionar usuarios.
- Gestionar empresas.
- Gestionar clientes.
- Crear presupuestos.
- Agregar módulos al presupuesto.
- Agregar tareas y costos.
- Calcular subtotales, impuestos, descuentos y totales.
- Guardar versiones del presupuesto.
- Exportar presupuestos.
- Emitir notificaciones.
- Exponer una API REST documentada con Swagger.
- Manejar eventos en tiempo real mediante WebSockets.
- Persistir datos en PostgreSQL usando Prisma ORM.
- Ejecutarse de manera dockerizada.

---

# 2. Stack tecnológico

## Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Socket.IO
- Swagger / OpenAPI
- JWT
- bcrypt
- dotenv
- CORS
- Morgan
- Docker
- Docker Compose

## Base de datos

- PostgreSQL

## ORM

- Prisma

## Documentación API

- Swagger UI
- OpenAPI 3.0

## Tiempo real

- Socket.IO sobre WebSockets

## Contenedores

- Docker
- Docker Compose

---

# 3. Arquitectura del backend

El backend usa una arquitectura modular basada en dominios. Cada módulo tendrá sus propias rutas, controladores, servicios y validaciones.

```txt
presusoft-backend/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
│
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   ├── env.js
│   │   ├── prisma.js
│   │   ├── swagger.js
│   │   └── cors.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.validation.js
│   │   │
│   │   ├── users/
│   │   │   ├── users.routes.js
│   │   │   ├── users.controller.js
│   │   │   ├── users.service.js
│   │   │   └── users.validation.js
│   │   │
│   │   ├── companies/
│   │   │   ├── companies.routes.js
│   │   │   ├── companies.controller.js
│   │   │   ├── companies.service.js
│   │   │   └── companies.validation.js
│   │   │
│   │   ├── clients/
│   │   │   ├── clients.routes.js
│   │   │   ├── clients.controller.js
│   │   │   ├── clients.service.js
│   │   │   └── clients.validation.js
│   │   │
│   │   ├── budgets/
│   │   │   ├── budgets.routes.js
│   │   │   ├── budgets.controller.js
│   │   │   ├── budgets.service.js
│   │   │   └── budgets.validation.js
│   │   │
│   │   ├── budget-modules/
│   │   │   ├── budgetModules.routes.js
│   │   │   ├── budgetModules.controller.js
│   │   │   └── budgetModules.service.js
│   │   │
│   │   ├── budget-tasks/
│   │   │   ├── budgetTasks.routes.js
│   │   │   ├── budgetTasks.controller.js
│   │   │   └── budgetTasks.service.js
│   │   │
│   │   ├── budget-costs/
│   │   │   ├── budgetCosts.routes.js
│   │   │   ├── budgetCosts.controller.js
│   │   │   └── budgetCosts.service.js
│   │   │
│   │   ├── templates/
│   │   │   ├── templates.routes.js
│   │   │   ├── templates.controller.js
│   │   │   └── templates.service.js
│   │   │
│   │   ├── versions/
│   │   │   ├── versions.routes.js
│   │   │   ├── versions.controller.js
│   │   │   └── versions.service.js
│   │   │
│   │   ├── exports/
│   │   │   ├── exports.routes.js
│   │   │   ├── exports.controller.js
│   │   │   └── exports.service.js
│   │   │
│   │   ├── notifications/
│   │   │   ├── notifications.routes.js
│   │   │   ├── notifications.controller.js
│   │   │   └── notifications.service.js
│   │   │
│   │   ├── plans/
│   │   │   ├── plans.routes.js
│   │   │   ├── plans.controller.js
│   │   │   └── plans.service.js
│   │   │
│   │   └── subscriptions/
│   │       ├── subscriptions.routes.js
│   │       ├── subscriptions.controller.js
│   │       └── subscriptions.service.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── error.middleware.js
│   │   ├── notFound.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── sockets/
│   │   ├── socket.js
│   │   └── socketEvents.js
│   │
│   ├── utils/
│   │   ├── calculateBudget.js
│   │   ├── generateBudgetCode.js
│   │   ├── generateToken.js
│   │   ├── hashPassword.js
│   │   ├── comparePassword.js
│   │   └── apiResponse.js
│   │
│   └── constants/
│       ├── roles.js
│       ├── budgetStatus.js
│       └── socketEvents.js
│
├── docker-compose.yml
├── Dockerfile
├── .dockerignore
├── .env
├── .env.example
├── package.json
├── README.md
└── nodemon.json
````

---

# 4. Módulos del sistema

## 4.1 Auth

Módulo encargado de la autenticación.

Funciones:

* Registro de usuario.
* Inicio de sesión.
* Encriptación de contraseña.
* Generación de token JWT.
* Validación de sesión.
* Obtención del perfil autenticado.

Endpoints principales:

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

---

## 4.2 Users

Módulo encargado de la gestión de usuarios.

Funciones:

* Listar usuarios.
* Obtener usuario por ID.
* Actualizar usuario.
* Cambiar estado del usuario.
* Eliminar usuario.
* Gestionar roles.

Roles principales:

```txt
admin
editor
viewer
```

---

## 4.3 Companies

Módulo encargado de las empresas.

Funciones:

* Crear empresa.
* Editar empresa.
* Asociar empresa a usuario.
* Configurar moneda.
* Configurar impuesto por defecto.
* Guardar logo de empresa.

---

## 4.4 Clients

Módulo encargado de los clientes.

Funciones:

* Crear cliente.
* Listar clientes.
* Buscar cliente.
* Editar cliente.
* Eliminar cliente.
* Asociar cliente a una empresa.
* Asociar cliente a presupuestos.

---

## 4.5 Budgets

Módulo principal del sistema.

Funciones:

* Crear presupuesto.
* Editar presupuesto.
* Cambiar estado del presupuesto.
* Calcular presupuesto.
* Duplicar presupuesto.
* Eliminar presupuesto.
* Listar presupuestos por usuario.
* Listar presupuestos por cliente.
* Guardar historial de versiones.

Estados:

```txt
draft
sent
accepted
rejected
expired
```

---

## 4.6 Budget Modules

Módulo encargado de las secciones internas de un presupuesto.

Ejemplos:

* Diseño UI/UX.
* Backend.
* Frontend.
* Base de datos.
* Testing.
* Despliegue.
* Mantenimiento.

---

## 4.7 Budget Tasks

Módulo encargado de las tareas dentro de cada módulo.

Una tarea puede tener:

* Nombre.
* Descripción.
* Horas estimadas.
* Tarifa por hora.
* Cantidad.
* Precio unitario.
* Total.

---

## 4.8 Budget Costs

Módulo encargado de costos adicionales.

Ejemplos:

* Hosting.
* Dominio.
* Licencias.
* APIs.
* Certificados.
* Servidores.
* Servicios externos.

Tipos de costo:

```txt
monthly
annual
one_time
```

---

## 4.9 Templates

Módulo encargado de plantillas reutilizables.

Funciones:

* Crear plantilla.
* Editar plantilla.
* Eliminar plantilla.
* Crear módulos predefinidos.
* Crear tareas predefinidas.
* Aplicar plantilla a un presupuesto.

---

## 4.10 Budget Versions

Módulo encargado del versionado.

Funciones:

* Crear versión del presupuesto.
* Guardar snapshot completo.
* Restaurar versión anterior.
* Consultar historial.
* Comparar cambios en versiones futuras.

---

## 4.11 Exports

Módulo encargado de exportaciones.

Formatos futuros:

```txt
pdf
word
excel
```

Funciones:

* Exportar presupuesto.
* Guardar archivo generado.
* Registrar fecha.
* Registrar usuario que exportó.
* Notificar exportación completada.

---

## 4.12 Notifications

Módulo encargado de notificaciones.

Eventos típicos:

* Presupuesto creado.
* Presupuesto actualizado.
* Presupuesto aceptado.
* Presupuesto rechazado.
* Presupuesto vencido.
* Exportación completada.
* Cliente registrado.
* Nueva versión creada.

---

## 4.13 Plans

Módulo encargado de planes SaaS.

Planes sugeridos:

```txt
Free
Pro
Business
```

---

## 4.14 Subscriptions

Módulo encargado de suscripciones.

Funciones:

* Crear suscripción.
* Asignar plan.
* Cambiar estado.
* Validar límites por plan.
* Controlar fecha de inicio y fin.

---

# 5. Flujo general del sistema

```txt
1. Usuario se registra.
2. Se crea una empresa inicial.
3. Se asigna un plan gratuito.
4. Usuario inicia sesión.
5. Usuario registra clientes.
6. Usuario crea un presupuesto.
7. Usuario agrega módulos al presupuesto.
8. Usuario agrega tareas a cada módulo.
9. Usuario agrega costos adicionales.
10. Sistema calcula subtotal, impuesto, descuento y total.
11. Sistema guarda versión inicial.
12. Usuario cambia estado del presupuesto.
13. Sistema genera notificación.
14. Usuario exporta presupuesto.
15. Sistema registra exportación.
16. Sistema emite evento en tiempo real.
```

---

# 6. Modelo de base de datos

## 6.1 Tablas del MVP

```txt
users
companies
clients
budgets
budget_modules
budget_tasks
budget_costs
templates
template_modules
template_tasks
budget_versions
budget_exports
plans
subscriptions
notifications
```

## 6.2 Tablas futuras

```txt
comments
attachments
budget_shares
reports
integrations
team_members
ai_estimations
```

---

# 7. Relaciones principales

```txt
users
├── companies
├── clients
├── budgets
├── templates
├── reports
├── integrations
├── notifications
└── subscriptions

companies
├── clients
└── team_members

clients
└── budgets

budgets
├── budget_modules
├── budget_tasks
├── budget_costs
├── budget_versions
├── budget_exports
├── budget_shares
├── comments
├── attachments
└── ai_estimations

templates
├── template_modules
└── template_tasks

plans
└── subscriptions
```

---

# 8. Reglas de negocio

## 8.1 Registro de usuario

Cuando un usuario se registra:

* Se crea un usuario.
* Se encripta su contraseña.
* Se crea una empresa inicial.
* Se asigna un plan Free.
* Se genera token JWT.
* Se devuelve la sesión.

---

## 8.2 Creación de cliente

Cuando se crea un cliente:

* Debe pertenecer a un usuario.
* Puede estar asociado a una empresa.
* Puede tener DNI, RUC o documento fiscal.
* Puede tener observaciones internas.

---

## 8.3 Creación de presupuesto

Cuando se crea un presupuesto:

* Debe pertenecer a un usuario.
* Debe poder asociarse a un cliente.
* Puede usar una plantilla.
* Debe tener estado inicial `draft`.
* Debe generar un código único.
* Debe calcular totales.
* Debe crear una versión inicial.

---

## 8.4 Cálculo de presupuesto

La fórmula principal será:

```txt
subtotal_tareas = suma de todos los totales de tareas

subtotal_costos = suma de todos los costos adicionales

subtotal = subtotal_tareas + subtotal_costos

tax_amount = subtotal * tax_percentage / 100

discount_amount = subtotal * discount_percentage / 100

total = subtotal + tax_amount - discount_amount
```

---

## 8.5 Cambio de estado

Estados válidos:

```txt
draft
sent
accepted
rejected
expired
```

Reglas:

* Un presupuesto inicia como `draft`.
* Puede pasar de `draft` a `sent`.
* Puede pasar de `sent` a `accepted`.
* Puede pasar de `sent` a `rejected`.
* Puede pasar de `sent` a `expired`.
* Un presupuesto aceptado no debería editarse sin crear una nueva versión.

---

## 8.6 Versionado

Cada vez que ocurre un cambio importante:

* Se guarda un snapshot.
* Se registra número de versión.
* Se registra usuario que hizo el cambio.
* Se registra fecha.

Ejemplo:

```json
{
  "budget": {},
  "modules": [],
  "tasks": [],
  "costs": [],
  "totals": {}
}
```

---

# 9. Instalación del proyecto

## 9.1 Requisitos previos

Instalar:

* Node.js 20 o superior.
* Docker.
* Docker Compose.
* Git.
* VS Code.
* Postman o Insomnia.

Verificar instalaciones:

```bash
node -v
npm -v
docker -v
docker compose version
git --version
```

---

# 10. Crear proyecto desde cero

## 10.1 Crear carpeta

```bash
mkdir presusoft-backend
cd presusoft-backend
```

## 10.2 Inicializar Node

```bash
npm init -y
```

## 10.3 Instalar dependencias

```bash
npm install express cors dotenv morgan bcrypt jsonwebtoken socket.io swagger-ui-express swagger-jsdoc @prisma/client
```

## 10.4 Instalar dependencias de desarrollo

```bash
npm install -D nodemon prisma
```

## 10.5 Inicializar Prisma

```bash
npx prisma init
```

---

# 11. Configuración de package.json

Editar `package.json`:

```json
{
  "name": "presusoft-backend",
  "version": "1.0.0",
  "description": "Backend API REST para PresuSoft",
  "main": "src/server.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio",
    "prisma:seed": "node prisma/seed.js"
  },
  "keywords": [
    "presusoft",
    "backend",
    "node",
    "express",
    "prisma",
    "postgresql",
    "docker",
    "swagger",
    "socket.io"
  ],
  "author": "PresuSoft",
  "license": "ISC",
  "dependencies": {
    "@prisma/client": "latest",
    "bcrypt": "latest",
    "cors": "latest",
    "dotenv": "latest",
    "express": "latest",
    "jsonwebtoken": "latest",
    "morgan": "latest",
    "socket.io": "latest",
    "swagger-jsdoc": "latest",
    "swagger-ui-express": "latest"
  },
  "devDependencies": {
    "nodemon": "latest",
    "prisma": "latest"
  }
}
```

---

# 12. Variables de entorno

Crear archivo `.env`:

```env
PORT=4000

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/presusoft_db?schema=public"

JWT_SECRET="presusoft_super_secret_key"
JWT_EXPIRES_IN="1d"

NODE_ENV="development"

CORS_ORIGIN="*"
```

Crear archivo `.env.example`:

```env
PORT=4000

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/presusoft_db?schema=public"

JWT_SECRET="change_this_secret"
JWT_EXPIRES_IN="1d"

NODE_ENV="development"

CORS_ORIGIN="*"
```

---

# 13. Docker

## 13.1 Dockerfile

Crear `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "start"]
```

---

## 13.2 docker-compose.yml

Crear `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16
    container_name: presusoft_postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: presusoft_db
    ports:
      - "5432:5432"
    volumes:
      - presusoft_pgdata:/var/lib/postgresql/data
    networks:
      - presusoft_network

  backend:
    build: .
    container_name: presusoft_backend
    restart: always
    ports:
      - "4000:4000"
    environment:
      PORT: 4000
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/presusoft_db?schema=public
      JWT_SECRET: presusoft_super_secret_key
      JWT_EXPIRES_IN: 1d
      NODE_ENV: development
      CORS_ORIGIN: "*"
    depends_on:
      - postgres
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - presusoft_network
    command: sh -c "npx prisma migrate deploy && npm run dev"

volumes:
  presusoft_pgdata:

networks:
  presusoft_network:
    driver: bridge
```

---

## 13.3 .dockerignore

Crear `.dockerignore`:

```txt
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
prisma/migrations
```

---

# 14. Prisma schema

Crear o reemplazar `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  admin
  editor
  viewer
}

enum UserStatus {
  active
  inactive
}

enum BudgetStatus {
  draft
  sent
  accepted
  rejected
  expired
}

enum CostType {
  monthly
  annual
  one_time
}

enum ExportFormat {
  pdf
  word
  excel
}

enum BillingCycle {
  monthly
  annual
}

enum SubscriptionStatus {
  active
  inactive
  canceled
  expired
}

enum NotificationType {
  budget_created
  budget_updated
  budget_accepted
  budget_rejected
  budget_expired
  export_completed
  client_created
  version_created
  system
}

model User {
  id        String     @id @default(uuid())
  name      String
  email     String     @unique
  password  String
  phone     String?
  role      UserRole   @default(editor)
  status    UserStatus @default(active)
  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @updatedAt @map("updated_at")

  companies     Company[]
  clients       Client[]
  budgets       Budget[]
  templates     Template[]
  versions      BudgetVersion[] @relation("BudgetVersionCreatedBy")
  exports       BudgetExport[]  @relation("BudgetExportedBy")
  notifications Notification[]
  subscriptions Subscription[]

  @@map("users")
}

model Company {
  id            String   @id @default(uuid())
  userId        String   @map("user_id")
  name          String
  ruc           String?
  address       String?
  phone         String?
  email         String?
  logoUrl       String?  @map("logo_url")
  currency      String   @default("PEN")
  taxPercentage Decimal  @default(18.00) @map("tax_percentage")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  clients Client[]

  @@map("companies")
}

model Client {
  id             String   @id @default(uuid())
  userId         String   @map("user_id")
  companyId      String?  @map("company_id")
  name           String
  businessName   String?  @map("business_name")
  email          String?
  phone          String?
  address        String?
  documentNumber String?  @map("document_number")
  notes          String?
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  company Company? @relation(fields: [companyId], references: [id], onDelete: SetNull)
  budgets Budget[]

  @@map("clients")
}

model Budget {
  id                 String       @id @default(uuid())
  userId             String       @map("user_id")
  clientId           String?      @map("client_id")
  templateId         String?      @map("template_id")
  code               String       @unique
  title              String
  description        String?
  status             BudgetStatus @default(draft)
  currency           String       @default("PEN")
  subtotal           Decimal      @default(0)
  taxPercentage      Decimal      @default(18.00) @map("tax_percentage")
  taxAmount          Decimal      @default(0) @map("tax_amount")
  discountPercentage Decimal      @default(0) @map("discount_percentage")
  discountAmount     Decimal      @default(0) @map("discount_amount")
  total              Decimal      @default(0)
  validityDays       Int          @default(15) @map("validity_days")
  paymentTerms       String?      @map("payment_terms")
  notes              String?
  clientNotes        String?      @map("client_notes")
  createdAt          DateTime     @default(now()) @map("created_at")
  updatedAt          DateTime     @updatedAt @map("updated_at")

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  client    Client?   @relation(fields: [clientId], references: [id], onDelete: SetNull)
  template  Template? @relation(fields: [templateId], references: [id], onDelete: SetNull)

  modules       BudgetModule[]
  tasks         BudgetTask[]
  costs         BudgetCost[]
  versions      BudgetVersion[]
  exports       BudgetExport[]
  notifications Notification[]

  @@map("budgets")
}

model BudgetModule {
  id          String   @id @default(uuid())
  budgetId    String   @map("budget_id")
  name        String
  description String?
  orderNumber Int      @default(1) @map("order_number")
  subtotal    Decimal  @default(0)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  budget Budget       @relation(fields: [budgetId], references: [id], onDelete: Cascade)
  tasks  BudgetTask[]

  @@map("budget_modules")
}

model BudgetTask {
  id          String   @id @default(uuid())
  budgetId    String   @map("budget_id")
  moduleId    String   @map("module_id")
  name        String
  description String?
  hours       Decimal  @default(0)
  hourlyRate  Decimal  @default(0) @map("hourly_rate")
  quantity    Decimal  @default(1)
  unitPrice   Decimal  @default(0) @map("unit_price")
  total       Decimal  @default(0)
  orderNumber Int      @default(1) @map("order_number")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  budget Budget       @relation(fields: [budgetId], references: [id], onDelete: Cascade)
  module BudgetModule @relation(fields: [moduleId], references: [id], onDelete: Cascade)

  @@map("budget_tasks")
}

model BudgetCost {
  id          String   @id @default(uuid())
  budgetId    String   @map("budget_id")
  name        String
  type        CostType
  amount      Decimal  @default(0)
  quantity    Int      @default(1)
  total       Decimal  @default(0)
  description String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  budget Budget @relation(fields: [budgetId], references: [id], onDelete: Cascade)

  @@map("budget_costs")
}

model Template {
  id          String   @id @default(uuid())
  userId      String?  @map("user_id")
  name        String
  category    String?
  description String?
  isDefault   Boolean  @default(false) @map("is_default")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user    User?            @relation(fields: [userId], references: [id], onDelete: Cascade)
  modules TemplateModule[]
  budgets Budget[]

  @@map("templates")
}

model TemplateModule {
  id          String   @id @default(uuid())
  templateId  String   @map("template_id")
  name        String
  description String?
  orderNumber Int      @default(1) @map("order_number")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  template Template       @relation(fields: [templateId], references: [id], onDelete: Cascade)
  tasks    TemplateTask[]

  @@map("template_modules")
}

model TemplateTask {
  id               String   @id @default(uuid())
  templateModuleId String   @map("template_module_id")
  name             String
  description      String?
  estimatedHours   Decimal  @default(0) @map("estimated_hours")
  defaultRate      Decimal  @default(0) @map("default_rate")
  orderNumber      Int      @default(1) @map("order_number")
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  templateModule TemplateModule @relation(fields: [templateModuleId], references: [id], onDelete: Cascade)

  @@map("template_tasks")
}

model BudgetVersion {
  id            String   @id @default(uuid())
  budgetId      String   @map("budget_id")
  versionNumber Int      @map("version_number")
  snapshotData  Json     @map("snapshot_data")
  createdById   String   @map("created_by")
  createdAt     DateTime @default(now()) @map("created_at")

  budget    Budget @relation(fields: [budgetId], references: [id], onDelete: Cascade)
  createdBy User   @relation("BudgetVersionCreatedBy", fields: [createdById], references: [id], onDelete: Cascade)

  @@map("budget_versions")
}

model BudgetExport {
  id           String       @id @default(uuid())
  budgetId     String       @map("budget_id")
  format       ExportFormat
  fileUrl      String?      @map("file_url")
  exportedById String       @map("exported_by")
  exportedAt   DateTime     @default(now()) @map("exported_at")

  budget     Budget @relation(fields: [budgetId], references: [id], onDelete: Cascade)
  exportedBy User   @relation("BudgetExportedBy", fields: [exportedById], references: [id], onDelete: Cascade)

  @@map("budget_exports")
}

model Plan {
  id           String       @id @default(uuid())
  name         String       @unique
  price        Decimal      @default(0)
  billingCycle BillingCycle @default(monthly) @map("billing_cycle")
  maxBudgets   Int          @default(5) @map("max_budgets")
  maxClients   Int          @default(10) @map("max_clients")
  hasAi        Boolean      @default(false) @map("has_ai")
  hasExports   Boolean      @default(false) @map("has_exports")
  hasTeam      Boolean      @default(false) @map("has_team")
  createdAt    DateTime     @default(now()) @map("created_at")
  updatedAt    DateTime     @updatedAt @map("updated_at")

  subscriptions Subscription[]

  @@map("plans")
}

model Subscription {
  id              String             @id @default(uuid())
  userId          String             @map("user_id")
  planId          String             @map("plan_id")
  status          SubscriptionStatus @default(active)
  startDate       DateTime           @default(now()) @map("start_date")
  endDate         DateTime?          @map("end_date")
  paymentProvider String?            @map("payment_provider")
  createdAt       DateTime           @default(now()) @map("created_at")
  updatedAt       DateTime           @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  plan Plan @relation(fields: [planId], references: [id], onDelete: Restrict)

  @@map("subscriptions")
}

model Notification {
  id        String           @id @default(uuid())
  userId    String           @map("user_id")
  budgetId  String?          @map("budget_id")
  title     String
  message   String
  type      NotificationType @default(system)
  isRead    Boolean          @default(false) @map("is_read")
  createdAt DateTime         @default(now()) @map("created_at")

  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  budget Budget? @relation(fields: [budgetId], references: [id], onDelete: Cascade)

  @@map("notifications")
}
```

---

# 15. Migraciones Prisma

Crear migración inicial:

```bash
npx prisma migrate dev --name init
```

Generar cliente Prisma:

```bash
npx prisma generate
```

Abrir Prisma Studio:

```bash
npx prisma studio
```

Aplicar migraciones en Docker o producción:

```bash
npx prisma migrate deploy
```

---

# 16. Configuración base del backend

## 16.1 src/config/prisma.js

```js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

---

## 16.2 src/config/env.js

```js
import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "*",
};
```

---

## 16.3 src/config/swagger.js

```js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PresuSoft API",
      version: "1.0.0",
      description: "Documentación oficial de la API REST de PresuSoft Backend",
    },
    servers: [
      {
        url: "http://localhost:4000/api",
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/modules/**/*.routes.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
```

---

# 17. Express app

## 17.1 src/app.js

```js
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { env } from "./config/env.js";
import { swaggerUi, swaggerSpec } from "./config/swagger.js";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import companyRoutes from "./modules/companies/companies.routes.js";
import clientRoutes from "./modules/clients/clients.routes.js";
import budgetRoutes from "./modules/budgets/budgets.routes.js";
import budgetModuleRoutes from "./modules/budget-modules/budgetModules.routes.js";
import budgetTaskRoutes from "./modules/budget-tasks/budgetTasks.routes.js";
import budgetCostRoutes from "./modules/budget-costs/budgetCosts.routes.js";
import templateRoutes from "./modules/templates/templates.routes.js";
import versionRoutes from "./modules/versions/versions.routes.js";
import exportRoutes from "./modules/exports/exports.routes.js";
import notificationRoutes from "./modules/notifications/notifications.routes.js";
import planRoutes from "./modules/plans/plans.routes.js";
import subscriptionRoutes from "./modules/subscriptions/subscriptions.routes.js";

import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.json({
    message: "PresuSoft Backend API",
    status: "running",
    docs: "/api/docs",
  });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/budget-modules", budgetModuleRoutes);
app.use("/api/budget-tasks", budgetTaskRoutes);
app.use("/api/budget-costs", budgetCostRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/versions", versionRoutes);
app.use("/api/exports", exportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
```

---

## 17.2 src/server.js

```js
import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { initSocket } from "./sockets/socket.js";

const server = http.createServer(app);

initSocket(server);

server.listen(env.port, () => {
  console.log(`Servidor PresuSoft ejecutándose en http://localhost:${env.port}`);
  console.log(`Swagger disponible en http://localhost:${env.port}/api/docs`);
});
```

---

# 18. WebSockets con Socket.IO

## 18.1 src/sockets/socket.js

```js
import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    socket.on("join:user", (userId) => {
      socket.join(`user:${userId}`);
      console.log(`Usuario unido a sala user:${userId}`);
    });

    socket.on("join:budget", (budgetId) => {
      socket.join(`budget:${budgetId}`);
      console.log(`Cliente unido a sala budget:${budgetId}`);
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io no ha sido inicializado");
  }

  return io;
};
```

---

## 18.2 Eventos en tiempo real

Eventos principales:

```txt
budget:created
budget:updated
budget:deleted
budget:status-changed
budget:calculated
budget:version-created
notification:new
export:completed
client:created
client:updated
```

---

## 18.3 Ejemplo de emitir evento

```js
import { getIO } from "../../sockets/socket.js";

export const emitNotification = (userId, notification) => {
  const io = getIO();

  io.to(`user:${userId}`).emit("notification:new", notification);
};
```

---

# 19. Middlewares

## 19.1 auth.middleware.js

```js
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import prisma from "../config/prisma.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token no proporcionado",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token inválido",
      });
    }

    const decoded = jwt.verify(token, env.jwtSecret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({
        message: "Usuario no encontrado",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message: "Usuario inactivo",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "No autorizado",
    });
  }
};
```

---

## 19.2 role.middleware.js

```js
export const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "No autenticado",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "No tienes permisos para realizar esta acción",
      });
    }

    next();
  };
};
```

---

## 19.3 error.middleware.js

```js
export const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    message: err.message || "Error interno del servidor",
  });
};
```

---

## 19.4 notFound.middleware.js

```js
export const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada",
    path: req.originalUrl,
  });
};
```

---

# 20. Utilidades

## 20.1 calculateBudget.js

```js
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
```

---

## 20.2 generateBudgetCode.js

```js
export const generateBudgetCode = (count) => {
  const nextNumber = count + 1;
  return `PRES-${String(nextNumber).padStart(4, "0")}`;
};
```

---

## 20.3 generateToken.js

```js
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );
};
```

---

# 21. Auth module

## 21.1 auth.routes.js

```js
import { Router } from "express";
import { register, login, profile } from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags:
 *       - Auth
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags:
 *       - Auth
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Obtener perfil autenticado
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 */
router.get("/profile", authMiddleware, profile);

export default router;
```

---

## 21.2 auth.controller.js

```js
import * as authService from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    res.json({
      message: "Inicio de sesión correcto",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const profile = async (req, res) => {
  res.json({
    message: "Perfil obtenido correctamente",
    data: req.user,
  });
};
```

---

## 21.3 auth.service.js

```js
import bcrypt from "bcrypt";
import prisma from "../../config/prisma.js";
import { generateToken } from "../../utils/generateToken.js";

export const register = async ({ name, email, password, phone }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error("El correo ya está registrado");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const freePlan = await prisma.plan.findFirst({
    where: { name: "Free" },
  });

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
      },
    });

    await tx.company.create({
      data: {
        userId: user.id,
        name: `Empresa de ${name}`,
        currency: "PEN",
        taxPercentage: 18,
      },
    });

    if (freePlan) {
      await tx.subscription.create({
        data: {
          userId: user.id,
          planId: freePlan.id,
          status: "active",
        },
      });
    }

    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  });

  return result;
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error("Credenciales inválidas");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Credenciales inválidas");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};
```

---

# 22. Budgets module

## 22.1 budgets.routes.js

```js
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  calculateBudget,
  changeBudgetStatus,
  duplicateBudget,
} from "./budgets.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createBudget);
router.get("/", getBudgets);
router.get("/:id", getBudgetById);
router.patch("/:id", updateBudget);
router.delete("/:id", deleteBudget);
router.post("/:id/calculate", calculateBudget);
router.patch("/:id/status", changeBudgetStatus);
router.post("/:id/duplicate", duplicateBudget);

export default router;
```

---

## 22.2 budgets.controller.js

```js
import * as budgetService from "./budgets.service.js";

export const createBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.createBudget(req.user.id, req.body);

    res.status(201).json({
      message: "Presupuesto creado correctamente",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const getBudgets = async (req, res, next) => {
  try {
    const budgets = await budgetService.getBudgets(req.user.id);

    res.json({
      message: "Presupuestos obtenidos correctamente",
      data: budgets,
    });
  } catch (error) {
    next(error);
  }
};

export const getBudgetById = async (req, res, next) => {
  try {
    const budget = await budgetService.getBudgetById(req.user.id, req.params.id);

    res.json({
      message: "Presupuesto obtenido correctamente",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.updateBudget(req.user.id, req.params.id, req.body);

    res.json({
      message: "Presupuesto actualizado correctamente",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    await budgetService.deleteBudget(req.user.id, req.params.id);

    res.json({
      message: "Presupuesto eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const calculateBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.calculateBudget(req.user.id, req.params.id);

    res.json({
      message: "Presupuesto calculado correctamente",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const changeBudgetStatus = async (req, res, next) => {
  try {
    const budget = await budgetService.changeBudgetStatus(
      req.user.id,
      req.params.id,
      req.body.status
    );

    res.json({
      message: "Estado actualizado correctamente",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const duplicateBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.duplicateBudget(req.user.id, req.params.id);

    res.status(201).json({
      message: "Presupuesto duplicado correctamente",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};
```

---

## 22.3 budgets.service.js

```js
import prisma from "../../config/prisma.js";
import { calculateBudgetTotals } from "../../utils/calculateBudget.js";
import { generateBudgetCode } from "../../utils/generateBudgetCode.js";
import { getIO } from "../../sockets/socket.js";

export const createBudget = async (userId, data) => {
  const count = await prisma.budget.count({
    where: { userId },
  });

  const code = generateBudgetCode(count);

  const budget = await prisma.budget.create({
    data: {
      userId,
      clientId: data.clientId || null,
      templateId: data.templateId || null,
      code,
      title: data.title,
      description: data.description,
      currency: data.currency || "PEN",
      taxPercentage: data.taxPercentage || 18,
      discountPercentage: data.discountPercentage || 0,
      validityDays: data.validityDays || 15,
      paymentTerms: data.paymentTerms,
      notes: data.notes,
      clientNotes: data.clientNotes,
    },
    include: {
      client: true,
      modules: true,
      tasks: true,
      costs: true,
    },
  });

  await prisma.budgetVersion.create({
    data: {
      budgetId: budget.id,
      versionNumber: 1,
      createdById: userId,
      snapshotData: budget,
    },
  });

  await prisma.notification.create({
    data: {
      userId,
      budgetId: budget.id,
      title: "Presupuesto creado",
      message: `Se creó el presupuesto ${budget.code}`,
      type: "budget_created",
    },
  });

  const io = getIO();
  io.to(`user:${userId}`).emit("budget:created", budget);

  return budget;
};

export const getBudgets = async (userId) => {
  return prisma.budget.findMany({
    where: { userId },
    include: {
      client: true,
      modules: true,
      tasks: true,
      costs: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getBudgetById = async (userId, id) => {
  const budget = await prisma.budget.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      client: true,
      modules: {
        include: {
          tasks: true,
        },
      },
      tasks: true,
      costs: true,
      versions: true,
      exports: true,
    },
  });

  if (!budget) {
    const error = new Error("Presupuesto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return budget;
};

export const updateBudget = async (userId, id, data) => {
  await getBudgetById(userId, id);

  const budget = await prisma.budget.update({
    where: { id },
    data,
    include: {
      client: true,
      modules: true,
      tasks: true,
      costs: true,
    },
  });

  await createBudgetVersion(userId, id);

  const io = getIO();
  io.to(`user:${userId}`).emit("budget:updated", budget);
  io.to(`budget:${id}`).emit("budget:updated", budget);

  return budget;
};

export const deleteBudget = async (userId, id) => {
  await getBudgetById(userId, id);

  await prisma.budget.delete({
    where: { id },
  });

  const io = getIO();
  io.to(`user:${userId}`).emit("budget:deleted", { id });

  return true;
};

export const calculateBudget = async (userId, id) => {
  const budget = await getBudgetById(userId, id);

  const totals = calculateBudgetTotals({
    tasks: budget.tasks,
    costs: budget.costs,
    taxPercentage: budget.taxPercentage,
    discountPercentage: budget.discountPercentage,
  });

  const updatedBudget = await prisma.budget.update({
    where: { id },
    data: {
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      discountAmount: totals.discountAmount,
      total: totals.total,
    },
    include: {
      client: true,
      modules: true,
      tasks: true,
      costs: true,
    },
  });

  await createBudgetVersion(userId, id);

  const io = getIO();
  io.to(`user:${userId}`).emit("budget:calculated", updatedBudget);
  io.to(`budget:${id}`).emit("budget:calculated", updatedBudget);

  return updatedBudget;
};

export const changeBudgetStatus = async (userId, id, status) => {
  await getBudgetById(userId, id);

  const validStatuses = ["draft", "sent", "accepted", "rejected", "expired"];

  if (!validStatuses.includes(status)) {
    const error = new Error("Estado de presupuesto inválido");
    error.statusCode = 400;
    throw error;
  }

  const budget = await prisma.budget.update({
    where: { id },
    data: { status },
  });

  await prisma.notification.create({
    data: {
      userId,
      budgetId: id,
      title: "Estado de presupuesto actualizado",
      message: `El presupuesto ${budget.code} cambió a ${status}`,
      type: "budget_updated",
    },
  });

  const io = getIO();
  io.to(`user:${userId}`).emit("budget:status-changed", budget);
  io.to(`budget:${id}`).emit("budget:status-changed", budget);

  return budget;
};

export const duplicateBudget = async (userId, id) => {
  const original = await getBudgetById(userId, id);

  const count = await prisma.budget.count({
    where: { userId },
  });

  const code = generateBudgetCode(count);

  const duplicated = await prisma.budget.create({
    data: {
      userId,
      clientId: original.clientId,
      templateId: original.templateId,
      code,
      title: `${original.title} - Copia`,
      description: original.description,
      currency: original.currency,
      taxPercentage: original.taxPercentage,
      discountPercentage: original.discountPercentage,
      validityDays: original.validityDays,
      paymentTerms: original.paymentTerms,
      notes: original.notes,
      clientNotes: original.clientNotes,
      modules: {
        create: original.modules.map((module) => ({
          name: module.name,
          description: module.description,
          orderNumber: module.orderNumber,
          subtotal: module.subtotal,
          tasks: {
            create: module.tasks.map((task) => ({
              userId,
              budgetId: undefined,
              name: task.name,
              description: task.description,
              hours: task.hours,
              hourlyRate: task.hourlyRate,
              quantity: task.quantity,
              unitPrice: task.unitPrice,
              total: task.total,
              orderNumber: task.orderNumber,
            })),
          },
        })),
      },
      costs: {
        create: original.costs.map((cost) => ({
          name: cost.name,
          type: cost.type,
          amount: cost.amount,
          quantity: cost.quantity,
          total: cost.total,
          description: cost.description,
        })),
      },
    },
    include: {
      modules: {
        include: {
          tasks: true,
        },
      },
      costs: true,
    },
  });

  return duplicated;
};

const createBudgetVersion = async (userId, budgetId) => {
  const budget = await prisma.budget.findUnique({
    where: { id: budgetId },
    include: {
      client: true,
      modules: {
        include: {
          tasks: true,
        },
      },
      costs: true,
    },
  });

  const versionCount = await prisma.budgetVersion.count({
    where: { budgetId },
  });

  return prisma.budgetVersion.create({
    data: {
      budgetId,
      versionNumber: versionCount + 1,
      createdById: userId,
      snapshotData: budget,
    },
  });
};
```

---

# 23. API REST por HTTP

La API REST usa HTTP para operaciones CRUD.

Base URL local:

```txt
http://localhost:4000/api
```

Documentación Swagger:

```txt
http://localhost:4000/api/docs
```

---

# 24. Endpoints principales

## Auth

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
```

## Users

```txt
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

## Companies

```txt
POST   /api/companies
GET    /api/companies
GET    /api/companies/:id
PATCH  /api/companies/:id
DELETE /api/companies/:id
```

## Clients

```txt
POST   /api/clients
GET    /api/clients
GET    /api/clients/:id
PATCH  /api/clients/:id
DELETE /api/clients/:id
```

## Budgets

```txt
POST   /api/budgets
GET    /api/budgets
GET    /api/budgets/:id
PATCH  /api/budgets/:id
DELETE /api/budgets/:id
POST   /api/budgets/:id/calculate
PATCH  /api/budgets/:id/status
POST   /api/budgets/:id/duplicate
```

## Budget Modules

```txt
POST   /api/budget-modules
GET    /api/budget-modules/:id
PATCH  /api/budget-modules/:id
DELETE /api/budget-modules/:id
```

## Budget Tasks

```txt
POST   /api/budget-tasks
GET    /api/budget-tasks/:id
PATCH  /api/budget-tasks/:id
DELETE /api/budget-tasks/:id
```

## Budget Costs

```txt
POST   /api/budget-costs
GET    /api/budget-costs/:id
PATCH  /api/budget-costs/:id
DELETE /api/budget-costs/:id
```

## Templates

```txt
POST   /api/templates
GET    /api/templates
GET    /api/templates/:id
PATCH  /api/templates/:id
DELETE /api/templates/:id
POST   /api/templates/:id/apply/:budgetId
```

## Versions

```txt
GET    /api/versions/budget/:budgetId
POST   /api/versions/budget/:budgetId
POST   /api/versions/:id/restore
```

## Exports

```txt
POST   /api/exports/budget/:budgetId/pdf
POST   /api/exports/budget/:budgetId/word
POST   /api/exports/budget/:budgetId/excel
GET    /api/exports/budget/:budgetId
```

## Notifications

```txt
GET    /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all
DELETE /api/notifications/:id
```

## Plans

```txt
POST   /api/plans
GET    /api/plans
GET    /api/plans/:id
PATCH  /api/plans/:id
DELETE /api/plans/:id
```

## Subscriptions

```txt
POST   /api/subscriptions
GET    /api/subscriptions
GET    /api/subscriptions/:id
PATCH  /api/subscriptions/:id
DELETE /api/subscriptions/:id
```

---

# 25. Ejemplos de requests

## 25.1 Registro

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456",
  "phone": "999999999"
}
```

Respuesta:

```json
{
  "message": "Usuario registrado correctamente",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "editor"
    },
    "token": "jwt_token"
  }
}
```

---

## 25.2 Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

---

## 25.3 Crear cliente

```http
POST /api/clients
Authorization: Bearer TOKEN
Content-Type: application/json
```

```json
{
  "name": "Carlos Ramírez",
  "businessName": "CR Soluciones SAC",
  "email": "carlos@crsoluciones.com",
  "phone": "988888888",
  "documentNumber": "20600000001",
  "address": "Lima, Perú",
  "notes": "Cliente interesado en sistema web"
}
```

---

## 25.4 Crear presupuesto

```http
POST /api/budgets
Authorization: Bearer TOKEN
Content-Type: application/json
```

```json
{
  "clientId": "uuid_cliente",
  "title": "Sistema web para gestión comercial",
  "description": "Desarrollo de plataforma web para gestión de clientes, ventas y reportes",
  "currency": "PEN",
  "taxPercentage": 18,
  "discountPercentage": 0,
  "validityDays": 15,
  "paymentTerms": "50% al inicio y 50% contra entrega",
  "clientNotes": "El presupuesto incluye desarrollo, pruebas y despliegue."
}
```

---

## 25.5 Agregar módulo

```http
POST /api/budget-modules
Authorization: Bearer TOKEN
Content-Type: application/json
```

```json
{
  "budgetId": "uuid_presupuesto",
  "name": "Backend",
  "description": "Desarrollo de API REST, base de datos y autenticación",
  "orderNumber": 1
}
```

---

## 25.6 Agregar tarea

```http
POST /api/budget-tasks
Authorization: Bearer TOKEN
Content-Type: application/json
```

```json
{
  "budgetId": "uuid_presupuesto",
  "moduleId": "uuid_modulo",
  "name": "Implementar autenticación JWT",
  "description": "Registro, login, perfil y protección de rutas",
  "hours": 10,
  "hourlyRate": 35,
  "quantity": 1,
  "unitPrice": 0,
  "orderNumber": 1
}
```

---

## 25.7 Agregar costo adicional

```http
POST /api/budget-costs
Authorization: Bearer TOKEN
Content-Type: application/json
```

```json
{
  "budgetId": "uuid_presupuesto",
  "name": "Servidor VPS",
  "type": "monthly",
  "amount": 120,
  "quantity": 1,
  "description": "Servidor para despliegue del backend y base de datos"
}
```

---

## 25.8 Calcular presupuesto

```http
POST /api/budgets/uuid_presupuesto/calculate
Authorization: Bearer TOKEN
```

Respuesta:

```json
{
  "message": "Presupuesto calculado correctamente",
  "data": {
    "id": "uuid_presupuesto",
    "subtotal": 3500,
    "taxAmount": 630,
    "discountAmount": 0,
    "total": 4130
  }
}
```

---

# 26. Seed inicial

Crear `prisma/seed.js`:

```js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.plan.upsert({
    where: { name: "Free" },
    update: {},
    create: {
      name: "Free",
      price: 0,
      billingCycle: "monthly",
      maxBudgets: 5,
      maxClients: 10,
      hasAi: false,
      hasExports: false,
      hasTeam: false,
    },
  });

  await prisma.plan.upsert({
    where: { name: "Pro" },
    update: {},
    create: {
      name: "Pro",
      price: 29,
      billingCycle: "monthly",
      maxBudgets: 100,
      maxClients: 200,
      hasAi: false,
      hasExports: true,
      hasTeam: false,
    },
  });

  await prisma.plan.upsert({
    where: { name: "Business" },
    update: {},
    create: {
      name: "Business",
      price: 79,
      billingCycle: "monthly",
      maxBudgets: 1000,
      maxClients: 1000,
      hasAi: true,
      hasExports: true,
      hasTeam: true,
    },
  });

  console.log("Seed ejecutado correctamente");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Ejecutar:

```bash
npm run prisma:seed
```

---

# 27. Ejecución local sin Docker

## 27.1 Instalar dependencias

```bash
npm install
```

## 27.2 Levantar PostgreSQL local

Crear una base de datos llamada:

```txt
presusoft_db
```

## 27.3 Ejecutar migraciones

```bash
npx prisma migrate dev
```

## 27.4 Ejecutar seed

```bash
npm run prisma:seed
```

## 27.5 Levantar servidor

```bash
npm run dev
```

Servidor:

```txt
http://localhost:4000
```

Swagger:

```txt
http://localhost:4000/api/docs
```

Prisma Studio:

```txt
http://localhost:5555
```

---

# 28. Ejecución con Docker

## 28.1 Construir y levantar

```bash
docker compose up --build
```

## 28.2 Levantar en segundo plano

```bash
docker compose up -d
```

## 28.3 Ver logs

```bash
docker compose logs -f backend
```

## 28.4 Apagar contenedores

```bash
docker compose down
```

## 28.5 Apagar y eliminar volúmenes

```bash
docker compose down -v
```

## 28.6 Entrar al contenedor backend

```bash
docker exec -it presusoft_backend sh
```

## 28.7 Entrar a PostgreSQL

```bash
docker exec -it presusoft_postgres psql -U postgres -d presusoft_db
```

## 28.8 Ejecutar Prisma dentro del contenedor

```bash
docker exec -it presusoft_backend npx prisma migrate dev
```

```bash
docker exec -it presusoft_backend npx prisma studio
```

---

# 29. Seguridad

El backend debe considerar:

* Contraseñas encriptadas con bcrypt.
* Autenticación JWT.
* Protección de rutas privadas.
* Validación de roles.
* No exponer `.env`.
* No subir tokens al repositorio.
* CORS controlado en producción.
* Validación de datos de entrada.
* Manejo centralizado de errores.
* Sanitización de datos sensibles.
* Separar entornos `development`, `staging` y `production`.

---

# 30. Convenciones de código

## 30.1 Nombres de carpetas

Usar kebab-case:

```txt
budget-modules
budget-tasks
budget-costs
```

## 30.2 Nombres de archivos

Usar camelCase o nombre del módulo:

```txt
budgets.controller.js
budgets.service.js
budgets.routes.js
```

## 30.3 Rutas

Usar plural:

```txt
/users
/clients
/budgets
/templates
/notifications
```

## 30.4 Respuestas

Formato estándar:

```json
{
  "message": "Operación realizada correctamente",
  "data": {}
}
```

Formato de error:

```json
{
  "message": "Descripción del error"
}
```

---

# 31. Orden recomendado de desarrollo

## Fase 1: Configuración inicial

* Crear proyecto Node.
* Instalar Express.
* Configurar Docker.
* Configurar PostgreSQL.
* Configurar Prisma.
* Configurar Swagger.
* Configurar estructura de carpetas.

## Fase 2: Autenticación

* Registro.
* Login.
* JWT.
* Middleware de autenticación.
* Middleware de roles.

## Fase 3: Usuarios y empresas

* CRUD usuarios.
* CRUD empresas.
* Relación usuario-empresa.
* Empresa inicial automática.

## Fase 4: Clientes

* CRUD clientes.
* Asociación con usuario.
* Asociación con empresa.

## Fase 5: Presupuestos

* Crear presupuesto.
* Listar presupuestos.
* Editar presupuesto.
* Eliminar presupuesto.
* Estados de presupuesto.
* Código automático.

## Fase 6: Módulos, tareas y costos

* CRUD módulos.
* CRUD tareas.
* CRUD costos.
* Cálculo por tarea.
* Cálculo por costo.

## Fase 7: Cálculo total

* Sumar tareas.
* Sumar costos.
* Calcular impuesto.
* Calcular descuento.
* Calcular total.
* Actualizar presupuesto.

## Fase 8: Versionado

* Crear versión inicial.
* Crear versión tras cambios.
* Guardar snapshot.
* Restaurar versión.

## Fase 9: Plantillas

* Crear plantilla.
* Crear módulos de plantilla.
* Crear tareas de plantilla.
* Aplicar plantilla a presupuesto.

## Fase 10: Exportaciones

* Registrar exportación.
* Preparar exportación PDF.
* Preparar exportación Word.
* Preparar exportación Excel.

## Fase 11: Notificaciones

* Crear notificaciones.
* Marcar como leído.
* Listar notificaciones.
* Notificar eventos importantes.

## Fase 12: Tiempo real

* Configurar Socket.IO.
* Unir usuario a sala.
* Unir presupuesto a sala.
* Emitir eventos.
* Integrar eventos con presupuestos y notificaciones.

## Fase 13: Documentación

* Completar Swagger.
* Documentar endpoints.
* Documentar variables.
* Documentar Docker.
* Documentar despliegue.

---

# 32. Eventos de tiempo real recomendados

```txt
auth:login
client:created
client:updated
client:deleted

budget:created
budget:updated
budget:deleted
budget:calculated
budget:status-changed
budget:version-created

module:created
module:updated
module:deleted

task:created
task:updated
task:deleted

cost:created
cost:updated
cost:deleted

export:started
export:completed
export:failed

notification:new
notification:read
notification:read-all
```

---

# 33. Estados HTTP recomendados

```txt
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error
```

---

# 34. Ejemplo de respuesta correcta

```json
{
  "message": "Cliente creado correctamente",
  "data": {
    "id": "uuid",
    "name": "Empresa Cliente",
    "email": "cliente@email.com"
  }
}
```

---

# 35. Ejemplo de respuesta de error

```json
{
  "message": "Cliente no encontrado"
}
```

---

# 36. Despliegue recomendado en VPS

## 36.1 Infraestructura

* VPS Contabo.
* Docker instalado.
* Docker Compose instalado.
* PostgreSQL en contenedor.
* Backend en contenedor.
* Nginx como reverse proxy.
* SSL con Certbot.
* Dominio apuntando al servidor.

## 36.2 Comandos en VPS

```bash
sudo apt update
sudo apt upgrade -y
```

Instalar Docker:

```bash
sudo apt install docker.io docker-compose-plugin -y
```

Clonar proyecto:

```bash
git clone https://github.com/tu-usuario/presusoft-backend.git
cd presusoft-backend
```

Crear `.env`:

```bash
nano .env
```

Levantar:

```bash
docker compose up -d --build
```

Ver logs:

```bash
docker compose logs -f
```

---

# 37. Nginx recomendado

Archivo de configuración:

```nginx
server {
    listen 80;
    server_name api.presusoft.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

# 38. SSL con Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

```bash
sudo certbot --nginx -d api.presusoft.com
```

---

# 39. Checklist del backend

```txt
[ ] Crear proyecto Node.js
[ ] Instalar dependencias
[ ] Configurar Express
[ ] Configurar Docker
[ ] Configurar PostgreSQL
[ ] Configurar Prisma
[ ] Crear modelos Prisma
[ ] Crear migraciones
[ ] Crear seed
[ ] Configurar Swagger
[ ] Crear módulo Auth
[ ] Crear JWT
[ ] Crear middleware Auth
[ ] Crear middleware Roles
[ ] Crear módulo Users
[ ] Crear módulo Companies
[ ] Crear módulo Clients
[ ] Crear módulo Budgets
[ ] Crear módulo Budget Modules
[ ] Crear módulo Budget Tasks
[ ] Crear módulo Budget Costs
[ ] Crear cálculo de presupuesto
[ ] Crear versiones
[ ] Crear plantillas
[ ] Crear exportaciones
[ ] Crear notificaciones
[ ] Configurar Socket.IO
[ ] Emitir eventos en tiempo real
[ ] Probar endpoints en Postman
[ ] Documentar todo en Swagger
[ ] Preparar despliegue en VPS
```

---

# 40. Comandos rápidos

```bash
npm run dev
```

```bash
npm run start
```

```bash
npm run prisma:migrate
```

```bash
npm run prisma:generate
```

```bash
npm run prisma:studio
```

```bash
docker compose up --build
```

```bash
docker compose down
```

```bash
docker compose logs -f backend
```

---

# 41. Resultado esperado del MVP

Al terminar el MVP, el backend debe permitir:

* Registrar usuarios.
* Iniciar sesión.
* Proteger rutas con JWT.
* Crear empresas.
* Crear clientes.
* Crear presupuestos.
* Agregar módulos al presupuesto.
* Agregar tareas.
* Agregar costos.
* Calcular totales.
* Guardar versiones.
* Crear plantillas.
* Exportar presupuestos.
* Crear notificaciones.
* Emitir eventos en tiempo real.
* Documentar la API con Swagger.
* Ejecutar todo con Docker.

---

# 42. Autor

Proyecto: **PresuSoft**

Backend desarrollado con:

```txt
Node.js
Express.js
Prisma ORM
PostgreSQL
Docker
Swagger
Socket.IO
JWT
```

---

# 43. Nota técnica

Este backend está pensado para crecer como una plataforma SaaS.
Primero se implementa el MVP con presupuestos, clientes, usuarios y cálculos.
Luego se puede ampliar con:

* Inteligencia artificial para estimar costos.
* Integraciones con Google Drive.
* Integraciones con Excel.
* Exportaciones avanzadas.
* Aprobación pública por cliente.
* Comentarios del cliente.
* Trabajo colaborativo por equipos.
* Planes de pago.
* Panel administrativo.

````

Ahí tienes el **README.md grande y completo**. Lo puedes copiar tal cual en un archivo llamado:

```txt
README.md
````
Aquí tienes un **README.md completo y grande** para tu backend de **PresuSoft**, solo backend, dockerizado, con PostgreSQL, Prisma ORM, Swagger, API REST por HTTP y tiempo real con WebSockets/Socket.IO.

Está alineado con tu documento técnico, donde PresuSoft se define como una plataforma SaaS para automatizar presupuestos y cotizaciones tecnológicas usando Node.js, Express, Prisma, PostgreSQL, Docker y despliegue en VPS.  También toma como base el modelo de datos propuesto con usuarios, empresas, clientes, presupuestos, módulos, tareas, costos, plantillas, versiones, exportaciones, notificaciones, planes y suscripciones. 

````md
# PresuSoft Backend

Backend oficial del sistema **PresuSoft**, una plataforma SaaS orientada a la automatización de presupuestos, cotizaciones y propuestas económicas para proyectos tecnológicos.

Este proyecto contiene únicamente el **backend**.  
No incluye frontend.

---

# 1. Descripción general

**PresuSoft** es un sistema diseñado para reemplazar la creación manual de presupuestos en Excel o Word, permitiendo que freelancers, empresas de software y equipos tecnológicos puedan crear, gestionar, calcular, versionar, exportar y compartir presupuestos de manera profesional.

El backend se encargará de:

- Gestionar usuarios.
- Gestionar empresas.
- Gestionar clientes.
- Crear presupuestos.
- Agregar módulos al presupuesto.
- Agregar tareas y costos.
- Calcular subtotales, impuestos, descuentos y totales.
- Guardar versiones del presupuesto.
- Exportar presupuestos.
- Emitir notificaciones.
- Exponer una API REST documentada con Swagger.
- Manejar eventos en tiempo real mediante WebSockets.
- Persistir datos en PostgreSQL usando Prisma ORM.
- Ejecutarse de manera dockerizada.

---

# 2. Stack tecnológico

## Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Socket.IO
- Swagger / OpenAPI
- JWT
- bcrypt
- dotenv
- CORS
- Morgan
- Docker
- Docker Compose

## Base de datos

- PostgreSQL

## ORM

- Prisma

## Documentación API

- Swagger UI
- OpenAPI 3.0

## Tiempo real

- Socket.IO sobre WebSockets

## Contenedores

- Docker
- Docker Compose

---

# 3. Arquitectura del backend

El backend usa una arquitectura modular basada en dominios. Cada módulo tendrá sus propias rutas, controladores, servicios y validaciones.

```txt
presusoft-backend/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
│
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   ├── env.js
│   │   ├── prisma.js
│   │   ├── swagger.js
│   │   └── cors.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.validation.js
│   │   │
│   │   ├── users/
│   │   │   ├── users.routes.js
│   │   │   ├── users.controller.js
│   │   │   ├── users.service.js
│   │   │   └── users.validation.js
│   │   │
│   │   ├── companies/
│   │   │   ├── companies.routes.js
│   │   │   ├── companies.controller.js
│   │   │   ├── companies.service.js
│   │   │   └── companies.validation.js
│   │   │
│   │   ├── clients/
│   │   │   ├── clients.routes.js
│   │   │   ├── clients.controller.js
│   │   │   ├── clients.service.js
│   │   │   └── clients.validation.js
│   │   │
│   │   ├── budgets/
│   │   │   ├── budgets.routes.js
│   │   │   ├── budgets.controller.js
│   │   │   ├── budgets.service.js
│   │   │   └── budgets.validation.js
│   │   │
│   │   ├── budget-modules/
│   │   │   ├── budgetModules.routes.js
│   │   │   ├── budgetModules.controller.js
│   │   │   └── budgetModules.service.js
│   │   │
│   │   ├── budget-tasks/
│   │   │   ├── budgetTasks.routes.js
│   │   │   ├── budgetTasks.controller.js
│   │   │   └── budgetTasks.service.js
│   │   │
│   │   ├── budget-costs/
│   │   │   ├── budgetCosts.routes.js
│   │   │   ├── budgetCosts.controller.js
│   │   │   └── budgetCosts.service.js
│   │   │
│   │   ├── templates/
│   │   │   ├── templates.routes.js
│   │   │   ├── templates.controller.js
│   │   │   └── templates.service.js
│   │   │
│   │   ├── versions/
│   │   │   ├── versions.routes.js
│   │   │   ├── versions.controller.js
│   │   │   └── versions.service.js
│   │   │
│   │   ├── exports/
│   │   │   ├── exports.routes.js
│   │   │   ├── exports.controller.js
│   │   │   └── exports.service.js
│   │   │
│   │   ├── notifications/
│   │   │   ├── notifications.routes.js
│   │   │   ├── notifications.controller.js
│   │   │   └── notifications.service.js
│   │   │
│   │   ├── plans/
│   │   │   ├── plans.routes.js
│   │   │   ├── plans.controller.js
│   │   │   └── plans.service.js
│   │   │
│   │   └── subscriptions/
│   │       ├── subscriptions.routes.js
│   │       ├── subscriptions.controller.js
│   │       └── subscriptions.service.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── error.middleware.js
│   │   ├── notFound.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── sockets/
│   │   ├── socket.js
│   │   └── socketEvents.js
│   │
│   ├── utils/
│   │   ├── calculateBudget.js
│   │   ├── generateBudgetCode.js
│   │   ├── generateToken.js
│   │   ├── hashPassword.js
│   │   ├── comparePassword.js
│   │   └── apiResponse.js
│   │
│   └── constants/
│       ├── roles.js
│       ├── budgetStatus.js
│       └── socketEvents.js
│
├── docker-compose.yml
├── Dockerfile
├── .dockerignore
├── .env
├── .env.example
├── package.json
├── README.md
└── nodemon.json
````

---

# 4. Módulos del sistema

## 4.1 Auth

Módulo encargado de la autenticación.

Funciones:

* Registro de usuario.
* Inicio de sesión.
* Encriptación de contraseña.
* Generación de token JWT.
* Validación de sesión.
* Obtención del perfil autenticado.

Endpoints principales:

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

---

## 4.2 Users

Módulo encargado de la gestión de usuarios.

Funciones:

* Listar usuarios.
* Obtener usuario por ID.
* Actualizar usuario.
* Cambiar estado del usuario.
* Eliminar usuario.
* Gestionar roles.

Roles principales:

```txt
admin
editor
viewer
```

---

## 4.3 Companies

Módulo encargado de las empresas.

Funciones:

* Crear empresa.
* Editar empresa.
* Asociar empresa a usuario.
* Configurar moneda.
* Configurar impuesto por defecto.
* Guardar logo de empresa.

---

## 4.4 Clients

Módulo encargado de los clientes.

Funciones:

* Crear cliente.
* Listar clientes.
* Buscar cliente.
* Editar cliente.
* Eliminar cliente.
* Asociar cliente a una empresa.
* Asociar cliente a presupuestos.

---

## 4.5 Budgets

Módulo principal del sistema.

Funciones:

* Crear presupuesto.
* Editar presupuesto.
* Cambiar estado del presupuesto.
* Calcular presupuesto.
* Duplicar presupuesto.
* Eliminar presupuesto.
* Listar presupuestos por usuario.
* Listar presupuestos por cliente.
* Guardar historial de versiones.

Estados:

```txt
draft
sent
accepted
rejected
expired
```

---

## 4.6 Budget Modules

Módulo encargado de las secciones internas de un presupuesto.

Ejemplos:

* Diseño UI/UX.
* Backend.
* Frontend.
* Base de datos.
* Testing.
* Despliegue.
* Mantenimiento.

---

## 4.7 Budget Tasks

Módulo encargado de las tareas dentro de cada módulo.

Una tarea puede tener:

* Nombre.
* Descripción.
* Horas estimadas.
* Tarifa por hora.
* Cantidad.
* Precio unitario.
* Total.

---

## 4.8 Budget Costs

Módulo encargado de costos adicionales.

Ejemplos:

* Hosting.
* Dominio.
* Licencias.
* APIs.
* Certificados.
* Servidores.
* Servicios externos.

Tipos de costo:

```txt
monthly
annual
one_time
```

---

## 4.9 Templates

Módulo encargado de plantillas reutilizables.

Funciones:

* Crear plantilla.
* Editar plantilla.
* Eliminar plantilla.
* Crear módulos predefinidos.
* Crear tareas predefinidas.
* Aplicar plantilla a un presupuesto.

---

## 4.10 Budget Versions

Módulo encargado del versionado.

Funciones:

* Crear versión del presupuesto.
* Guardar snapshot completo.
* Restaurar versión anterior.
* Consultar historial.
* Comparar cambios en versiones futuras.

---

## 4.11 Exports

Módulo encargado de exportaciones.

Formatos futuros:

```txt
pdf
word
excel
```

Funciones:

* Exportar presupuesto.
* Guardar archivo generado.
* Registrar fecha.
* Registrar usuario que exportó.
* Notificar exportación completada.

---

## 4.12 Notifications

Módulo encargado de notificaciones.

Eventos típicos:

* Presupuesto creado.
* Presupuesto actualizado.
* Presupuesto aceptado.
* Presupuesto rechazado.
* Presupuesto vencido.
* Exportación completada.
* Cliente registrado.
* Nueva versión creada.

---

## 4.13 Plans

Módulo encargado de planes SaaS.

Planes sugeridos:

```txt
Free
Pro
Business
```

---

## 4.14 Subscriptions

Módulo encargado de suscripciones.

Funciones:

* Crear suscripción.
* Asignar plan.
* Cambiar estado.
* Validar límites por plan.
* Controlar fecha de inicio y fin.

---

# 5. Flujo general del sistema

```txt
1. Usuario se registra.
2. Se crea una empresa inicial.
3. Se asigna un plan gratuito.
4. Usuario inicia sesión.
5. Usuario registra clientes.
6. Usuario crea un presupuesto.
7. Usuario agrega módulos al presupuesto.
8. Usuario agrega tareas a cada módulo.
9. Usuario agrega costos adicionales.
10. Sistema calcula subtotal, impuesto, descuento y total.
11. Sistema guarda versión inicial.
12. Usuario cambia estado del presupuesto.
13. Sistema genera notificación.
14. Usuario exporta presupuesto.
15. Sistema registra exportación.
16. Sistema emite evento en tiempo real.
```

---

# 6. Modelo de base de datos

## 6.1 Tablas del MVP

```txt
users
companies
clients
budgets
budget_modules
budget_tasks
budget_costs
templates
template_modules
template_tasks
budget_versions
budget_exports
plans
subscriptions
notifications
```

## 6.2 Tablas futuras

```txt
comments
attachments
budget_shares
reports
integrations
team_members
ai_estimations
```

---

# 7. Relaciones principales

```txt
users
├── companies
├── clients
├── budgets
├── templates
├── reports
├── integrations
├── notifications
└── subscriptions

companies
├── clients
└── team_members

clients
└── budgets

budgets
├── budget_modules
├── budget_tasks
├── budget_costs
├── budget_versions
├── budget_exports
├── budget_shares
├── comments
├── attachments
└── ai_estimations

templates
├── template_modules
└── template_tasks

plans
└── subscriptions
```

---

# 8. Reglas de negocio

## 8.1 Registro de usuario

Cuando un usuario se registra:

* Se crea un usuario.
* Se encripta su contraseña.
* Se crea una empresa inicial.
* Se asigna un plan Free.
* Se genera token JWT.
* Se devuelve la sesión.

---

## 8.2 Creación de cliente

Cuando se crea un cliente:

* Debe pertenecer a un usuario.
* Puede estar asociado a una empresa.
* Puede tener DNI, RUC o documento fiscal.
* Puede tener observaciones internas.

---

## 8.3 Creación de presupuesto

Cuando se crea un presupuesto:

* Debe pertenecer a un usuario.
* Debe poder asociarse a un cliente.
* Puede usar una plantilla.
* Debe tener estado inicial `draft`.
* Debe generar un código único.
* Debe calcular totales.
* Debe crear una versión inicial.

---

## 8.4 Cálculo de presupuesto

La fórmula principal será:

```txt
subtotal_tareas = suma de todos los totales de tareas

subtotal_costos = suma de todos los costos adicionales

subtotal = subtotal_tareas + subtotal_costos

tax_amount = subtotal * tax_percentage / 100

discount_amount = subtotal * discount_percentage / 100

total = subtotal + tax_amount - discount_amount
```

---

## 8.5 Cambio de estado

Estados válidos:

```txt
draft
sent
accepted
rejected
expired
```

Reglas:

* Un presupuesto inicia como `draft`.
* Puede pasar de `draft` a `sent`.
* Puede pasar de `sent` a `accepted`.
* Puede pasar de `sent` a `rejected`.
* Puede pasar de `sent` a `expired`.
* Un presupuesto aceptado no debería editarse sin crear una nueva versión.

---

## 8.6 Versionado

Cada vez que ocurre un cambio importante:

* Se guarda un snapshot.
* Se registra número de versión.
* Se registra usuario que hizo el cambio.
* Se registra fecha.

Ejemplo:

```json
{
  "budget": {},
  "modules": [],
  "tasks": [],
  "costs": [],
  "totals": {}
}
```

---

# 9. Instalación del proyecto

## 9.1 Requisitos previos

Instalar:

* Node.js 20 o superior.
* Docker.
* Docker Compose.
* Git.
* VS Code.
* Postman o Insomnia.

Verificar instalaciones:

```bash
node -v
npm -v
docker -v
docker compose version
git --version
```

---

# 10. Crear proyecto desde cero

## 10.1 Crear carpeta

```bash
mkdir presusoft-backend
cd presusoft-backend
```

## 10.2 Inicializar Node

```bash
npm init -y
```

## 10.3 Instalar dependencias

```bash
npm install express cors dotenv morgan bcrypt jsonwebtoken socket.io swagger-ui-express swagger-jsdoc @prisma/client
```

## 10.4 Instalar dependencias de desarrollo

```bash
npm install -D nodemon prisma
```

## 10.5 Inicializar Prisma

```bash
npx prisma init
```

---

# 11. Configuración de package.json

Editar `package.json`:

```json
{
  "name": "presusoft-backend",
  "version": "1.0.0",
  "description": "Backend API REST para PresuSoft",
  "main": "src/server.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio",
    "prisma:seed": "node prisma/seed.js"
  },
  "keywords": [
    "presusoft",
    "backend",
    "node",
    "express",
    "prisma",
    "postgresql",
    "docker",
    "swagger",
    "socket.io"
  ],
  "author": "PresuSoft",
  "license": "ISC",
  "dependencies": {
    "@prisma/client": "latest",
    "bcrypt": "latest",
    "cors": "latest",
    "dotenv": "latest",
    "express": "latest",
    "jsonwebtoken": "latest",
    "morgan": "latest",
    "socket.io": "latest",
    "swagger-jsdoc": "latest",
    "swagger-ui-express": "latest"
  },
  "devDependencies": {
    "nodemon": "latest",
    "prisma": "latest"
  }
}
```

---

# 12. Variables de entorno

Crear archivo `.env`:

```env
PORT=4000

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/presusoft_db?schema=public"

JWT_SECRET="presusoft_super_secret_key"
JWT_EXPIRES_IN="1d"

NODE_ENV="development"

CORS_ORIGIN="*"
```

Crear archivo `.env.example`:

```env
PORT=4000

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/presusoft_db?schema=public"

JWT_SECRET="change_this_secret"
JWT_EXPIRES_IN="1d"

NODE_ENV="development"

CORS_ORIGIN="*"
```

---

# 13. Docker

## 13.1 Dockerfile

Crear `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "start"]
```

---

## 13.2 docker-compose.yml

Crear `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16
    container_name: presusoft_postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: presusoft_db
    ports:
      - "5432:5432"
    volumes:
      - presusoft_pgdata:/var/lib/postgresql/data
    networks:
      - presusoft_network

  backend:
    build: .
    container_name: presusoft_backend
    restart: always
    ports:
      - "4000:4000"
    environment:
      PORT: 4000
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/presusoft_db?schema=public
      JWT_SECRET: presusoft_super_secret_key
      JWT_EXPIRES_IN: 1d
      NODE_ENV: development
      CORS_ORIGIN: "*"
    depends_on:
      - postgres
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - presusoft_network
    command: sh -c "npx prisma migrate deploy && npm run dev"

volumes:
  presusoft_pgdata:

networks:
  presusoft_network:
    driver: bridge
```

---

## 13.3 .dockerignore

Crear `.dockerignore`:

```txt
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
prisma/migrations
```

---

# 14. Prisma schema

Crear o reemplazar `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  admin
  editor
  viewer
}

enum UserStatus {
  active
  inactive
}

enum BudgetStatus {
  draft
  sent
  accepted
  rejected
  expired
}

enum CostType {
  monthly
  annual
  one_time
}

enum ExportFormat {
  pdf
  word
  excel
}

enum BillingCycle {
  monthly
  annual
}

enum SubscriptionStatus {
  active
  inactive
  canceled
  expired
}

enum NotificationType {
  budget_created
  budget_updated
  budget_accepted
  budget_rejected
  budget_expired
  export_completed
  client_created
  version_created
  system
}

model User {
  id        String     @id @default(uuid())
  name      String
  email     String     @unique
  password  String
  phone     String?
  role      UserRole   @default(editor)
  status    UserStatus @default(active)
  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @updatedAt @map("updated_at")

  companies     Company[]
  clients       Client[]
  budgets       Budget[]
  templates     Template[]
  versions      BudgetVersion[] @relation("BudgetVersionCreatedBy")
  exports       BudgetExport[]  @relation("BudgetExportedBy")
  notifications Notification[]
  subscriptions Subscription[]

  @@map("users")
}

model Company {
  id            String   @id @default(uuid())
  userId        String   @map("user_id")
  name          String
  ruc           String?
  address       String?
  phone         String?
  email         String?
  logoUrl       String?  @map("logo_url")
  currency      String   @default("PEN")
  taxPercentage Decimal  @default(18.00) @map("tax_percentage")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  clients Client[]

  @@map("companies")
}

model Client {
  id             String   @id @default(uuid())
  userId         String   @map("user_id")
  companyId      String?  @map("company_id")
  name           String
  businessName   String?  @map("business_name")
  email          String?
  phone          String?
  address        String?
  documentNumber String?  @map("document_number")
  notes          String?
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  company Company? @relation(fields: [companyId], references: [id], onDelete: SetNull)
  budgets Budget[]

  @@map("clients")
}

model Budget {
  id                 String       @id @default(uuid())
  userId             String       @map("user_id")
  clientId           String?      @map("client_id")
  templateId         String?      @map("template_id")
  code               String       @unique
  title              String
  description        String?
  status             BudgetStatus @default(draft)
  currency           String       @default("PEN")
  subtotal           Decimal      @default(0)
  taxPercentage      Decimal      @default(18.00) @map("tax_percentage")
  taxAmount          Decimal      @default(0) @map("tax_amount")
  discountPercentage Decimal      @default(0) @map("discount_percentage")
  discountAmount     Decimal      @default(0) @map("discount_amount")
  total              Decimal      @default(0)
  validityDays       Int          @default(15) @map("validity_days")
  paymentTerms       String?      @map("payment_terms")
  notes              String?
  clientNotes        String?      @map("client_notes")
  createdAt          DateTime     @default(now()) @map("created_at")
  updatedAt          DateTime     @updatedAt @map("updated_at")

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  client    Client?   @relation(fields: [clientId], references: [id], onDelete: SetNull)
  template  Template? @relation(fields: [templateId], references: [id], onDelete: SetNull)

  modules       BudgetModule[]
  tasks         BudgetTask[]
  costs         BudgetCost[]
  versions      BudgetVersion[]
  exports       BudgetExport[]
  notifications Notification[]

  @@map("budgets")
}

model BudgetModule {
  id          String   @id @default(uuid())
  budgetId    String   @map("budget_id")
  name        String
  description String?
  orderNumber Int      @default(1) @map("order_number")
  subtotal    Decimal  @default(0)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  budget Budget       @relation(fields: [budgetId], references: [id], onDelete: Cascade)
  tasks  BudgetTask[]

  @@map("budget_modules")
}

model BudgetTask {
  id          String   @id @default(uuid())
  budgetId    String   @map("budget_id")
  moduleId    String   @map("module_id")
  name        String
  description String?
  hours       Decimal  @default(0)
  hourlyRate  Decimal  @default(0) @map("hourly_rate")
  quantity    Decimal  @default(1)
  unitPrice   Decimal  @default(0) @map("unit_price")
  total       Decimal  @default(0)
  orderNumber Int      @default(1) @map("order_number")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  budget Budget       @relation(fields: [budgetId], references: [id], onDelete: Cascade)
  module BudgetModule @relation(fields: [moduleId], references: [id], onDelete: Cascade)

  @@map("budget_tasks")
}

model BudgetCost {
  id          String   @id @default(uuid())
  budgetId    String   @map("budget_id")
  name        String
  type        CostType
  amount      Decimal  @default(0)
  quantity    Int      @default(1)
  total       Decimal  @default(0)
  description String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  budget Budget @relation(fields: [budgetId], references: [id], onDelete: Cascade)

  @@map("budget_costs")
}

model Template {
  id          String   @id @default(uuid())
  userId      String?  @map("user_id")
  name        String
  category    String?
  description String?
  isDefault   Boolean  @default(false) @map("is_default")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user    User?            @relation(fields: [userId], references: [id], onDelete: Cascade)
  modules TemplateModule[]
  budgets Budget[]

  @@map("templates")
}

model TemplateModule {
  id          String   @id @default(uuid())
  templateId  String   @map("template_id")
  name        String
  description String?
  orderNumber Int      @default(1) @map("order_number")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  template Template       @relation(fields: [templateId], references: [id], onDelete: Cascade)
  tasks    TemplateTask[]

  @@map("template_modules")
}

model TemplateTask {
  id               String   @id @default(uuid())
  templateModuleId String   @map("template_module_id")
  name             String
  description      String?
  estimatedHours   Decimal  @default(0) @map("estimated_hours")
  defaultRate      Decimal  @default(0) @map("default_rate")
  orderNumber      Int      @default(1) @map("order_number")
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  templateModule TemplateModule @relation(fields: [templateModuleId], references: [id], onDelete: Cascade)

  @@map("template_tasks")
}

model BudgetVersion {
  id            String   @id @default(uuid())
  budgetId      String   @map("budget_id")
  versionNumber Int      @map("version_number")
  snapshotData  Json     @map("snapshot_data")
  createdById   String   @map("created_by")
  createdAt     DateTime @default(now()) @map("created_at")

  budget    Budget @relation(fields: [budgetId], references: [id], onDelete: Cascade)
  createdBy User   @relation("BudgetVersionCreatedBy", fields: [createdById], references: [id], onDelete: Cascade)

  @@map("budget_versions")
}

model BudgetExport {
  id           String       @id @default(uuid())
  budgetId     String       @map("budget_id")
  format       ExportFormat
  fileUrl      String?      @map("file_url")
  exportedById String       @map("exported_by")
  exportedAt   DateTime     @default(now()) @map("exported_at")

  budget     Budget @relation(fields: [budgetId], references: [id], onDelete: Cascade)
  exportedBy User   @relation("BudgetExportedBy", fields: [exportedById], references: [id], onDelete: Cascade)

  @@map("budget_exports")
}

model Plan {
  id           String       @id @default(uuid())
  name         String       @unique
  price        Decimal      @default(0)
  billingCycle BillingCycle @default(monthly) @map("billing_cycle")
  maxBudgets   Int          @default(5) @map("max_budgets")
  maxClients   Int          @default(10) @map("max_clients")
  hasAi        Boolean      @default(false) @map("has_ai")
  hasExports   Boolean      @default(false) @map("has_exports")
  hasTeam      Boolean      @default(false) @map("has_team")
  createdAt    DateTime     @default(now()) @map("created_at")
  updatedAt    DateTime     @updatedAt @map("updated_at")

  subscriptions Subscription[]

  @@map("plans")
}

model Subscription {
  id              String             @id @default(uuid())
  userId          String             @map("user_id")
  planId          String             @map("plan_id")
  status          SubscriptionStatus @default(active)
  startDate       DateTime           @default(now()) @map("start_date")
  endDate         DateTime?          @map("end_date")
  paymentProvider String?            @map("payment_provider")
  createdAt       DateTime           @default(now()) @map("created_at")
  updatedAt       DateTime           @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  plan Plan @relation(fields: [planId], references: [id], onDelete: Restrict)

  @@map("subscriptions")
}

model Notification {
  id        String           @id @default(uuid())
  userId    String           @map("user_id")
  budgetId  String?          @map("budget_id")
  title     String
  message   String
  type      NotificationType @default(system)
  isRead    Boolean          @default(false) @map("is_read")
  createdAt DateTime         @default(now()) @map("created_at")

  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  budget Budget? @relation(fields: [budgetId], references: [id], onDelete: Cascade)

  @@map("notifications")
}
```

---

# 15. Migraciones Prisma

Crear migración inicial:

```bash
npx prisma migrate dev --name init
```

Generar cliente Prisma:

```bash
npx prisma generate
```

Abrir Prisma Studio:

```bash
npx prisma studio
```

Aplicar migraciones en Docker o producción:

```bash
npx prisma migrate deploy
```

---

# 16. Configuración base del backend

## 16.1 src/config/prisma.js

```js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

---

## 16.2 src/config/env.js

```js
import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "*",
};
```

---

## 16.3 src/config/swagger.js

```js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PresuSoft API",
      version: "1.0.0",
      description: "Documentación oficial de la API REST de PresuSoft Backend",
    },
    servers: [
      {
        url: "http://localhost:4000/api",
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/modules/**/*.routes.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
```

---

# 17. Express app

## 17.1 src/app.js

```js
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { env } from "./config/env.js";
import { swaggerUi, swaggerSpec } from "./config/swagger.js";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import companyRoutes from "./modules/companies/companies.routes.js";
import clientRoutes from "./modules/clients/clients.routes.js";
import budgetRoutes from "./modules/budgets/budgets.routes.js";
import budgetModuleRoutes from "./modules/budget-modules/budgetModules.routes.js";
import budgetTaskRoutes from "./modules/budget-tasks/budgetTasks.routes.js";
import budgetCostRoutes from "./modules/budget-costs/budgetCosts.routes.js";
import templateRoutes from "./modules/templates/templates.routes.js";
import versionRoutes from "./modules/versions/versions.routes.js";
import exportRoutes from "./modules/exports/exports.routes.js";
import notificationRoutes from "./modules/notifications/notifications.routes.js";
import planRoutes from "./modules/plans/plans.routes.js";
import subscriptionRoutes from "./modules/subscriptions/subscriptions.routes.js";

import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.json({
    message: "PresuSoft Backend API",
    status: "running",
    docs: "/api/docs",
  });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/budget-modules", budgetModuleRoutes);
app.use("/api/budget-tasks", budgetTaskRoutes);
app.use("/api/budget-costs", budgetCostRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/versions", versionRoutes);
app.use("/api/exports", exportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
```

---

## 17.2 src/server.js

```js
import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { initSocket } from "./sockets/socket.js";

const server = http.createServer(app);

initSocket(server);

server.listen(env.port, () => {
  console.log(`Servidor PresuSoft ejecutándose en http://localhost:${env.port}`);
  console.log(`Swagger disponible en http://localhost:${env.port}/api/docs`);
});
```

---

# 18. WebSockets con Socket.IO

## 18.1 src/sockets/socket.js

```js
import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    socket.on("join:user", (userId) => {
      socket.join(`user:${userId}`);
      console.log(`Usuario unido a sala user:${userId}`);
    });

    socket.on("join:budget", (budgetId) => {
      socket.join(`budget:${budgetId}`);
      console.log(`Cliente unido a sala budget:${budgetId}`);
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io no ha sido inicializado");
  }

  return io;
};
```

---

## 18.2 Eventos en tiempo real

Eventos principales:

```txt
budget:created
budget:updated
budget:deleted
budget:status-changed
budget:calculated
budget:version-created
notification:new
export:completed
client:created
client:updated
```

---

## 18.3 Ejemplo de emitir evento

```js
import { getIO } from "../../sockets/socket.js";

export const emitNotification = (userId, notification) => {
  const io = getIO();

  io.to(`user:${userId}`).emit("notification:new", notification);
};
```

---

# 19. Middlewares

## 19.1 auth.middleware.js

```js
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import prisma from "../config/prisma.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token no proporcionado",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token inválido",
      });
    }

    const decoded = jwt.verify(token, env.jwtSecret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({
        message: "Usuario no encontrado",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message: "Usuario inactivo",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "No autorizado",
    });
  }
};
```

---

## 19.2 role.middleware.js

```js
export const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "No autenticado",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "No tienes permisos para realizar esta acción",
      });
    }

    next();
  };
};
```

---

## 19.3 error.middleware.js

```js
export const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    message: err.message || "Error interno del servidor",
  });
};
```

---

## 19.4 notFound.middleware.js

```js
export const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada",
    path: req.originalUrl,
  });
};
```

---

# 20. Utilidades

## 20.1 calculateBudget.js

```js
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
```

---

## 20.2 generateBudgetCode.js

```js
export const generateBudgetCode = (count) => {
  const nextNumber = count + 1;
  return `PRES-${String(nextNumber).padStart(4, "0")}`;
};
```

---

## 20.3 generateToken.js

```js
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );
};
```

---

# 21. Auth module

## 21.1 auth.routes.js

```js
import { Router } from "express";
import { register, login, profile } from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags:
 *       - Auth
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags:
 *       - Auth
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Obtener perfil autenticado
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 */
router.get("/profile", authMiddleware, profile);

export default router;
```

---

## 21.2 auth.controller.js

```js
import * as authService from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    res.json({
      message: "Inicio de sesión correcto",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const profile = async (req, res) => {
  res.json({
    message: "Perfil obtenido correctamente",
    data: req.user,
  });
};
```

---

## 21.3 auth.service.js

```js
import bcrypt from "bcrypt";
import prisma from "../../config/prisma.js";
import { generateToken } from "../../utils/generateToken.js";

export const register = async ({ name, email, password, phone }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error("El correo ya está registrado");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const freePlan = await prisma.plan.findFirst({
    where: { name: "Free" },
  });

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
      },
    });

    await tx.company.create({
      data: {
        userId: user.id,
        name: `Empresa de ${name}`,
        currency: "PEN",
        taxPercentage: 18,
      },
    });

    if (freePlan) {
      await tx.subscription.create({
        data: {
          userId: user.id,
          planId: freePlan.id,
          status: "active",
        },
      });
    }

    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  });

  return result;
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error("Credenciales inválidas");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Credenciales inválidas");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};
```

---

# 22. Budgets module

## 22.1 budgets.routes.js

```js
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  calculateBudget,
  changeBudgetStatus,
  duplicateBudget,
} from "./budgets.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createBudget);
router.get("/", getBudgets);
router.get("/:id", getBudgetById);
router.patch("/:id", updateBudget);
router.delete("/:id", deleteBudget);
router.post("/:id/calculate", calculateBudget);
router.patch("/:id/status", changeBudgetStatus);
router.post("/:id/duplicate", duplicateBudget);

export default router;
```

---

## 22.2 budgets.controller.js

```js
import * as budgetService from "./budgets.service.js";

export const createBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.createBudget(req.user.id, req.body);

    res.status(201).json({
      message: "Presupuesto creado correctamente",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const getBudgets = async (req, res, next) => {
  try {
    const budgets = await budgetService.getBudgets(req.user.id);

    res.json({
      message: "Presupuestos obtenidos correctamente",
      data: budgets,
    });
  } catch (error) {
    next(error);
  }
};

export const getBudgetById = async (req, res, next) => {
  try {
    const budget = await budgetService.getBudgetById(req.user.id, req.params.id);

    res.json({
      message: "Presupuesto obtenido correctamente",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.updateBudget(req.user.id, req.params.id, req.body);

    res.json({
      message: "Presupuesto actualizado correctamente",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    await budgetService.deleteBudget(req.user.id, req.params.id);

    res.json({
      message: "Presupuesto eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const calculateBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.calculateBudget(req.user.id, req.params.id);

    res.json({
      message: "Presupuesto calculado correctamente",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const changeBudgetStatus = async (req, res, next) => {
  try {
    const budget = await budgetService.changeBudgetStatus(
      req.user.id,
      req.params.id,
      req.body.status
    );

    res.json({
      message: "Estado actualizado correctamente",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const duplicateBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.duplicateBudget(req.user.id, req.params.id);

    res.status(201).json({
      message: "Presupuesto duplicado correctamente",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};
```

---

## 22.3 budgets.service.js

```js
import prisma from "../../config/prisma.js";
import { calculateBudgetTotals } from "../../utils/calculateBudget.js";
import { generateBudgetCode } from "../../utils/generateBudgetCode.js";
import { getIO } from "../../sockets/socket.js";

export const createBudget = async (userId, data) => {
  const count = await prisma.budget.count({
    where: { userId },
  });

  const code = generateBudgetCode(count);

  const budget = await prisma.budget.create({
    data: {
      userId,
      clientId: data.clientId || null,
      templateId: data.templateId || null,
      code,
      title: data.title,
      description: data.description,
      currency: data.currency || "PEN",
      taxPercentage: data.taxPercentage || 18,
      discountPercentage: data.discountPercentage || 0,
      validityDays: data.validityDays || 15,
      paymentTerms: data.paymentTerms,
      notes: data.notes,
      clientNotes: data.clientNotes,
    },
    include: {
      client: true,
      modules: true,
      tasks: true,
      costs: true,
    },
  });

  await prisma.budgetVersion.create({
    data: {
      budgetId: budget.id,
      versionNumber: 1,
      createdById: userId,
      snapshotData: budget,
    },
  });

  await prisma.notification.create({
    data: {
      userId,
      budgetId: budget.id,
      title: "Presupuesto creado",
      message: `Se creó el presupuesto ${budget.code}`,
      type: "budget_created",
    },
  });

  const io = getIO();
  io.to(`user:${userId}`).emit("budget:created", budget);

  return budget;
};

export const getBudgets = async (userId) => {
  return prisma.budget.findMany({
    where: { userId },
    include: {
      client: true,
      modules: true,
      tasks: true,
      costs: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getBudgetById = async (userId, id) => {
  const budget = await prisma.budget.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      client: true,
      modules: {
        include: {
          tasks: true,
        },
      },
      tasks: true,
      costs: true,
      versions: true,
      exports: true,
    },
  });

  if (!budget) {
    const error = new Error("Presupuesto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return budget;
};

export const updateBudget = async (userId, id, data) => {
  await getBudgetById(userId, id);

  const budget = await prisma.budget.update({
    where: { id },
    data,
    include: {
      client: true,
      modules: true,
      tasks: true,
      costs: true,
    },
  });

  await createBudgetVersion(userId, id);

  const io = getIO();
  io.to(`user:${userId}`).emit("budget:updated", budget);
  io.to(`budget:${id}`).emit("budget:updated", budget);

  return budget;
};

export const deleteBudget = async (userId, id) => {
  await getBudgetById(userId, id);

  await prisma.budget.delete({
    where: { id },
  });

  const io = getIO();
  io.to(`user:${userId}`).emit("budget:deleted", { id });

  return true;
};

export const calculateBudget = async (userId, id) => {
  const budget = await getBudgetById(userId, id);

  const totals = calculateBudgetTotals({
    tasks: budget.tasks,
    costs: budget.costs,
    taxPercentage: budget.taxPercentage,
    discountPercentage: budget.discountPercentage,
  });

  const updatedBudget = await prisma.budget.update({
    where: { id },
    data: {
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      discountAmount: totals.discountAmount,
      total: totals.total,
    },
    include: {
      client: true,
      modules: true,
      tasks: true,
      costs: true,
    },
  });

  await createBudgetVersion(userId, id);

  const io = getIO();
  io.to(`user:${userId}`).emit("budget:calculated", updatedBudget);
  io.to(`budget:${id}`).emit("budget:calculated", updatedBudget);

  return updatedBudget;
};

export const changeBudgetStatus = async (userId, id, status) => {
  await getBudgetById(userId, id);

  const validStatuses = ["draft", "sent", "accepted", "rejected", "expired"];

  if (!validStatuses.includes(status)) {
    const error = new Error("Estado de presupuesto inválido");
    error.statusCode = 400;
    throw error;
  }

  const budget = await prisma.budget.update({
    where: { id },
    data: { status },
  });

  await prisma.notification.create({
    data: {
      userId,
      budgetId: id,
      title: "Estado de presupuesto actualizado",
      message: `El presupuesto ${budget.code} cambió a ${status}`,
      type: "budget_updated",
    },
  });

  const io = getIO();
  io.to(`user:${userId}`).emit("budget:status-changed", budget);
  io.to(`budget:${id}`).emit("budget:status-changed", budget);

  return budget;
};

export const duplicateBudget = async (userId, id) => {
  const original = await getBudgetById(userId, id);

  const count = await prisma.budget.count({
    where: { userId },
  });

  const code = generateBudgetCode(count);

  const duplicated = await prisma.budget.create({
    data: {
      userId,
      clientId: original.clientId,
      templateId: original.templateId,
      code,
      title: `${original.title} - Copia`,
      description: original.description,
      currency: original.currency,
      taxPercentage: original.taxPercentage,
      discountPercentage: original.discountPercentage,
      validityDays: original.validityDays,
      paymentTerms: original.paymentTerms,
      notes: original.notes,
      clientNotes: original.clientNotes,
      modules: {
        create: original.modules.map((module) => ({
          name: module.name,
          description: module.description,
          orderNumber: module.orderNumber,
          subtotal: module.subtotal,
          tasks: {
            create: module.tasks.map((task) => ({
              userId,
              budgetId: undefined,
              name: task.name,
              description: task.description,
              hours: task.hours,
              hourlyRate: task.hourlyRate,
              quantity: task.quantity,
              unitPrice: task.unitPrice,
              total: task.total,
              orderNumber: task.orderNumber,
            })),
          },
        })),
      },
      costs: {
        create: original.costs.map((cost) => ({
          name: cost.name,
          type: cost.type,
          amount: cost.amount,
          quantity: cost.quantity,
          total: cost.total,
          description: cost.description,
        })),
      },
    },
    include: {
      modules: {
        include: {
          tasks: true,
        },
      },
      costs: true,
    },
  });

  return duplicated;
};

const createBudgetVersion = async (userId, budgetId) => {
  const budget = await prisma.budget.findUnique({
    where: { id: budgetId },
    include: {
      client: true,
      modules: {
        include: {
          tasks: true,
        },
      },
      costs: true,
    },
  });

  const versionCount = await prisma.budgetVersion.count({
    where: { budgetId },
  });

  return prisma.budgetVersion.create({
    data: {
      budgetId,
      versionNumber: versionCount + 1,
      createdById: userId,
      snapshotData: budget,
    },
  });
};
```

---

# 23. API REST por HTTP

La API REST usa HTTP para operaciones CRUD.

Base URL local:

```txt
http://localhost:4000/api
```

Documentación Swagger:

```txt
http://localhost:4000/api/docs
```

---

# 24. Endpoints principales

## Auth

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
```

## Users

```txt
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

## Companies

```txt
POST   /api/companies
GET    /api/companies
GET    /api/companies/:id
PATCH  /api/companies/:id
DELETE /api/companies/:id
```

## Clients

```txt
POST   /api/clients
GET    /api/clients
GET    /api/clients/:id
PATCH  /api/clients/:id
DELETE /api/clients/:id
```

## Budgets

```txt
POST   /api/budgets
GET    /api/budgets
GET    /api/budgets/:id
PATCH  /api/budgets/:id
DELETE /api/budgets/:id
POST   /api/budgets/:id/calculate
PATCH  /api/budgets/:id/status
POST   /api/budgets/:id/duplicate
```

## Budget Modules

```txt
POST   /api/budget-modules
GET    /api/budget-modules/:id
PATCH  /api/budget-modules/:id
DELETE /api/budget-modules/:id
```

## Budget Tasks

```txt
POST   /api/budget-tasks
GET    /api/budget-tasks/:id
PATCH  /api/budget-tasks/:id
DELETE /api/budget-tasks/:id
```

## Budget Costs

```txt
POST   /api/budget-costs
GET    /api/budget-costs/:id
PATCH  /api/budget-costs/:id
DELETE /api/budget-costs/:id
```

## Templates

```txt
POST   /api/templates
GET    /api/templates
GET    /api/templates/:id
PATCH  /api/templates/:id
DELETE /api/templates/:id
POST   /api/templates/:id/apply/:budgetId
```

## Versions

```txt
GET    /api/versions/budget/:budgetId
POST   /api/versions/budget/:budgetId
POST   /api/versions/:id/restore
```

## Exports

```txt
POST   /api/exports/budget/:budgetId/pdf
POST   /api/exports/budget/:budgetId/word
POST   /api/exports/budget/:budgetId/excel
GET    /api/exports/budget/:budgetId
```

## Notifications

```txt
GET    /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all
DELETE /api/notifications/:id
```

## Plans

```txt
POST   /api/plans
GET    /api/plans
GET    /api/plans/:id
PATCH  /api/plans/:id
DELETE /api/plans/:id
```

## Subscriptions

```txt
POST   /api/subscriptions
GET    /api/subscriptions
GET    /api/subscriptions/:id
PATCH  /api/subscriptions/:id
DELETE /api/subscriptions/:id
```

---

# 25. Ejemplos de requests

## 25.1 Registro

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456",
  "phone": "999999999"
}
```

Respuesta:

```json
{
  "message": "Usuario registrado correctamente",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "editor"
    },
    "token": "jwt_token"
  }
}
```

---

## 25.2 Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

---

## 25.3 Crear cliente

```http
POST /api/clients
Authorization: Bearer TOKEN
Content-Type: application/json
```

```json
{
  "name": "Carlos Ramírez",
  "businessName": "CR Soluciones SAC",
  "email": "carlos@crsoluciones.com",
  "phone": "988888888",
  "documentNumber": "20600000001",
  "address": "Lima, Perú",
  "notes": "Cliente interesado en sistema web"
}
```

---

## 25.4 Crear presupuesto

```http
POST /api/budgets
Authorization: Bearer TOKEN
Content-Type: application/json
```

```json
{
  "clientId": "uuid_cliente",
  "title": "Sistema web para gestión comercial",
  "description": "Desarrollo de plataforma web para gestión de clientes, ventas y reportes",
  "currency": "PEN",
  "taxPercentage": 18,
  "discountPercentage": 0,
  "validityDays": 15,
  "paymentTerms": "50% al inicio y 50% contra entrega",
  "clientNotes": "El presupuesto incluye desarrollo, pruebas y despliegue."
}
```

---

## 25.5 Agregar módulo

```http
POST /api/budget-modules
Authorization: Bearer TOKEN
Content-Type: application/json
```

```json
{
  "budgetId": "uuid_presupuesto",
  "name": "Backend",
  "description": "Desarrollo de API REST, base de datos y autenticación",
  "orderNumber": 1
}
```

---

## 25.6 Agregar tarea

```http
POST /api/budget-tasks
Authorization: Bearer TOKEN
Content-Type: application/json
```

```json
{
  "budgetId": "uuid_presupuesto",
  "moduleId": "uuid_modulo",
  "name": "Implementar autenticación JWT",
  "description": "Registro, login, perfil y protección de rutas",
  "hours": 10,
  "hourlyRate": 35,
  "quantity": 1,
  "unitPrice": 0,
  "orderNumber": 1
}
```

---

## 25.7 Agregar costo adicional

```http
POST /api/budget-costs
Authorization: Bearer TOKEN
Content-Type: application/json
```

```json
{
  "budgetId": "uuid_presupuesto",
  "name": "Servidor VPS",
  "type": "monthly",
  "amount": 120,
  "quantity": 1,
  "description": "Servidor para despliegue del backend y base de datos"
}
```

---

## 25.8 Calcular presupuesto

```http
POST /api/budgets/uuid_presupuesto/calculate
Authorization: Bearer TOKEN
```

Respuesta:

```json
{
  "message": "Presupuesto calculado correctamente",
  "data": {
    "id": "uuid_presupuesto",
    "subtotal": 3500,
    "taxAmount": 630,
    "discountAmount": 0,
    "total": 4130
  }
}
```

---

# 26. Seed inicial

Crear `prisma/seed.js`:

```js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.plan.upsert({
    where: { name: "Free" },
    update: {},
    create: {
      name: "Free",
      price: 0,
      billingCycle: "monthly",
      maxBudgets: 5,
      maxClients: 10,
      hasAi: false,
      hasExports: false,
      hasTeam: false,
    },
  });

  await prisma.plan.upsert({
    where: { name: "Pro" },
    update: {},
    create: {
      name: "Pro",
      price: 29,
      billingCycle: "monthly",
      maxBudgets: 100,
      maxClients: 200,
      hasAi: false,
      hasExports: true,
      hasTeam: false,
    },
  });

  await prisma.plan.upsert({
    where: { name: "Business" },
    update: {},
    create: {
      name: "Business",
      price: 79,
      billingCycle: "monthly",
      maxBudgets: 1000,
      maxClients: 1000,
      hasAi: true,
      hasExports: true,
      hasTeam: true,
    },
  });

  console.log("Seed ejecutado correctamente");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Ejecutar:

```bash
npm run prisma:seed
```

---

# 27. Ejecución local sin Docker

## 27.1 Instalar dependencias

```bash
npm install
```

## 27.2 Levantar PostgreSQL local

Crear una base de datos llamada:

```txt
presusoft_db
```

## 27.3 Ejecutar migraciones

```bash
npx prisma migrate dev
```

## 27.4 Ejecutar seed

```bash
npm run prisma:seed
```

## 27.5 Levantar servidor

```bash
npm run dev
```

Servidor:

```txt
http://localhost:4000
```

Swagger:

```txt
http://localhost:4000/api/docs
```

Prisma Studio:

```txt
http://localhost:5555
```

---

# 28. Ejecución con Docker

## 28.1 Construir y levantar

```bash
docker compose up --build
```

## 28.2 Levantar en segundo plano

```bash
docker compose up -d
```

## 28.3 Ver logs

```bash
docker compose logs -f backend
```

## 28.4 Apagar contenedores

```bash
docker compose down
```

## 28.5 Apagar y eliminar volúmenes

```bash
docker compose down -v
```

## 28.6 Entrar al contenedor backend

```bash
docker exec -it presusoft_backend sh
```

## 28.7 Entrar a PostgreSQL

```bash
docker exec -it presusoft_postgres psql -U postgres -d presusoft_db
```

## 28.8 Ejecutar Prisma dentro del contenedor

```bash
docker exec -it presusoft_backend npx prisma migrate dev
```

```bash
docker exec -it presusoft_backend npx prisma studio
```

---

# 29. Seguridad

El backend debe considerar:

* Contraseñas encriptadas con bcrypt.
* Autenticación JWT.
* Protección de rutas privadas.
* Validación de roles.
* No exponer `.env`.
* No subir tokens al repositorio.
* CORS controlado en producción.
* Validación de datos de entrada.
* Manejo centralizado de errores.
* Sanitización de datos sensibles.
* Separar entornos `development`, `staging` y `production`.

---

# 30. Convenciones de código

## 30.1 Nombres de carpetas

Usar kebab-case:

```txt
budget-modules
budget-tasks
budget-costs
```

## 30.2 Nombres de archivos

Usar camelCase o nombre del módulo:

```txt
budgets.controller.js
budgets.service.js
budgets.routes.js
```

## 30.3 Rutas

Usar plural:

```txt
/users
/clients
/budgets
/templates
/notifications
```

## 30.4 Respuestas

Formato estándar:

```json
{
  "message": "Operación realizada correctamente",
  "data": {}
}
```

Formato de error:

```json
{
  "message": "Descripción del error"
}
```

---

# 31. Orden recomendado de desarrollo

## Fase 1: Configuración inicial

* Crear proyecto Node.
* Instalar Express.
* Configurar Docker.
* Configurar PostgreSQL.
* Configurar Prisma.
* Configurar Swagger.
* Configurar estructura de carpetas.

## Fase 2: Autenticación

* Registro.
* Login.
* JWT.
* Middleware de autenticación.
* Middleware de roles.

## Fase 3: Usuarios y empresas

* CRUD usuarios.
* CRUD empresas.
* Relación usuario-empresa.
* Empresa inicial automática.

## Fase 4: Clientes

* CRUD clientes.
* Asociación con usuario.
* Asociación con empresa.

## Fase 5: Presupuestos

* Crear presupuesto.
* Listar presupuestos.
* Editar presupuesto.
* Eliminar presupuesto.
* Estados de presupuesto.
* Código automático.

## Fase 6: Módulos, tareas y costos

* CRUD módulos.
* CRUD tareas.
* CRUD costos.
* Cálculo por tarea.
* Cálculo por costo.

## Fase 7: Cálculo total

* Sumar tareas.
* Sumar costos.
* Calcular impuesto.
* Calcular descuento.
* Calcular total.
* Actualizar presupuesto.

## Fase 8: Versionado

* Crear versión inicial.
* Crear versión tras cambios.
* Guardar snapshot.
* Restaurar versión.

## Fase 9: Plantillas

* Crear plantilla.
* Crear módulos de plantilla.
* Crear tareas de plantilla.
* Aplicar plantilla a presupuesto.

## Fase 10: Exportaciones

* Registrar exportación.
* Preparar exportación PDF.
* Preparar exportación Word.
* Preparar exportación Excel.

## Fase 11: Notificaciones

* Crear notificaciones.
* Marcar como leído.
* Listar notificaciones.
* Notificar eventos importantes.

## Fase 12: Tiempo real

* Configurar Socket.IO.
* Unir usuario a sala.
* Unir presupuesto a sala.
* Emitir eventos.
* Integrar eventos con presupuestos y notificaciones.

## Fase 13: Documentación

* Completar Swagger.
* Documentar endpoints.
* Documentar variables.
* Documentar Docker.
* Documentar despliegue.

---

# 32. Eventos de tiempo real recomendados

```txt
auth:login
client:created
client:updated
client:deleted

budget:created
budget:updated
budget:deleted
budget:calculated
budget:status-changed
budget:version-created

module:created
module:updated
module:deleted

task:created
task:updated
task:deleted

cost:created
cost:updated
cost:deleted

export:started
export:completed
export:failed

notification:new
notification:read
notification:read-all
```

---

# 33. Estados HTTP recomendados

```txt
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error
```

---

# 34. Ejemplo de respuesta correcta

```json
{
  "message": "Cliente creado correctamente",
  "data": {
    "id": "uuid",
    "name": "Empresa Cliente",
    "email": "cliente@email.com"
  }
}
```

---

# 35. Ejemplo de respuesta de error

```json
{
  "message": "Cliente no encontrado"
}
```

---

# 36. Despliegue recomendado en VPS

## 36.1 Infraestructura

* VPS Contabo.
* Docker instalado.
* Docker Compose instalado.
* PostgreSQL en contenedor.
* Backend en contenedor.
* Nginx como reverse proxy.
* SSL con Certbot.
* Dominio apuntando al servidor.

## 36.2 Comandos en VPS

```bash
sudo apt update
sudo apt upgrade -y
```

Instalar Docker:

```bash
sudo apt install docker.io docker-compose-plugin -y
```

Clonar proyecto:

```bash
git clone https://github.com/tu-usuario/presusoft-backend.git
cd presusoft-backend
```

Crear `.env`:

```bash
nano .env
```

Levantar:

```bash
docker compose up -d --build
```

Ver logs:

```bash
docker compose logs -f
```

---

# 37. Nginx recomendado

Archivo de configuración:

```nginx
server {
    listen 80;
    server_name api.presusoft.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

# 38. SSL con Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

```bash
sudo certbot --nginx -d api.presusoft.com
```

---

# 39. Checklist del backend

```txt
[ ] Crear proyecto Node.js
[ ] Instalar dependencias
[ ] Configurar Express
[ ] Configurar Docker
[ ] Configurar PostgreSQL
[ ] Configurar Prisma
[ ] Crear modelos Prisma
[ ] Crear migraciones
[ ] Crear seed
[ ] Configurar Swagger
[ ] Crear módulo Auth
[ ] Crear JWT
[ ] Crear middleware Auth
[ ] Crear middleware Roles
[ ] Crear módulo Users
[ ] Crear módulo Companies
[ ] Crear módulo Clients
[ ] Crear módulo Budgets
[ ] Crear módulo Budget Modules
[ ] Crear módulo Budget Tasks
[ ] Crear módulo Budget Costs
[ ] Crear cálculo de presupuesto
[ ] Crear versiones
[ ] Crear plantillas
[ ] Crear exportaciones
[ ] Crear notificaciones
[ ] Configurar Socket.IO
[ ] Emitir eventos en tiempo real
[ ] Probar endpoints en Postman
[ ] Documentar todo en Swagger
[ ] Preparar despliegue en VPS
```

---

# 40. Comandos rápidos

```bash
npm run dev
```

```bash
npm run start
```

```bash
npm run prisma:migrate
```

```bash
npm run prisma:generate
```

```bash
npm run prisma:studio
```

```bash
docker compose up --build
```

```bash
docker compose down
```

```bash
docker compose logs -f backend
```

---

# 41. Resultado esperado del MVP

Al terminar el MVP, el backend debe permitir:

* Registrar usuarios.
* Iniciar sesión.
* Proteger rutas con JWT.
* Crear empresas.
* Crear clientes.
* Crear presupuestos.
* Agregar módulos al presupuesto.
* Agregar tareas.
* Agregar costos.
* Calcular totales.
* Guardar versiones.
* Crear plantillas.
* Exportar presupuestos.
* Crear notificaciones.
* Emitir eventos en tiempo real.
* Documentar la API con Swagger.
* Ejecutar todo con Docker.

---

# 42. Autor

Proyecto: **PresuSoft**

Backend desarrollado con:

```txt
Node.js
Express.js
Prisma ORM
PostgreSQL
Docker
Swagger
Socket.IO
JWT
```

---

# 43. Nota técnica

Este backend está pensado para crecer como una plataforma SaaS.
Primero se implementa el MVP con presupuestos, clientes, usuarios y cálculos.
Luego se puede ampliar con:

* Inteligencia artificial para estimar costos.
* Integraciones con Google Drive.
* Integraciones con Excel.
* Exportaciones avanzadas.
* Aprobación pública por cliente.
* Comentarios del cliente.
* Trabajo colaborativo por equipos.
* Planes de pago.
* Panel administrativo.

````

Ahí tienes el **README.md grande y completo**. Lo puedes copiar tal cual en un archivo llamado:

```txt
README.md
````