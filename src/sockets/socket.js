import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    socket.on("join:user", (userId) => {
      socket.join(`user:${userId}`);
      console.log(`Usuario unido a sala user:${userId}`);
    });

    socket.on("join:budget", (budgetId) => {
      socket.join(`budget:${budgetId}`);
      console.log(`Cliente unido a sala budget:${budgetId}`);
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io no ha sido inicializado");
  }

  return io;
};
