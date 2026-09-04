import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  Wallet,
  ArrowRight,
  Zap,
  DollarSign,
  Star,
  Bus,
  Train,
  Car,
  Bike,
  Navigation,
  RefreshCw,
  Loader2,
  LocateFixed,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { transportOptions as fallbackOptions } from '@/data/mock';
import { getTransportOptions } from '@/services/places-api';
import { useAppStore } from '@/store/app-store';
import { useGeocode } from '@/hooks/use-places';
import type { TransportOption } from '@/types/travel';

export default function Move() {
  const { situation, addedToPlan, apiPlaces } = useAppStore();
  const { resolve: geocodeLocation } = useGeocode();
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'best'>('best');
  const [transportData, setTransportData] = useState<TransportOption[]>(fallbackOptions);
  const [loading, setLoading] = useState(false);
  const [fromPlace, setFromPlace] = useState(situation.currentLocation || 'Current Location');
  const [toPlace, setToPlace] = useState(situation.destination || 'Hyderabad');
  const [fromInput, setFromInput] = useState(fromPlace);
  const [toInput, setToInput] = useState(toPlace);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const fromCoords = await geocodeLocation(fromPlace);
        const toCoords = await geocodeLocation(toPlace);

        if (fromCoords && toCoords) {
          // Calculate approximate distance
          const R = 6371;
          const dLat = ((toCoords.lat - fromCoords.lat) * Math.PI) / 180;
          const dLon = ((toCoords.lng - fromCoords.lng) * Math.PI) / 180;
          const a = Math.sin(dLat / 2) ** 2 + Math.cos((fromCoords.lat * Math.PI) / 180) * Math.cos((toCoords.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
          const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          const options = await getTransportOptions(fromCoords, toCoords, distance);
          setTransportData(options.map((o, i) => ({
            ...o,
            type: o.type as TransportOption['type'],
            transfers: o.transfers || 0,
            isCheapest: i === options.length - 1,
            isFastest: i === 1,
          })));
        }
      } catch {
        setTransportData(fallbackOptions);
      }
      setLoading(false);
    }
    load();
  }, [fromPlace, toPlace]);

  const handleRouteSearch = () => {
    setFromPlace(fromInput);
    setToPlace(toInput);
  };

  const sorted = [...transportData].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'duration') return parseInt(a.duration) - parseInt(b.duration);
    const aScore = a.isBestValue ? 3 : a.isFastest ? 2 : a.isCheapest ? 1 : 0;
    const bScore = b.isBestValue ? 3 : b.isFastest ? 2 : b.isCheapest ? 1 : 0;
    return bScore - aScore;
  });

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5" />
            <span className="font-medium uppercase tracking-wider">Transport</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Transport Hub
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compare all options — cheapest, fastest, best value.
          </p>
        </motion.div>

        {/* Route summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-5 mb-6"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground mb-1">From</p>
                <div className="relative">
                  <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <input
                    value={fromInput}
                    onChange={(e) => setFromInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRouteSearch()}
                    placeholder="Enter origin"
                    className="w-full rounded-lg border border-border bg-background pl-7 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 pt-4">
                <div className="h-px w-8 bg-border" />
                <Navigation className="h-3 w-3 text-muted-foreground" />
                <div className="h-px w-8 bg-border" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground mb-1">To</p>
                <div className="relative">
                  <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <input
                    value={toInput}
                    onChange={(e) => setToInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRouteSearch()}
                    placeholder="Enter destination"
                    className="w-full rounded-lg border border-border bg-background pl-7 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleRouteSearch}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-foreground text-background px-4 py-2 text-xs font-medium hover:bg-foreground/90 transition-all"
            >
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <LocateFixed className="h-3 w-3" />}
              {loading ? 'Searching...' : 'Search Routes'}
            </button>
          </div>
        </motion.div>

        {/* Sort controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 mb-6"
        >
          {[
            { id: 'best' as const, label: 'Best Value', icon: <Star className="h-3 w-3" /> },
            { id: 'price' as const, label: 'Cheapest', icon: <DollarSign className="h-3 w-3" /> },
            { id: 'duration' as const, label: 'Fastest', icon: <Zap className="h-3 w-3" /> },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSortBy(opt.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all border',
                sortBy === opt.id
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-card text-muted-foreground border-border hover:border-foreground/30'
              )}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </motion.div>

        {/* Transport cards */}
        <div className="space-y-3">
          {sorted.map((transport, i) => (
            <motion.div
              key={transport.type + transport.provider}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={cn(
                'rounded-xl border bg-card p-4 transition-all hover:border-foreground/20',
                transport.isBestValue ? 'border-foreground/30' : 'border-border'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'h-10 w-10 rounded-lg flex items-center justify-center text-foreground',
                    transport.isBestValue ? 'bg-foreground text-background' : 'bg-foreground/5'
                  )}>
                    <TransportIcon type={transport.type} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground">{transport.label}</h4>
                      {transport.isCheapest && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-medium">Cheapest</span>
                      )}
                      {transport.isFastest && (
                        <span className="text-[10px] bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded font-medium">Fastest</span>
                      )}
                      {transport.isBestValue && (
                        <span className="text-[10px] bg-foreground text-background px-1.5 py-0.5 rounded font-medium">Best Value</span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{transport.provider} • {transport.distance}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-foreground">₹{transport.price}</p>
                  <p className="text-[10px] text-muted-foreground">{transport.duration}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-muted-foreground">{transport.distance}</span>
                  <span className="text-[10px] text-muted-foreground">{transport.transfers === 0 ? 'Direct' : `${transport.transfers} transfer(s)`}</span>
                </div>
                <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(fromPlace)}&destination=${encodeURIComponent(toPlace)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-medium text-foreground hover:underline"
              >
                Select →
              </a>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-[10px] text-center text-muted-foreground mt-6">
          Transport options estimated based on distance. Prices are approximate.
        </p>
      </div>
    </AppShell>
  );
}

function TransportIcon({ type }: { type: string }) {
  switch (type) {
    case 'bus': return <Bus className="h-5 w-5" />;
    case 'metro': return <Train className="h-5 w-5" />;
    case 'train': return <Train className="h-5 w-5" />;
    case 'uber':
    case 'ola':
    case 'taxi': return <Car className="h-5 w-5" />;
    case 'bike':
    case 'rapido': return <Bike className="h-5 w-5" />;
    default: return <MapPin className="h-5 w-5" />;
  }
}
