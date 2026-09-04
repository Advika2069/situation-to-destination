import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Route,
  Clock,
  Wallet,
  MapPin,
  Zap,
  Utensils,
  Mountain,
  Coffee,
  Star,
  Plus,
  GripVertical,
  Trash2,
  ChevronRight,
  RefreshCw,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { useAppStore } from '@/store/app-store';
import { generateItinerary } from '@/services/ai-engine';
import { hyderabadPlaces } from '@/data/mock';
import type { ItineraryActivity, Place } from '@/types/travel';

const optimizationModes = [
  { id: 'balanced', label: 'Balanced', icon: <Star className="h-3 w-3" /> },
  { id: 'time', label: 'Optimize Time', icon: <Clock className="h-3 w-3" /> },
  { id: 'cost', label: 'Minimize Cost', icon: <Wallet className="h-3 w-3" /> },
  { id: 'food', label: 'More Food', icon: <Utensils className="h-3 w-3" /> },
  { id: 'adventure', label: 'More Adventure', icon: <Mountain className="h-3 w-3" /> },
  { id: 'relaxation', label: 'More Relaxation', icon: <Coffee className="h-3 w-3" /> },
];

export default function Plan() {
  const { situation, itinerary, setItinerary, apiPlaces } = useAppStore();
  const [mode, setMode] = useState('balanced');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [showAddPicker, setShowAddPicker] = useState(false);

  const availablePlaces = apiPlaces.length > 0 ? apiPlaces : hyderabadPlaces;

  const handleAddActivity = (place: Place) => {
    const baseItinerary = itinerary || generateItinerary({
      ...situation,
      destination: situation.destination || 'Hyderabad',
      currentLocation: situation.currentLocation || 'Hyderabad',
    });

    const newActivity: ItineraryActivity = {
      id: `act-${Date.now()}`,
      placeId: place.id,
      place,
      startTime: '12:00',
      endTime: '13:00',
      duration: 60,
      notes: 'Added manually',
      cost: place.price,
      priority: 50,
    };

    setItinerary({
      ...baseItinerary,
      activities: [...baseItinerary.activities, newActivity],
    });
    setShowAddPicker(false);
  };

  const activeItinerary =
    itinerary ||
    generateItinerary({
      ...situation,
      destination: situation.destination || 'Hyderabad',
      currentLocation: situation.currentLocation || 'Hyderabad',
    });

  const handleOptimize = () => {
    const newItinerary = generateItinerary(situation);
    setItinerary(newItinerary);
  };

  const handleRemoveActivity = (id: string) => {
    if (!itinerary) return;
    setItinerary({
      ...itinerary,
      activities: itinerary.activities.filter((a) => a.id !== id),
    });
  };

  const handleRegenerate = () => {
    const newItinerary = generateItinerary({
      ...situation,
      interests: ['food', 'adventure'],
    });
    setItinerary(newItinerary);
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Route className="h-3.5 w-3.5" />
            <span className="font-medium uppercase tracking-wider">Plan</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Itinerary Builder
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {activeItinerary.destination} • {activeItinerary.totalDuration} • {activeItinerary.activities.length} stops
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOptimize}
                className="flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3 py-2 text-xs font-medium hover:bg-foreground/90 transition-all"
              >
                <Zap className="h-3 w-3" />
                Optimize
              </button>
              <button
                onClick={handleRegenerate}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-card transition-all"
              >
                <RefreshCw className="h-3 w-3" />
                Regenerate
              </button>
            </div>
          </div>
        </motion.div>

        {/* Optimization modes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none"
        >
          {optimizationModes.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setMode(opt.id)}
              className={cn(
                'flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all border shrink-0',
                mode === opt.id
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-card text-muted-foreground border-border hover:border-foreground/30'
              )}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          <MetricPill label="Fit Score" value={`${activeItinerary.fitScore}%`} />
          <MetricPill label="Total Cost" value={`₹${activeItinerary.totalCost}`} />
          <MetricPill label="Duration" value={activeItinerary.totalDuration} />
          <MetricPill label="Distance" value={activeItinerary.totalDistance} />
        </motion.div>

        {/* Add activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <button
            onClick={() => setShowAddPicker(!showAddPicker)}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card px-4 py-3 text-xs font-medium text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Activity
          </button>

          {/* Place picker */}
          <AnimatePresence>
            {showAddPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="rounded-xl border border-border bg-card p-3 max-h-60 overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-foreground">Select a place to add</p>
                    <button onClick={() => setShowAddPicker(false)} className="p-1 text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {availablePlaces.slice(0, 10).map((place) => (
                      <button
                        key={place.id}
                        onClick={() => handleAddActivity(place)}
                        className="w-full flex items-center gap-3 rounded-lg border border-border bg-background p-2.5 text-left hover:border-foreground/30 transition-all"
                      >
                        <div className="h-8 w-8 rounded overflow-hidden shrink-0">
                          <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-foreground truncate">{place.name}</p>
                          <p className="text-[10px] text-muted-foreground">{place.type} • {place.price > 0 ? `₹${place.price}` : 'Free'}</p>
                        </div>
                        <Plus className="h-3 w-3 text-muted-foreground shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Activity list */}
        <div className="space-y-3">
          {activeItinerary.activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + index * 0.04 }}
              className={cn(
                'rounded-xl border border-border bg-card p-4 transition-all',
                dragIndex === index && 'opacity-50'
              )}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragEnd={() => setDragIndex(null)}
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <div className="h-6 w-6 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-bold">
                    {index + 1}
                  </div>
                  <GripVertical className="h-4 w-4 text-muted-foreground/30 cursor-grab" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {activity.startTime} – {activity.endTime}
                      </span>
                      <span className="text-[10px] text-muted-foreground">• {activity.duration}m</span>
                    </div>
                    {activity.place.priorityScore !== undefined && (
                      <div className="flex items-center gap-0.5">
                        <Star className="h-2.5 w-2.5" fill="currentColor" />
                        <span className="text-[10px] font-bold text-foreground">{activity.place.priorityScore}</span>
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">{activity.place.name}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{activity.place.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-muted-foreground">{activity.cost > 0 ? `₹${activity.cost}` : 'Free'}</span>
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleRemoveActivity(activity.id)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  {activity.notes && (
                    <p className="text-[10px] text-muted-foreground/80 mt-1 italic">{activity.notes}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  );
}
