import { useEffect, useState, useRef, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  Circle,
} from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import {
  Star,
  Navigation,
  Plus,
  Minus,
  Crosshair,
  MapPin,
  Utensils,
  Hotel,
  Sparkles,
  ShoppingBag,
  Shield,
  Layers,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculatePriorityScore } from '@/services/ai-engine';
import { useAppStore } from '@/store/app-store';
import type { Place, GeoPoint } from '@/types/travel';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const typeColors: Record<string, string> = {
  attraction: '#1e3a5f',
  restaurant: '#c8a348',
  hotel: '#3b82f6',
  shop: '#8b5cf6',
  emergency: '#ef4444',
};

function createCustomIcon(type: string, score?: number) {
  const color = typeColors[type] || '#1e3a5f';
  const size = score && score > 75 ? 38 : 30;
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      background: ${color};
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 700; color: white;
      cursor: pointer; transition: transform 0.2s;
    ">${score ?? '•'}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function LocationTracker({ onLocationFound }: { onLocationFound: (pos: GeoPoint) => void }) {
  const map = useMap();

  useMapEvents({
    locationfound: (e) => {
      onLocationFound({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  useEffect(() => {
    map.locate({ setView: false, maxZoom: 14 });
    const interval = setInterval(() => {
      map.locate({ setView: false, maxZoom: 14 });
    }, 30000);
    return () => clearInterval(interval);
  }, [map]);

  return null;
}

function MapControls({ onRecenter }: { onRecenter: () => void }) {
  const map = useMap();

  return (
    <div className="absolute bottom-6 right-4 flex flex-col gap-1.5 z-[1000]">
      <button
        onClick={() => map.zoomIn()}
        className="h-9 w-9 rounded-lg bg-white shadow-md border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-50 transition-all"
      >
        <Plus className="h-4 w-4" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="h-9 w-9 rounded-lg bg-white shadow-md border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-50 transition-all"
      >
        <Minus className="h-4 w-4" />
      </button>
      <div className="h-px bg-neutral-200 my-0.5" />
      <button
        onClick={onRecenter}
        className="h-9 w-9 rounded-lg bg-white shadow-md border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-50 transition-all"
      >
        <Crosshair className="h-4 w-4" />
      </button>
    </div>
  );
}

interface LiveMapProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place | null) => void;
  showFilters?: boolean;
}

export function LiveMap({ places, selectedPlace, onSelectPlace, showFilters = true }: LiveMapProps) {
  const { situation } = useAppStore();
  const [userLocation, setUserLocation] = useState<GeoPoint | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const mapRef = useRef<L.Map | null>(null);

  const placesWithScores = places.map((p) => ({
    ...p,
    priorityScore: calculatePriorityScore(p, situation),
  }));

  const filteredPlaces = activeFilter === 'all'
    ? placesWithScores
    : placesWithScores.filter((p) => p.type === activeFilter);

  const center: [number, number] = situation.destination === 'Hyderabad'
    ? [17.385, 78.4867]
    : userLocation
    ? [userLocation.lat, userLocation.lng]
    : [20.5937, 78.9629]; // India center

  const handleRecenter = useCallback(() => {
    if (userLocation) {
      mapRef.current?.setView([userLocation.lat, userLocation.lng], 14);
    } else {
      mapRef.current?.setView(center, 12);
    }
  }, [userLocation, center]);

  const filters = [
    { id: 'all', label: 'All', icon: <Layers className="h-3 w-3" /> },
    { id: 'attraction', label: 'Places', icon: <Sparkles className="h-3 w-3" /> },
    { id: 'restaurant', label: 'Food', icon: <Utensils className="h-3 w-3" /> },
    { id: 'hotel', label: 'Hotels', icon: <Hotel className="h-3 w-3" /> },
    { id: 'shop', label: 'Shopping', icon: <ShoppingBag className="h-3 w-3" /> },
    { id: 'emergency', label: 'Safety', icon: <Shield className="h-3 w-3" /> },
  ];

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={12}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
        ref={(map) => { if (map) mapRef.current = map; }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        />

        <LocationTracker onLocationFound={setUserLocation} />
        <MapControls onRecenter={handleRecenter} />

        {/* User location circle */}
        {userLocation && (
          <>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={150}
              pathOptions={{
                fillColor: '#3b82f6',
                fillOpacity: 0.15,
                color: '#3b82f6',
                weight: 1,
              }}
            />
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={L.divIcon({
                className: 'user-marker',
                html: `<div style="
                  width: 18px; height: 18px;
                  border-radius: 50%;
                  background: #3b82f6;
                  border: 3px solid white;
                  box-shadow: 0 0 12px rgba(59,130,246,0.5);
                "></div>`,
                iconSize: [18, 18],
                iconAnchor: [9, 9],
              })}
            >
              <Popup>
                <div className="text-xs font-semibold text-[#1e3a5f]">
                  📍 You are here
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Place markers */}
        {filteredPlaces.map((place) => (
          <Marker
            key={place.id}
            position={[place.coordinates.lat, place.coordinates.lng]}
            icon={createCustomIcon(place.type, place.priorityScore)}
            eventHandlers={{
              click: () => onSelectPlace(place),
            }}
          >
            <Popup>
              <div className="min-w-[180px]">
                <p className="font-semibold text-[#1e3a5f] text-sm">{place.name}</p>
                <p className="text-xs text-neutral-500 mt-0.5 capitalize">{place.type}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="flex items-center gap-0.5 text-xs text-[#c8a348] font-semibold">
                    <Star className="h-3 w-3" fill="currentColor" />
                    {place.rating}
                  </span>
                  {place.priorityScore !== undefined && (
                    <span className="text-[10px] bg-[#1e3a5f] text-white px-1.5 py-0.5 rounded font-bold">
                      Score: {place.priorityScore}
                    </span>
                  )}
                </div>
                {place.price > 0 && (
                  <p className="text-xs text-neutral-600 mt-1">₹{place.price}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Filter bar */}
      {showFilters && (
        <div className="absolute top-4 left-4 right-16 flex gap-1.5 overflow-x-auto z-[1000] scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                'flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium transition-all border shadow-sm shrink-0',
                activeFilter === f.id
                  ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                  : 'bg-white/95 text-neutral-600 border-neutral-200 hover:border-[#c8a348]/40'
              )}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Location indicator */}
      {userLocation && (
        <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm border border-neutral-200 rounded-lg px-3 py-1.5 shadow-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-medium text-neutral-600">Live Location</span>
          </div>
        </div>
      )}
    </div>
  );
}
