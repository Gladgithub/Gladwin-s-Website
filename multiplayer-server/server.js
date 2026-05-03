import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;
const players = new Map();
const levelEnemies = new Map();
const enemySpeed = 240;
const enemyRange = 224;

function roomName(levelIndex) {
  return `level-${levelIndex}`;
}

function cleanState(socket, state = {}) {
  return {
    id: socket.id,
    name: String(state.name || "Player").slice(0, 18),
    x: clamp(Number(state.x), 0, 1024),
    y: clamp(Number(state.y), 0, 640),
    width: clamp(Number(state.width) || 32, 8, 64),
    height: clamp(Number(state.height) || 32, 8, 64),
    color: String(state.color || "#2772db").slice(0, 24),
    levelIndex: clamp(Math.floor(Number(state.levelIndex) || 0), 0, 99)
  };
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.max(min, Math.min(max, value));
}

function playersForLevel(levelIndex) {
  const roomPlayers = {};
  for (const [id, player] of players) {
    if (player.levelIndex === levelIndex) {
      roomPlayers[id] = player;
    }
  }
  return roomPlayers;
}

function broadcastLevel(levelIndex) {
  io.to(roomName(levelIndex)).emit("players", playersForLevel(levelIndex));
}

function cleanEnemies(enemies = []) {
  if (!Array.isArray(enemies)) {
    return [];
  }

  return enemies.slice(0, 50).map((enemy, index) => ({
    index,
    baseX: clamp(Number(enemy.x), 0, 1024),
    baseY: clamp(Number(enemy.y), 0, 640),
    x: clamp(Number(enemy.x), 0, 1024),
    y: clamp(Number(enemy.y), 0, 640),
    width: clamp(Number(enemy.width) || 32, 8, 64),
    height: clamp(Number(enemy.height) || 32, 8, 64)
  }));
}

function updateLevelEnemies(levelIndex, enemies) {
  const cleanedEnemies = cleanEnemies(enemies);
  if (!cleanedEnemies.length) {
    return;
  }

  const currentEnemies = levelEnemies.get(levelIndex);
  if (!currentEnemies || currentEnemies.length !== cleanedEnemies.length) {
    levelEnemies.set(levelIndex, {
      startedAt: Date.now(),
      enemies: cleanedEnemies
    });
  }
}

function enemySnapshot(levelIndex) {
  const levelState = levelEnemies.get(levelIndex);
  if (!levelState) {
    return [];
  }

  const distanceRaw = ((Date.now() - levelState.startedAt) / 1000 * enemySpeed) % (enemyRange * 2);
  const offset = distanceRaw > enemyRange ? (enemyRange * 2) - distanceRaw : distanceRaw;

  return levelState.enemies.map((enemy, index) => ({
    index,
    x: enemy.baseX + offset,
    y: enemy.baseY,
    width: enemy.width,
    height: enemy.height
  }));
}

function broadcastEnemies(levelIndex) {
  io.to(roomName(levelIndex)).emit("enemies", {
    levelIndex,
    enemies: enemySnapshot(levelIndex)
  });
}

app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "Gladwin platformer multiplayer",
    players: players.size
  });
});

io.on("connection", (socket) => {
  socket.on("joinGame", (state) => {
    const player = cleanState(socket, state);
    updateLevelEnemies(player.levelIndex, state?.enemies);
    players.set(socket.id, player);
    socket.join(roomName(player.levelIndex));
    broadcastLevel(player.levelIndex);
    broadcastEnemies(player.levelIndex);
  });

  socket.on("playerState", (state) => {
    const oldPlayer = players.get(socket.id);
    const player = cleanState(socket, state);
    updateLevelEnemies(player.levelIndex, state?.enemies);
    players.set(socket.id, player);

    if (!oldPlayer) {
      socket.join(roomName(player.levelIndex));
      broadcastLevel(player.levelIndex);
      broadcastEnemies(player.levelIndex);
      return;
    }

    if (oldPlayer.levelIndex !== player.levelIndex) {
      socket.leave(roomName(oldPlayer.levelIndex));
      socket.join(roomName(player.levelIndex));
      broadcastLevel(oldPlayer.levelIndex);
      broadcastEnemies(oldPlayer.levelIndex);
    }

    broadcastLevel(player.levelIndex);
    broadcastEnemies(player.levelIndex);
  });

  socket.on("changeLevel", (state) => {
    const oldPlayer = players.get(socket.id);
    const player = cleanState(socket, state);
    updateLevelEnemies(player.levelIndex, state?.enemies);

    if (oldPlayer) {
      socket.leave(roomName(oldPlayer.levelIndex));
      broadcastLevel(oldPlayer.levelIndex);
      broadcastEnemies(oldPlayer.levelIndex);
    }

    players.set(socket.id, player);
    socket.join(roomName(player.levelIndex));
    broadcastLevel(player.levelIndex);
    broadcastEnemies(player.levelIndex);
  });

  socket.on("disconnect", () => {
    const oldPlayer = players.get(socket.id);
    players.delete(socket.id);
    if (oldPlayer) {
      broadcastLevel(oldPlayer.levelIndex);
    }
  });
});

setInterval(() => {
  for (const levelIndex of levelEnemies.keys()) {
    broadcastEnemies(levelIndex);
  }
}, 50);

server.listen(PORT, () => {
  console.log(`Multiplayer server listening on port ${PORT}`);
});
