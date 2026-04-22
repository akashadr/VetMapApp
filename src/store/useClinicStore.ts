import { create } from 'zustand';
import { Clinic, Coordinates } from '../types';
import { MapRegion, getClinicsInRegion, searchClinics } from '../services/clinicService';
import { MOCK_CLINICS } from '../data/mockClinics';

export const DEFAULT_REGION: MapRegion = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

interface ClinicStore {
  // State
  allClinics: Clinic[];
  visibleClinics: Clinic[];
  selectedClinic: Clinic | null;
  searchQuery: string;
  activeFilter: string;
  region: MapRegion;
  userLocation: Coordinates | null;
  locationDenied: boolean;

  // Actions
  setRegion: (region: MapRegion) => void;
  setUserLocation: (coords: Coordinates | null) => void;
  setLocationDenied: (denied: boolean) => void;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: string) => void;
  selectClinic: (clinic: Clinic | null) => void;
  refreshVisibleClinics: () => void;
}

export const useClinicStore = create<ClinicStore>((set, get) => ({
  allClinics: MOCK_CLINICS,
  visibleClinics: MOCK_CLINICS,
  selectedClinic: null,
  searchQuery: '',
  activeFilter: 'all',
  region: DEFAULT_REGION,
  userLocation: null,
  locationDenied: false,

  setRegion: (region) => {
    set({ region });
    get().refreshVisibleClinics();
  },

  setUserLocation: (coords) => {
    set({ userLocation: coords });
    get().refreshVisibleClinics();
  },

  setLocationDenied: (denied) => set({ locationDenied: denied }),

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().refreshVisibleClinics();
  },

  setActiveFilter: (filter) => {
    set({ activeFilter: filter });
    get().refreshVisibleClinics();
  },

  selectClinic: (clinic) => set({ selectedClinic: clinic }),

  refreshVisibleClinics: () => {
    const { region, userLocation, searchQuery, activeFilter } = get();

    let results = searchQuery.trim()
      ? searchClinics(searchQuery, region, userLocation)
      : getClinicsInRegion(region, userLocation);

    if (activeFilter === 'open_now') {
      results = results.filter(c => c.isOpenNow);
    } else if (activeFilter !== 'all') {
      results = results.filter(c => c.speciality === activeFilter);
    }

    set({ visibleClinics: results });
  },
}));
