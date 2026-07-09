"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Map as MapIcon } from "lucide-react";
import type { GateMetric } from "@stadiummind/shared";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

interface StadiumMapProps {
  stadiumName: string;
  coordinates: { lat: number; lng: number };
  gates: GateMetric[];
}

// Component to update map center when stadium changes using useMap hook
function MapController({ center, zoom = 16 }: { center: [number, number]; zoom?: number }) {
  const [useMapHook, setUseMapHook] = useState<any>(null);

  useEffect(() => {
    import("react-leaflet").then((mod) => {
      setUseMapHook(() => mod.useMap);
    });
  }, []);

  if (!useMapHook) return null;

  const MapEffect = () => {
    const map = useMapHook();
    
    useEffect(() => {
      if (map) {
        map.flyTo(center, zoom, {
          duration: 1.5,
          easeLinearity: 0.5
        });
      }
    }, [center, zoom, map]);

    return null;
  };

  return <MapEffect />;
}

export function StadiumMap({ stadiumName, coordinates, gates }: StadiumMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const center: [number, number] = [coordinates.lat, coordinates.lng];

  // Generate gate locations around the stadium based on real gate data
  const gateLocations = gates.map((gate, index) => {
    // Distribute gates in a circle around the stadium
    const angle = (index / gates.length) * 2 * Math.PI;
    const radius = 0.001; // ~111 meters
    const lat = coordinates.lat + radius * Math.cos(angle);
    const lng = coordinates.lng + radius * Math.sin(angle);

    return {
      id: gate.id,
      lat,
      lng,
      name: gate.name,
      risk: gate.riskScore,
      occupancy: gate.occupancy,
      queueMinutes: gate.queueMinutes,
      color: gate.riskScore > 75 ? "#ef4444" : gate.riskScore > 55 ? "#f59e0b" : "#22c55e"
    };
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-border bg-muted/40">
        <div className="text-center">
          <MapIcon className="mx-auto text-muted-foreground animate-pulse" size={48} />
          <p className="mt-3 text-sm font-semibold">Loading Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-border shadow-inner relative z-0">
      <MapContainer
        center={center}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={center} zoom={16} />

        {/* Stadium center marker */}
        <CircleMarker
          center={center}
          radius={8}
          pathOptions={{
            fillColor: "#3b82f6",
            fillOpacity: 0.8,
            color: "#ffffff",
            weight: 2
          }}
        >
          <Popup>
            <div className="font-semibold">{stadiumName}</div>
            <div className="text-sm text-muted-foreground">FIFA World Cup 2026</div>
          </Popup>
        </CircleMarker>

        {/* Gate markers with risk-based colors */}
        {gateLocations.map((gate) => (
          <CircleMarker
            key={gate.id}
            center={[gate.lat, gate.lng]}
            radius={10}
            pathOptions={{
              fillColor: gate.color,
              fillOpacity: 0.8,
              color: "#ffffff",
              weight: 2
            }}
          >
            <Popup>
              <div className="font-semibold">{gate.name}</div>
              <div className="text-sm">
                <div>Risk: {gate.risk}%</div>
                <div>Occupancy: {gate.occupancy}%</div>
                <div>Queue: {gate.queueMinutes} min</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Heat circles around high-risk gates */}
        {gateLocations
          .filter((gate) => gate.risk > 50)
          .map((gate) => (
            <Circle
              key={`heat-${gate.id}`}
              center={[gate.lat, gate.lng]}
              radius={50}
              pathOptions={{
                fillColor: gate.risk > 75 ? "#ef4444" : "#f59e0b",
                fillOpacity: 0.2,
                color: gate.risk > 75 ? "#ef4444" : "#f59e0b",
                weight: 1
              }}
            />
          ))}
      </MapContainer>
    </div>
  );
}
