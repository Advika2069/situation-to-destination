import { useState } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { transportOptions } from '@/data/mock';

export default function Move() {
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'best'>('best');

  const sorted = [...transportOptions].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'duration') return parseInt(a.duration) - parseInt(b.duration);
    // best value
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">From</p>
              <p className="text-sm font-semibold text-foreground">Charminar</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-px w-12 bg-border" />
              <Navigation className="h-4 w-4 text-muted-foreground" />
              <div className="h-px w-12 bg-border" />
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">To</p>
              <p className="text-sm font-semibold text-foreground">Hussain Sagar Lake</p>
            </div>
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
                <button className="text-[10px] font-medium text-foreground hover:underline">Select →</button>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-[10px] text-center text-muted-foreground mt-6">
          Simulated transport data for demo purposes. Prices and times are approximate.
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
