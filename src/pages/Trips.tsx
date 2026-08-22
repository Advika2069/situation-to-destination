import { motion } from 'framer-motion';
import { Link } from 'react-router';import { Briefcase,
  Clock,
  Wallet,
  Star,
  ChevronRight,
  Calendar,
  Route,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';

const trips = [
  {
    id: 'trip-1',
    title: 'Hyderabad Heritage Day',
    destination: 'Hyderabad',
    date: 'Dec 15, 2025',
    duration: '7 hours',
    cost: 2340,
    budget: 3000,
    stops: 6,
    fitScore: 94,
    status: 'completed',
  },
  {
    id: 'trip-2',
    title: 'Charminar Food Walk',
    destination: 'Hyderabad',
    date: 'Dec 20, 2025',
    duration: '4 hours',
    cost: 850,
    budget: 1500,
    stops: 4,
    fitScore: 88,
    status: 'completed',
  },
  {
    id: 'trip-3',
    title: 'Jaipur Weekend',
    destination: 'Jaipur',
    date: 'Jan 5, 2026',
    duration: '2 days',
    cost: 8500,
    budget: 10000,
    stops: 12,
    fitScore: 91,
    status: 'planned',
  },
  {
    id: 'trip-4',
    title: 'Goa Beach Trail',
    destination: 'Goa',
    date: 'Feb 14, 2026',
    duration: '3 days',
    cost: 0,
    budget: 15000,
    stops: 0,
    fitScore: 0,
    status: 'planned',
  },
];

export default function Trips() {
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
            <Briefcase className="h-3.5 w-3.5" />
            <span className="font-medium uppercase tracking-wider">Trips</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            My Trips
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your saved and completed journeys.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">4</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Trips</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">2</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Completed</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">₹11,690</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Spent</p>
          </div>
        </motion.div>

        {/* Trip list */}
        <div className="space-y-3">
          {trips.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
            >
              <Link
                to={`/trips/${trip.id}`}
                className="block rounded-xl border border-border bg-card p-5 hover:border-foreground/20 transition-all group"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-foreground">{trip.title}</h3>
                      <span className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded font-medium',
                        trip.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-blue-500/10 text-blue-600'
                      )}>
                        {trip.status === 'completed' ? 'Completed' : 'Planned'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{trip.destination}</p>
                  </div>
                  {trip.fitScore > 0 && (
                    <div className="flex items-center gap-1 bg-foreground/5 rounded-full px-2 py-0.5">
                      <Star className="h-3 w-3" fill="currentColor" />
                      <span className="text-xs font-bold text-foreground">{trip.fitScore}%</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{trip.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{trip.duration}</span>
                  <span className="flex items-center gap-1"><Route className="h-3 w-3" />{trip.stops} stops</span>
                  {trip.cost > 0 && (
                    <span className="flex items-center gap-1"><Wallet className="h-3 w-3" />₹{trip.cost.toLocaleString()}</span>
                  )}
                </div>
                <div className="flex items-center justify-end mt-3">
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
