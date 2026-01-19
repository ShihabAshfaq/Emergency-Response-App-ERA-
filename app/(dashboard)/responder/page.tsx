"use client"

import { useState, useEffect } from "react"
import { useMockData } from "@/context/MockDataContext"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { MapPin, Navigation, Phone, MessageSquare, AlertCircle, Clock, Shield, CheckCircle, XCircle, ChevronRight, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Dynamic import for Map
const Map = dynamic(() => import("@/components/map"), {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-slate-100 animate-pulse rounded-xl" />
})

type ResponderStatus = 'available' | 'offline' | 'busy'
type IncidentSeverity = 'low' | 'medium' | 'high'

export default function ResponderPage() {
    const { requests, currentUser, acceptRequest, resolveRequest, users } = useMockData()
    const [status, setStatus] = useState<ResponderStatus>('offline')
    const [showResolution, setShowResolution] = useState(false)
    const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null)
    const [ignoredRequests, setIgnoredRequests] = useState<string[]>([])

    // Derived state
    const incomingRequest = requests.find(r =>
        r.status === 'pending' &&
        r.requesterId !== currentUser?.id &&
        !ignoredRequests.includes(r.id) &&
        status === 'available' // ONLY show if available
    )
    const myActiveCase = requests.find(r => r.status === 'accepted' && r.responderId === currentUser?.id)

    // Prepare display objects
    const requestUser = incomingRequest ? users.find(u => u.id === incomingRequest.requesterId) : null
    const request = incomingRequest ? {
        id: incomingRequest.id,
        userName: requestUser?.name || 'Unknown User',
        type: incomingRequest.type,
        severity: incomingRequest.severity,
        location: incomingRequest.location,
        distance: '0.8km',
        eta: '3-5 mins', // Range confidence
        timeSince: 'Just now'
    } : null

    const userData = myActiveCase ? users.find(u => u.id === myActiveCase.requesterId) : null
    const activeCase = myActiveCase ? {
        ...myActiveCase,
        user: userData?.name || 'Unknown User',
        eta: '3-5 mins', // Range confidence
        distance: '0.8km'
    } : null

    useEffect(() => {
        // Auto-busy if we have an active case
        if (activeCase && status !== 'busy') {
            setStatus('busy')
        }
    }, [activeCase])

    const handleAccept = () => {
        if (request && currentUser) {
            acceptRequest(request.id, currentUser.id)
            setStatus('busy')
        } else if (!currentUser) {
            alert("Error: You seem to be logged out. Please refresh the page or login again.")
        }
    }

    const handleDecline = () => {
        if (request) {
            setIgnoredRequests(prev => [...prev, request.id])
        }
    }

    const handleComplete = () => {
        setShowResolution(true)
        setSelectedOutcome(null) // Reset selection
    }

    const finalizeResolution = (emotionalStatus: string) => {
        if (activeCase && selectedOutcome) {
            resolveRequest(activeCase.id, selectedOutcome, emotionalStatus)
        }
        setShowResolution(false)
        setStatus(emotionalStatus === 'Offline' ? 'offline' : 'available')
    }

    // BLOCK UNVERIFIED RESPONDERS
    if (currentUser && currentUser.role === 'responder' && !currentUser.verified) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
                <Card className="w-full max-w-md border-amber-200 bg-amber-50 shadow-lg">
                    <CardHeader>
                        <div className="mx-auto h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                            <Shield className="h-8 w-8 text-amber-600" />
                        </div>
                        <CardTitle className="text-amber-900">Verification Pending</CardTitle>
                        <CardDescription className="text-amber-700">
                            Your responder account is currently under review.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-amber-800">
                            Admins must verify your certification before you can receive emergency requests.
                            Please contact an administrator or check back later.
                        </p>
                        <div className="bg-white p-3 rounded-lg border border-amber-100 text-xs text-slate-500 font-mono">
                            Status: Awaiting Approval
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-500">

            {/* 1. Top Section - Duty Status (Anchor) */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shadow-sm z-30 sticky top-16">
                <div className="container max-w-md md:max-w-6xl mx-auto flex items-center justify-between">
                    <div className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between flex-1 md:flex-none md:w-96 ${status === 'available' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900' :
                        status === 'busy' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900' :
                            'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        }`}>
                        <div className="flex items-center gap-3">
                            <div className={`h-3 w-3 rounded-full animate-pulse ${status === 'available' ? 'bg-green-500' :
                                status === 'busy' ? 'bg-blue-500' :
                                    'bg-slate-400'
                                }`} />
                            <div>
                                <h2 className="font-bold text-slate-900 dark:text-white leading-tight">
                                    {status === 'available' ? 'Available' :
                                        status === 'busy' ? 'On Active Case' : 'Off Duty'}
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    {status === 'available' ? 'Location sharing active' :
                                        status === 'busy' ? 'Tracking enabled' : 'Location hidden'}
                                </p>
                            </div>
                        </div>

                        {status !== 'busy' && (
                            <Switch
                                checked={status === 'available'}
                                onCheckedChange={(c) => setStatus(c ? 'available' : 'offline')}
                                className="data-[state=checked]:bg-green-600"
                            />
                        )}
                    </div>
                </div>
                {/* Session Warning */}
                <div className="container max-w-md md:max-w-6xl mx-auto">
                    {!currentUser && (
                        <div className="mt-2 bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm text-center font-bold animate-pulse">
                            ⚠️ You are currently logged out. Please refresh to restore session.
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 container max-w-md md:max-w-6xl mx-auto p-4 flex flex-col relative">

                {/* INCOMING REQUEST MODAL (High Priority) */}
                <AnimatePresence>
                    {request && !activeCase && (
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end md:items-center md:justify-center p-4 md:p-0"
                        >
                            <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden p-6 pb-8 space-y-6 border dark:border-slate-800">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-500 font-bold uppercase tracking-wider text-sm">
                                        <AlertCircle className="h-4 w-4 animate-pulse" />
                                        Incoming Request
                                    </div>
                                    <span className="text-xs font-mono text-slate-400">{request.timeSince} ago</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-500">
                                            <HeartPulse className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{request.type}</h3>
                                            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">{request.userName}</p>
                                            <p className="text-slate-500 dark:text-slate-400">{request.location} • {request.distance}</p>
                                        </div>
                                    </div>

                                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900">
                                        <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <AlertTitle className="text-blue-800 dark:text-blue-300">AI Triage Note</AlertTitle>
                                        <AlertDescription className="text-xs text-blue-600 dark:text-blue-400">
                                            User reports severity is <strong>{request.severity}</strong>. 000 has NOT been called yet.
                                        </AlertDescription>
                                    </Alert>
                                </div>

                                <div className="grid gap-3">
                                    <Button onClick={handleAccept} className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 dark:shadow-none text-white">
                                        Accept Request • {request.eta}
                                    </Button>
                                    <Button onClick={handleDecline} variant="ghost" className="w-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200">
                                        Decline (I'm unable to help)
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ACTIVE CASE VIEW */}
                {activeCase && !showResolution && (
                    <div className="space-y-4 flex-1 flex flex-col md:grid md:grid-cols-2 md:gap-8 md:space-y-0 h-full">
                        {/* Map Panel */}
                        <div className="h-64 md:h-[600px] bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 relative shadow-inner md:col-span-1">
                            <Map className="h-full w-full" />
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-sm flex items-center gap-2 text-slate-900 dark:text-slate-200">
                                <Navigation className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                {activeCase.eta} ETA
                            </div>
                        </div>

                        {/* User & Incident Info */}
                        <div className="flex flex-col gap-4 md:col-span-1 h-full">
                            <Card className="border-l-4 border-l-blue-500 shadow-sm flex-1 bg-white dark:bg-slate-900 dark:border-t-slate-800 dark:border-r-slate-800 dark:border-b-slate-800">
                                <CardContent className="p-4 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                                {activeCase.user} <span className="text-xs font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">User</span>
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{activeCase.location}</p>
                                        </div>
                                        <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                                            <User className="h-5 w-5" />
                                        </div>
                                    </div>

                                    {/* Comm Actions */}
                                    <div className="flex gap-2">
                                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100 dark:shadow-none">
                                            <Navigation className="h-4 w-4 mr-2" /> Navigate
                                        </Button>
                                        <Button variant="outline" className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                            <Phone className="h-4 w-4 mr-2" /> Call
                                        </Button>
                                        <Button variant="outline" size="icon" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                            <MessageSquare className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Quick Presets */}
                                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                        {["I'm on my way", "Stay on the line", "I'm here"].map(msg => (
                                            <button key={msg} className="text-nowrap px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 transition-colors">
                                                {msg}
                                            </button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Safety Footer */}
                            <div className="mt-auto grid grid-cols-2 gap-3 pb-safe">
                                <Button variant="destructive" className="w-full bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900">
                                    <Phone className="h-4 w-4 mr-2" /> Escalation (000)
                                </Button>
                                <Button variant="secondary" onClick={handleComplete} className="w-full bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 shadow-lg shadow-slate-200 dark:shadow-none">
                                    <CheckCircle className="h-4 w-4 mr-2" /> Complete Job
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* RESOLUTION FLOW */}
                {showResolution && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col justify-center space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <div className="h-20 w-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400 mb-4">
                                <CheckCircle className="h-10 w-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Initial Response Complete</h2>
                            <p className="text-slate-500 dark:text-slate-400">Great work. Take a moment to breathe.</p>
                        </div>

                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-base text-slate-900 dark:text-white">1. Incident Outcome</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-3">
                                <Button
                                    variant={selectedOutcome === "Resolved On-Site" ? "default" : "outline"}
                                    className={`justify-start h-12 ${selectedOutcome === "Resolved On-Site" ? "bg-slate-900 dark:bg-slate-700 text-white" : "text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"}`}
                                    onClick={() => setSelectedOutcome("Resolved On-Site")}
                                >
                                    <CheckCircle className={`h-4 w-4 mr-2 ${selectedOutcome === "Resolved On-Site" ? "text-white" : "text-green-500"}`} /> Resolved On-Site
                                </Button>
                                <Button
                                    variant={selectedOutcome === "Handed over to Ambulance" ? "default" : "outline"}
                                    className={`justify-start h-12 ${selectedOutcome === "Handed over to Ambulance" ? "bg-slate-900 dark:bg-slate-700 text-white" : "text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"}`}
                                    onClick={() => setSelectedOutcome("Handed over to Ambulance")}
                                >
                                    <Phone className={`h-4 w-4 mr-2 ${selectedOutcome === "Handed over to Ambulance" ? "text-white" : "text-red-500"}`} /> Handed over to Ambulance
                                </Button>
                                <Button
                                    variant={selectedOutcome === "User Unavailable / False Alarm" ? "default" : "outline"}
                                    className={`justify-start h-12 ${selectedOutcome === "User Unavailable / False Alarm" ? "bg-slate-900 dark:bg-slate-700 text-white" : "text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"}`}
                                    onClick={() => setSelectedOutcome("User Unavailable / False Alarm")}
                                >
                                    <XCircle className={`h-4 w-4 mr-2 ${selectedOutcome === "User Unavailable / False Alarm" ? "text-white" : "text-slate-400"}`} /> User Unavailable / False Alarm
                                </Button>
                            </CardContent>
                        </Card>

                        {selectedOutcome && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900 text-center"
                            >
                                <p className="text-blue-800 dark:text-blue-300 font-bold mb-1">2. Emotional Check-in</p>
                                <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">That was a high-stress situation. Are you okay to continue?</p>
                                <div className="flex gap-3 justify-center">
                                    <Button onClick={() => finalizeResolution("Ready")} size="sm" className="bg-blue-600 text-white">I'm Good</Button>
                                    <Button onClick={() => finalizeResolution("Offline")} size="sm" variant="outline" className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-white dark:bg-transparent">Go Offline</Button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* EMPTY/OFFLINE STATE */}
                {!status.includes('busy') && !request && !activeCase && !showResolution && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 p-8 opacity-50">
                        <div className="h-24 w-24 rounded-full border-4 border-slate-200 dark:border-slate-800 flex items-center justify-center mb-4">
                            <MapPin className="h-10 w-10" />
                        </div>
                        <p className="font-medium text-slate-900 dark:text-white">
                            {status === 'available' ? 'Scanning for incidents...' : 'You are currently offline'}
                        </p>
                        <p className="text-sm mt-2 max-w-xs mx-auto">
                            {status === 'available' ? 'Stay ready. You will be alerted when someone nearby needs help.' : 'Go online to start receiving request alerts from the community.'}
                        </p>

                        {/* Demo Helper Text */}
                        <p className="absolute bottom-4 text-[10px] text-slate-300 dark:text-slate-600 uppercase tracking-widest w-full text-center">
                            DEV MODE: Wait 3s after going online for demo request
                        </p>
                    </div>
                )}

            </main>
        </div>
    )
}

function HeartPulse(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
        </svg>
    )
}
