import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MapDiscoveryScreen } from '../screens/MapDiscoveryScreen';
import { ClinicDetailScreen } from '../screens/ClinicDetailScreen';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapDiscovery" component={MapDiscoveryScreen} />
      <Stack.Screen
        name="ClinicDetail"
        component={ClinicDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
