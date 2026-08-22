import { useParams } from 'react-router';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, Wallet, Star, Calendar, Route } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { generateItinerary } from '@/services/ai-engine';
import { useAppStore } from '@/store/app-store';

const tripData: Record<string, { title: string; destination: string; date: string; duration: string; cost: number; budget: number; fitScore: number }> = {
  'trip-1': { title: 'Hyderabad Heritage Day', destination: 'Hyderabad', date: 'Dec 15, 2025', duration: '7 hours', cost: 2340, budget: 3000, fitScore: 94 },
  'trip-2': { title: 'Charminar Food Walk', destination: 'Hyderabad', date: 'Dec 20, 2025', duration: '4 hours', cost: 850, budget: 1500, fitScore: 88 },
  'trip-3': { title: 'Jaipur Weekend', destination: 'Jaipur', date: 'Jan 5, 2026', duration: '2 days', cost: 8500, budget: 10000, fitScore: 91 },
  'trip-4': { title: 'Goa Beach Trail', destination: 'Goa', date: 'Feb 14, 2026', duration: '3 days', cost: 0, budget: 15000, fitScore: 0 },
};

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const { situation } = useAppStore();
  const trip = tripData[id || ''] || tripData['trip-1'];
  const itinerary = generateItinerary({ ...situation, destination: trip.destination, currentLocation: trip.destination });

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Briefcase className="h-3.5 w-3.5" />
            <span className="font-medium uppercase tracking-wider">Trip Detail</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{trip.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{trip.destination} • {trip.date}</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="text-lg font-bold text-foreground">{trip.fitScore}%</p>
            <p className="text-[10px] text-muted-foreground">Fit Score</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="text-lg font-bold text-foreground">₹{trip.cost.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Total Cost</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="text-lg font-bold text-foreground">{trip.duration}</p>
            <p className="text-[10px] text-muted-foreground">Duration</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="text-lg font-bold text-foreground">{itinerary.activities.length}</p>
            <p className="text-[10px] text-muted-foreground">Stops</p>
          </div>
        </div>

        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Itinerary</p>
        <div className="space-y-3">
          {itinerary.activities.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">{activity.startTime} – {activity.endTime}</span>
                    <span className="text-[10px] text-muted-foreground">• {activity.duration}m</span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">{activity.place.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{activity.cost > 0 ? `₹${activity.cost}` : 'Free'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
