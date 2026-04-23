export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface OpenHours {
  open: string;
  close: string;
  days: string;
}

export interface Clinic {
  id: string;
  name: string;
  speciality: string;
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
  coordinates: Coordinates;
  hours: OpenHours;
  isOpenNow: boolean;
  imageUrl?: string;
  distance?: number;
}

export type FilterType = 'all' | 'open_now' | string;

export type RootTabParamList = {
  Home: undefined;
  Tasks: undefined;
  Appointments: undefined;
  Documents: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  ClinicDetail: { clinic: Clinic };
};
