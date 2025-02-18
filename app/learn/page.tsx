import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const articles = [
  { id: 1, title: "Introduction to MTUCoin", description: "Learn the basics of MTUCoin and how it works." },
  {
    id: 2,
    title: "How to Set Up Your MTUCoin Wallet",
    description: "A step-by-step guide to setting up your MTUCoin wallet.",
  },
  { id: 3, title: "MTUCoin Mining: A Beginner's Guide", description: "Understand the process of mining MTUCoin." },
]

export default function Learn() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Learn About MTUCoin</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
              <CardDescription>{article.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href={`/learn/${article.id}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

