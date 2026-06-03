FROM node:20-alpine

# Instalar dependencias del sistema operativo necesarias para que Puppeteer funcione en Alpine
RUN apk update && apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

# Configurar variables de entorno para que Puppeteer use el Chromium que acabamos de instalar
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Generar el cliente de Prisma
RUN npx prisma generate

EXPOSE 4000

# Aplicar las migraciones de la BD y LUEGO iniciar la app
CMD npx prisma migrate deploy && npm run start
