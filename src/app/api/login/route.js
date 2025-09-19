import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email et mot de passe requis" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Email ou mot de passe incorrect" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid){
      return new Response(
        JSON.stringify({ message: "Email ou mot de passe incorrect" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "jwt8secret",
      { expiresIn: "2h" }
    )

    return new Response(
      JSON.stringify({ token, message: "Connexion réussie" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )

  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Erreur serveur", error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
