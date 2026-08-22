import { create } from 'zustand';
import type {
  TravelSituation,
  Itinerary,
  ExperienceType,
  TravelStyle,
  TransportPreference,
  FoodPreference,
  TravelDNA,
} from '@/types/travel';

interface AppState {
  // Travel situation
  situation: TravelSituation;
  setSituation: (s: Partial<TravelSituation>) => void;
  resetSituation: () => void;

  // Current itinerary
  itinerary: Itinerary | null;
  setItinerary: (i: Itinerary | null) => void;

  // Analysis state
  isAnalyzing: boolean;
  setIsAnalyzing: (v: boolean) => void;
  analysisProgress: number;
  setAnalysisProgress: (v: number) => void;
  analysisStep: number;
  setAnalysisStep: (v: number) => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (v: boolean) => void;
  aiAssistantOpen: boolean;
  setAiAssistantOpen: (v: boolean) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;

  // Demo mode
  isDemoMode: boolean;
  setIsDemoMode: (v: boolean) => void;
  runDemo: () => void;

  // Travel DNA
  travelDNA: TravelDNA;
  updateTravelDNA: (updates: Partial<TravelDNA>) => void;

  // Offline mode
  offlineMode: boolean;
  setOfflineMode: (v: boolean) => void;
}

const defaultSituation: TravelSituation = {
  currentLocation: '',
  destination: '',
  date: new Date().toISOString().split('T')[0],
  time: '09:00',
  hoursAvailable: 7,
  travelers: 1,
  travelStyle: 'solo',
  budget: 3000,
  currency: '₹',
  interests: ['food', 'culture', 'photography'],
  foodPreference: 'any',
  transportPreference: 'any',
  description: '',
};

const defaultTravelDNA: TravelDNA = {
  food: 88,
  culture: 75,
  nature: 45,
  adventure: 30,
  luxury: 20,
  nightlife: 15,
  photography: 82,
  heritage: 70,
  shopping: 35,
  relaxation: 40,
};

export const useAppStore = create<AppState>((set) => ({
  situation: defaultSituation,
  setSituation: (s) => set((state) => ({ situation: { ...state.situation, ...s } })),
  resetSituation: () => set({ situation: defaultSituation }),

  itinerary: null,
  setItinerary: (i) => set({ itinerary: i }),

  isAnalyzing: false,
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),
  analysisProgress: 0,
  setAnalysisProgress: (v) => set({ analysisProgress: v }),
  analysisStep: 0,
  setAnalysisStep: (v) => set({ analysisStep: v }),

  sidebarOpen: true,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  mobileNavOpen: false,
  setMobileNavOpen: (v) => set({ mobileNavOpen: v }),
  aiAssistantOpen: false,
  setAiAssistantOpen: (v) => set({ aiAssistantOpen: v }),
  darkMode: false,
  setDarkMode: (v) => {
    set({ darkMode: v });
    if (v) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  },

  isDemoMode: false,
  setIsDemoMode: (v) => set({ isDemoMode: v }),
  runDemo: () => {
    set({
      isDemoMode: true,
      situation: {
        currentLocation: 'Hyderabad',
        destination: 'Hyderabad',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        hoursAvailable: 7,
        travelers: 1,
        travelStyle: 'solo',
        budget: 3000,
        currency: '₹',
        interests: ['food', 'culture', 'photography'],
        foodPreference: 'any',
        transportPreference: 'any',
        description: "I'm in Hyderabad, traveling solo, have 7 hours before departure, ₹3,000 budget, and love food, culture and photography.",
      },
    });
  },

  travelDNA: defaultTravelDNA,
  updateTravelDNA: (updates) =>
    set((state) => ({ travelDNA: { ...state.travelDNA, ...updates } })),

  offlineMode: false,
  setOfflineMode: (v) => set({ offlineMode: v }),
}));
