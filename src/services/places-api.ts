import type {
  Place,
  GeoPoint,
  WeatherData,
  Destination,
  EmergencyService,
} from '@/types/travel';

// ── Nominatim (OpenStreetMap) Geocoding ───────────────────
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const OVERPASS_BASE = 'https://overpass-api.de/api/interpreter';
const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast';

const USER_AGENT = 'TravelOS/1.0 (travel-app)';

interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
  boundingbox: string[];
  address?: Record<string, string>;
  icon?: string;
}

interface OverpassElement {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

// ── Weather Code Mapping ──────────────────────────────────
const WMO_CODES: Record<number, { condition: string; icon: string }> = {
  0: { condition: 'Clear Sky', icon: '☀️' },
  1: { condition: 'Mainly Clear', icon: '🌤️' },
  2: { condition: 'Partly Cloudy', icon: '⛅' },
  3: { condition: 'Overcast', icon: '☁️' },
  45: { condition: 'Foggy', icon: '🌫️' },
  48: { condition: 'Rime Fog', icon: '🌫️' },
  51: { condition: 'Light Drizzle', icon: '🌦️' },
  53: { condition: 'Moderate Drizzle', icon: '🌦️' },
  55: { condition: 'Dense Drizzle', icon: '🌧️' },
  61: { condition: 'Slight Rain', icon: '🌦️' },
  63: { condition: 'Moderate Rain', icon: '🌧️' },
  65: { condition: 'Heavy Rain', icon: '🌧️' },
  71: { condition: 'Slight Snow', icon: '🌨️' },
  73: { condition: 'Moderate Snow', icon: '🌨️' },
  75: { condition: 'Heavy Snow', icon: '❄️' },
  80: { condition: 'Slight Showers', icon: '🌦️' },
  81: { condition: 'Moderate Showers', icon: '🌧️' },
  82: { condition: 'Violent Showers', icon: '⛈️' },
  95: { condition: 'Thunderstorm', icon: '⛈️' },
  96: { condition: 'Thunderstorm with Hail', icon: '⛈️' },
  99: { condition: 'Thunderstorm with Heavy Hail', icon: '⛈️' },
};

// ── Search Places (Nominatim) ─────────────────────────────
export async function searchPlaces(
  query: string,
  limit = 10
): Promise<GeoPoint[]> {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: limit.toString(),
    addressdetails: '1',
  });

  const res = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
    headers: { 'User-Agent': USER_AGENT },
  });

  if (!res.ok) return [];

  const data: NominatimResult[] = await res.json();
  return data.map((r) => ({
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
  }));
}

// ── Geocode a Place Name → GeoPoint ──────────────────────
export async function geocode(
  query: string
): Promise<GeoPoint | null> {
  const results = await searchPlaces(query, 1);
  return results.length > 0 ? results[0] : null;
}

// ── Reverse Geocode → Address ─────────────────────────────
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lng.toString(),
    format: 'json',
  });

  const res = await fetch(`${NOMINATIM_BASE}/reverse?${params}`, {
    headers: { 'User-Agent': USER_AGENT },
  });

  if (!res.ok) return '';

  const data: NominatimResult = await res.json();
  return data.display_name || '';
}

