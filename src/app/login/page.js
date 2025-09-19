"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const router = useRouter()

    async function handleLogin(e) {
        e.preventDefault()

        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })

        const data = await res.json()

        if (res.ok) {
            localStorage.setItem("token", data.token)
            setMessage("Connexion réussie")
            router.push("/dashboard")
        } else {
            setMessage(data.message || "Erreur de connexion")
        }
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Connexion</h1>
            <form onSubmit={handleLogin}>
                <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <button type="submit">Se connecter</button>
            </form>
            {message && <p>{message}</p>}

            <hr style={{ margin: "1rem 0" }} />
            <p>Pas encore de compte ?</p>
            <button onClick={() => router.push("/register")}>S'inscrire</button>
        </div>
    )
}
