import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Utensils,
  Camera,
  Mountain,
  Heart,
  ShoppingBag,
  Music,
  TreePine,
  Star,
  MapPin,
  ArrowRight,
  Clock,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { foodItems, hyderabadPlaces } from '@/data/mock';

const experienceTypes = [
  { id: 'food', label: 'Food Tours', icon: Utensils, color: 'bg-orange-500/10 text-orange-600' },
  { id: 'heritage', label: 'Heritage Walks', icon: Heart, color: 'bg-purple-500/10 text-purple-600' },
  { id: 'photography', label: 'Photography', icon: Camera, color: 'bg-blue-500/10 text-blue-600' },
  { id: 'adventure', label: 'Adventure', icon: Mountain, color: 'bg-emerald-500/10 text-emerald-600' },
  { id: 'cooking', label: 'Cooking Classes', icon: Utensils, color: 'bg-red-500/10 text-red-600' },
  { id: 'culture', label: 'Culture', icon: Music, color: 'bg-violet-500/10 text-violet-600' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'bg-pink-500/10 text-pink-600' },
  { id: 'nature', label: 'Nature', icon: TreePine, color: 'bg-green-500/10 text-green-600' },
];

export default function Experiences() {
  const [activeType, setActiveType] = useState('food');

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
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-medium uppercase tracking-wider">Experiences</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Experiences & Food
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Curated experiences and local food recommendations.
          </p>
        </motion.div>

        {/* Experience type cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {experienceTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={cn(
                  'rounded-xl border p-4 text-left transition-all',
                  activeType === type.id
                    ? 'border-foreground bg-foreground/5'
                    : 'border-border bg-card hover:border-foreground/20'
                )}
              >
                <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center mb-2', type.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-xs font-medium text-foreground">{type.label}</p>
              </button>
            );
          })}
        </motion.div>

        {/* Build Food Trail CTA */}
        {activeType === 'food' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-5 py-3 text-sm font-medium hover:bg-foreground/90 transition-all">
              <Utensils className="h-4 w-4" />
              Build My Food Trail
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {/* Food items */}
        {activeType === 'food' && (
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Local Specialties
            </p>
            {foodItems.map((food, i) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="rounded-xl border border-border bg-card p-4 hover:border-foreground/20 transition-all"
              >
                <div className="flex items-start gap-3">
                  {food.image && (
                    <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0">
                      <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-foreground">{food.name}</h4>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="h-3 w-3" fill="currentColor" />
                        <span className="text-xs font-bold text-foreground">{food.rating}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{food.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-medium text-foreground">₹{food.price}</span>
                      <span className="text-[10px] text-muted-foreground">{food.restaurant}</span>
                      {food.isVegetarian && (
                        <span className="text-[10px] bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded font-medium">Veg</span>
                      )}
                      {food.isVegan && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-medium">Vegan</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Generic experience cards */}
        {activeType !== 'food' && (
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Curated Experiences
            </p>
            {hyderabadPlaces.filter(p => p.tags.includes(activeType)).map((place, i) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="rounded-xl border border-border bg-card p-4 hover:border-foreground/20 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0">
                    <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-foreground">{place.name}</h4>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="h-3 w-3" fill="currentColor" />
                        <span className="text-xs font-bold text-foreground">{place.rating}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{place.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {place.price > 0 && <span className="text-xs font-medium text-foreground">₹{place.price}</span>}
                      <span className="text-[10px] text-muted-foreground">{place.openHours}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {hyderabadPlaces.filter(p => p.tags.includes(activeType)).length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">No experiences found for this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
