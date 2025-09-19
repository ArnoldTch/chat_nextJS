import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req) {
  const { name, email, password } = await req.json()

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return new Response(JSON.stringify({ message: "Email déjà utilisé" }), { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "user",
    },
  })

  return new Response(JSON.stringify({ message: "Utilisateur créé", user }), { status: 201 })
}
