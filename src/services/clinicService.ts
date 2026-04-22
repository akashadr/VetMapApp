import { Clinic, Coordinates } from '../types';
import { MOCK_CLINICS } from '../data/mockClinics';
import { calculateDistance } from '../utils/distance';

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

function isClinicInRegion(clinic: Clinic, region: MapRegion): boolean {
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
  const latMin = latitude - latitudeDelta / 2;
  const latMax = latitude + latitudeDelta / 2;
  const lngMin = longitude - longitudeDelta / 2;
  const lngMax = longitude + longitudeDelta / 2;
  return (
    clinic.coordinates.latitude >= latMin &&
    clinic.coordinates.latitude <= latMax &&
    clinic.coordinates.longitude >= lngMin &&
    clinic.coordinates.longitude <= lngMax
  );
}

export function getClinicsInRegion(
  region: MapRegion,
  userLocation: Coordinates | null,
): Clinic[] {
  return MOCK_CLINICS.filter(clinic => isClinicInRegion(clinic, region)).map(
    clinic => ({
      ...clinic,
      distance: userLocation
        ? calculateDistance(userLocation, clinic.coordinates)
        : undefined,
    }),
  );
}

export function searchClinics(
  query: string,
  region: MapRegion,
  userLocation: Coordinates | null,
): Clinic[] {
  const q = query.toLowerCase().trim();
  if (!q) return getClinicsInRegion(region, userLocation);
  return MOCK_CLINICS.filter(
    clinic =>
      clinic.name.toLowerCase().includes(q) ||
      clinic.speciality.toLowerCase().includes(q) ||
      clinic.address.toLowerCase().includes(q),
  ).map(clinic => ({
    ...clinic,
    distance: userLocation
      ? calculateDistance(userLocation, clinic.coordinates)
      : undefined,
  }));
}

export function getAllClinics(userLocation: Coordinates | null): Clinic[] {
  return MOCK_CLINICS.map(clinic => ({
    ...clinic,
    distance: userLocation
      ? calculateDistance(userLocation, clinic.coordinates)
      : undefined,
  }));
}
