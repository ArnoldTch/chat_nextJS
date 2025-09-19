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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f4f8",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "#cce4ff",
          padding: "2rem",
          borderRadius: "20px",
          width: "400px",
          maxWidth: "90%",
          boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" , color: "#333"}}>Chat</h2>

        {/* Zone messages */}
        <div
          style={{
            flex: 1,
            border: "1px solid #aaa",
            borderRadius: "15px",
            padding: "1rem",
            overflowY: "auto",
            marginBottom: "1rem",
            background: "#e6f2ff",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.sender === username ? "flex-start" : "flex-end",
                margin: "0.5rem 0",
              }}
            >
              <div
                style={{
                  background: msg.sender === username ? "#fff" : "#3399ff",
                  color: msg.sender === username ? "#333" : "#fff",
                  padding: "0.5rem 1rem",
                  borderRadius: "15px",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                }}
              >
                <strong>{msg.sender}:</strong> {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Zone d’envoi */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            placeholder="Écris un message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "10px",
              border: "1px solid #aaa",
              color: "#333",
              background: "#fff",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              border: "none",
              background: "#3399ff",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  )

}
