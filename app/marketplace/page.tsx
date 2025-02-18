import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const products = [
  { id: 1, name: "MTUCoin Starter Pack", description: "Get started with 100 MTU", price: 15 },
  { id: 2, name: "MTUCoin Pro Pack", description: "Boost your portfolio with 500 MTU", price: 70 },
  { id: 3, name: "MTUCoin Hardware Wallet", description: "Secure storage for your MTU", price: 50 },
]

export default function Marketplace() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${product.price}</p>
            </CardContent>
            <CardFooter>
              <Button>Buy Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

