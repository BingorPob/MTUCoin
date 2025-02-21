import NextAuth from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      twoFactorEnabled: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    twoFactorEnabled: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    twoFactorEnabled: boolean;
  }
}
