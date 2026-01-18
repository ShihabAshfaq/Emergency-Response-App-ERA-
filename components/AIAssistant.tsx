"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, CheckCircle, Shield, Phone, ChevronRight, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type TriageState = 'START' | 'CHECK_CONSCIOUS' | 'CHECK_BREATHING' | 'CHECK_BLEEDING' | 'ADVICE_CPR' | 'ADVICE_BLEEDING' | 'ADVICE_BURN' | 'ADVICE_WAIT' | 'EMERGENCY_INTERRUPT'

export function AIAssistant() {
    const [step, setStep] = useState<TriageState>('START')
    const [history, setHistory] = useState<TriageState[]>([])

    const goTo = (nextStep: TriageState) => {
        setHistory(prev => [...prev, step])
        setStep(nextStep)
    }

    const goBack = () => {
        if (history.length === 0) return
        const prevStep = history[history.length - 1]
        setHistory(prev => prev.slice(0, -1))
        setStep(prevStep)
    }

    const restart = () => {
        setHistory([])
        setStep('START')
    }

    // Render Logic
    const renderContent = () => {
        switch (step) {
            case 'START':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">What seems to be the main issue?</h3>
                            <p className="text-slate-500 text-sm">Select the best match.</p>
                        </div>
                        <div className="grid gap-3">
                            <OptionButton label="Unconscious / Not responding" onClick={() => goTo('CHECK_CONSCIOUS')} />
                            <OptionButton label="Heavy Bleeding" onClick={() => goTo('ADVICE_BLEEDING')} />
                            <OptionButton label="Burn or Scald" onClick={() => goTo('ADVICE_BURN')} />
                            <OptionButton label="Chest Pain / Heart Issue" onClick={() => goTo('EMERGENCY_INTERRUPT')} />
                            <OptionButton label="Something else / Not Sure" onClick={() => goTo('CHECK_CONSCIOUS')} />
                        </div>
                    </div>
                )

            case 'CHECK_CONSCIOUS':
                return (
                    <QuestionScreen
                        question="Is the person responding to you?"
                        subtext="Tap their shoulder and ask 'Can you hear me?' loudly."
                        onYes={() => goTo('CHECK_BREATHING')}
                        onNo={() => goTo('EMERGENCY_INTERRUPT')}
                        onNotSure={() => goTo('CHECK_BREATHING')}
                    />
                )

            case 'CHECK_BREATHING':
                return (
                    <QuestionScreen
                        question="Are they breathing normally?"
                        subtext="Look for their chest rising and falling regularly."
                        onYes={() => goTo('ADVICE_WAIT')}
                        onNo={() => goTo('ADVICE_CPR')}
                        onNotSure={() => goTo('ADVICE_CPR')} // Safer to assume CPR needed if unsure
                    />
                )

            case 'ADVICE_CPR':
                return (
                    <AdviceScreen
                        title="Start CPR Immediately"
                        steps={[
                            "Call 000 immediately (Speaker mode).",
                            "Place heel of hand on center of chest.",
                            "Push hard and fast (2 pushes per second).",
                            "Use body weight. Don't stop until help arrives."
                        ]}
                        emergency={true}
                    />
                )

            case 'EMERGENCY_INTERRUPT':
                return (
                    <EmergencyScreen />
                )

            case 'ADVICE_BLEEDING':
                return (
                    <AdviceScreen
                        title="Control the Bleeding"
                        steps={[
                            "Apply firm direct pressure with a clean cloth.",
                            "Keep pressure on constantly.",
                            "Elevate the injury above heart level if possible.",
                            "If blood soaks through, add another layer (do not remove)."
                        ]}
                    />
                )

            case 'ADVICE_BURN':
                return (
                    <AdviceScreen
                        title="Treating a Burn"
                        steps={[
                            "Cool under cool running water for 20 minutes.",
                            "Remove jewelry near the burn before it swells.",
                            "Do not use ice, creams, or butter.",
                            "Cover loosely with cling wrap or clean cloth."
                        ]}
                    />
                )

            case 'ADVICE_WAIT':
                return (
                    <AdviceScreen
                        title="Monitor and Wait"
                        steps={[
                            "Keep them comfortable and warm.",
                            "Do not give them food or drink.",
                            "Stay with them and keep talking.",
                            "If their condition changes, call 000."
                        ]}
                    />
                )
        }
    }

    return (
        <div className="flex flex-col h-full max-h-[80vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-50 to-white border-b border-teal-100 p-4 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center border border-teal-200 shadow-sm">
                        <Shield className="h-5 w-5 text-teal-700" />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900 leading-tight">First Aid Assistant</h2>
                        <p className="text-xs text-teal-700 font-medium">Calm guidance • Verified Protocols</p>
                    </div>
                </div>
                {step !== 'START' && step !== 'EMERGENCY_INTERRUPT' && (
                    <Button variant="ghost" size="icon" onClick={restart} className="text-slate-400 hover:text-slate-600">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white safe-bottom">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

// Sub-components

function OptionButton({ label, onClick }: { label: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-teal-300 transition-all font-semibold text-slate-700 flex items-center justify-between group shadow-sm"
        >
            {label}
            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-teal-500" />
        </button>
    )
}

function QuestionScreen({ question, subtext, onYes, onNo, onNotSure }: { question: string, subtext?: string, onYes: () => void, onNo: () => void, onNotSure: () => void }) {
    return (
        <div className="flex flex-col h-full justify-center space-y-8">
            <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold text-slate-900">{question}</h3>
                {subtext && <p className="text-slate-500 text-lg leading-relaxed">{subtext}</p>}
            </div>
            <div className="grid gap-3 max-w-sm mx-auto w-full">
                <Button onClick={onYes} className="h-14 text-lg bg-teal-600 hover:bg-teal-700 text-white rounded-full">Yes</Button>
                <Button onClick={onNo} variant="outline" className="h-14 text-lg border-teal-200 text-teal-800 hover:bg-teal-50 rounded-full">No</Button>
                <Button onClick={onNotSure} variant="ghost" className="text-slate-500 hover:text-slate-700">Not Sure</Button>
            </div>
        </div>
    )
}

function EmergencyScreen() {
    return (
        <div className="h-full flex flex-col justify-center items-center text-center space-y-6">
            <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-red-700">This requires emergency help.</h3>
                <p className="text-slate-600 max-w-xs mx-auto">Based on your answers, you should call 000 immediately.</p>
            </div>
            <Button className="w-full max-w-sm h-16 text-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-200 rounded-xl flex items-center justify-center gap-3">
                <Phone className="h-6 w-6" /> Call 000 Now
            </Button>
            <p className="text-xs text-slate-400">Cannot be dismissed for safety reasons.</p>
        </div>
    )
}

function AdviceScreen({ title, steps, emergency = false }: { title: string, steps: string[], emergency?: boolean }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-full ${emergency ? 'bg-red-100' : 'bg-green-100'}`}>
                    <CheckCircle className={`h-6 w-6 ${emergency ? 'text-red-600' : 'text-green-600'}`} />
                </div>
                <h3 className={`text-xl font-bold ${emergency ? 'text-red-700' : 'text-slate-800'}`}>{title}</h3>
            </div>

            <Card className={`border ${emergency ? 'border-red-100 bg-red-50' : 'border-slate-100 bg-slate-50'}`}>
                <CardContent className="p-5 space-y-4">
                    {steps.map((step, i) => (
                        <div key={i} className="flex gap-4 items-start">
                            <span className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-sm font-bold ${emergency ? 'bg-red-200 text-red-800' : 'bg-white text-teal-700 border border-teal-200'}`}>
                                {i + 1}
                            </span>
                            <p className="text-slate-700 font-medium leading-relaxed">{step}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {emergency && (
                <Button className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-xl">
                    <Phone className="h-5 w-5 mr-2" /> Call 000
                </Button>
            )}
        </div>
    )
}
