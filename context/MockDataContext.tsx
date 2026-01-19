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
    outcome?: string
    emotionalStatus?: string
}

// ... (skipping unchanged parts)



export interface AdminLog {
    id: string
    adminId: string
    adminName: string
    action: string
    details: string
    targetId?: string
    timestamp: number
}

interface MockDataContextType {
    users: User[]
    currentUser: User | null
    requests: Request[]
    adminLogs: AdminLog[]
    signup: (user: Omit<User, 'id'>) => Promise<boolean>
    login: (email: string, password: string) => Promise<User | null>
    logout: () => void
    verifyResponder: (id: string) => void
    deleteUser: (id: string) => void
    createRequest: (type: string, location: string, severity: string) => void
    acceptRequest: (requestId: string, responderId: string) => void
    resolveRequest: (requestId: string, outcome?: string, emotionalStatus?: string) => void
    updateRequest: (requestId: string, updates: Partial<Request>) => void
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
    const [adminLogs, setAdminLogs] = useState<AdminLog[]>([])

    // Load initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, requestsRes, logsRes] = await Promise.all([
                    fetch('/api/mock/users'),
                    fetch('/api/mock/requests'),
                    fetch('/api/mock/admin/logs')
                ])
                if (usersRes.ok) setUsers(await usersRes.json())
                if (requestsRes.ok) setRequests(await requestsRes.json())
                if (logsRes.ok) setAdminLogs(await logsRes.json())
            } catch (err) {
                console.error("Failed to load mock data", err)
            }
        }
        fetchData()

        // Session Persistence (Tab specific - keep using sessionStorage)
        const sessionUser = sessionStorage.getItem('mock_session_user')
        if (sessionUser) setCurrentUser(JSON.parse(sessionUser))
    }, [])

    useEffect(() => {
        if (currentUser) {
            sessionStorage.setItem('mock_session_user', JSON.stringify(currentUser))
        } else {
            sessionStorage.removeItem('mock_session_user')
        }
    }, [currentUser])

    // Polling from API (Simulate real-time updates from other users)
    useEffect(() => {
        const pollInterval = setInterval(async () => {
            try {
                // Poll Requests
                const requestsRes = await fetch('/api/mock/requests')
                if (requestsRes.ok) {
                    const latestRequests = await requestsRes.json()
                    setRequests(prev => {
                        if (JSON.stringify(prev) !== JSON.stringify(latestRequests)) {
                            return latestRequests
                        }
                        return prev
                    })
                }

                // Poll Users
                const usersRes = await fetch('/api/mock/users')
                if (usersRes.ok) {
                    const latestUsers = await usersRes.json()
                    setUsers(prev => {
                        if (JSON.stringify(prev) !== JSON.stringify(latestUsers)) {
                            return latestUsers
                        }
                        return prev
                    })
                }

                // Poll Logs
                const logsRes = await fetch('/api/mock/admin/logs')
                if (logsRes.ok) {
                    const latestLogs = await logsRes.json()
                    setAdminLogs(prev => {
                        if (JSON.stringify(prev) !== JSON.stringify(latestLogs)) {
                            return latestLogs
                        }
                        return prev
                    })
                }
            } catch (err) {
                // Ignore polling errors
            }
        }, 1000)

        return () => clearInterval(pollInterval)
    }, [])

    // Auto-update currentUser when users list changes (e.g. verified status update)
    useEffect(() => {
        if (currentUser) {
            const freshUser = users.find(u => u.id === currentUser.id)
            if (freshUser) {
                if (JSON.stringify(freshUser) !== JSON.stringify(currentUser)) {
                    setCurrentUser(freshUser)
                }
            } else {
                // User was deleted!
                if (currentUser.role !== 'admin') {
                    logout()
                    alert("Your account has been removed by an administrator.")
                }
            }
        }
    }, [users])

    // HELPER: API Services
    const updateUsers = async (newUsers: User[]) => {
        setUsers(newUsers) // Optimistic update
        await fetch('/api/mock/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUsers)
        })
    }

    const updateRequests = async (newRequests: Request[]) => {
        setRequests(newRequests) // Optimistic update
        await fetch('/api/mock/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRequests)
        })
    }

    const logAdminAction = async (action: string, details: string, targetId?: string) => {
        if (!currentUser) return
        const newLog = {
            id: Math.random().toString(36).substr(2, 9),
            adminId: currentUser.id,
            adminName: currentUser.name,
            action,
            details,
            targetId,
            timestamp: Date.now()
        }
        setAdminLogs(prev => [newLog, ...prev])
        await fetch('/api/mock/admin/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newLog)
        })
    }

    const signup = async (userData: Omit<User, 'id'>) => {
        const newUser = { ...userData, id: Math.random().toString(36).substr(2, 9) }
        const newUsers = [...users, newUser]
        await updateUsers(newUsers)
        // Auto login after signup
        setCurrentUser(newUser)
        return true
    }

    const login = async (email: string, password: string) => {
        // Fetch fresh data for login to ensure we have latest users
        try {
            const res = await fetch('/api/mock/users')
            if (res.ok) {
                const freshUsers = await res.json() as User[]
                const user = freshUsers.find(u => u.email === email && u.password === password)
                if (user) {
                    setCurrentUser(user)
                    setUsers(freshUsers) // Sync state while we're at it
                    return user
                }
            }
        } catch (e) {
            console.error("Login fetch error", e)
        }
        return null
    }

    const logout = () => setCurrentUser(null)

    const verifyResponder = async (id: string) => {
        const targetUser = users.find(u => u.id === id)
        const newUsers = users.map(u => u.id === id ? { ...u, verified: true } : u)
        await updateUsers(newUsers)
        if (targetUser) {
            await logAdminAction('VERIFY', `Verified responder: ${targetUser.name}`, id)
        }
    }

    const deleteUser = async (id: string) => {
        const targetUser = users.find(u => u.id === id)

        // Log FIRST before deleting, to ensure we have the user data
        if (targetUser) {
            await logAdminAction('DELETE', `Deleted user: ${targetUser.name} (${targetUser.role})`, id)
        }

        const newUsers = users.filter(u => u.id !== id)
        await updateUsers(newUsers)
    }

    const createRequest = async (type: string, location: string, severity: string) => {
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
        await updateRequests([...requests, newRequest])
    }

    const acceptRequest = async (requestId: string, responderId: string) => {
        const newRequests = requests.map(r => r.id === requestId ? { ...r, status: 'accepted' as const, responderId } : r)
        await updateRequests(newRequests)
    }

    const updateRequest = async (requestId: string, updates: Partial<Request>) => {
        const newRequests = requests.map(r => r.id === requestId ? { ...r, ...updates } : r)
        await updateRequests(newRequests)
    }

    const resolveRequest = async (requestId: string, outcome?: string, emotionalStatus?: string) => {
        const newRequests = requests.map(r => r.id === requestId ? { ...r, status: 'resolved' as const, outcome, emotionalStatus } : r)
        await updateRequests(newRequests)
    }

    return (
        <MockDataContext.Provider value={{
            users,
            currentUser,
            requests,
            adminLogs,
            signup,
            login,
            logout,
            verifyResponder,
            deleteUser,
            createRequest,
            acceptRequest,
            resolveRequest,
            updateRequest
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
