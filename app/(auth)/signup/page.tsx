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
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 font-sans transition-colors duration-500">
            <Card className="w-full max-w-md border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 bg-white dark:bg-slate-900">
                <CardHeader className="text-center space-y-2 pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">Join the Emergency Response & Aid community</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            <button
                                type="button"
                                className={`py-2.5 text-sm font-medium rounded-lg transition-all ${role === 'user'
                                    ? 'bg-white dark:bg-slate-950 shadow-sm text-teal-700 dark:text-teal-400 ring-1 ring-black/5 dark:ring-white/10'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                                onClick={() => setRole('user')}
                            >
                                I need help
                            </button>
                            <button
                                type="button"
                                className={`py-2.5 text-sm font-medium rounded-lg transition-all ${role === 'responder'
                                    ? 'bg-white dark:bg-slate-950 shadow-sm text-teal-700 dark:text-teal-400 ring-1 ring-black/5 dark:ring-white/10'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                                onClick={() => setRole('responder')}
                            >
                                I am a Responder
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    required
                                    className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {role === 'responder' && (
                            <div className="p-3 bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-sm rounded-lg flex items-start gap-2">
                                <span className="text-lg">🛡️</span>
                                <span className="leading-snug">You will need to upload your valid first-aid certification after signing up.</span>
                            </div>
                        )}

                        <Button type="submit" className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-lg shadow-teal-100 dark:shadow-none mt-2">
                            Create {role === 'responder' ? 'Responder' : 'User'} Account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-xl">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Already have an account? <Link href="/login" className="text-teal-600 dark:text-teal-400 hover:underline font-semibold">Sign in</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
