import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Colors } from '../theme/colors';
import { FontWeights } from '../theme/typography';
import { Radius } from '../theme/spacing';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'large' | 'medium';

interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  onPress,
  fullWidth = true,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        size === 'large' ? styles.sizeLarge : styles.sizeMedium,
        variant === 'primary'
          ? isDisabled ? styles.primaryDisabled : styles.primaryDefault
          : isDisabled ? styles.secondaryDisabled : styles.secondaryDefault,
        !fullWidth && styles.shrink,
      ]}
    >
      <Text
        style={[
          styles.label,
          size === 'medium' && styles.labelMedium,
          variant === 'primary'
            ? isDisabled ? styles.primaryLabelDisabled : styles.primaryLabel
            : isDisabled ? styles.secondaryLabelDisabled : styles.secondaryLabel,
        ]}
      >
        {loading ? `${label}...` : label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shrink: {
    alignSelf: 'flex-start',
  },
  sizeLarge: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  sizeMedium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },

  // Primary
  primaryDefault: {
    backgroundColor: Colors.primary,
  },
  primaryDisabled: {
    backgroundColor: Colors.borderSelected,
  },
  primaryLabel: {
    fontSize: 16,
    fontFamily: 'Satoshi-Variable',
    fontWeight: FontWeights.bold,
    color: Colors.textInverse,
  },
  primaryLabelDisabled: {
    fontSize: 16,
    fontFamily: 'Satoshi-Variable',
    fontWeight: FontWeights.bold,
    color: 'rgba(255,255,255,0.55)',
  },

  // Secondary
  secondaryDefault: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  secondaryDisabled: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  secondaryLabel: {
    fontSize: 16,
    fontFamily: 'Satoshi-Variable',
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  secondaryLabelDisabled: {
    fontSize: 16,
    fontFamily: 'Satoshi-Variable',
    fontWeight: FontWeights.medium,
    color: Colors.textMuted,
  },

  label: {},
  labelMedium: {
    fontSize: 15,
  },
});
