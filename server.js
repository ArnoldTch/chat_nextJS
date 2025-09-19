import { Server } from "socket.io"
import http from "http"
import express from "express"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  console.log("Un client est connecté :", socket.id)

  socket.on("send_message", (msg) => {

    io.emit("receive_message", msg)
  })

  socket.on("disconnect", () => {
  })
})

server.listen(3001, () => {
  console.log("Serveur WebSocket démarré sur http://localhost:3001")
})
