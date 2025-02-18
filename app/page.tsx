import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to MTUCoin</h1>
      <p className="text-xl mb-8 max-w-2xl">
        MTUCoin is a revolutionary cryptocurrency built on the Solana blockchain, designed to empower users with fast,
        secure, and efficient transactions.
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/dashboard">Get Started</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/learn">Learn More</Link>
        </Button>
      </div>
    </div>
  )
}

