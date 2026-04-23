import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { UIText, FontWeights } from '../theme/typography';
import { Radius } from '../theme/spacing';

export type BadgeVariant = 'default' | 'success' | 'successSolid' | 'warning' | 'info';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  default:       { bg: Colors.border,     text: Colors.textSecondary },
  success:       { bg: Colors.successBg,  text: Colors.success },
  successSolid:  { bg: Colors.success,    text: Colors.textInverse },
  warning:       { bg: Colors.warningBg,  text: Colors.warning },
  info:          { bg: Colors.accentBg,   text: Colors.accent },
};

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default' }) => {
  const { bg, text } = VARIANT_STYLES[variant];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
  },
  label: {
    ...UIText.caption,
    fontWeight: FontWeights.medium,
  },
});
