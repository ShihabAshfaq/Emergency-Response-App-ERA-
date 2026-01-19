"use client"

import Link from "next/link"
import { ShieldAlert, Activity, CheckCircle, Heart, MapPin, Users, ArrowRight, ShieldCheck, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">



      <main className="flex-1">

        {/* 1. Hero / First Impression */}
        <section className="relative px-4 py-20 md:py-32 text-center overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50 via-slate-50 to-slate-50" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto max-w-4xl"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-teal-100 text-teal-800 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span>Help, when it matters most</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-slate-900 mb-6 leading-tight">
              Connect with verified <br className="hidden sm:block" /> first aid responders.
            </h1>

            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Or get instant AI guidance for smaller incidents. <br />
              A calm, safe way to find support before emergency services arrive.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-8 rounded-full text-base bg-teal-700 hover:bg-teal-800 text-white shadow-lg shadow-teal-700/20 hover:shadow-teal-700/30 transition-all">
                  Get Started
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="ghost" size="lg" className="h-12 px-8 rounded-full text-base text-slate-600 hover:text-teal-700 hover:bg-teal-50">
                  How It Works <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Subtle Hero Visual */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-16 flex justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
            >
              {/* Abstract placeholder for "Location pins / People connecting" */}
              <div className="relative h-32 w-full max-w-lg bg-white/50 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center gap-12">
                  <MapPin className="h-8 w-8 text-teal-500 animate-bounce" style={{ animationDuration: '3s' }} />
                  <div className="h-px w-24 bg-gradient-to-r from-teal-500/50 to-transparent border-t border-dashed border-teal-300" />
                  <Users className="h-8 w-8 text-teal-600" />
                </div>
                <p className="mt-16 text-xs text-slate-400 font-medium">Connecting you to nearby help securely.</p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* 2. How It Works - Cards */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">How It Works</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Simple steps to get the help you need, quickly and calmly.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: MapPin,
                  title: "Request Help",
                  text: "Tell us what's happening and share your location securely."
                },
                {
                  icon: Users,
                  title: "Nearby Responders",
                  text: "Verified first aid responders nearby are alerted instantly."
                },
                {
                  icon: Heart,
                  title: "Immediate Support",
                  text: "Live tracking, chat, and step-by-step guidance until help arrives."
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center shadow-sm mb-6 text-teal-600">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. AI Assistance Highlight */}
        <section className="py-20 bg-teal-50 overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  AI ASSISTANT
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">
                  Instant guidance, <br className="hidden md:block" /> even before help arrives.
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Our AI provides clear first aid steps for minor incidents and guides you when to call emergency services. Only trustworthy medical data is used.
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <CheckCircle className="h-5 w-5 text-teal-600" /> 24/7 Availability
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <CheckCircle className="h-5 w-5 text-teal-600" /> Standardized Protocols
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md mx-auto relative z-10 border border-teal-100">
                  <div className="flex gap-4 mb-4">
                    <div className="bg-teal-100 h-10 w-10 rounded-full flex items-center justify-center">
                      <Activity className="h-5 w-5 text-teal-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">First Aid Assistant</p>
                      <p className="text-xs text-slate-500">Just now</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl rounded-tl-none mb-3">
                    <p className="text-sm text-slate-700">For a minor burn, cool the area under running water for 20 minutes. Do not use ice.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl rounded-tl-none">
                    <p className="text-sm text-slate-700">Would you like me to find a nearby responder to check it?</p>
                  </div>
                </div>
                {/* Decorative blobb/glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-teal-200/50 rounded-full blur-3xl -z-0" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. Trust & Safety */}
        <section id="safety" className="py-20 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Designed for safety</h2>
              <p className="text-slate-600">Your privacy and security are our top priority.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <Card
                icon={ShieldCheck}
                title="Verified Responders"
                text="Every responder verifies their identity and current first aid certification before joining."
              />
              <Card
                icon={Lock}
                title="Privacy-First"
                text="Your location is only shared when you request help and only with the responder who accepts."
              />
              <Card
                icon={MapPin}
                title="Australian Focus"
                text="Designed locally with Australian emergency protocols in mind."
              />
              <Card
                icon={ShieldAlert}
                title="Emergency Integration"
                text="We always prioritize 000. Our app is a supplemental layer of community support."
              />
            </div>
          </div>
        </section>

        {/* 5. Audience - Split Call to Action */}
        <section className="py-20 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start"
              >
                <div className="bg-teal-50 h-12 w-12 rounded-full flex items-center justify-center mb-6 text-teal-700 font-bold">U</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">For Everyone</h3>
                <p className="text-slate-600 mb-8 flex-1">Help is nearby, even before emergency services arrive. Be prepared for anything.</p>
                <Link href="/signup?role=user" className="w-full">
                  <Button variant="outline" className="w-full border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800">
                    Create Free Account
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start"
              >
                <div className="bg-orange-50 h-12 w-12 rounded-full flex items-center justify-center mb-6 text-orange-600 font-bold">R</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">For Responders</h3>
                <p className="text-slate-600 mb-8 flex-1">Use your skills responsibly. Get verified and help your local community.</p>
                <Link href="/signup?role=responder" className="w-full">
                  <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                    Become a Responder
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 6. Bottom CTA */}
        <section className="py-24 bg-teal-900 text-center text-white px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Be prepared. Be connected.</h2>
            <p className="text-teal-100 text-lg mb-10">Join the community of helpers and people who care.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="h-14 px-8 rounded-full text-lg bg-white text-teal-900 hover:bg-teal-50">
                  Create an Account
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-lg border-teal-700 text-teal-100 hover:bg-teal-800 hover:text-white">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>


      </main>
    </div>
  )
}

function Card({ icon: Icon, title, text }: { icon: any, title: string, text: string }) {
  return (
    <div className="flex gap-4 p-6 bg-slate-50 rounded-xl border border-slate-100">
      <div className="shrink-0">
        <Icon className="h-6 w-6 text-teal-600" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
