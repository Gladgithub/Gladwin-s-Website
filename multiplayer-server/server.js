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
    players.set(socket.id, player);
    socket.join(roomName(player.levelIndex));
    broadcastLevel(player.levelIndex);
  });

  socket.on("playerState", (state) => {
    const oldPlayer = players.get(socket.id);
    const player = cleanState(socket, state);
    players.set(socket.id, player);

    if (!oldPlayer) {
      socket.join(roomName(player.levelIndex));
      broadcastLevel(player.levelIndex);
      return;
    }

    if (oldPlayer.levelIndex !== player.levelIndex) {
      socket.leave(roomName(oldPlayer.levelIndex));
      socket.join(roomName(player.levelIndex));
      broadcastLevel(oldPlayer.levelIndex);
    }

    broadcastLevel(player.levelIndex);
  });

  socket.on("changeLevel", (state) => {
    const oldPlayer = players.get(socket.id);
    const player = cleanState(socket, state);

    if (oldPlayer) {
      socket.leave(roomName(oldPlayer.levelIndex));
      broadcastLevel(oldPlayer.levelIndex);
    }

    players.set(socket.id, player);
    socket.join(roomName(player.levelIndex));
    broadcastLevel(player.levelIndex);
  });

  socket.on("disconnect", () => {
    const oldPlayer = players.get(socket.id);
    players.delete(socket.id);
    if (oldPlayer) {
      broadcastLevel(oldPlayer.levelIndex);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Multiplayer server listening on port ${PORT}`);
});
