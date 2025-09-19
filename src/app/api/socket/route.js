import { Server } from "socket.io";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);

    res.socket.server.io = io;

    io.on("connection", (socket) => {

      socket.on("send_message", (msg) => {
        io.emit("receive_message", msg); 
      });

      socket.on("disconnect", () => {
      });
    });
  }

  res.end();
}
