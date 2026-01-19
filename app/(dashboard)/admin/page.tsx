"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, FileText, Clock, ShieldAlert, User } from "lucide-react"
import { useMockData } from "@/context/MockDataContext"
import { useState } from "react"

export default function AdminPage() {
    const { users, verifyResponder, deleteUser, adminLogs } = useMockData()
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs'>('overview')
    const pendingVerifications = users.filter(u => u.role === 'responder' && !u.verified)

    const handleApprove = (id: string) => {
        verifyResponder(id)
    }

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            deleteUser(id)
        }
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-6">
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <div className="flex space-x-2">
                    <Button variant={activeTab === 'overview' ? 'default' : 'outline'} onClick={() => setActiveTab('overview')}>Overview</Button>
                    <Button variant={activeTab === 'users' ? 'default' : 'outline'} onClick={() => setActiveTab('users')}>All Users</Button>
                    <Button variant={activeTab === 'logs' ? 'default' : 'outline'} onClick={() => setActiveTab('logs')}>Audit Logs</Button>
                </div>
            </div>

            {activeTab === 'overview' && (
                <>
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
                            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                                <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                    <CheckCircle className="h-6 w-6 text-slate-400" />
                                </div>
                                <p className="text-slate-900 font-medium">No pending verifications</p>
                                <p className="text-sm text-slate-500">All responders are up to date.</p>
                            </div>
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
                                    <Button onClick={() => handleDelete(user.id)} size="sm" variant="destructive" className="flex items-center gap-2 flex-1 md:flex-none">
                                        <XCircle className="h-4 w-4" /> Reject/Delete
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            {activeTab === 'users' && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-7">
                        <CardHeader>
                            <CardTitle>All Users</CardTitle>
                            <CardDescription>Manage all registered users and responders.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {users.map(user => (
                                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                                                    user.role === 'responder' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-slate-200 text-slate-500'
                                                }`}>
                                                {user.role === 'admin' ? <ShieldAlert className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-slate-500 capitalize">{user.role}</p>
                                                <div className="flex gap-2 mt-1">
                                                    {user.role !== 'admin' && <Badge variant="outline">{user.role}</Badge>}
                                                    {user.verified && <Badge className="bg-green-600 hover:bg-green-700 text-white border-transparent">Verified</Badge>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-right text-sm text-slate-500 mr-4 hidden sm:block">
                                                {user.email}
                                            </div>
                                            {user.role !== 'admin' && (
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>Delete</Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === 'logs' && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-7">
                        <CardHeader>
                            <CardTitle>Audit Logs</CardTitle>
                            <CardDescription>History of administrative actions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {adminLogs.length === 0 ? (
                                    <p className="text-center text-slate-500 py-8">No actions logged yet.</p>
                                ) : (
                                    adminLogs.map(log => (
                                        <div key={log.id} className="flex items-start justify-between p-4 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{log.action}</p>
                                                <p className="text-sm text-slate-600">{log.details}</p>
                                                <p className="text-xs text-slate-400 mt-1">By: {log.adminName}</p>
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
