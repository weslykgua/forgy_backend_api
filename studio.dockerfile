FROM node:18-bullseye-slim
WORKDIR /app
COPY package.json ./
COPY prisma ./prisma/
EXPOSE 5555
RUN npm i --only=production
ENV NODE_ENV=production
ENTRYPOINT ["npm", "run", "prisma:studio"]