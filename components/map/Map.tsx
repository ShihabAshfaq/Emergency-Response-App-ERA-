"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useTheme } from "next-themes"

interface MapProps {
    center?: [number, number]
    zoom?: number
    markers?: Array<{
        position: [number, number]
        title: string
    }>
    className?: string
}

export default function Map({ center = [-33.8688, 151.2093], zoom = 13, markers = [], className }: MapProps) {
    // Sydney default
    const [mounted, setMounted] = useState(false)
    const { resolvedTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="h-full w-full bg-gray-100 dark:bg-slate-800 animate-pulse flex items-center justify-center dark:text-slate-400">Loading Map...</div>
    }

    const isDark = resolvedTheme === 'dark'

    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className={`h-full w-full ${className} z-0`}>
            <TileLayer
                attribution={isDark
                    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }
                url={isDark
                    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                }
            />
            {markers.map((marker, i) => (
                <Marker key={i} position={marker.position}>
                    <Popup className="text-slate-900">
                        {marker.title}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
