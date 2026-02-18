const express = require("express");
const cors = require("cors");
const { GameDig } = require("gamedig");

const app = express();

app.use(cors({ origin: "*" }));

const SERVERS = [
  { id: "main",  title: "Основной", host: "194.147.90.109", port: 24215 },
  { id: "rogue", title: "Рогалик",  host: "194.147.90.109", port: 24216 },
];

// кеш, чтобы не долбить сервера
let cache = { ts: 0, data: null };
const CACHE_MS = 15000;

app.get("/api/servers", async (req, res) => {
  const now = Date.now();
  if (cache?.data && now - cache.ts < CACHE_MS) {
    return res.json(cache.data);
  }

  const results = await Promise.allSettled(
    SERVERS.map(async (s) => {
      const state = await GameDig.query({
        type: "garrysmod",
        host: s.host,
        port: s.port,

        // диагностика/стабильность
        maxAttempts: 2,
        socketTimeout: 2000,
        attemptTimeout: 6000,


      });

      return {
        id: s.id,
        title: s.title,
        addr: `${s.host}:${s.port}`,
        online: true,
        name: state.name || "",
        map: state.map || "",
        players: Array.isArray(state.players) ? state.players.length : (state.numplayers ?? 0),
        maxPlayers: state.maxplayers ?? null,
        ping: state.ping ?? null,
      };
    })
  );

  const payload = {
    updatedAt: new Date().toISOString(),
    servers: results.map((r, i) => {
      const s = SERVERS[i];
      if (r.status === "fulfilled") return r.value;

      return {
        id: s.id,
        title: s.title,
        addr: `${s.host}:${s.port}`,
        online: false,
        error: String(r.reason?.message || r.reason || "query_failed"),
      };
    }),
  };

  cache = { ts: now, data: payload };
  res.json(payload);
});

