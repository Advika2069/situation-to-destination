import { motion } from 'framer-motion';
import {
  Clock,
  MapPin,
  Wallet,
  Shield,
  TrendingUp,
  ArrowRight,
  Star,
  ChevronRight,
  Navigation,
  Camera,
  Utensils,
  Heart,
  Sparkles,
  Mountain,
  TreePine,
  ShoppingBag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Itinerary } from '@/types/travel';

const tagIcons: Record<string, React.ReactNode> = {
  food: <Utensils className="h-3 w-3" />,
  culture: <Heart className="h-3 w-3" />,
  photography: <Camera className="h-3 w-3" />,
  heritage: <Sparkles className="h-3 w-3" />,
  adventure: <Mountain className="h-3 w-3" />,
  nature: <TreePine className="h-3 w-3" />,
  shopping: <ShoppingBag className="h-3 w-3" />,
};

interface Props {
  itinerary: Itinerary;
  onViewMap: () => void;
}

export function ItineraryResults({ itinerary, onViewMap }: Props) {
  const budgetUsed = itinerary.totalCost;
  const budgetRemaining = itinerary.budget - budgetUsed;
  const budgetPercent = Math.round((budgetUsed / itinerary.budget) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-4 py-1.5 text-xs font-medium text-foreground mb-4">
          <Sparkles className="h-3 w-3" />
          JOURNEY READY
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
          Your {itinerary.activities.length * 1.5 > itinerary.safetyBuffer ? 'Perfect' : ''} Journey Is Ready
        </h2>
        <p className="text-sm text-muted-foreground">
          {itinerary.destination} • {itinerary.totalDuration} • {itinerary.activities.length} stops
        </p>
      </motion.div>

      {/* Metrics grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10"
      >
        <MetricCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Trip Fit"
          value={`${itinerary.fitScore}%`}
          highlight
        />
        <MetricCard
          icon={<Wallet className="h-4 w-4" />}
          label="Est. Cost"
          value={`₹${itinerary.totalCost.toLocaleString()}`}
        />
        <MetricCard
          icon={<Clock className="h-4 w-4" />}
          label="Total Time"
          value={itinerary.totalDuration}
        />
        <MetricCard
          icon={<MapPin className="h-4 w-4" />}
          label="Distance"
          value={itinerary.totalDistance}
        />
        <MetricCard
          icon={<Shield className="h-4 w-4" />}
          label="Safety Buffer"
          value={`${itinerary.safetyBuffer}m`}
        />
      </motion.div>

      {/* Budget bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-10 rounded-xl border border-border bg-card p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Budget Usage</span>
          <span className="text-sm text-muted-foreground">
            ₹{budgetUsed.toLocaleString()} / ₹{itinerary.budget.toLocaleString()}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-border overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-full',
              budgetPercent > 90 ? 'bg-destructive' : budgetPercent > 70 ? 'bg-amber-500' : 'bg-foreground'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${budgetPercent}%` }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          ₹{budgetRemaining.toLocaleString()} remaining — {budgetPercent}% utilized
        </p>
      </motion.div>

      {/* View Map CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-8"
      >
        <button
          onClick={onViewMap}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-all"
        >
          <Navigation className="h-4 w-4" />
          View on Map
          <ChevronRight className="h-4 w-4" />
        </button>
      </motion.div>

      {/* Activity Timeline */}
      <div className="space-y-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Your Itinerary
        </p>
        {itinerary.activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.08 }}
          >
            <ActivityCard
              activity={activity}
              index={index}
              isLast={index === itinerary.activities.length - 1}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4 text-center transition-all',
        highlight
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-card'
      )}
    >
      <div className={cn('flex justify-center mb-2', highlight ? 'text-background/70' : 'text-muted-foreground')}>
        {icon}
      </div>
      <p className={cn('text-xl font-bold', highlight ? 'text-background' : 'text-foreground')}>
        {value}
      </p>
      <p className={cn('text-[10px] font-medium uppercase tracking-wider mt-1', highlight ? 'text-background/70' : 'text-muted-foreground')}>
        {label}
      </p>
    </div>
  );
}

function ActivityCard({
  activity,
  index,
  isLast,
}: {
  activity: Itinerary['activities'][0];
  index: number;
  isLast: boolean;
}) {
  const tags = activity.place.tags.filter((t) =>
    ['food', 'culture', 'photography', 'heritage', 'adventure', 'nature', 'shopping'].includes(t)
  );

  return (
    <div className="flex gap-4">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">
          {index + 1}
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-border my-1" />
        )}
      </div>

      {/* Card */}
      <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
        <div className="rounded-xl border border-border bg-card p-4 hover:border-foreground/20 transition-all">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-muted-foreground">
                  {activity.startTime} – {activity.endTime}
                </span>
                <span className="text-[10px] text-muted-foreground">•</span>
                <span className="text-[10px] text-muted-foreground">
                  {activity.duration}m
                </span>
              </div>
              <h4 className="text-sm font-semibold text-foreground truncate">
                {activity.place.name}
              </h4>
            </div>
            {activity.place.priorityScore !== undefined && (
              <div className="flex items-center gap-1 rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-bold text-foreground shrink-0">
                <Star className="h-2.5 w-2.5" fill="currentColor" />
                {activity.place.priorityScore}
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            {activity.place.description}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {tagIcons[tag]}
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Cost and notes */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {activity.cost > 0 ? `₹${activity.cost}` : 'Free'}
            </span>
            {activity.transportToNext && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <ArrowRight className="h-2.5 w-2.5" />
                Next: {activity.transportToNext.type}
              </span>
            )}
          </div>

          {activity.notes && (
            <p className="text-[10px] text-muted-foreground/80 mt-2 italic leading-relaxed">
              {activity.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
