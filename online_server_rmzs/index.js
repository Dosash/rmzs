const express = require("express");
const cors = require("cors");
const { GameDig } = require("gamedig");

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const CACHE_MS = Number(process.env.CACHE_MS) || 15000;

const SERVERS = [
  { id: "main", title: "Основной", host: "194.147.90.109", port: 24215 },
  { id: "rogue", title: "Рогалик", host: "194.147.90.109", port: 24216 },
];

const QUERY_OPTIONS = {
  maxAttempts: 2,
  socketTimeout: 2000,
  attemptTimeout: 6000,
};

let cache = { ts: 0, data: null };

app.use(cors({ origin: "*" }));

app.get("/healthz", (req, res) => {
  res.json({ ok: true, uptimeSec: Math.round(process.uptime()) });
});

app.get("/api/servers", async (req, res) => {
  const now = Date.now();

  if (cache.data && now - cache.ts < CACHE_MS) {
    return res.json(cache.data);
  }

  try {
    const payload = await buildServersPayload();
    cache = { ts: now, data: payload };
    return res.json(payload);
  } catch (error) {
    console.error("[online_server_rmzs] failed to refresh servers:", error);

    if (cache.data) {
      return res.json(cache.data);
    }

    return res.status(503).json({
      updatedAt: new Date().toISOString(),
      servers: SERVERS.map((server) => ({
        id: server.id,
        title: server.title,
        addr: `${server.host}:${server.port}`,
        online: false,
        error: "query_failed",
      })),
    });
  }
});

async function buildServersPayload() {
  const results = await Promise.allSettled(SERVERS.map((server) => queryServer(server)));

  return {
    updatedAt: new Date().toISOString(),
    servers: results.map((result, index) => {
      const server = SERVERS[index];

      if (result.status === "fulfilled") {
        return result.value;
      }

      return {
        id: server.id,
        title: server.title,
        addr: `${server.host}:${server.port}`,
        online: false,
        error: String(result.reason?.message || result.reason || "query_failed"),
      };
    }),
  };
}

async function queryServer(server) {
  const state = await GameDig.query({
    type: "garrysmod",
    host: server.host,
    port: server.port,
    ...QUERY_OPTIONS,
  });

  return {
    id: server.id,
    title: server.title,
    addr: `${server.host}:${server.port}`,
    online: true,
    name: state.name || "",
    map: state.map || "",
    players: Array.isArray(state.players) ? state.players.length : state.numplayers ?? 0,
    maxPlayers: state.maxplayers ?? null,
    ping: state.ping ?? null,
  };
}

app.listen(PORT, () => {
  console.log(`[online_server_rmzs] listening on :${PORT}`);
});
