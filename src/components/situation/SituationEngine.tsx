import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  Users,
  Wallet,
  Sparkles,
  ChevronRight,
  Zap,
  Utensils,
  Camera,
  Mountain,
  TreePine,
  ShoppingBag,
  Music,
  Heart,
  Play,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import type { ExperienceType, TravelStyle, FoodPreference } from '@/types/travel';

const interests = [
  { id: 'food' as ExperienceType, label: 'Food', icon: Utensils },
  { id: 'culture' as ExperienceType, label: 'Culture', icon: Heart },
  { id: 'photography' as ExperienceType, label: 'Photography', icon: Camera },
  { id: 'adventure' as ExperienceType, label: 'Adventure', icon: Mountain },
  { id: 'nature' as ExperienceType, label: 'Nature', icon: TreePine },
  { id: 'shopping' as ExperienceType, label: 'Shopping', icon: ShoppingBag },
  { id: 'heritage' as ExperienceType, label: 'Heritage', icon: Sparkles },
  { id: 'nightlife' as ExperienceType, label: 'Nightlife', icon: Music },
];

const travelStyles = [
  { id: 'solo' as TravelStyle, label: 'Solo', emoji: '👤' },
  { id: 'couple' as TravelStyle, label: 'Couple', emoji: '💑' },
  { id: 'family' as TravelStyle, label: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { id: 'group' as TravelStyle, label: 'Group', emoji: '👥' },
];

const foodPrefs = [
  { id: 'any' as FoodPreference, label: 'No Preference' },
  { id: 'vegetarian' as FoodPreference, label: 'Vegetarian' },
  { id: 'vegan' as FoodPreference, label: 'Vegan' },
  { id: 'non-veg' as FoodPreference, label: 'Non-Veg' },
];

interface Props {
  onSubmit: () => void;
}

export function SituationEngine({ onSubmit }: Props) {
  const { situation, setSituation, runDemo } = useAppStore();
  const [freeText, setFreeText] = useState(situation.description);

  const handleFreeTextChange = useCallback(
    (text: string) => {
      setFreeText(text);
      // Simple keyword parsing for demo
      const lower = text.toLowerCase();
      if (lower.includes('hyderabad')) setSituation({ destination: 'Hyderabad', currentLocation: 'Hyderabad' });
      if (lower.includes('solo') || lower.includes('alone')) setSituation({ travelStyle: 'solo', travelers: 1 });
      if (lower.includes('family')) setSituation({ travelStyle: 'family', travelers: 4 });
      if (lower.includes('couple')) setSituation({ travelStyle: 'couple', travelers: 2 });
      if (lower.includes('food')) setSituation({ interests: [...new Set([...situation.interests, 'food' as ExperienceType])] });
      if (lower.includes('culture')) setSituation({ interests: [...new Set([...situation.interests, 'culture' as ExperienceType])] });
      if (lower.includes('photo')) setSituation({ interests: [...new Set([...situation.interests, 'photography' as ExperienceType])] });
      if (lower.includes('₹3,000') || lower.includes('3000') || lower.includes('3k')) setSituation({ budget: 3000 });
      if (lower.includes('₹5,000') || lower.includes('5000') || lower.includes('5k')) setSituation({ budget: 5000 });
      if (lower.includes('7 hour')) setSituation({ hoursAvailable: 7 });
      if (lower.includes('4 hour')) setSituation({ hoursAvailable: 4 });
      setSituation({ description: text });
    },
    [setSituation, situation.interests]
  );

  const handleSubmit = () => {
    onSubmit();
  };

  const handleDemo = () => {
    runDemo();
    setTimeout(() => onSubmit(), 100);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Free text input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative mb-8"
      >
        <textarea
          value={freeText}
          onChange={(e) => handleFreeTextChange(e.target.value)}
          placeholder="Describe your travel situation... e.g. &quot;I'm in Hyderabad, traveling solo, have 7 hours, ₹3,000 budget, love food and photography&quot;"
          className="w-full min-h-[120px] rounded-xl border border-border bg-card px-5 py-4 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
          aria-label="Travel situation description"
        />
        <div className="absolute bottom-3 right-3">
          <button
            onClick={handleSubmit}
            disabled={!situation.destination}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
              situation.destination
                ? 'bg-foreground text-background hover:bg-foreground/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            <Zap className="h-3.5 w-3.5" />
            Build My Journey
          </button>
        </div>
      </motion.div>

      {/* Quick inputs row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
      >
        <QuickInput
          icon={<MapPin className="h-4 w-4" />}
          label="Location"
          value={situation.destination || situation.currentLocation || ''}
          onClick={() => {}}
        />
        <QuickInput
          icon={<Clock className="h-4 w-4" />}
          label="Hours"
          value={`${situation.hoursAvailable}h`}
          onClick={() => {}}
        />
        <QuickInput
          icon={<Users className="h-4 w-4" />}
          label="Travelers"
          value={`${situation.travelers} ${situation.travelStyle}`}
          onClick={() => {}}
        />
        <QuickInput
          icon={<Wallet className="h-4 w-4" />}
          label="Budget"
          value={`${situation.currency}${situation.budget.toLocaleString()}`}
          onClick={() => {}}
        />
      </motion.div>

      {/* Interest chips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="mb-6"
      >
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Interests</p>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => {
            const Icon = interest.icon;
            const active = situation.interests.includes(interest.id);
            return (
              <button
                key={interest.id}
                onClick={() => {
                  const newInterests = active
                    ? situation.interests.filter((i) => i !== interest.id)
                    : [...situation.interests, interest.id];
                  setSituation({ interests: newInterests });
                }}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all border',
                  active
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-card text-muted-foreground border-border hover:border-foreground/30'
                )}
              >
                <Icon className="h-3 w-3" />
                {interest.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Travel style + Food preference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8"
      >
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Travel Style</p>
          <div className="flex gap-2">
            {travelStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => {
                  const travelers = style.id === 'solo' ? 1 : style.id === 'couple' ? 2 : style.id === 'family' ? 4 : 5;
                  setSituation({ travelStyle: style.id, travelers });
                }}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all border',
                  situation.travelStyle === style.id
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-card text-muted-foreground border-border hover:border-foreground/30'
                )}
              >
                <span>{style.emoji}</span>
                {style.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Food Preference</p>
          <div className="flex flex-wrap gap-2">
            {foodPrefs.map((pref) => (
              <button
                key={pref.id}
                onClick={() => setSituation({ foodPreference: pref.id })}
                className={cn(
                  'rounded-lg px-3 py-2 text-xs font-medium transition-all border',
                  situation.foodPreference === pref.id
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-card text-muted-foreground border-border hover:border-foreground/30'
                )}
              >
                {pref.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Demo CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="flex flex-col items-center gap-4 pt-4 border-t border-border"
      >
        <p className="text-xs text-muted-foreground">
          Try the demo scenario: Hyderabad • Solo • 7 hours • ₹3,000 • Food + Culture + Photography
        </p>
        <button
          onClick={handleDemo}
          className="flex items-center gap-2 rounded-lg bg-foreground text-background px-6 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-all"
        >
          <Play className="h-3.5 w-3.5" fill="currentColor" />
          Try the Live Demo
        </button>
      </motion.div>
    </div>
  );
}

function QuickInput({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition-all hover:border-foreground/20"
    >
      <div className="text-muted-foreground">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value || '—'}</p>
      </div>
    </button>
  );
}
