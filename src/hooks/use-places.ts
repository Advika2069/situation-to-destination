import { useState, useCallback, useRef } from 'react';
import type {
  Place,
  GeoPoint,
  WeatherData,
  Destination,
  EmergencyService,
} from '@/types/travel';
import {
  getNearbyPlaces,
  getWeather,
  getEmergencyServices,
  searchDestinations,
  geocode,
} from '@/services/places-api';

// ── Rate limit helper (Nominatim: 1 req/s) ────────────────
let lastRequestTime = 0;
async function rateLimitedFetch<T>(fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < 1100) {
    await new Promise((resolve) =>
      setTimeout(resolve, 1100 - timeSinceLastRequest)
    );
  }
  lastRequestTime = Date.now();
  return fn();
}

// ── Use Nearby Places ─────────────────────────────────────
export function useNearbyPlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchPlaces = useCallback(
    async (center: GeoPoint, radius = 5000, category?: string) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const result = await rateLimitedFetch(() =>
          getNearbyPlaces(center, radius, category)
        );
        setPlaces(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch places');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { places, loading, error, fetchPlaces, setPlaces };
}

// ── Use Weather ───────────────────────────────────────────
export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = useCallback(async (point: GeoPoint) => {
    setLoading(true);
    try {
      const result = await getWeather(point);
      setWeather(result);
    } catch {
      // Weather is non-critical, fail silently
    } finally {
      setLoading(false);
    }
  }, []);

  return { weather, loading, fetchWeather };
}

// ── Use Emergency Services ────────────────────────────────
export function useEmergencyServices() {
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchServices = useCallback(async (center: GeoPoint, radius = 10000) => {
    setLoading(true);
    try {
      const result = await getEmergencyServices(center, radius);
      setServices(result);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { services, loading, fetchServices };
}

// ── Use Destination Search ────────────────────────────────
export function useDestinationSearch() {
  const [results, setResults] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const data = await rateLimitedFetch(() => searchDestinations(query));
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, search };
}

// ── Use Geocode ───────────────────────────────────────────
export function useGeocode() {
  const [loading, setLoading] = useState(false);

  const resolve = useCallback(async (query: string): Promise<GeoPoint | null> => {
    setLoading(true);
    try {
      return await rateLimitedFetch(() => geocode(query));
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { resolve, loading };
}