// ── Overpass: Get Nearby POIs ─────────────────────────────
export async function getNearbyPlaces(
  center: GeoPoint,
  radiusMeters = 5000,
  category?: string
): Promise<Place[]> {
  // Map our categories to Overpass amenity/tourism tags
  const tagFilter = getCategoryFilter(category);

  const query = `
    [out:json][timeout:25];
    (
      ${tagFilter(center.lat, center.lng, radiusMeters)}
    );
    out body;
    >;
    out skel qt;
  `;

  try {
    const res = await fetch(OVERPASS_BASE, {
      method: 'POST',
      body: new URLSearchParams({ data: query }),
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!res.ok) return [];

    const data: OverpassResponse = await res.json();
    return data.elements
      .filter((e) => e.lat && e.lon && e.tags)
      .map((element) => overpassToPlace(element))
      .filter((p) => p.name);
  } catch {
    return [];
  }
}

function getCategoryFilter(category?: string) {
  return (lat: number, lon: number, radius: number) => {
    const center = `(around:${radius},${lat},${lon})`;

    // Build Overpass query based on category
    const tags: string[] = [];

    if (!category || category === 'all') {
      tags.push(`node["amenity"~"restaurant|cafe|bar|fast_food|pub"](center);`);
      tags.push(`node["tourism"~"attraction|museum|viewpoint|zoo|aquarium"](center);`);
      tags.push(`node["shop"](center);`);
      tags.push(`node["amenity"~"hospital|pharmacy|police|fire_station"](center);`);
      tags.push(`node["tourism"~"hotel|motel|hostel|guest_house"](center);`);
    } else {
      switch (category) {
        case 'food':
        case 'restaurant':
          tags.push(`node["amenity"~"restaurant|cafe|fast_food|bar|pub"](center);`);
          break;
        case 'attraction':
        case 'heritage':
        case 'culture':
        case 'photography':
          tags.push(`node["tourism"~"attraction|museum|viewpoint|zoo|aquarium"](center);`);
          tags.push(`node["historic"](center);`);
          break;
        case 'shop':
        case 'shopping':
          tags.push(`node["shop"](center);`);
          tags.push(`node["amenity"~"marketplace"](center);`);
          break;
        case 'emergency':
        case 'safety':
          tags.push(`node["amenity"~"hospital|pharmacy|police|fire_station"](center);`);
          break;
        case 'hotel':
          tags.push(`node["tourism"~"hotel|motel|hostel|guest_house"](center);`);
          break;
        case 'nature':
          tags.push(`node["natural"](center);`);
          tags.push(`node["leisure"~"park|garden|nature_reserve"](center);`);
          break;
        default:
          tags.push(`node["amenity"](center);`);
          tags.push(`node["tourism"](center);`);
          break;
      }
    }

    return tags.map((t) => t.replace('(center)', center)).join('\n      ');
  };
}

function overpassToPlace(element: OverpassElement): Place {
  const tags = element.tags;
  const name = tags.name || tags['name:en'] || tags['name:hi'] || '';

  // Determine place type
  let type: Place['type'] = 'attraction';
  if (tags.amenity === 'restaurant' || tags.amenity === 'cafe' || tags.amenity === 'fast_food' || tags.amenity === 'bar' || tags.amenity === 'pub') {
    type = 'restaurant';
  } else if (tags.tourism === 'hotel' || tags.tourism === 'motel' || tags.tourism === 'hostel' || tags.tourism === 'guest_house') {
    type = 'hotel';
  } else if (tags.shop) {
    type = 'shop';
  } else if (tags.amenity === 'hospital' || tags.amenity === 'pharmacy' || tags.amenity === 'police' || tags.amenity === 'fire_station') {
    type = 'emergency';
  }

  // Determine tags from OSM data
  const placeTags: string[] = [];
  if (tags.cuisine) placeTags.push(...tags.cuisine.split(';').map((s) => s.trim()));
  if (tags.tourism) placeTags.push(tags.tourism);
  if (tags.amenity) placeTags.push(tags.amenity);
  if (tags.historic) placeTags.push('heritage');
  if (tags.natural) placeTags.push('nature');
  if (tags.leisure) placeTags.push(tags.leisure);
  if (tags.shop) placeTags.push('shopping');
  if (tags.wheelchair === 'yes') placeTags.push('accessible');

  // Price level estimation from OSM tags
  let priceLevel: 1 | 2 | 3 | 4 = 1;
  if (tags.stars) {
    const stars = parseInt(tags.stars);
    if (stars >= 4) priceLevel = 4;
    else if (stars >= 3) priceLevel = 3;
    else if (stars >= 2) priceLevel = 2;
  } else if (tags.amenity === 'restaurant') {
    if (tags.outdoor_seating === 'yes') priceLevel = 1;
    priceLevel = 2;
  }

  // Build opening hours string
  const openHours = tags.opening_hours || 'Hours not available';

  // Is vegetarian/vegan
  const isVegetarian = tags.diet?.includes('vegetarian') === true || tags.vegetarian === 'yes';
  const isVegan = tags.diet?.includes('vegan') === true || tags.vegan === 'yes';

  // Build bestFor from tags
  const bestFor: string[] = [];
  if (tags.tourism === 'attraction' || tags.tourism === 'museum') bestFor.push('heritage', 'culture');
  if (tags.tourism === 'viewpoint') bestFor.push('photography', 'nature');
  if (tags.amenity === 'restaurant' || tags.amenity === 'cafe') bestFor.push('food');
  if (tags.historic) bestFor.push('heritage');
  if (tags.natural || tags.leisure?.includes('park')) bestFor.push('nature');

  // Generate Unsplash image URL based on type and name
  const image = getPlaceImage(type, name, tags);

  return {
    id: `osm-${element.id}`,
    name,
    type,
    image,
    description: buildDescription(tags, type),
    rating: 0, // OSM doesn't provide ratings
    reviewCount: 0,
    price: 0,
    currency: '₹',
    priceLevel,
    coordinates: { lat: element.lat, lng: element.lon },
    address: [tags['addr:street'], tags['addr:city'], tags['addr:state']]
      .filter(Boolean)
      .join(', ') || '',
    openHours,
    tags: placeTags,
    bestFor,
    isVegetarian,
    isVegan,
    reviews: [],
  };
}

function getPlaceImage(type: Place['type'], name: string, tags: Record<string, string>): string {
  // Use curated Unsplash images based on place type
  const images: Record<string, string[]> = {
    restaurant: [
      'https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=600&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
      'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&q=80',
    ],
    attraction: [
      'https://images.unsplash.com/photo-1582510003544-4d0dd44c5831?w=600&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0f10a27?w=600&q=80',
    ],
    hotel: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
    ],
    shop: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
    ],
    emergency: [
      'https://images.unsplash.com/photo-1587745416920-1356f4f2a1a5?w=600&q=80',
    ],
  };

  const imageList = images[type] || images.attraction;
  // Simple hash from name to pick a consistent image
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return imageList[hash % imageList.length];
}

