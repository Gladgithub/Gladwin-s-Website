# Platformer Multiplayer Server

This is the real Socket.IO server for the platformer. Host it on Render, Railway, Fly.io, or any Node.js server host. Vercel should keep serving the static website only.

## Local Run

```bash
npm install
npm start
```

The local server URL is:

```text
http://localhost:3001
```

## Connect The Website

After deploying this server, copy its public URL into:

```text
Platformer/multiplayer-config.js
```

Example:

```js
window.PLATFORMER_SOCKET_URL = "https://your-platformer-server.onrender.com";
```

Players only see and collide with other players on the same level. Players on other levels stay in separate Socket.IO rooms.
