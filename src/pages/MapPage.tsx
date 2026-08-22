import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Map,
  Star,
  Filter,
  Navigation,
  Utensils,
  Hotel,
  Sparkles,
  ShoppingBag,
  Shield,
  MapPin,
  Layers,
  X,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { hyderabadPlaces, transportOptions, emergencyServices } from '@/data/mock';
import { calculatePriorityScore } from '@/services/ai-engine';
import { useAppStore } from '@/store/app-store';
import type { Place } from '@/types/travel';

const filters = [
  { id: 'all', label: 'All', icon: <Layers className="h-3 w-3" /> },
  { id: 'attraction', label: 'Attractions', icon: <Sparkles className="h-3 w-3" /> },
  { id: 'restaurant', label: 'Food', icon: <Utensils className="h-3 w-3" /> },
  { id: 'hotel', label: 'Hotels', icon: <Hotel className="h-3 w-3" /> },
  { id: 'shop', label: 'Shopping', icon: <ShoppingBag className="h-3 w-3" /> },
  { id: 'emergency', label: 'Safety', icon: <Shield className="h-3 w-3" /> },
];

export default function MapPage() {
  const { situation } = useAppStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const places = activeFilter === 'all'
    ? hyderabadPlaces
    : activeFilter === 'emergency'
    ? emergencyServices.map((e) => ({
        id: e.id,
        name: e.name,
        type: 'emergency' as const,
        image: '',
        description: e.address,
        rating: 0,
        reviewCount: 0,
        price: 0,
        currency: '₹',
        priceLevel: 1 as const,
        coordinates: e.coordinates,
        address: e.address,
        openHours: '24/7',
        tags: ['emergency'],
      }))
    : hyderabadPlaces.filter((p) => p.type === activeFilter);

  // Add priority scores
  const placesWithScores = places.map((p) => ({
    ...p,
    priorityScore: calculatePriorityScore(p, situation),
  }));

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-3.5rem)] lg:h-screen">
        {/* Map area */}
        <div className="flex-1 relative bg-muted">
          {/* Simulated map */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            {/* Grid pattern for map feel */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />

            {/* Map markers */}
            {placesWithScores.map((place, i) => (
              <motion.button
                key={place.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                onClick={() => setSelectedPlace(place)}
                className={cn(
                  'absolute w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all hover:scale-110 z-10',
                  selectedPlace?.id === place.id
                    ? 'bg-foreground text-background border-foreground scale-125'
                    : 'bg-card text-foreground border-border shadow-sm'
                )}
                style={{
                  left: `${20 + (i % 5) * 15 + Math.sin(i) * 5}%`,
                  top: `${15 + Math.floor(i / 5) * 20 + Math.cos(i) * 5}%`,
                }}
              >
                {place.priorityScore ?? 50}
              </motion.button>
            ))}

            {/* Center marker */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative">
                <div className="h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-foreground text-background text-[10px] font-medium px-2 py-0.5 rounded">
                  You are here
                </div>
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="absolute top-4 left-4 right-4 flex gap-2 overflow-x-auto z-30">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={cn(
                  'flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-medium transition-all border shrink-0 backdrop-blur-sm',
                  activeFilter === f.id
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-card/80 text-muted-foreground border-border hover:border-foreground/30'
                )}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-1 z-30">
            <button className="h-8 w-8 rounded-lg bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground font-bold text-sm hover:bg-card">+</button>
            <button className="h-8 w-8 rounded-lg bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground font-bold text-sm hover:bg-card">−</button>
          </div>
        </div>

        {/* Side panel */}
        <div className={cn(
          'w-80 border-l border-border bg-card overflow-y-auto transition-all hidden lg:block',
          selectedPlace ? 'block' : 'hidden lg:block'
        )}>
          {selectedPlace ? (
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Place Details</h3>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {selectedPlace.image && (
                <div className="rounded-lg overflow-hidden mb-4 h-36">
                  <img
                    src={selectedPlace.image}
                    alt={selectedPlace.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h4 className="text-base font-bold text-foreground mb-1">{selectedPlace.name}</h4>
              <p className="text-xs text-muted-foreground mb-3">{selectedPlace.address}</p>

              {selectedPlace.priorityScore !== undefined && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 rounded-full bg-foreground text-background px-2.5 py-1">
                    <Star className="h-3 w-3" fill="currentColor" />
                    <span className="text-xs font-bold">{selectedPlace.priorityScore}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Priority Score</span>
                </div>
              )}

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Rating</span>
                  <span className="text-xs font-medium text-foreground">{selectedPlace.rating}/5 ({selectedPlace.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Price</span>
                  <span className="text-xs font-medium text-foreground">{selectedPlace.price > 0 ? `₹${selectedPlace.price}` : 'Free'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Hours</span>
                  <span className="text-xs font-medium text-foreground">{selectedPlace.openHours}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{selectedPlace.description}</p>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-foreground text-background px-3 py-2 text-xs font-medium hover:bg-foreground/90 transition-all">
                  <Navigation className="h-3 w-3" />
                  Navigate
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-card transition-all">
                  Add to Plan
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Places on Map</h3>
              <div className="space-y-2">
                {placesWithScores.slice(0, 6).map((place) => (
                  <button
                    key={place.id}
                    onClick={() => setSelectedPlace(place)}
                    className="w-full flex items-center justify-between rounded-lg border border-border bg-card p-3 text-left hover:border-foreground/20 transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground truncate">{place.name}</p>
                      <p className="text-[10px] text-muted-foreground">{place.type}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <Star className="h-2.5 w-2.5" fill="currentColor" />
                      <span className="text-[10px] font-bold text-foreground">{place.priorityScore ?? '—'}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
