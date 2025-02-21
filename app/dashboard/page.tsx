'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTypedSession } from '@/hooks/use-typed-session'; // Import your custom hook
import { signIn } from "next-auth/react"; // Import signIn from next-auth/react
import axios from "axios";
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useTypedSession(); // Use the custom hook for typed session
  const [balance, setBalance] = useState<number | null>(null);
  const [hasWallet, setHasWallet] = useState(false);

  useEffect(() => {
    const fetchWalletInfo = async () => {
      if (session?.user?.id) {
        try {
          const response = await axios.get(`/api/wallet?userId=${session.user.id}`);
          console.log("API Response:", response.data); // Log the full response
          if (response.data) {
            console.log("Balance:", response.data.balance); // Log the balance field
            setBalance(response.data.balance);
            setHasWallet(true);
          } else {
            setBalance(null);
            setHasWallet(false);
          }
        } catch (error) {
          console.error("Error fetching wallet info:", error); // Log any errors
          setBalance(null);
          setHasWallet(false);
        }
      }
    };

    if (session) {
      fetchWalletInfo();
    }
  }, [session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Balance</CardTitle>
            <CardDescription>Your current JelqAI token balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{balance !== null ? `${balance} JelqAI` : "No wallet linked"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Send JelqAI Tokens</CardTitle>
            <CardDescription>Transfer JelqAI tokens to another user</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Send JelqAI</Button>
          </CardContent>
        </Card>
        {hasWallet && (
          <Card>
            <CardHeader>
              <CardTitle>Access Wallet</CardTitle>
              <CardDescription>Access your existing wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/access-wallet">Access Wallet</Link>
              </Button>
            </CardContent>
          </Card>
        )}
        {!hasWallet && (
          <Card>
            <CardHeader>
              <CardTitle>Create Wallet</CardTitle>
              <CardDescription>Create a new wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/create-wallet">Create Wallet</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
