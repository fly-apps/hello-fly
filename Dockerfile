FROM node:25-alpine

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

USER node
EXPOSE 8080
CMD ["node", "server.js"]