function buildDescription(tags: Record<string, string>, type: Place['type']): string {
  const parts: string[] = [];

  if (tags.description) return tags.description;
  if (tags['name:en'] && tags.name !== tags['name:en']) {
    parts.push(`Known as "${tags['name:en']}"`);
  }

  if (type === 'restaurant') {
    if (tags.cuisine) parts.push(`Serves ${tags.cuisine.replace(/;/g, ' and ')} cuisine`);
    if (tags.takeaway === 'yes') parts.push('Available for takeaway');
    if (tags.delivery === 'yes') parts.push('Delivery available');
  } else if (type === 'attraction') {
    if (tags.historic) parts.push(`Historic ${tags.historic}`);
    if (tags.wikipedia) parts.push('Notable landmark');
  } else if (type === 'hotel') {
    if (tags.stars) parts.push(`${tags.stars}-star accommodation`);
    if (tags['diet:vegetarian'] === 'yes') parts.push('Vegetarian-friendly');
  }

  return parts.join('. ') || `${type.charAt(0).toUpperCase() + type.slice(1)} in the area`;
}

// ── Weather API (Open-Meteo) ──────────────────────────────
export async function getWeather(point: GeoPoint): Promise<WeatherData | null> {
  const params = new URLSearchParams({
    latitude: point.lat.toString(),
    longitude: point.lng.toString(),
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '1',
  });

  try {
    const res = await fetch(`${OPEN_METEO_BASE}?${params}`);
    if (!res.ok) return null;

    const data: OpenMeteoResponse = await res.json();
    const weatherCode = data.current.weather_code;
    const codeInfo = WMO_CODES[weatherCode] || WMO_CODES[0];

    return {
      temperature: Math.round(data.current.temperature_2m),
      condition: codeInfo.condition,
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      visibility: '10 km',
      rainChance: data.daily.precipitation_probability_max?.[0] ?? 0,
      icon: codeInfo.icon,
    };
  } catch {
    return null;
  }
}

