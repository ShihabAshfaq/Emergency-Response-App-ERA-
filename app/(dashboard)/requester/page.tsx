"use client"

import { useState, useEffect } from "react"
import { useMockData } from "@/context/MockDataContext"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, MessageSquare, Phone, MapPin, Activity, Flame, HeartPulse, HelpCircle, X, ShieldCheck, PhoneCall, CheckCircle } from "lucide-react"
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
    const { createRequest, updateRequest, requests, currentUser, users, signup } = useMockData()
    const [guestName, setGuestName] = useState("")
    const [trustedContact, setTrustedContact] = useState("")
    const [showNotifyToast, setShowNotifyToast] = useState(false)



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
        createRequest(incidentType || 'Medical', 'Doncaster East', 'High')
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
                        <CardTitle className="text-teal-900">Welcome to Emergency & Aid</CardTitle>
                        <CardDescription>Enter your details to request help immediately.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Your Name</label>
                            <Input
                                placeholder="e.g. John Doe"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                className="text-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase flex justify-between">
                                Trusted Contact <span className="text-teal-600 font-normal normal-case">(Optional: Auto-SMS)</span>
                            </label>
                            <Input
                                placeholder="Mobile Number"
                                value={trustedContact}
                                onChange={(e) => setTrustedContact(e.target.value)}
                                className="text-lg"
                            />
                        </div>
                        <Button
                            className="w-full bg-teal-600 hover:bg-teal-700 h-12 text-lg font-bold mt-2"
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
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col relative overflow-hidden transition-colors duration-1000 ease-in-out">

            {/* Auto-Notify Toast */}
            <AnimatePresence>
                {showNotifyToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-4 left-4 right-4 z-[100] bg-green-900/90 backdrop-blur text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3"
                    >
                        <div className="bg-green-500 rounded-full p-1"><CheckCircle className="h-4 w-4 text-white" /></div>
                        <div>
                            <p className="font-bold text-sm">Emergency Contact Notified</p>
                            <p className="text-xs opacity-90">SMS sent to {trustedContact}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 1. Top Section - Context & Reassurance */}
            <div className={`border-b p-4 shadow-sm z-20 transition-colors duration-1000 ${status === 'searching' ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-100'}`}>
                <div className="container max-w-md md:max-w-6xl mx-auto flex items-center justify-between">
                    <div className={`flex items-center gap-2 ${status === 'searching' ? 'text-slate-400' : 'text-slate-700'}`}>
                        <MapPin className={`h-5 w-5 ${status === 'searching' ? 'text-teal-500' : 'text-teal-600'}`} />
                        <div>
                            <p className="text-xs font-medium opacity-70 uppercase tracking-wider">Current Location</p>
                            <p className={`font-semibold ${status === 'searching' ? 'text-slate-200' : 'text-slate-900'}`}>Doncaster East, VIC</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${status === 'idle' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                        <span className={`text-xs font-medium ${status === 'searching' ? 'text-slate-400' : 'text-slate-600'}`}>
                            {status === 'idle' ? 'Ready' : 'Active'}
                        </span>
                    </div>
                </div>
            </div>

            <main className={`flex-1 container max-w-md md:max-w-6xl mx-auto p-4 flex flex-col relative z-10 transition-colors duration-1000 ${status === 'searching' ? 'bg-slate-950' : ''}`}>

                <AnimatePresence mode="wait">

                    {/* IDLE STATE */}
                    {status === 'idle' && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex-1 flex flex-col justify-center gap-8 md:max-w-md md:mx-auto w-full"
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

                    {/* SEARCHING STATE - "STAY CALM" MODE */}
                    {status === 'searching' && (
                        <motion.div
                            key="searching"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col gap-8 py-8 md:grid md:grid-cols-2 md:items-center md:justify-items-center w-full"
                        >
                            {/* Pulse Animation Card - Calmer */}
                            <div className="flex flex-col items-center justify-center text-center space-y-8 w-full">
                                <div className="relative">
                                    <motion.div
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} // Slower duration for calm
                                        className="absolute inset-0 bg-teal-500 rounded-full blur-2xl"
                                    />
                                    <div className="relative z-10 h-32 w-32 rounded-full border-4 border-teal-500/30 flex items-center justify-center bg-slate-900 shadow-2xl">
                                        <Activity className="h-12 w-12 text-teal-400" />
                                    </div>
                                </div>

                                <div className="space-y-4 max-w-xs mx-auto">
                                    <h3 className="text-2xl font-light text-white tracking-wide">Help is being notified</h3>
                                    <motion.p
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="text-teal-400 font-medium text-lg"
                                    >
                                        Take a slow, deep breath...
                                    </motion.p>
                                    <p className="text-slate-500 text-sm">We are connecting you with certified responders in Doncaster East.</p>
                                </div>
                            </div>

                            {/* Smart Templates */}
                            <div className="space-y-4 z-20 w-full max-w-md">
                                <h4 className="font-medium text-slate-400 text-center text-sm uppercase tracking-widest">Optional: Tap to speed up response</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { icon: HeartPulse, label: 'Chest Pain', sub: 'Crushing feeling' },
                                        { icon: Flame, label: 'Burns', sub: 'Fire or Chemical' },
                                        { icon: AlertTriangle, label: 'Bleeding', sub: 'Deep cut/wound' },
                                        { icon: HelpCircle, label: 'Breathing', sub: 'Shortness of breath' }
                                    ].map((type) => (
                                        <button
                                            key={type.label}
                                            onClick={() => {
                                                setIncidentType(type.label)
                                                if (myRequest) {
                                                    updateRequest(myRequest.id, { type: type.label })
                                                }
                                            }}
                                            className={`p-4 rounded-xl border text-left transition-all group relative overflow-hidden ${incidentType === type.label
                                                ? 'bg-teal-900/40 border-teal-500/50 ring-1 ring-teal-500/50'
                                                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3 relative z-10">
                                                <div className={`p-2 rounded-lg ${incidentType === type.label ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'}`}>
                                                    <type.icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <span className={`block font-medium ${incidentType === type.label ? 'text-teal-400' : 'text-slate-300'}`}>
                                                        {type.label}
                                                    </span>
                                                    <span className="text-xs text-slate-500 block mt-0.5">{type.sub}</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-8">
                                    <Button variant="ghost" onClick={handleCancel} className="w-full text-slate-600 hover:text-slate-400 hover:bg-white/5">
                                        Cancel Request
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* RESPONDER FOUND STATE */}
                    {status === 'responder_found' && (
                        !responder ? (
                            <div className="flex-1 flex flex-col items-center justify-center space-y-4 animate-pulse">
                                <Activity className="h-12 w-12 text-teal-500" />
                                <p className="text-slate-500 font-medium">Connecting to responder...</p>
                            </div>
                        ) : (
                            <motion.div
                                key="found"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex-1 flex flex-col md:grid md:grid-cols-2 md:gap-8 h-full"
                            >
                                {/* Map takes up more space here */}
                                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-64 md:h-[600px] relative z-0">
                                    <Map className="h-full w-full" />
                                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg border border-slate-100 shadow-sm text-xs font-medium flex justify-between z-[400]">
                                        <span>Your Location</span>
                                        <span className="text-teal-600">Responder Location</span>
                                    </div>
                                </div>

                                {/* Responder Info */}
                                <div className="flex flex-col gap-4">
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
                                </div>
                            </motion.div>
                        )
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
