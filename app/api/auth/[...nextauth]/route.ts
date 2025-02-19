import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import { compare } from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import type { MongoClient } from 'mongodb';

interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error('Missing environment variables for Google OAuth');
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: clientId!,
      clientSecret: clientSecret!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<AuthenticatedUser | null> {
        console.log('Authorizing user:', credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log('Missing email or password');
          return null;
        }

        // Connect to the database
        const client: MongoClient = await clientPromise;
        const db = client.db('JelqAI');
        const usersCollection = db.collection('users');

        // Find the user by email
        const user = await usersCollection.findOne({ email: credentials.email });
        if (!user) {
          console.log('User not found');
          return null;
        }

        // Compare the hashed password with the provided password
        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
          console.log('Invalid password');
          return null;
        }

        // Return the user object if authentication is successful
        console.log('User authenticated:', user);
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Optional
    verifyRequest: '/auth/verify-request', // Optional
    newUser: '/auth/new-user', // Optional
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      console.log('JWT token:', token);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      console.log('Session:', session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
