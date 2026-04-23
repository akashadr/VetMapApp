import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Radius } from '../theme/spacing';
import { SearchIcon } from './TabIcons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search hospital, boarder, breeder',
}) => {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={[styles.input, isActive ? styles.inputActive : styles.inputDefault]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        returnKeyType="search"
        clearButtonMode="never"
        autoCorrect={false}
        autoCapitalize="none"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value.length > 0 ? (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.iconBtn}
        >
          <Text style={styles.clearIcon}>✕</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn}>
          <SearchIcon color={Colors.textMuted} size={18} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    fontFamily: 'Satoshi-Variable',
    fontSize: 17,
    lineHeight: 22,
    color: Colors.textPrimary,
    padding: 0,
  },
  inputDefault: {
    fontWeight: '400',
  },
  inputActive: {
    fontWeight: '500',
  },
  iconBtn: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textMuted,
  },
});
