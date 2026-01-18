"use client"

import { useState } from "react"
import Link from "next/link"
import { useMockData } from "@/context/MockDataContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function SignupPage() {
    const router = useRouter()
    const { signup } = useMockData()
    const [role, setRole] = useState<'user' | 'responder'>('user')
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        await signup({ name, email, password, role, verified: false })

        if (role === 'responder') {
            router.push("/responder")
        } else {
            router.push("/requester")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans">
            <Card className="w-full max-w-md border-slate-200 shadow-xl shadow-slate-200/50">
                <CardHeader className="text-center space-y-2 pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900">Create Account</CardTitle>
                    <CardDescription className="text-slate-500">Join the First Response community</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                            <button
                                type="button"
                                className={`py-2.5 text-sm font-medium rounded-lg transition-all ${role === 'user'
                                    ? 'bg-white shadow-sm text-teal-700 ring-1 ring-black/5'
                                    : 'text-slate-500 hover:text-slate-900'
                                    }`}
                                onClick={() => setRole('user')}
                            >
                                I need help
                            </button>
                            <button
                                type="button"
                                className={`py-2.5 text-sm font-medium rounded-lg transition-all ${role === 'responder'
                                    ? 'bg-white shadow-sm text-teal-700 ring-1 ring-black/5'
                                    : 'text-slate-500 hover:text-slate-900'
                                    }`}
                                onClick={() => setRole('responder')}
                            >
                                I am a Responder
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    required
                                    className="h-11 border-slate-200"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    className="h-11 border-slate-200"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-700">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    className="h-11 border-slate-200"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {role === 'responder' && (
                            <div className="p-3 bg-teal-50 border border-teal-100 text-teal-800 text-sm rounded-lg flex items-start gap-2">
                                <span className="text-lg">🛡️</span>
                                <span className="leading-snug">You will need to upload your valid first-aid certification after signing up.</span>
                            </div>
                        )}

                        <Button type="submit" className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-lg shadow-teal-100 mt-2">
                            Create {role === 'responder' ? 'Responder' : 'User'} Account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-slate-100 p-6 bg-slate-50/50 rounded-b-xl">
                    <p className="text-sm text-slate-500">
                        Already have an account? <Link href="/login" className="text-teal-600 hover:underline font-semibold">Sign in</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
