import NextAuth from "next-auth"
import Providers from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import type { NextAuthOptions } from "next-auth"

// This is a mock user database - in production, use a real database
const users = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    // Password: "password123"
    password: "$2a$10$8r78.89o/u8929N8.89o/u8929N8.89o/u8929",
  },
]

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // Optional: Add other NextAuth.js options here
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = users.find((user) => user.email === credentials.email)
        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)
        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