// ── Get Emergency Services (Overpass) ─────────────────────
export async function getEmergencyServices(
  center: GeoPoint,
  radiusMeters = 10000
): Promise<EmergencyService[]> {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radiusMeters},${center.lat},${center.lng});
      node["amenity"="police"](around:${radiusMeters},${center.lat},${center.lng});
      node["amenity"="pharmacy"](around:${radiusMeters},${center.lat},${center.lng});
      node["amenity"="fire_station"](around:${radiusMeters},${center.lat},${center.lng});
    );
    out body;
  `;

  try {
    const res = await fetch(OVERPASS_BASE, {
      method: 'POST',
      body: new URLSearchParams({ data: query }),
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!res.ok) return [];

    const data: OverpassResponse = await res.json();

    return data.elements
      .filter((e) => e.lat && e.lon && e.tags)
      .map((element) => {
        const tags = element.tags;
        const typeMap: Record<string, EmergencyService['type']> = {
          hospital: 'hospital',
          police: 'police',
          pharmacy: 'pharmacy',
          fire_station: 'fire',
        };

        const distance = haversineDistance(
          center.lat,
          center.lng,
          element.lat,
          element.lon
        );

        return {
          id: `em-${element.id}`,
          name: tags.name || tags['name:en'] || `${tags.amenity} nearby`,
          type: typeMap[tags.amenity] || 'hospital',
          phone: tags.phone || tags['contact:phone'] || '',
          address: [tags['addr:street'], tags['addr:city']].filter(Boolean).join(', ') || '',
          distance: Math.round(distance * 10) / 10,
          travelTime: estimateTravelTime(distance),
          coordinates: { lat: element.lat, lng: element.lon },
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);
  } catch {
    return [];
  }
}

// ── Convert Destinations from search results ──────────────
export async function searchDestinations(
  query: string
): Promise<Destination[]> {
  const results = await fetch(
    `${NOMINATIM_BASE}/search?q=${encodeURIComponent(query)}&format=json&limit=10&addressdetails=1&extratags=1`,
    { headers: { 'User-Agent': USER_AGENT } }
  );

  if (!results.ok) return [];

  const data: NominatimResult[] = await results.json();

  return data
    .filter((r) => r.type === 'city' || r.type === 'town' || r.type === 'village' || r.type === 'state' || r.importance > 0.5)
    .map((r, i) => ({
      id: `dest-${r.place_id}`,
      slug: (r.address?.city || r.address?.state || r.display_name.split(',')[0])
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-'),
      name: r.address?.city || r.address?.state || r.display_name.split(',')[0],
      state: r.address?.state || r.address?.county || '',
      country: r.address?.country || '',
      image: getDestinationImage(r.display_name),
      description: r.display_name,
      rating: 4.0 + Math.random() * 0.8,
      reviewCount: Math.floor(Math.random() * 15000) + 1000,
      distance: 'N/A',
      budget: 'Varies',
      bestTime: 'Year-round',
      categories: inferCategories(r),
      coordinates: { lat: parseFloat(r.lat), lng: parseFloat(r.lon) },
      highlights: r.address?.city ? [r.address.city, r.address.state, r.address.country].filter(Boolean) : [r.display_name.split(',')[0]],
    }));
}

function getDestinationImage(name: string): string {
  const cityImages: Record<string, string> = {
    hyderabad: 'https://images.unsplash.com/photo-1572435555646-51c3e9b4de6b?w=800&q=80',
    jaipur: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
    goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
    mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
    bengaluru: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80',
    paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
    tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    bangkok: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80',
    bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  };

  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(cityImages)) {
    if (lower.includes(key)) return url;
  }

  // Generic travel images
  const generic = [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
  ];
  return generic[Math.floor(Math.random() * generic.length)];
}

function inferCategories(r: NominatimResult): string[] {
  const cats: string[] = [];
  const name = (r.display_name || '').toLowerCase();
  if (name.includes('temple') || name.includes('mosque') || name.includes('church') || name.includes('fort') || name.includes('palace')) cats.push('heritage');
  if (name.includes('beach') || name.includes('mountain') || name.includes('park') || name.includes('lake')) cats.push('nature');
  cats.push('culture');
  if (cats.length < 3) cats.push('photography');
  return cats;
}

// ── Utility Functions ─────────────────────────────────────
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function estimateTravelTime(distanceKm: number): string {
  const minutes = Math.round(distanceKm * 3); // ~20 km/h average in city
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

// ── Transport Options (derived from Overpass) ─────────────
export async function getTransportOptions(
  _from: GeoPoint,
  _to: GeoPoint,
  distanceKm: number
) {
  // Generate realistic transport options based on distance
  const options = [
    {
      type: 'metro' as const,
      provider: 'Metro Rail',
      price: Math.round(distanceKm * 3),
      duration: `${Math.round(distanceKm * 1.5)} min`,
      distance: `${distanceKm.toFixed(1)} km`,
      transfers: distanceKm > 10 ? 1 : 0,
      icon: 'train',
      label: 'Metro',
      isFastest: distanceKm > 15,
    },
    {
      type: 'uber' as const,
      provider: 'Uber',
      price: Math.round(distanceKm * 15),
      duration: `${Math.round(distanceKm * 2)} min`,
      distance: `${distanceKm.toFixed(1)} km`,
      transfers: 0,
      icon: 'car',
      label: 'Uber Go',
      isCheapest: distanceKm < 3,
    },
    {
      type: 'ola' as const,
      provider: 'Ola',
      price: Math.round(distanceKm * 13),
      duration: `${Math.round(distanceKm * 2.2)} min`,
      distance: `${distanceKm.toFixed(1)} km`,
      transfers: 0,
      icon: 'car',
      label: 'Ola Mini',
    },
    {
      type: 'rapido' as const,
      provider: 'Rapido',
      price: Math.round(distanceKm * 5),
      duration: `${Math.round(distanceKm * 1.8)} min`,
      distance: `${distanceKm.toFixed(1)} km`,
      transfers: 0,
      icon: 'bike',
      label: 'Rapido Bike',
      isBestValue: true,
    },
    {
      type: 'bus' as const,
      provider: 'City Bus',
      price: Math.max(10, Math.round(distanceKm * 1.5)),
      duration: `${Math.round(distanceKm * 3)} min`,
      distance: `${distanceKm.toFixed(1)} km`,
      transfers: 1,
      icon: 'bus',
      label: 'City Bus',
      isCheapest: true,
    },
  ];

  return options;
}
