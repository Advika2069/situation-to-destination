import type {
  TravelSituation,
  Itinerary,
  ItineraryActivity,
  Place,
  AISuggestion,
  WeatherData,
} from '@/types/travel';
import { hyderabadPlaces, hyderabadWeather } from '@/data/mock';

// Allow external places to be passed in; fall back to mock
let externalPlaces: Place[] | null = null;

export function setPlacesForEngine(places: Place[]) {
  externalPlaces = places;
}

export function clearPlacesForEngine() {
  externalPlaces = null;
}

// ── Priority Score Calculator ─────────────────────────────
export function calculatePriorityScore(
  place: Place,
  situation: TravelSituation
): number {
  let score = 0;

  // Interest Match (0-30)
  const matchingTags = place.tags.filter((t) =>
    situation.interests.some((i) => t.includes(i))
  );
  score += Math.min(30, (matchingTags.length / Math.max(1, situation.interests.length)) * 30);

  // Review Quality (0-20)
  score += (place.rating / 5) * 20;

  // Price Fit (0-20)
  const budgetPerActivity = situation.budget / Math.max(1, Math.floor(situation.hoursAvailable / 1.5));
  if (place.price <= budgetPerActivity) score += 20;
  else if (place.price <= budgetPerActivity * 1.5) score += 10;
  else if (place.price <= budgetPerActivity * 2) score += 5;

  // Popularity (0-15)
  score += Math.min(15, (place.reviewCount / 10000) * 15);

  // Time Fit (0-15) — places with "local" or "heritage" tags get boosted for short trips
  if (situation.hoursAvailable <= 4) {
    if (place.tags.includes('local') || place.tags.includes('heritage')) score += 15;
    else score += 5;
  } else {
    score += 12;
  }

  return Math.min(100, Math.round(score));
}

// ── Itinerary Generator ───────────────────────────────────
export function generateItinerary(
  situation: TravelSituation
): Itinerary {
  const places = getRelevantPlaces(situation);
  const scoredPlaces = places.map((p) => ({
    ...p,
    priorityScore: calculatePriorityScore(p, situation),
  }));

  // Sort by priority score
  scoredPlaces.sort((a, b) => (b.priorityScore ?? 0) - (a.priorityScore ?? 0));

  // Build itinerary based on time budget
  const availableMinutes = situation.hoursAvailable * 60;
  const travelBuffer = 15; // minutes between places
  const stopDuration = 45; // average minutes per stop
  const maxStops = Math.min(
    scoredPlaces.length,
    Math.floor((availableMinutes - 60) / (stopDuration + travelBuffer))
  );

  const activities: ItineraryActivity[] = [];
  let currentTime = timeToMinutes(situation.time);
  let totalCost = 0;

  for (let i = 0; i < maxStops; i++) {
    const place = scoredPlaces[i];
    const duration = i === 0 ? stopDuration + 15 : stopDuration;
    const startTime = minutesToTime(currentTime);
    const endTime = minutesToTime(currentTime + duration);

    activities.push({
      id: `act-${i}`,
      placeId: place.id,
      place,
      startTime,
      endTime,
      duration,
      notes: getSmartNote(place, situation, i),
      cost: place.price,
      priority: place.priorityScore ?? 0,
    });

    totalCost += place.price;
    currentTime += duration + travelBuffer;
  }

  // Safety buffer calculation
  const usedMinutes = currentTime - timeToMinutes(situation.time);
  const safetyBuffer = Math.max(0, availableMinutes - usedMinutes - 30);

  return {
    id: `itin-${Date.now()}`,
    title: `${situation.hoursAvailable}-Hour ${situation.destination || situation.currentLocation} Journey`,
    destination: situation.destination || situation.currentLocation || 'Current Location',
    date: situation.date,
    activities,
    totalDuration: formatDuration(usedMinutes),
    totalDistance: calculateTotalDistance(activities),
    totalCost,
    budget: situation.budget,
    fitScore: calculateFitScore(activities, situation),
    safetyBuffer,
    optimizationMode: 'balanced',
  };
}

// ── Smart Notes Generator ─────────────────────────────────
function getSmartNote(
  place: Place,
  situation: TravelSituation,
  index: number
): string {
  const notes: string[] = [];

  if (index === 0) {
    notes.push(`Start here — opens early and less crowded in the morning.`);
  }

  if (place.tags.includes('food')) {
    if (situation.foodPreference === 'vegetarian' && !place.isVegetarian) {
      notes.push('Ask for vegetarian options — they have a separate veg menu.');
    }
    notes.push(`Budget ~₹${place.price} per person here.`);
  }

  if (place.tags.includes('photography')) {
    notes.push('Golden hour (6–7 PM) is ideal for photos here.');
  }

  if (place.tags.includes('heritage')) {
    notes.push('Hiring a guide adds context — worth it for first-time visitors.');
  }

  if (place.tags.includes('local')) {
    notes.push('This is a local favorite — authentic experience away from tourist crowds.');
  }

  if (situation.travelStyle === 'family' && place.price > 500) {
    notes.push('Kids under 5 enter free. Family-friendly rest areas available.');
  }

  if (situation.travelStyle === 'solo') {
    notes.push('Great for solo exploration — safe area with good connectivity.');
  }

  return notes.join(' ');
}

