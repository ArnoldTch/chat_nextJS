"use client"

import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import jwtDecode from "jwt-decode"

let socket

export default function Dashboard() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const user = jwtDecode(token)
        console.log(user)
        console.log(user.name) 
        setUsername(user.name)
        
      } catch (err) {
        console.log("Token invalide :", err)
      }
    }
  }, [])

  useEffect(() => {
    socket = io("http://localhost:3001") 
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.off("receive_message")
      socket.disconnect()
    }
  }, [])

  const sendMessage = () => {
    if (message.trim() === "") return

    const msg = { content: message, sender: username }
    socket.emit("send_message", msg)
    setMessage("")
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Chat en temps réel</h1>

      {/* Zone des messages */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "1rem",
          height: "300px",
          overflowY: "auto",
          marginBottom: "1rem",
          background: "#f9f9f9",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent:
                msg.sender === username ? "flex-start" : "flex-end",
              margin: "0.5rem 0",
            }}
          >
            <div
              style={{
                background: msg.sender === username ? "#e0e0e0" : "#007bff",
                color: msg.sender === username ? "#000" : "#fff",
                padding: "0.5rem 1rem",
                borderRadius: "15px",
                maxWidth: "60%",
                wordBreak: "break-word",
              }}
            >
              <strong>{msg.sender}:</strong> {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Zone d'envoi */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="Écris un message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button onClick={sendMessage} style={{ padding: "0.5rem 1rem" }}>
          Envoyer
        </button>
      </div>
    </div>
  )
}
