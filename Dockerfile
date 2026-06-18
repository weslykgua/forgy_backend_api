# Etapa 1: Construcción (Builder)
FROM node:18-bullseye-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY src ./src/

RUN npm install
RUN DATABASE_URL="postgresql://dummy:dummy@localhost/dummy" npx prisma generate
RUN npm run build

# Etapa 2: Producción
FROM node:18-bullseye-slim
WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --omit=dev
RUN DATABASE_URL="postgresql://dummy:dummy@localhost/dummy" npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 3000
ENV NODE_ENV=production
ENTRYPOINT ["npm", "start"]