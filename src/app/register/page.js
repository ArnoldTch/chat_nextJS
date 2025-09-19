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
        <div style={{ padding: "2rem" }}>
            <h1>Inscription</h1>
            <form onSubmit={handleRegister}>
                <input placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
                <br />
                <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <button type="submit">S'inscrire</button>
            </form>
            {message && <p>{message}</p>}

            <hr style={{ margin: "1rem 0" }} />
            <p>Déjà un compte ?</p>
            <button onClick={() => router.push("/login")}>Se connecter</button>
        </div>
    )
}
