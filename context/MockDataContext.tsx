"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'user' | 'responder' | 'admin'

export interface User {
    id: string
    name: string
    email: string
    password: string // Insecure for mock only
    role: UserRole
    verified?: boolean // For responders
}

export interface Request {
    id: string
    requesterId: string
    responderId?: string
    status: 'pending' | 'accepted' | 'resolved'
    type: string
    location: string
    severity: string
    timestamp: number
}

interface MockDataContextType {
    users: User[]
    currentUser: User | null
    requests: Request[]
    signup: (user: Omit<User, 'id'>) => Promise<boolean>
    login: (email: string, password: string) => Promise<User | null>
    logout: () => void
    verifyResponder: (id: string) => void
    createRequest: (type: string, location: string, severity: string) => void
    acceptRequest: (requestId: string, responderId: string) => void
    resolveRequest: (requestId: string) => void
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined)

// Default Admin User
const DEFAULT_ADMIN: User = {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin'
}

export function MockDataProvider({ children }: { children: React.ReactNode }) {
    const [users, setUsers] = useState<User[]>([DEFAULT_ADMIN])
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [requests, setRequests] = useState<Request[]>([])

    // Load initial data
    useEffect(() => {
        const storedUsers = localStorage.getItem('mock_users')
        if (storedUsers) setUsers(JSON.parse(storedUsers))
        else localStorage.setItem('mock_users', JSON.stringify([DEFAULT_ADMIN]))

        const storedRequests = localStorage.getItem('mock_requests')
        if (storedRequests) setRequests(JSON.parse(storedRequests))

        // Session Persistence (Tab specific)
        const sessionUser = sessionStorage.getItem('mock_session_user')
        if (sessionUser) setCurrentUser(JSON.parse(sessionUser))
    }, [])

    // Sync state changes to localStorage
    useEffect(() => {
        localStorage.setItem('mock_users', JSON.stringify(users))
    }, [users])

    useEffect(() => {
        localStorage.setItem('mock_requests', JSON.stringify(requests))
    }, [requests])

    useEffect(() => {
        if (currentUser) {
            sessionStorage.setItem('mock_session_user', JSON.stringify(currentUser))
        } else {
            sessionStorage.removeItem('mock_session_user')
        }
    }, [currentUser])

    // Listen for changes from OTHER tabs + Polling
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'mock_users' && e.newValue) {
                setUsers(JSON.parse(e.newValue))
            }
            if (e.key === 'mock_requests' && e.newValue) {
                setRequests(JSON.parse(e.newValue))
            }
        }

        const pollInterval = setInterval(() => {
            const storedRequests = localStorage.getItem('mock_requests')
            if (storedRequests) {
                const parsed = JSON.parse(storedRequests)
                setRequests(prev => {
                    if (JSON.stringify(prev) !== storedRequests) {
                        return parsed
                    }
                    return prev
                })
            }

            // Also poll users to catch verification updates
            const storedUsers = localStorage.getItem('mock_users')
            if (storedUsers) {
                const parsedUsers = JSON.parse(storedUsers)
                setUsers(prev => {
                    if (JSON.stringify(prev) !== storedUsers) {
                        return parsedUsers
                    }
                    return prev
                })
            }
        }, 1000)

        window.addEventListener('storage', handleStorageChange)
        return () => {
            window.removeEventListener('storage', handleStorageChange)
            clearInterval(pollInterval)
        }
    }, [])

    // Auto-update currentUser when users list changes (e.g. verified status update)
    useEffect(() => {
        if (currentUser) {
            const freshUser = users.find(u => u.id === currentUser.id)
            if (freshUser && JSON.stringify(freshUser) !== JSON.stringify(currentUser)) {
                setCurrentUser(freshUser)
            }
        }
    }, [users])

    const signup = async (userData: Omit<User, 'id'>) => {
        const newUser = { ...userData, id: Math.random().toString(36).substr(2, 9) }
        setUsers(prev => [...prev, newUser])
        // Auto login after signup
        setCurrentUser(newUser)
        return true
    }

    const login = async (email: string, password: string) => {
        const user = users.find(u => u.email === email && u.password === password)
        if (user) {
            setCurrentUser(user)
            return user
        }
        return null
    }

    const logout = () => setCurrentUser(null)

    const verifyResponder = (id: string) => {
        setUsers(users.map(u => u.id === id ? { ...u, verified: true } : u))
    }

    const createRequest = (type: string, location: string, severity: string) => {
        if (!currentUser) {
            console.error("Attempted to create request without active user session")
            alert("Error: You must be logged in to request help. Please refresh or login again.")
            return
        }
        const newRequest: Request = {
            id: Math.random().toString(36).substr(2, 9),
            requesterId: currentUser.id,
            status: 'pending',
            type,
            location,
            severity,
            timestamp: Date.now()
        }
        setRequests(prev => [...prev, newRequest])
    }

    const acceptRequest = (requestId: string, responderId: string) => {
        setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'accepted', responderId } : r))
    }

    const resolveRequest = (requestId: string) => {
        setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'resolved' } : r))
    }

    return (
        <MockDataContext.Provider value={{
            users,
            currentUser,
            requests,
            signup,
            login,
            logout,
            verifyResponder,
            createRequest,
            acceptRequest,
            resolveRequest
        }}>
            {children}
        </MockDataContext.Provider>
    )
}

export function useMockData() {
    const context = useContext(MockDataContext)
    if (context === undefined) {
        throw new Error('useMockData must be used within a MockDataProvider')
    }
    return context
}
