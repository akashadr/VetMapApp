import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const Typography = StyleSheet.create({
  h1: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  caption: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textMuted,
    letterSpacing: 0.3,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
