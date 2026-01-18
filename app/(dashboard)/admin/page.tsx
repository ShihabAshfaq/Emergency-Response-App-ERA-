"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, FileText, Clock } from "lucide-react"
import { useMockData } from "@/context/MockDataContext"

export default function AdminPage() {
    const { users, verifyResponder } = useMockData()
    const pendingVerifications = users.filter(u => u.role === 'responder' && !u.verified)

    const handleApprove = (id: string) => {
        verifyResponder(id)
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <Button>Export Data</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Responders</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.filter(u => u.role === 'responder').length}</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingVerifications.length}</div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4">Verification Queue</h2>
            <div className="grid gap-4">
                {pendingVerifications.length === 0 && (
                    <p className="text-gray-500">No pending verifications.</p>
                )}
                {pendingVerifications.map((user) => (
                    <Card key={user.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white">
                        <div className="flex gap-4 items-center mb-4 md:mb-0">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <div className="grid gap-1">
                                <h3 className="font-semibold">{user.name}</h3>
                                <p className="text-sm text-gray-500">{user.email} • ID: {user.id}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button variant="outline" size="sm" className="flex items-center gap-2 flex-1 md:flex-none">
                                <FileText className="h-4 w-4" /> View Cert
                            </Button>
                            <Button onClick={() => handleApprove(user.id)} size="sm" className="bg-green-600 hover:bg-green-700 flex items-center gap-2 flex-1 md:flex-none">
                                <CheckCircle className="h-4 w-4" /> Approve
                            </Button>
                            <Button size="sm" variant="destructive" className="flex items-center gap-2 flex-1 md:flex-none">
                                <XCircle className="h-4 w-4" /> Reject
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

