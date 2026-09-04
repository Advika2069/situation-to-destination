import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { motion } from 'framer-motion';
import {
  Star,
  MapPin,
  Calendar,
  CalendarDays,
  Wallet,
  Cloud,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Umbrella,
  ChevronRight,
  Utensils,
  Camera,
  Heart,
  ShoppingBag,
  Sparkles,
  Shield,
  Navigation,
  Clock,
  Train,
  Info,
  Loader2,
  Phone,
  BookmarkCheck,
  Bookmark,
  ExternalLink,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { destinations as fallbackDestinations, hyderabadPlaces, hyderabadWeather, guides as fallbackGuides, culturalEvents as fallbackEvents } from '@/data/mock';
import { cn } from '@/lib/utils';
import { useNearbyPlaces, useWeather, useEmergencyServices, useGeocode } from '@/hooks/use-places';
import { getTransportOptions } from '@/services/places-api';
import { useAppStore } from '@/store/app-store';
import type { Place, WeatherData, EmergencyService } from '@/types/travel';

export default function DestinationDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { addToPlan, addedToPlan, savedPlaces, addSavedPlace, removeSavedPlace } = useAppStore();
  const destination = fallbackDestinations.find((d) => d.slug === slug) || fallbackDestinations[0];

  const { places: apiPlaces, loading: placesLoading, fetchPlaces } = useNearbyPlaces();
  const { weather: apiWeather, fetchWeather } = useWeather();
  const { services: apiEmergency, loading: emergencyLoading, fetchServices } = useEmergencyServices();
  const { resolve: geocodeLocation } = useGeocode();

  const [attractions, setAttractions] = useState<Place[]>([]);
  const [restaurants, setRestaurants] = useState<Place[]>([]);
  const [shops, setShops] = useState<Place[]>([]);
  const [weather, setWeather] = useState<WeatherData>(hyderabadWeather);
  const [emergencyServicesList, setEmergencyServicesList] = useState<EmergencyService[]>([]);
  const [transportOptions, setTransportOptions] = useState<{type: string; provider: string; price: number; duration: string; distance: string; label: string}[]>([]);

  const isSaved = useCallback((id: string) => savedPlaces.some((p) => p.id === id), [savedPlaces]);

  // Derive places from API data
  useEffect(() => {
    const allPlaces = apiPlaces;
    if (allPlaces.length > 0) {
      setAttractions(allPlaces.filter((p) => p.type === 'attraction'));
      setRestaurants(allPlaces.filter((p) => p.type === 'restaurant'));
      setShops(allPlaces.filter((p) => p.type === 'shop'));
    } else if (!placesLoading) {
      // Fallback to mock data
      setAttractions(hyderabadPlaces.filter((p) => p.type === 'attraction'));
      setRestaurants(hyderabadPlaces.filter((p) => p.type === 'restaurant'));
      setShops(hyderabadPlaces.filter((p) => p.type === 'shop'));
    }
  }, [apiPlaces, placesLoading]);

  // Derive weather from API data
  useEffect(() => {
    if (apiWeather) setWeather(apiWeather);
  }, [apiWeather]);

  // Derive emergency services from API data
  useEffect(() => {
    if (apiEmergency.length > 0) setEmergencyServicesList(apiEmergency);
    else if (!emergencyLoading) setEmergencyServicesList([]);
  }, [apiEmergency, emergencyLoading]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      // Try to geocode the destination
      const coords = await geocodeLocation(destination.name);
      if (cancelled) return;

      const center = coords || destination.coordinates;

      // Fetch places, weather, and emergency services in parallel
      await Promise.all([
        fetchPlaces(center, 8000),
        fetchWeather(center),
        fetchServices(center),
      ]);

      if (cancelled) return;

      // Place data will be updated via apiPlaces state
      // Weather data will be updated via apiWeather state
      // Emergency data will be updated via apiEmergency state

      // apiPlaces will be updated by the hook, use it via state

      // Weather and emergency services will be picked up by the useEffect hooks above

      // Generate transport options
      const distance = 8 + Math.random() * 5;
      const transport = await getTransportOptions(center, center, distance);
      setTransportOptions(transport);
    }
    load();
    return () => { cancelled = true; };
  }, [destination]);

  const destinationEvents = fallbackEvents.filter((e) => e.destination === destination.name);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden mb-8 h-64 sm:h-80"
        >
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-3.5 w-3.5 text-white/80" />
              <span className="text-xs text-white/80">{destination.state}, {destination.country}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              {destination.name}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-white" fill="currentColor" />
                <span className="text-sm font-bold text-white">{destination.rating}</span>
                <span className="text-xs text-white/60">({destination.reviewCount.toLocaleString()} reviews)</span>
              </div>
              <span className="text-xs text-white/60">{destination.distance}</span>
            </div>
          </div>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          <InfoCard icon={<Calendar className="h-4 w-4" />} label="Best Time" value={destination.bestTime} />
          <InfoCard icon={<Wallet className="h-4 w-4" />} label="Budget" value={destination.budget} />
          <InfoCard icon={<MapPin className="h-4 w-4" />} label="Distance" value={destination.distance} />
          <InfoCard icon={<Star className="h-4 w-4" />} label="Rating" value={`${destination.rating}/5`} />
        </motion.div>

        {/* Weather */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-border bg-card p-5 mb-8"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4">Weather Today</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{weather.icon}</span>
              <div>
                <p className="text-lg font-bold text-foreground">{weather.temperature}°C</p>
                <p className="text-[10px] text-muted-foreground">{weather.condition}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">{weather.humidity}%</p>
                <p className="text-[10px] text-muted-foreground">Humidity</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">{weather.windSpeed} km/h</p>
                <p className="text-[10px] text-muted-foreground">Wind</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">{weather.visibility}</p>
                <p className="text-[10px] text-muted-foreground">Visibility</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Umbrella className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">{weather.rainChance}%</p>
                <p className="text-[10px] text-muted-foreground">Rain Chance</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4">Must Visit</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {destination.highlights.map((h) => (
              <div
                key={h}
                className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
              >
                {h}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cultural Events */}
        {destinationEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="mb-8"
          >
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <CalendarDays className="h-4 w-4" /> Cultural Events
            </h2>
            <div className="space-y-3">
              {destinationEvents.map((event: typeof fallbackEvents[0]) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-border bg-card p-4 hover:border-foreground/20 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-14 w-14 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground truncate">{event.name}</h4>
                        <span className="text-[10px] bg-primary/10 text-foreground px-1.5 py-0.5 rounded font-medium capitalize shrink-0">{event.type}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{event.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Calendar className="h-3 w-3" /> {event.dateRange}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{event.ticketPrice}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {event.tags.map((tag: string) => (
                          <span key={tag} className="text-[10px] bg-foreground/5 text-muted-foreground px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Attractions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Attractions
          </h2>
          <div className="space-y-3">
            {attractions.map((place) => (
              <PlaceCard key={place.id} place={place} onAddToPlan={() => addToPlan(place.id)} onToggleSave={() => isSaved(place.id) ? removeSavedPlace(place.id) : addSavedPlace(place)} isInPlan={addedToPlan.includes(place.id)} isSaved={isSaved(place.id)} />
            ))}
            {attractions.length === 0 && !placesLoading && (
              <p className="text-xs text-muted-foreground text-center py-4">No attractions found nearby.</p>
            )}
          </div>
        </motion.div>

        {/* Food */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Utensils className="h-4 w-4" /> Best Food
          </h2>
          <div className="space-y-3">
            {restaurants.map((place) => (
              <PlaceCard key={place.id} place={place} onAddToPlan={() => addToPlan(place.id)} onToggleSave={() => isSaved(place.id) ? removeSavedPlace(place.id) : addSavedPlace(place)} isInPlan={addedToPlan.includes(place.id)} isSaved={isSaved(place.id)} />
            ))}
            {restaurants.length === 0 && !placesLoading && (
              <p className="text-xs text-muted-foreground text-center py-4">No restaurants found nearby.</p>
            )}
          </div>
        </motion.div>

        {/* Guides */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Navigation className="h-4 w-4" /> Guides & Drivers
          </h2>
          <div className="space-y-3">
            {fallbackGuides.map((guide) => (
              <div
                key={guide.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-bold text-foreground shrink-0">
                    {guide.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground">{guide.name}</h4>
                      {guide.verified && (
                        <span className="text-[10px] bg-foreground/10 text-foreground px-1.5 py-0.5 rounded font-medium">Verified</span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{guide.type === 'both' ? 'Guide + Driver' : guide.type === 'guide' ? 'Guide' : 'Driver'}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Star className="h-3 w-3" fill="currentColor" /> {guide.rating}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{guide.tripCount} trips</span>
                      <span className="text-[10px] text-muted-foreground">{guide.languages.join(', ')}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {guide.specialization.map((s) => (
                        <span key={s} className="text-[10px] bg-foreground/5 text-muted-foreground px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-foreground">₹{guide.pricePerHour}</p>
                    <p className="text-[10px] text-muted-foreground">per hour</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Safety */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4" /> Safety & Emergency
          </h2>
          <div className="space-y-2">
            {emergencyServicesList.map((svc) => (
              <div
                key={svc.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-foreground/5 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{svc.name}</p>
                    <p className="text-[10px] text-muted-foreground">{svc.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right mr-2">
                    <p className="text-[10px] font-medium text-foreground">{svc.distance} km</p>
                    <p className="text-[10px] text-muted-foreground">{svc.travelTime}</p>
                  </div>
                  {svc.phone && (
                    <a href={`tel:${svc.phone}`} className="flex items-center gap-1 rounded-lg bg-foreground text-background px-3 py-1.5 text-[10px] font-medium hover:bg-foreground/90 transition-all">
                      <Phone className="h-3 w-3" /> Call
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${svc.coordinates.lat},${svc.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-[10px] font-medium text-foreground hover:bg-card transition-all"
                  >
                    <Navigation className="h-3 w-3" /> Navigate
                  </a>
                </div>
              </div>
            ))}
            {emergencyServicesList.length === 0 && placesLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                <span className="text-xs text-muted-foreground ml-2">Loading emergency services...</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="text-muted-foreground mb-1">{icon}</div>
      <p className="text-sm font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function PlaceCard({ place, onAddToPlan, onToggleSave, isInPlan, isSaved }: { place: Place; onAddToPlan: () => void; onToggleSave: () => void; isInPlan: boolean; isSaved: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 hover:border-foreground/20 transition-all">
      <div className="flex items-start gap-3">
        <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0">
          <img
            src={place.image}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-foreground truncate">{place.name}</h4>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="h-3 w-3" fill="currentColor" />
              <span className="text-xs font-bold text-foreground">{place.rating}</span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{place.description}</p>
          <div className="flex items-center gap-3 mt-2">
            {place.price > 0 ? (
              <span className="text-[10px] font-medium text-foreground">₹{place.price}</span>
            ) : (
              <span className="text-[10px] font-medium text-foreground">Free</span>
            )}
            <span className="text-[10px] text-muted-foreground">{place.openHours}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={onAddToPlan}
              className={cn(
                'flex items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-all',
                isInPlan
                  ? 'bg-foreground text-background'
                  : 'border border-border text-foreground hover:bg-card'
              )}
            >
              {isInPlan ? <BookmarkCheck className="h-3 w-3" /> : <Bookmark className="h-3 w-3" />}
              {isInPlan ? 'In Plan' : 'Add to Plan'}
            </button>
            <button
              onClick={onToggleSave}
              className={cn(
                'flex items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-all',
                isSaved
                  ? 'bg-foreground text-background'
                  : 'border border-border text-foreground hover:bg-card'
              )}
            >
              {isSaved ? '★ Saved' : '☆ Save'}
            </button>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-[10px] font-medium text-foreground hover:bg-card transition-all"
            >
              <ExternalLink className="h-3 w-3" /> Navigate
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
