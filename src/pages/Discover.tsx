import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  Compass,
  Star,
  MapPin,
  Clock,
  Wallet,
  TrendingUp,
  Search,
  ChevronRight,
  Utensils,
  Heart,
  Camera,
  Mountain,
  TreePine,
  Loader2,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { destinations as fallbackDestinations } from '@/data/mock';
import { useDestinationSearch } from '@/hooks/use-places';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'trending', label: 'Trending' },
  { id: 'nearby', label: 'Nearby' },
  { id: 'hidden', label: 'Hidden Gems' },
  { id: 'food', label: 'Food' },
  { id: 'culture', label: 'Culture' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'nature', label: 'Nature' },
  { id: 'budget', label: 'Budget' },
];

const catIcons: Record<string, React.ReactNode> = {
  food: <Utensils className="h-3 w-3" />,
  culture: <Heart className="h-3 w-3" />,
  photography: <Camera className="h-3 w-3" />,
  heritage: <Star className="h-3 w-3" />,
  adventure: <Mountain className="h-3 w-3" />,
  nature: <TreePine className="h-3 w-3" />,
};

export default function Discover() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const { results: apiResults, loading: apiLoading, search: searchDestinations } = useDestinationSearch();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.length >= 2) {
        searchDestinations(value);
      }
    }, 800);
  }, [searchDestinations]);

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  // Merge API results with fallback destinations
  const allDestinations = apiResults.length > 0
    ? [...apiResults, ...fallbackDestinations.filter((fd) => !apiResults.some((ar) => ar.name === fd.name))]
    : fallbackDestinations;

  const filtered = allDestinations.filter((d) => {
    const matchesCategory =
      activeCategory === 'all' || d.categories.includes(activeCategory);
    const matchesSearch =
      !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.state.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Compass className="h-3.5 w-3.5" />
            <span className="font-medium uppercase tracking-wider">Discover</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Explore Destinations
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-ranked destinations matched to your interests and situation.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search any city or destination worldwide..."
              className="w-full rounded-xl border border-border bg-card pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
            />
            {apiLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
            )}
          </div>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all border shrink-0',
                activeCategory === cat.id
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-card text-muted-foreground border-border hover:border-foreground/30'
              )}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Destination grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <Link
                to={`/destination/${dest.slug}`}
                className="block rounded-xl border border-border bg-card overflow-hidden hover:border-foreground/20 transition-all group"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">{dest.name}</h3>
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
                        <Star className="h-3 w-3 text-white" fill="currentColor" />
                        <span className="text-[10px] font-bold text-white">{dest.rating}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-white/80">{dest.state}, {dest.country}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                    {dest.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {dest.categories.slice(0, 3).map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {catIcons[cat]}
                        {cat}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <MapPin className="h-2.5 w-2.5" /> {dest.distance}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Wallet className="h-2.5 w-2.5" /> {dest.budget}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && !apiLoading && (
          <div className="text-center py-16">
            <Globe className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No destinations found. Try a different search or category.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Search for any city worldwide — results come from OpenStreetMap.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
