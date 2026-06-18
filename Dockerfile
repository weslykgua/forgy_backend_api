# =========================
# Etapa 1: Build
# =========================
FROM node:22-bookworm-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/
COPY src ./src/

# Instalar dependencias
RUN DATABASE_URL="postgresql://dummy:dummy@localhost/dummy" npm install

# Compilar TypeScript
RUN npm run build


# =========================
# Etapa 2: Producción
# =========================
FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

# Solo dependencias de producción
RUN DATABASE_URL="postgresql://dummy:dummy@localhost/dummy" npm install --omit=dev

# Copiar Prisma Client generado
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copiar build compilado
COPY --from=builder /app/dist ./dist

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]