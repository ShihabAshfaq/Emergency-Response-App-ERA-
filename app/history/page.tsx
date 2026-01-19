"use client"

import { useMockData } from "@/context/MockDataContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, AlertTriangle, User, Calendar } from "lucide-react"

export default function HistoryPage() {
    const { currentUser, requests, users } = useMockData()

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-slate-500">Please log in to view your history.</p>
            </div>
        )
    }

    // Filter requests based on role
    const history = requests.filter(req => {
        if (currentUser.role === 'user') {
            return req.requesterId === currentUser.id
        }
        if (currentUser.role === 'responder') {
            return req.responderId === currentUser.id
        }
        return false // Admins view history in Admin Dashboard users tab (or could be added here too)
    }).sort((a, b) => b.timestamp - a.timestamp)

    const getResponderName = (id?: string) => {
        if (!id) return "Pending"
        return users.find(u => u.id === id)?.name || "Unknown Responder"
    }

    const getRequesterName = (id: string) => {
        return users.find(u => u.id === id)?.name || "Unknown Requester"
    }

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4 dark:text-slate-200">
            <h1 className="text-3xl font-bold mb-2 dark:text-white">History</h1>
            <p className="text-slate-500 mb-8 dark:text-slate-400">
                {currentUser.role === 'responder'
                    ? "Past emergencies you have responded to."
                    : "Your past requests for assistance."}
            </p>

            <div className="space-y-4">
                {history.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
                        <Clock className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400">No history found.</p>
                    </div>
                )}

                {history.map(req => (
                    <Card key={req.id} className="overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                        <div className={`h-2 w-full ${req.status === 'resolved' ? 'bg-slate-500 dark:bg-slate-600' :
                            req.status === 'accepted' ? 'bg-green-500 dark:bg-green-600' :
                                'bg-yellow-500 dark:bg-yellow-600'
                            }`} />
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge variant="outline" className="mb-2 uppercase tracking-wide text-xs dark:border-slate-700 dark:text-slate-300">
                                        {req.type}
                                    </Badge>
                                    <CardTitle className="text-lg dark:text-white">
                                        {currentUser.role === 'responder'
                                            ? `Assisted ${getRequesterName(req.requesterId)}`
                                            : `Request at ${req.location}`
                                        }
                                    </CardTitle>
                                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {new Date(req.timestamp).toLocaleDateString()} at {new Date(req.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                                <Badge className={
                                    req.status === 'resolved' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700' :
                                        req.status === 'accepted' ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50' :
                                            'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50'
                                }>
                                    {req.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-4 text-sm mt-2">
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500 mt-0.5" />
                                        <span className="text-slate-700 dark:text-slate-300">{req.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                        <span className="capitalize text-slate-700 dark:text-slate-300">Severity: {req.severity}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {currentUser.role === 'user' && (
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                            <span className="text-slate-700 dark:text-slate-300">Responder: <span className="font-medium dark:text-white">{getResponderName(req.responderId)}</span></span>
                                        </div>
                                    )}
                                    {currentUser.role === 'responder' && (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                                <span className="text-slate-700 dark:text-slate-300">Requester ID: <span className="font-mono text-xs dark:text-slate-400">{req.requesterId}</span></span>
                                            </div>
                                            {req.outcome && (
                                                <div className="text-sm mt-2 border-t dark:border-slate-800 pt-2">
                                                    <p className="text-slate-600 dark:text-slate-400 font-medium">Outcome: <span className="text-slate-800 dark:text-white">{req.outcome}</span></p>
                                                    {req.emotionalStatus && <p className="text-slate-500 dark:text-slate-500 text-xs">Responder Status: {req.emotionalStatus}</p>}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
