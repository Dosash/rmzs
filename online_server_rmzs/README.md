# online_server_rmzs

Мини-API для получения информации о статусе серверов RedImpact Zombie Survival, включая количество игроков онлайн, текущую карту и статус сервера.

## Описание

Это простой Node.js API на базе Express, который опрашивает игровые серверы Garry's Mod и предоставляет актуальную информацию о:
- **Статусе сервера** (online/offline)
- **Количестве игроков** и максимальном количестве мест
- **Текущей карте**
- **Названии сервера**
- **Пинге сервера**

API использует библиотеку [GameDig](https://www.npmjs.com/package/gamedig) для запроса информации у игровых серверов.

## Установка

### Требования
- Node.js 18+ или Docker

### Локальная установка

```bash
npm install
```

### Docker установка

```bash
docker-compose up -d
```

## Использование

### Запуск локально

```bash
npm start
```

API будет доступен по адресу: `http://localhost:3000`

### Запуск через Docker

```bash
docker-compose up -d
```

Контейнер автоматически перезагружается при сбое.

## API Endpoints

### GET `/api/servers`

Получить информацию о всех серверах.

**Пример ответа:**

```json
{
  "updatedAt": "2024-01-15T10:30:45.123Z",
  "servers": [
    {
      "id": "main",
      "title": "Основной",
      "addr": "194.147.90.109:24215",
      "online": true,
      "name": "RedImpact - Zombie Survival #1",
      "map": "zm_rooftops_final",
      "players": 12,
      "maxPlayers": 32,
      "ping": 45
    },
    {
      "id": "rogue",
      "title": "Рогалик",
      "addr": "194.147.90.109:24216",
      "online": false,
      "error": "query_failed"
    }
  ]
}
```

**Параметры ответа:**
- `id` — уникальный идентификатор сервера
- `title` — название сервера
- `addr` — IP адрес и порт
- `online` — статус сервера (true/false)
- `name` — полное название сервера
- `map` — текущая карта
- `players` — количество игроков онлайн
- `maxPlayers` — максимальное количество игроков
- `ping` — пинг до сервера (мс)

## Конфигурация

### Добавление нового сервера

Отредактируйте массив `SERVERS` в [index.js](index.js):

```javascript
const SERVERS = [
  { id: "main",  title: "Основной", host: "194.147.90.109", port: 24215 },
  { id: "rogue", title: "Рогалик",  host: "194.147.90.109", port: 24216 },
  // Добавьте новый сервер здесь
  { id: "new",   title: "Новый",    host: "123.456.789.0", port: 27015 },
];
```

### Параметры кеширования

По умолчанию результаты кешируются на **15 секунд** (`CACHE_MS = 15000`). Это предотвращает перегрузку серверов частыми запросами.

Для изменения интервала отредактируйте значение `CACHE_MS`:

```javascript
const CACHE_MS = 15000; // 15 секунд
```

## Структура файлов

```
online_server_rmzs/
├── index.js                 # Основной файл API
├── package.json            # Зависимости проекта
├── docker-compose.yml      # Конфигурация Docker
├── Dockerfile              # Docker образ
├── nodesource_setup.sh     # Скрипт установки Node.js на сервер
└── README.md               # Этот файл
```

## Переменные окружения

```bash
NODE_ENV=production  # Режим работы (production/development)
```

Может быть установлена в `docker-compose.yml` или `.env` файле.

## Логирование

При запуске в Docker контейнер логирует информацию в JSON формате. Логи ограничены:
- Максимальный размер одного файла: 10 МБ
- Максимальное количество файлов: 3

## Возможные ошибки

| Ошибка | Причина | Решение |
|--------|---------|---------|
| `ECONNREFUSED` | Сервер недоступен | Проверьте IP адрес и порт |
| `ETIMEDOUT` | Сервер не отвечает | Проверьте соединение с интернетом |
| `query_failed` | Ошибка запроса | Сервер может быть offline или требует повторной попытки |

## Разработка

### Установка Node.js на Linux (Ubuntu/Debian)

```bash
bash nodesource_setup.sh
apt install nodejs -y
npm install -g npm@latest
```

### Использование на продакшене

```bash
docker-compose up -d --pull always
```

## Лицензия

ISC

## Контакты

**Разработчик:** [Dosash](https://dosash.ru)

**Discord:** [RedImpact Discord](https://discord.gg/dnJHWyw)

---

**Примечание:** API используется на сайте [rmzs.ru](https://rmzs.ru) для отображения актуальной информации о статусе серверов.