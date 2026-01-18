"use client"

import { useState, useEffect } from "react"
import { useMockData } from "@/context/MockDataContext"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, MessageSquare, Phone, MapPin, Activity, Flame, HeartPulse, HelpCircle, X, ShieldCheck, PhoneCall } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AIAssistant } from "@/components/AIAssistant"

// Dynamic import for Map to avoid SSR, only loaded when needed
const Map = dynamic(() => import("@/components/map"), {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-slate-100 animate-pulse rounded-xl" />
})

type PageState = 'idle' | 'searching' | 'responder_found' | 'resolved'

export default function RequesterPage() {
    const [status, setStatus] = useState<PageState>('idle')
    const [incidentType, setIncidentType] = useState<string | null>('Medical')
    const { createRequest, requests, currentUser, users, signup } = useMockData()
    const [guestName, setGuestName] = useState("")



    // Find active request for this user
    const myRequest = requests.find(r => r.requesterId === currentUser?.id && r.status !== 'resolved')

    // Watch for status changes
    useEffect(() => {
        if (!myRequest) {
            setStatus('idle')
            return
        }

        if (myRequest.status === 'pending') {
            setStatus('searching')
        } else if (myRequest.status === 'accepted') {
            setStatus('responder_found')
        }
    }, [myRequest])

    const handleRequestHelp = () => {
        createRequest(incidentType || 'General', 'Doncaster East', 'High')
        setStatus('searching')
    }

    const assignedResponder = myRequest?.responderId ? users.find(u => u.id === myRequest.responderId) : null
    const responder = assignedResponder ? {
        name: assignedResponder.name,
        verified: assignedResponder.verified,
        distance: '0.8km',
        eta: '2 mins'
    } : null

    const handleCancel = () => {
        setStatus('idle')
        setIncidentType(null)
    }

    const handleResolve = () => {
        setStatus('resolved')
    }

    if (!currentUser) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-sm shadow-lg border-teal-100">
                    <CardHeader className="bg-teal-50 border-b border-teal-100 rounded-t-xl">
                        <CardTitle className="text-teal-900">Welcome to First Aid</CardTitle>
                        <CardDescription>Enter your name to request help immediately.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <Input
                            placeholder="Your Name (e.g. John)"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="text-lg py-6"
                        />
                        <Button
                            className="w-full bg-teal-600 hover:bg-teal-700 h-12 text-lg font-bold"
                            onClick={() => signup({ name: guestName, email: `guest-${Date.now()}@example.com`, password: '123', role: 'user' })}
                            disabled={!guestName.trim()}
                        >
                            Start
                        </Button>
                        <p className="text-xs text-center text-slate-400">
                            Dev Mode: Auto-creates a guest account.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col relative overflow-hidden">

            {/* 1. Top Section - Context & Reassurance */}
            <div className="bg-white border-b border-slate-100 p-4 shadow-sm z-20">
                <div className="container max-w-md mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700">
                        <MapPin className="h-5 w-5 text-teal-600" />
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Current Location</p>
                            <p className="font-semibold text-slate-900">Doncaster East, VIC</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${status === 'idle' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                        <span className="text-xs font-medium text-slate-600">
                            {status === 'idle' ? 'Ready' : 'Active'}
                        </span>
                    </div>
                </div>
            </div>

            <main className="flex-1 container max-w-md mx-auto p-4 flex flex-col relative z-10">

                <AnimatePresence mode="wait">

                    {/* IDLE STATE */}
                    {status === 'idle' && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex-1 flex flex-col justify-center gap-8"
                        >
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold text-slate-900">Need First Aid?</h2>
                                <p className="text-slate-600">Tap below to alert nearby responders.</p>
                            </div>

                            {/* Primary Action */}
                            <div className="relative flex justify-center py-8">
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-teal-100 rounded-full blur-xl opacity-50"
                                />
                                <Button
                                    onClick={handleRequestHelp}
                                    className="relative h-48 w-48 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-xl shadow-teal-200 border-4 border-teal-100 flex flex-col items-center justify-center gap-2"
                                >
                                    <Activity className="h-10 w-10" />
                                    <span className="text-xl font-bold">REQUEST HELP</span>
                                </Button>
                            </div>

                            {/* AI Preview */}
                            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-teal-50 p-3 border-b border-teal-100 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-teal-800 font-medium">
                                        <MessageSquare className="h-4 w-4" />
                                        AI Guidance Preview
                                    </div>
                                    <span className="text-xs text-teal-600 bg-white px-2 py-0.5 rounded-full border border-teal-100">24/7</span>
                                </div>
                                <div className="p-4 space-y-3">
                                    <p className="text-sm text-slate-600">Not an emergency yet? Ask our AI assistant for advice.</p>
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="outline" size="sm" className="w-full border-teal-200 text-teal-700 hover:bg-teal-50">
                                                Open First Aid Chat
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="bottom" className="h-[85vh] rounded-t-xl p-0 overflow-hidden">
                                            <SheetHeader className="sr-only">
                                                <SheetTitle>AI First Aid Assistant</SheetTitle>
                                            </SheetHeader>
                                            <AIAssistant />
                                        </SheetContent>
                                    </Sheet>
                                </div>
                            </Card>

                            {/* Emergency Shortcut */}
                            <div className="mt-auto pt-4">
                                <Button variant="destructive" className="w-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 py-6 h-auto flex flex-col gap-1">
                                    <span className="flex items-center gap-2 font-bold text-lg"><Phone className="h-5 w-5" /> Call 000</span>
                                    <span className="text-xs font-normal opacity-80">For life-threatening emergencies only</span>
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* SEARCHING STATE */}
                    {status === 'searching' && (
                        <motion.div
                            key="searching"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col gap-6"
                        >
                            {/* Pulse Animation Card */}
                            <Card className="bg-slate-900 text-white border-0 shadow-xl overflow-hidden relative">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-900/50 to-slate-900 z-0" />
                                <CardContent className="p-8 flex flex-col items-center text-center relative z-10 min-h-[200px] justify-center">
                                    <div className="relative">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-20 animate-ping"></span>
                                        <div className="relative inline-flex rounded-full h-16 w-16 bg-teal-500/20 items-center justify-center border border-teal-500/50">
                                            <Activity className="h-8 w-8 text-teal-400" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mt-6 mb-2">Looking for nearby responders...</h3>
                                    <p className="text-slate-400 text-sm">We have alerted 3 certified responders in your area.</p>
                                </CardContent>
                            </Card>

                            {/* Incident Type Selector */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-slate-700 ml-1">What happened? (Optional)</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { icon: HeartPulse, label: 'Chest Pain' },
                                        { icon: Flame, label: 'Burns' },
                                        { icon: AlertTriangle, label: 'Injury/Cut' },
                                        { icon: HelpCircle, label: 'Not Sure' }
                                    ].map((type) => (
                                        <button
                                            key={type.label}
                                            onClick={() => setIncidentType(type.label)}
                                            className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${incidentType === type.label
                                                ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500'
                                                : 'bg-white border-slate-200 hover:border-teal-200'
                                                }`}
                                        >
                                            <div className={`p-2 rounded-full ${incidentType === type.label ? 'bg-teal-200 text-teal-800' : 'bg-slate-100 text-slate-600'}`}>
                                                <type.icon className="h-5 w-5" />
                                            </div>
                                            <span className={`font-medium ${incidentType === type.label ? 'text-teal-900' : 'text-slate-700'}`}>
                                                {type.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto">
                                <Button variant="outline" onClick={handleCancel} className="w-full text-slate-500 hover:text-slate-700">
                                    Cancel Request
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* RESPONDER FOUND STATE */}
                    {status === 'responder_found' && responder && (
                        <motion.div
                            key="found"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-1 flex flex-col gap-4 h-full"
                        >
                            {/* Map takes up more space here */}
                            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-64 relative z-0">
                                <Map className="h-full w-full" />
                                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg border border-slate-100 shadow-sm text-xs font-medium flex justify-between z-[400]">
                                    <span>Your Location</span>
                                    <span className="text-teal-600">Responder Location</span>
                                </div>
                            </div>

                            {/* Responder Info */}
                            <Card className="bg-white border-teal-100 shadow-md">
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4">
                                            <div className="h-14 w-14 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xl font-bold border-2 border-white shadow-sm">
                                                {responder.name[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                                    {responder.name}
                                                    {responder.verified && <ShieldCheck className="h-4 w-4 text-teal-500" />}
                                                </h3>
                                                <p className="text-sm text-slate-500">Certified First Aider</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                                        <Activity className="h-3 w-3" /> On the way
                                                    </span>
                                                    <span className="text-xs text-slate-400">• {responder.distance} away</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">ETA</p>
                                            <p className="text-2xl font-bold text-teal-600">{responder.eta}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-teal-100">
                                            <MessageSquare className="h-4 w-4 mr-2" /> Chat
                                        </Button>
                                        <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                                            <PhoneCall className="h-4 w-4 mr-2" /> Call
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Escalation / Safety */}
                            <Alert variant="destructive" className="bg-red-50 border-red-100">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Emergency Escalation</AlertTitle>
                                <AlertDescription className="text-xs">
                                    If the situation worsens, do not wait. <span className="underline font-bold pointer cursor-pointer">Call 000 immediately.</span>
                                </AlertDescription>
                            </Alert>

                            <Button variant="ghost" size="sm" onClick={handleResolve} className="mt-auto text-slate-400 hover:text-slate-600">
                                End Mock Scenario
                            </Button>
                        </motion.div>
                    )}

                    {/* RESOLVED STATE */}
                    {status === 'resolved' && (
                        <motion.div
                            key="resolved"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col items-center justify-center text-center p-8"
                        >
                            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                                <ShieldCheck className="h-10 w-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Help Completed</h2>
                            <p className="text-slate-600 mb-8 max-w-xs">The incident has been marked as resolved. We hope everyone is safe.</p>

                            <Button onClick={handleCancel} className="w-full max-w-xs bg-slate-900 text-white">
                                Return Home
                            </Button>
                        </motion.div>
                    )}

                </AnimatePresence>

            </main>
        </div>
    )
}
