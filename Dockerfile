FROM node:18-bullseye-slim
WORKDIR /app
COPY package.json ./
COPY prisma ./prisma/
COPY ./dist ./dist
EXPOSE 3000
RUN apt update
RUN apt install -y openssl;
RUN npm i --only=production
RUN npx prisma generate
ENV NODE_ENV=production
ENTRYPOINT ["npm", "start"]