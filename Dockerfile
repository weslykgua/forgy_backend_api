FROM node:18-bullseye-slim
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY src ./src/

RUN apt-get update && apt-get install -y openssl
RUN npm install
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
ENV NODE_ENV=production
ENTRYPOINT ["npm", "start"]