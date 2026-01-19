# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Etapa 2: Production
FROM node:18-alpine AS runner

WORKDIR /app

# Instalar solo dependencias de producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar Prisma schema y generar cliente
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate

# Copiar código compilado
COPY --from=builder /app/dist ./dist

# Copiar archivos necesarios
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Exponer puerto
EXPOSE 3000

# Script de inicio que ejecuta migraciones y luego inicia el servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]