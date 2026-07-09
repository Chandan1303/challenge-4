import { createServer } from "node:http";
import { Server } from "socket.io";
import { config } from "./config.js";
import { createApp } from "./app.js";
import { gates } from "./data/stadium.js";

const httpServer = createServer(createApp());
const io = new Server(httpServer, {
  cors: { origin: config.FRONTEND_ORIGIN }
});

io.on("connection", (socket) => {
  socket.emit("crowd:update", gates);
});

setInterval(() => {
  io.emit("crowd:update", gates.map((gate) => ({
    ...gate,
    occupancy: Math.min(100, Math.max(0, gate.occupancy + Math.round(Math.random() * 4 - 2)))
  })));
}, 5000);

httpServer.listen(config.PORT, () => {
  console.log(`StadiumMind API listening on ${config.PORT}`);
});
