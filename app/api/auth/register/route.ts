import { hash } from "bcryptjs"
import { NextResponse } from "next/server"

// This is a mock user database - in production, use a real database
const users: any[] = []

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    if (users.some((user) => user.email === email)) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const user = {
      id: String(users.length + 1),
      name,
      email,
      password: hashedPassword,
    }

    users.push(user)

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

