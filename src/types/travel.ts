export type TravelStyle = 'solo' | 'couple' | 'family' | 'group';
export type Budget = 'budget' | 'moderate' | 'premium' | 'luxury';
export type TransportPreference = 'any' | 'bus' | 'metro' | 'train' | 'car' | 'bike' | 'walk';
export type FoodPreference = 'any' | 'vegetarian' | 'vegan' | 'non-veg' | 'jain';
export type ExperienceType = 'food' | 'culture' | 'photography' | 'adventure' | 'nature' | 'shopping' | 'heritage' | 'nightlife' | 'wellness';

export interface TravelSituation {
  currentLocation: string;
  destination?: string;
  date: string;
  time: string;
  hoursAvailable: number;
  travelers: number;
  travelStyle: TravelStyle;
  budget: number;
  currency: string;
  interests: ExperienceType[];
  foodPreference: FoodPreference;
  transportPreference: TransportPreference;
  description: string;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  state: string;
  country: string;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  distance: string;
  budget: string;
  bestTime: string;
  categories: string[];
  matchScore?: number;
  coordinates: GeoPoint;
  highlights: string[];
}

export interface Place {
  id: string;
  name: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'experience' | 'shop' | 'transport' | 'emergency';
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  price: number;
  currency: string;
  priceLevel: 1 | 2 | 3 | 4;
  coordinates: GeoPoint;
  address: string;
  openHours: string;
  tags: string[];
  distance?: number;
  duration?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  bestFor?: string[];
  priorityScore?: number;
  reviews?: Review[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}

export interface ItineraryActivity {
  id: string;
  placeId: string;
  place: Place;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  transportToNext?: TransportOption;
  notes: string;
  cost: number;
  priority: number;
}

export interface Itinerary {
  id: string;
  title: string;
  destination: string;
  date: string;
  activities: ItineraryActivity[];
  totalDuration: string;
  totalDistance: string;
  totalCost: number;
  budget: number;
  fitScore: number;
  safetyBuffer: number; // minutes
  optimizationMode: string;
}

export interface TransportOption {
  type: 'bus' | 'metro' | 'train' | 'uber' | 'ola' | 'rapido' | 'taxi' | 'bike' | 'car-rental' | 'walk';
  provider: string;
  price: number;
  duration: string;
  distance: string;
  transfers: number;
  icon: string;
  label: string;
  isCheapest?: boolean;
  isFastest?: boolean;
  isBestValue?: boolean;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: string;
  rainChance: number;
  icon: string;
}

export interface GuideProfile {
  id: string;
  name: string;
  avatar: string;
  type: 'guide' | 'driver' | 'both';
  verified: boolean;
  rating: number;
  tripCount: number;
  languages: string[];
  specialization: string[];
  pricePerHour: number;
  currency: string;
  reviewCount: number;
  description: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  isVegetarian: boolean;
  isVegan: boolean;
  restaurant: string;
  location: string;
  coordinates: GeoPoint;
  tags: string[];
  image?: string;
}

export interface TravelerMatch {
  id: string;
  name: string;
  avatar: string;
  compatibility: number;
  reasons: string[];
  destination: string;
  date: string;
  interests: ExperienceType[];
  budget: Budget;
}

export interface WalletExpense {
  id: string;
  description: string;
  category: 'accommodation' | 'transport' | 'food' | 'activities' | 'shopping' | 'tickets';
  amount: number;
  currency: string;
  paidBy: string;
  splitType: 'equal' | 'custom' | 'percentage';
  splitAmong: string[];
}

export interface OfflinePack {
  destination: string;
  includesMap: boolean;
  includesItinerary: boolean;
  includesHotels: boolean;
  includesPlaces: boolean;
  includesEmergency: boolean;
  includesTransport: boolean;
  includesPhrases: boolean;
  downloadedAt?: string;
}

export interface AISuggestion {
  type: 'route' | 'food' | 'experience' | 'tip' | 'weather' | 'safety' | 'transport';
  title: string;
  description: string;
  action?: string;
  actionLabel?: string;
  priority: 'high' | 'medium' | 'low';
  data?: Record<string, unknown>;
}

export interface MapMarker {
  id: string;
  position: GeoPoint;
  type: Place['type'];
  name: string;
  rating?: number;
  price?: number;
  priorityScore?: number;
}

export interface EmergencyService {
  id: string;
  name: string;
  type: 'hospital' | 'police' | 'pharmacy' | 'embassy' | 'fire' | 'helpline';
  phone: string;
  address: string;
  distance: number;
  travelTime: string;
  coordinates: GeoPoint;
}

export interface LocalOffer {
  id: string;
  businessName: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  code: string;
  image: string;
  category: string;
  claimed: number;
}

export interface AnalyticsData {
  totalTrips: number;
  totalDistance: number;
  totalSpent: number;
  moneySaved: number;
  favoriteCategories: { name: string; value: number }[];
  transportDistribution: { name: string; value: number }[];
  monthlySpending: { month: string; amount: number }[];
  activityDistribution: { name: string; value: number }[];
}

export interface TravelDNA {
  food: number;
  culture: number;
  nature: number;
  adventure: number;
  luxury: number;
  nightlife: number;
  photography: number;
  heritage: number;
  shopping: number;
  relaxation: number;
}
