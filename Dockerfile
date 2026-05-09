FROM node:20-slim

WORKDIR /app

COPY package.json ./
RUN npm install --production=false

COPY . .
RUN npm run build
RUN npm prune --production

EXPOSE 8080
CMD ["node", "server/index.js"]
