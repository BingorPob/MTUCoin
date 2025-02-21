import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("JelqAI");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      twoFactorEnabled: false, // 2FA setup flag
    };

    await db.collection("users").insertOne(user);

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// Save 2FA Secret (Separate route)
export async function SAVE_2FA(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  try {
    const { userId, secret } = await req.json();
    const client = await clientPromise;
    const db = client.db("JelqAI");

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { twoFactorEnabled: true, twoFactorSecret: secret } }
    );

    return NextResponse.json({ message: "2FA setup successfully" }, { status: 200 });
  } catch (error) {
    console.error("2FA Setup error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
