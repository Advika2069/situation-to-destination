import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Navigation,
  MapPin,
  X,
  Utensils,
  Sparkles,
  Shield,
  Info,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { LiveMap } from '@/components/map/LiveMap';
import { hyderabadPlaces, emergencyServices } from '@/data/mock';
import { calculatePriorityScore } from '@/services/ai-engine';
import { useAppStore } from '@/store/app-store';
import type { Place } from '@/types/travel';

// Merge emergency services as places for map display
const emergencyPlaces: Place[] = emergencyServices.map((e) => ({
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
  tags: ['emergency', e.type],
}));

const allPlaces = [...hyderabadPlaces, ...emergencyPlaces];

export default function MapPage() {
  const { situation } = useAppStore();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const placesWithScores = allPlaces.map((p) => ({
    ...p,
    priorityScore: calculatePriorityScore(p, situation),
  }));

  const selectedWithScore = selectedPlace
    ? placesWithScores.find((p) => p.id === selectedPlace.id) || null
    : null;

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-3.5rem)] lg:h-screen">
        {/* Map */}
        <div className="flex-1 relative">
          <LiveMap
            places={allPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={setSelectedPlace}
          />
        </div>

        {/* Side panel */}
        <div className={cn(
          'w-80 border-l border-border bg-card overflow-y-auto transition-all hidden lg:block'
        )}>
          <AnimatePresence mode="wait">
            {selectedWithScore ? (
              <motion.div
                key={selectedWithScore.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Place Details</h3>
                  <button
                    onClick={() => setSelectedPlace(null)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {selectedWithScore.image && (
                  <div className="rounded-xl overflow-hidden mb-4 h-40">
                    <img
                      src={selectedWithScore.image}
                      alt={selectedWithScore.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h4 className="text-base font-bold text-foreground mb-1">{selectedWithScore.name}</h4>
                <p className="text-xs text-muted-foreground mb-1 capitalize flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {selectedWithScore.address}
                </p>
                <p className="text-xs text-muted-foreground mb-3 capitalize">{selectedWithScore.type}</p>

                {/* Priority score */}
                {selectedWithScore.priorityScore !== undefined && (
                  <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-primary/5 border border-border">
                    <div className="flex items-center gap-1 rounded-full bg-[#c8a348] text-[#1e3a5f] px-2.5 py-1">
                      <Star className="h-3 w-3" fill="currentColor" />
                      <span className="text-xs font-bold">{selectedWithScore.priorityScore}</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-foreground">Priority Score</p>
                      <p className="text-[10px] text-muted-foreground">
                        {selectedWithScore.priorityScore >= 80 ? 'Excellent match' :
                         selectedWithScore.priorityScore >= 60 ? 'Good match' : 'Fair match'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star className="h-3 w-3" /> Rating
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {selectedWithScore.rating > 0 ? `${selectedWithScore.rating}/5 (${selectedWithScore.reviewCount})` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Price</span>
                    <span className="text-xs font-medium text-foreground">
                      {selectedWithScore.price > 0 ? `₹${selectedWithScore.price}` : 'Free'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Hours
                    </span>
                    <span className="text-xs font-medium text-foreground">{selectedWithScore.openHours}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{selectedWithScore.description}</p>

                {selectedWithScore.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {selectedWithScore.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-foreground/5 text-muted-foreground px-2 py-0.5 rounded-full capitalize">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedWithScore.coordinates.lat},${selectedWithScore.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#1e3a5f] text-white px-3 py-2.5 text-xs font-medium hover:bg-[#1e3a5f]/90 transition-all"
                  >
                    <Navigation className="h-3 w-3" />
                    Navigate
                  </a>
                  <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2.5 text-xs font-medium text-foreground hover:bg-card transition-all">
                    Add to Plan
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-5"
              >
                <h3 className="text-sm font-semibold text-foreground mb-1">Places on Map</h3>
                <p className="text-[10px] text-muted-foreground mb-4">Tap a marker or list item for details</p>

                <div className="space-y-2">
                  {placesWithScores.slice(0, 8).map((place) => (
                    <button
                      key={place.id}
                      onClick={() => setSelectedPlace(place)}
                      className="w-full flex items-center justify-between rounded-lg border border-border bg-card p-3 text-left hover:border-[#c8a348]/40 hover:bg-accent/30 transition-all"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-foreground truncate">{place.name}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{place.type}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <Star className="h-2.5 w-2.5 text-[#c8a348]" fill="currentColor" />
                        <span className="text-[10px] font-bold text-foreground">{place.priorityScore ?? '—'}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 p-3 rounded-lg bg-[#1e3a5f]/5 border border-[#1e3a5f]/10">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-[#1e3a5f] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-foreground mb-0.5">Priority Score</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Based on your interests, reviews, distance, time fit, weather, and popularity.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}
