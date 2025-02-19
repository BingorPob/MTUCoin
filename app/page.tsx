"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to JelqAI</h1>
      {session ? (
        <div>
          <p className="text-xl mb-4">
            Welcome back, {session.user?.name || session.user?.email}!
          </p>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <>
          <p className="text-xl mb-8 max-w-2xl">
            JelqAI is a revolutionary cryptocurrency built on the Solana
            blockchain, designed to empower users with fast, secure, and
            efficient transactions.
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/learn">Learn More</Link>
            </Button>
          </div>
          <div className="mt-4">
            <button
              onClick={() => signIn()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign In
            </button>
          </div>
        </>
      )}
    </div>
  );
}
