import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Balance</CardTitle>
            <CardDescription>Your current MTUCoin balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,000 MTU</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Send MTUCoin</CardTitle>
            <CardDescription>Transfer MTUCoin to another user</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Send MTU</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Market Price</CardTitle>
            <CardDescription>Current MTUCoin market price</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$0.15 USD</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

