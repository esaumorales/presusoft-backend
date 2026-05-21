import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { initSocket } from "./sockets/socket.js";

const server = http.createServer(app);

initSocket(server);

server.listen(env.port, () => {
  console.log(`Servidor PresuSoft ejecutándose en http://localhost:${env.port}`);
  console.log(`Swagger disponible en http://localhost:${env.port}/api/docs`);
});
