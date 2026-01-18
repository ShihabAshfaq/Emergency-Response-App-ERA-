"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default marker icons in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png"
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

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

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center">Loading Map...</div>
    }

    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className={`h-full w-full ${className}`}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((marker, i) => (
                <Marker key={i} position={marker.position}>
                    <Popup>
                        {marker.title}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
