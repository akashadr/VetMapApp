import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Colors } from '../theme/colors';
import { UIText, FontWeights } from '../theme/typography';
import { Radius, Spacing } from '../theme/spacing';

interface InputFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  rightElement?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  disabled = false,
  rightElement,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const showFloating = hasValue || focused;

  const borderColor = disabled
    ? Colors.border
    : error
    ? Colors.error
    : focused || hasValue
    ? Colors.primary
    : Colors.border;

  return (
    <View>
      <View style={[styles.container, { borderColor }]}>
        <View style={styles.inner}>
          {showFloating && (
            <Text style={[styles.floatingLabel, error ? { color: Colors.error } : null]}>
              {label}
            </Text>
          )}
          <TextInput
            style={[styles.input, !showFloating && styles.inputCentered]}
            value={value}
            onChangeText={onChangeText}
            placeholder={showFloating ? undefined : label}
            placeholderTextColor={disabled ? Colors.textExtra : Colors.textMuted}
            editable={!disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...rest}
          />
        </View>
        {rightElement != null && (
          <View style={styles.rightElement}>{rightElement}</View>
        )}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.input,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.component,
    minHeight: 52,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  floatingLabel: {
    ...UIText.caption,
    fontWeight: FontWeights.medium,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  input: {
    ...UIText.callout,
    color: Colors.textPrimary,
    padding: 0,
  },
  inputCentered: {
    paddingVertical: 4,
  },
  rightElement: {
    marginLeft: Spacing.tight,
  },
  errorText: {
    ...UIText.footnote,
    color: Colors.error,
    marginTop: 4,
    marginLeft: 2,
  },
});
