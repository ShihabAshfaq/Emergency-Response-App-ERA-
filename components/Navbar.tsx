"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShieldAlert, Menu, CircleUser, LogOut, LayoutDashboard, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMockData } from "@/context/MockDataContext"
import { useState, useEffect } from "react"

export function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const { currentUser, logout } = useMockData()
    const [isScrolled, setIsScrolled] = useState(false)

    // Handle scroll effect for transparency
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    const isDashboard = pathname?.startsWith("/requester") || pathname?.startsWith("/responder") || pathname?.startsWith("/admin")

    // Determine dashboard home link based on role
    const dashboardLink = currentUser?.role === 'responder' ? '/responder' :
        currentUser?.role === 'admin' ? '/admin' : '/requester'

    return (
        <header
            className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${isScrolled || isDashboard ? "bg-white/80 backdrop-blur-md border-slate-200" : "bg-transparent border-transparent"
                }`}
        >
            <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold text-teal-700 text-lg">
                        <ShieldAlert className="h-6 w-6" />
                        <span>Emergency Response & Aid</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
                        {isDashboard ? (
                            <>
                                <Link href={dashboardLink} className={`hover:text-teal-700 transition-colors ${pathname === dashboardLink ? 'text-teal-700 font-bold' : ''}`}>
                                    Dashboard
                                </Link>
                                <Link href="/history" className={`hover:text-teal-700 transition-colors ${pathname === '/history' ? 'text-teal-700 font-bold' : ''}`}>
                                    History
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/#how-it-works" className="hover:text-teal-700 transition-colors">How It Works</Link>
                                <Link href="/#safety" className="hover:text-teal-700 transition-colors">Safety</Link>
                                {!currentUser && (
                                    <Link href="/signup?role=responder" className="hover:text-teal-700 transition-colors">Become a Responder</Link>
                                )}
                            </>
                        )}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {/* User Auth State */}
                    {currentUser ? (
                        <div className="flex items-center gap-4">
                            {!isDashboard && (
                                <Link href={dashboardLink}>
                                    <Button variant="ghost" size="sm" className="hidden sm:flex" >
                                        <LayoutDashboard className="h-4 w-4 mr-2" />
                                        Go to Dashboard
                                    </Button>
                                </Link>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size="icon" className="rounded-full h-9 w-9 border border-slate-200">
                                        <CircleUser className="h-5 w-5" />
                                        <span className="sr-only">Toggle user menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push(dashboardLink)}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <span>Dashboard</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/history')}>
                                        <History className="mr-2 h-4 w-4" />
                                        <span>History</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-sm font-medium hover:text-teal-700 text-slate-600 hidden sm:block">Login</Link>
                            <Link href="/signup">
                                <Button className="bg-teal-700 hover:bg-teal-800 text-white rounded-full px-4 sm:px-6">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden text-slate-600">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <nav className="flex flex-col gap-4 mt-6">
                                {isDashboard ? (
                                    <>
                                        <Link href={dashboardLink} className="text-lg font-medium hover:text-teal-700">
                                            Dashboard
                                        </Link>
                                        <Link href="/history" className="text-lg font-medium hover:text-teal-700">
                                            History
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/#how-it-works" className="text-lg font-medium hover:text-teal-700">How It Works</Link>
                                        <Link href="/#safety" className="text-lg font-medium hover:text-teal-700">Safety</Link>
                                        <Link href="/signup?role=responder" className="text-lg font-medium hover:text-teal-700">Become a Responder</Link>
                                    </>
                                )}
                                <div className="border-t pt-4 mt-2">
                                    {currentUser ? (
                                        <Button variant="ghost" className="w-full justify-start text-red-600 p-0 hover:text-red-700 hover:bg-transparent" onClick={handleLogout}>
                                            <LogOut className="h-5 w-5 mr-2" />
                                            Log out
                                        </Button>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <Link href="/login">
                                                <Button variant="outline" className="w-full justify-center">Login</Button>
                                            </Link>
                                            <Link href="/signup">
                                                <Button className="w-full justify-center bg-teal-700">Get Started</Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
