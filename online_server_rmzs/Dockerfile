FROM node:18-alpine

LABEL maintainer="Dosash <@Dosash>"
LABEL description="online_server_rmzs - API статуса серверов Garry's Mod"
LABEL version="1.0.0"

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY index.js ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
