"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

export function TwoFactorAuth() {
  const [code, setCode] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically verify the 2FA code
    console.log("Verifying 2FA code:", code)
    alert("2FA code submitted")
    setCode("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>Enter the code from your authenticator app</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="code">Authentication Code</Label>
            <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} required maxLength={6} />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit}>Verify</Button>
      </CardFooter>
    </Card>
  )
}

