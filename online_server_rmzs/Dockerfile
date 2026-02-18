# Используем официальный образ Node.js
FROM node:18-alpine

# Метаданные
LABEL maintainer="Dosash <@Dosash>"
LABEL description="online_server_rmzs - бот для получения информации о серверах игры Garry's Mod"
LABEL version="1.0.0"

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы проекта
COPY package*.json ./
COPY index.js ./

# Устанавливаем зависимости
RUN npm install --omit=dev

# Создаем директорию для данных
RUN mkdir -p /app/data

# Переменные окружения
ENV NODE_ENV=production

# Запускаем бота
CMD ["npm", "start"]