// ── Fit Score Calculator ──────────────────────────────────
function calculateFitScore(
  activities: ItineraryActivity[],
  situation: TravelSituation
): number {
  if (activities.length === 0) return 0;

  const avgPriority =
    activities.reduce((sum, a) => sum + a.priority, 0) / activities.length;

  // Budget adherence
  const totalCost = activities.reduce((sum, a) => sum + a.cost, 0);
  const budgetScore = totalCost <= situation.budget ? 100 : Math.max(0, 100 - ((totalCost - situation.budget) / situation.budget) * 100);

  // Time utilization
  const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);
  const timeUtilization = Math.min(1, totalMinutes / (situation.hoursAvailable * 60));
  const timeScore = timeUtilization > 0.6 ? 90 + (timeUtilization - 0.6) * 25 : timeUtilization * 150;

  // Interest coverage
  const coveredInterests = new Set(
    activities.flatMap((a) => a.place.tags)
  );
  const interestCoverage =
    situation.interests.filter((i) =>
      [...coveredInterests].some((t) => t.includes(i))
    ).length / situation.interests.length;

  const fitScore =
    avgPriority * 0.3 +
    budgetScore * 0.25 +
    timeScore * 0.25 +
    interestCoverage * 100 * 0.2;

  return Math.min(100, Math.round(fitScore));
}

// ── Place Filter ──────────────────────────────────────────
function getRelevantPlaces(situation: TravelSituation): Place[] {
  // Use API-provided places if available, otherwise fallback to mock
  let places = externalPlaces && externalPlaces.length > 0
    ? [...externalPlaces]
    : [...hyderabadPlaces];

  // Filter by vegetarian preference
  if (situation.foodPreference === 'vegetarian') {
    places = places.filter(
      (p) => p.type !== 'restaurant' || p.isVegetarian === true
    );
  }

  if (situation.foodPreference === 'vegan') {
    places = places.filter(
      (p) => p.type !== 'restaurant' || p.isVegan === true
    );
  }

  return places;
}

// ── Weather Impact ────────────────────────────────────────
export function getWeatherImpact(weather: WeatherData): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  if (weather.rainChance > 50) {
    suggestions.push({
      type: 'weather',
      title: 'Rain Expected',
      description: `${weather.rainChance}% rain chance today. Moving outdoor activities earlier and adding indoor alternatives.`,
      priority: 'high',
    });
  }

  if (weather.temperature > 35) {
    suggestions.push({
      type: 'weather',
      title: 'Hot Day Ahead',
      description: `${weather.temperature}°C expected. Starting early, adding shaded spots, and ensuring water breaks.`,
      priority: 'medium',
    });
  }

  return suggestions;
}

// ── AI Suggestions Generator ──────────────────────────────
export function generateSuggestions(
  situation: TravelSituation
): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  suggestions.push({
    type: 'tip',
    title: 'Best Route Strategy',
    description: `For a ${situation.hoursAvailable}-hour trip in ${situation.destination || 'Hyderabad'}, start with distant spots and work back to your departure point.`,
    priority: 'high',
  });

  if (situation.budget < 2000) {
    suggestions.push({
      type: 'tip',
      title: 'Budget Tip',
      description: 'Save on transport by using the metro for longer distances and walking in the old city area.',
      priority: 'medium',
    });
  }

  if (situation.interests.includes('food')) {
    suggestions.push({
      type: 'food',
      title: 'Food Stop Recommended',
      description: 'The famous Irani chai near Charminar is a must-try. Budget ₹30–50.',
      priority: 'high',
    });
  }

  if (situation.interests.includes('photography')) {
    suggestions.push({
      type: 'tip',
      title: 'Photo Timing',
      description: 'Golden hour is 6:00–7:00 PM today. Plan photogenic spots for this window.',
      priority: 'medium',
    });
  }

  if (situation.travelStyle === 'family') {
    suggestions.push({
      type: 'tip',
      title: 'Family-Friendly',
      description: 'Short walking distances between stops. Rest areas marked on the map. Kid-friendly food options included.',
      priority: 'high',
    });
  }

  return suggestions;
}

// ── Utility Functions ─────────────────────────────────────
function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function calculateTotalDistance(activities: ItineraryActivity[]): string {
  // Simulated distance based on number of activities
  const km = activities.length * 2.8 + Math.random() * 3;
  return `${km.toFixed(1)} km`;
}

// ── Analysis Steps ────────────────────────────────────────
export const analysisSteps = [
  { label: 'Understanding situation', duration: 300 },
  { label: 'Checking time constraints', duration: 250 },
  { label: 'Matching interests', duration: 350 },
  { label: 'Evaluating destinations', duration: 300 },
  { label: 'Checking weather conditions', duration: 250 },
  { label: 'Comparing transport options', duration: 300 },
  { label: 'Optimizing route', duration: 400 },
  { label: 'Finding best experiences', duration: 350 },
  { label: 'Calculating budget fit', duration: 250 },
  { label: 'Building your journey', duration: 300 },
];
