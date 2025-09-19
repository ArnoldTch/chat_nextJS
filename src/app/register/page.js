"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const router = useRouter()

    async function handleRegister(e) {
        e.preventDefault()

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        })

        const data = await res.json()
        if (res.ok) {
            setMessage("Inscription réussie")
            router.push("/dashboard")
        } else {
            setMessage(data.message || "Erreur lors de l'inscription")
        }
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "#f0f4f8",
            }}
        >
            <div
                style={{
                    background: "#cce4ff",
                    padding: "2rem",
                    borderRadius: "20px",
                    width: "350px",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "1rem",  color: "#333" }}>Inscription</h2>
                <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <input
                        placeholder="Nom"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ padding: "0.5rem", borderRadius: "10px", border: "1px solid #aaa", color: "#333", background: "#cce4ff" }}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: "0.5rem", borderRadius: "10px", border: "1px solid #aaa", color: "#333", background: "#cce4ff" }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: "0.5rem", borderRadius: "10px", border: "1px solid #aaa", color: "#333", background: "#cce4ff" }}
                        required
                    />
                    <button
                        type="submit"
                        style={{ padding: "0.5rem", borderRadius: "10px", border: "none", background: "#3399ff", color: "#fff", fontWeight: "bold", cursor: "pointer" }}
                    >
                        S'inscrire
                    </button>
                </form>
                {message && <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>{message}</p>}
                <p style={{ textAlign: "center", marginTop: "1rem",  color: "#333" }}>
                    Déjà un compte ? <button onClick={() => router.push("/login")} style={{ color: "#007bff", cursor: "pointer", border: "none", background: "transparent" }}>Se connecter</button>
                </p>
            </div>
        </div>
    )

}
