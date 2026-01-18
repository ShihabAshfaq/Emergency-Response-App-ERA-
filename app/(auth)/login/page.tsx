"use client"

import { useState } from "react"
import Link from "next/link"
import { useMockData } from "@/context/MockDataContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useMockData()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const user = await login(email, password)

    if (!user) {
      setError("Invalid email or password")
      return
    }

    if (user.role === 'admin') {
      router.push("/admin")
    } else if (user.role === 'responder') {
      router.push("/responder")
    } else {
      router.push("/requester")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans">
      <Card className="w-full max-w-md border-slate-200 shadow-xl shadow-slate-200/50">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="mx-auto h-12 w-12 bg-teal-100 rounded-xl flex items-center justify-center mb-2">
            <div className="h-6 w-6 bg-teal-600 rounded-full" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Welcome Back</CardTitle>
          <CardDescription className="text-slate-500">Sign in to First Response</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <Link href="#" className="text-xs text-teal-600 hover:text-teal-700 font-medium">Forgot password?</Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
              />
            </div>
            <Button type="submit" className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-lg shadow-teal-100">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-100 p-6 bg-slate-50/50 rounded-b-xl">
          <p className="text-sm text-slate-500">
            Don't have an account? <Link href="/signup" className="text-teal-600 hover:underline font-semibold">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
