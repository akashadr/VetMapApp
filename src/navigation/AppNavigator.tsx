import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapDiscoveryScreen } from '../screens/MapDiscoveryScreen';
import { ClinicDetailScreen } from '../screens/ClinicDetailScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { AppointmentsScreen } from '../screens/AppointmentsScreen';
import { DocumentsScreen } from '../screens/DocumentsScreen';
import { BottomTabBar } from '../components/BottomTabBar';
import { RootStackParamList, RootTabParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const TabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={props => <BottomTabBar {...props} />}
  >
    <Tab.Screen name="Home" component={MapDiscoveryScreen} />
    <Tab.Screen name="Tasks" component={TasksScreen} />
    <Tab.Screen name="Appointments" component={AppointmentsScreen} />
    <Tab.Screen name="Documents" component={DocumentsScreen} />
  </Tab.Navigator>
);

export const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen
        name="ClinicDetail"
        component={ClinicDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
