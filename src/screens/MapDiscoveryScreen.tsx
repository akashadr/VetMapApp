import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import MapView, { Region, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Geolocation from '@react-native-community/geolocation';

import { useClinicStore, DEFAULT_REGION } from '../store/useClinicStore';
import { mapStyle } from '../theme/mapStyle';
import { Colors } from '../theme/colors';
import { ClinicPin } from '../components/ClinicPin';
import { BottomSheetPanel } from '../components/BottomSheetPanel';
import { SearchBar } from '../components/SearchBar';
import { FilterChips } from '../components/FilterChips';
import { Clinic, Coordinates, RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'MapDiscovery'>;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CLUSTER_DELTA_THRESHOLD = 0.05;

type ClusterItem =
  | { isClustered: false; clinic: Clinic }
  | { isClustered: true; count: number; coordinate: Coordinates; ids: string[] };

function buildClusters(clinics: Clinic[], latDelta: number): ClusterItem[] {
  if (latDelta < CLUSTER_DELTA_THRESHOLD) {
    return clinics.map(c => ({ isClustered: false as const, clinic: c }));
  }
  const clusterRadius = latDelta * 0.3;
  const visited = new Set<string>();
  const result: ClusterItem[] = [];

  clinics.forEach(clinic => {
    if (visited.has(clinic.id)) return;
    const nearby = clinics.filter(
      c =>
        !visited.has(c.id) &&
        Math.abs(c.coordinates.latitude - clinic.coordinates.latitude) < clusterRadius &&
        Math.abs(c.coordinates.longitude - clinic.coordinates.longitude) < clusterRadius,
    );
    if (nearby.length > 1) {
      const avgLat = nearby.reduce((s, c) => s + c.coordinates.latitude, 0) / nearby.length;
      const avgLng = nearby.reduce((s, c) => s + c.coordinates.longitude, 0) / nearby.length;
      nearby.forEach(c => visited.add(c.id));
      result.push({ isClustered: true, count: nearby.length, coordinate: { latitude: avgLat, longitude: avgLng }, ids: nearby.map(c => c.id) });
    } else {
      visited.add(clinic.id);
      result.push({ isClustered: false, clinic });
    }
  });
  return result;
}

const animateTo = (
  mapRef: React.RefObject<MapView | null>,
  latitude: number,
  longitude: number,
  zoom = 14,
  duration = 500,
) => {
  mapRef.current?.animateCamera(
    { center: { latitude, longitude }, zoom },
    { duration },
  );
};

export const MapDiscoveryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const mapRef = useRef<MapView | null>(null);

  const {
    visibleClinics, selectedClinic, searchQuery, activeFilter, region,
    setRegion, setUserLocation, setLocationDenied,
    setSearchQuery, setActiveFilter, selectClinic,
  } = useClinicStore();

  useEffect(() => { requestLocation(); }, []);

  const requestLocation = useCallback(async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        setLocationDenied(true);
        return;
      }
    }
    Geolocation.getCurrentPosition(
      pos => {
        const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setUserLocation(coords);
        animateTo(mapRef, coords.latitude, coords.longitude, 13, 800);
      },
      () => { setLocationDenied(true); setUserLocation(null); },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }, [setUserLocation, setLocationDenied]);

  const handleRegionChangeComplete = useCallback(
    (r: Region) => setRegion(r), [setRegion],
  );

  const handlePinPress = useCallback((clinic: Clinic) => {
    selectClinic(clinic);
    animateTo(mapRef, clinic.coordinates.latitude, clinic.coordinates.longitude, 15, 500);
  }, [selectClinic]);

  const handleCardPress = useCallback((clinic: Clinic) => {
    selectClinic(clinic);
    animateTo(mapRef, clinic.coordinates.latitude, clinic.coordinates.longitude, 15, 500);
  }, [selectClinic]);

  const handleCardDetailPress = useCallback(
    (clinic: Clinic) => navigation.navigate('ClinicDetail', { clinic }),
    [navigation],
  );

  const clusters = useMemo(
    () => buildClusters(visibleClinics, region.latitudeDelta),
    [visibleClinics, region.latitudeDelta],
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={DEFAULT_REGION}
        customMapStyle={mapStyle}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        zoomEnabled
        zoomControlEnabled
        scrollEnabled
        rotateEnabled={false}
        pitchEnabled={false}
        onPress={() => selectClinic(null)}
      >
        {clusters.map((item, idx) => {
          if (!item.isClustered) {
            return (
              <ClinicPin
                key={item.clinic.id}
                clinic={item.clinic}
                isSelected={selectedClinic?.id === item.clinic.id}
                onPress={handlePinPress}
              />
            );
          }
          return (
            <Marker
              key={`cluster-${idx}`}
              coordinate={item.coordinate}
              tracksViewChanges={false}
              onPress={() => animateTo(mapRef, item.coordinate.latitude, item.coordinate.longitude, 15, 500)}
            >
              <View style={styles.cluster}>
                <Text style={styles.clusterText}>{item.count}</Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      <View style={[styles.topOverlay, { paddingTop: insets.top + 8 }]}>
        <View style={styles.searchRow}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        </View>
        <FilterChips activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        {visibleClinics.length === 0 && (
          <View style={styles.emptyBanner}>
            <Text style={styles.emptyText}>No clinics in this area</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.myLocationBtn, { bottom: SCREEN_HEIGHT * 0.38 + 16 }]}
        onPress={requestLocation}
      >
        <Text style={styles.myLocationIcon}>📍</Text>
      </TouchableOpacity>

      <BottomSheetPanel
        clinics={visibleClinics}
        selectedClinic={selectedClinic}
        onCardPress={handleCardPress}
        onCardDetailPress={handleCardDetailPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topOverlay: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  searchRow: { paddingHorizontal: 16, paddingBottom: 6 },
  emptyBanner: {
    alignSelf: 'center', backgroundColor: Colors.surface,
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    marginTop: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
  },
  emptyText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  myLocationBtn: {
    position: 'absolute', right: 16, width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 4, zIndex: 10,
  },
  myLocationIcon: { fontSize: 20 },
  cluster: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.accentLight,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 5,
  },
  clusterText: { color: Colors.textInverse, fontWeight: '800', fontSize: 14 },
});
