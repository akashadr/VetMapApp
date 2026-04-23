import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TopNavBar } from '../components/TopNavBar';
import { Colors } from '../theme/colors';
import { UIText, FontWeights } from '../theme/typography';

export const AppointmentsScreen: React.FC = () => (
  <View style={styles.container}>
    <TopNavBar title="Appointments" showBack={false} rightIcon="add" />
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>📅</Text>
      <Text style={styles.emptyText}>No appointments yet</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { ...UIText.subHeadline, fontWeight: FontWeights.medium, color: Colors.textMuted },
});
