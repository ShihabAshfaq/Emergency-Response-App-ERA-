import Link from "next/link"
import { ShieldAlert } from "lucide-react"

export function Footer() {
    return (
        <footer className="w-full border-t border-slate-800 bg-slate-950 py-12 text-slate-400 text-sm">
            <div className="container max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand Column */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 font-bold text-slate-100 text-lg">
                        <ShieldAlert className="h-6 w-6" />
                        <span>ER&A</span>
                    </div>
                    <p className="max-w-xs text-slate-400">
                        Connecting communities with rapid first aid response. Every second save lives.
                    </p>
                </div>

                {/* Links Column 1 */}
                <div className="space-y-3">
                    <h4 className="font-bold text-slate-200">Platform</h4>
                    <Link href="/signup?role=responder" className="block hover:text-white transition-colors">Become a Responder</Link>
                    <Link href="/#how-it-works" className="block hover:text-white transition-colors">How It Works</Link>
                    <Link href="/history" className="block hover:text-white transition-colors">My Activity</Link>
                </div>

                {/* Links Column 2 */}
                <div className="space-y-3">
                    <h4 className="font-bold text-slate-200">Safety & Legal</h4>
                    <Link href="/#safety" className="block hover:text-white transition-colors">Safety Guidelines</Link>
                    <Link href="#" className="block hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="#" className="block hover:text-white transition-colors">Terms of Service</Link>
                </div>

                {/* Emergency Column */}
                <div className="space-y-3">
                    <h4 className="font-bold text-red-500">Emergency</h4>
                    <p>For life-threatening emergencies, always call:</p>
                    <p className="text-3xl font-black text-white">000</p>
                </div>
            </div>

            <div className="container max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p>&copy; {new Date().getFullYear()} Emergency Response & Aid. All rights reserved.</p>
                <div className="flex gap-4">
                    <span className="text-xs bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-500">v1.2.0 (Mock Mode)</span>
                </div>
            </div>
        </footer>
    )
}
