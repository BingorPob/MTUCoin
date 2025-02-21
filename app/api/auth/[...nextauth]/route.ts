import { NextAuth } from "next-auth"; // Updated import
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";
import { ObjectId } from "mongodb";
import speakeasy from "speakeasy";

interface CustomUser {
  _id: ObjectId;
  id: string;
  email: string;
  name: string;
  password?: string;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  emailVerified: Date | null;
}

const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const client = await clientPromise;
        const db = client.db("JelqAI");

        const user = await db.collection("users").findOne<CustomUser>({
          email: credentials.email.toLowerCase(),
        });

        if (!user) {
          throw new Error("No user found");
        }

        // Only verify password for credentials-based login
        if (user.password) {
          const isPasswordValid = await compare(credentials.password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }
        }

        return {
          ...user,
          id: user._id.toString(),
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: { user: CustomUser; account: any; profile?: any; email?: any; credentials?: any }) {
      console.log("signIn callback - user:", user);
      console.log("signIn callback - account:", account);

      if (user.twoFactorEnabled && account) {
        // Verify 2FA token
        const verified = speakeasy.totp.verify({
          secret: user.twoFactorSecret!,
          encoding: "base32",
          token: account.token,
        });
        if (!verified) {
          throw new Error("Invalid 2FA token");
        }
      }
      return true;
    },
    async jwt({ token, user }: { token: any; user?: CustomUser }) {
      console.log("jwt callback - token before:", token);
      if (user) {
        token.id = user.id;
        token.twoFactorEnabled = user.twoFactorEnabled ?? false;
      }
      console.log("jwt callback - token after:", token);
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      console.log("session callback - session before:", session);
      if (session.user) {
        session.user.id = token.id as string;
        session.user.twoFactorEnabled = token.twoFactorEnabled ?? false;
      }
      console.log("session callback - session after:", session);
      return session;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler for GET and POST methods
export { handler as GET, handler as POST };