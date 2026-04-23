import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontWeights } from '../theme/typography';
import { Spacing, Radius } from '../theme/spacing';

export type NavRightIcon = 'search' | 'add' | 'edit' | 'delete' | 'none';

interface TopNavBarProps {
  title: string;
  showBack?: boolean;
  rightIcon?: NavRightIcon;
  onBack?: () => void;
  onRight?: () => void;
}

const RightIconView: React.FC<{ type: NavRightIcon; onPress?: () => void }> = ({
  type,
  onPress,
}) => {
  if (type === 'none') return <View style={styles.iconSlot} />;

  if (type === 'delete') {
    return (
      <TouchableOpacity style={styles.iconSlot} onPress={onPress} hitSlop={HIT_SLOP}>
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    );
  }

  if (type === 'edit') {
    return (
      <TouchableOpacity style={styles.iconSlot} onPress={onPress} hitSlop={HIT_SLOP}>
        <Text style={styles.editIcon}>✏️</Text>
      </TouchableOpacity>
    );
  }

  if (type === 'add') {
    return (
      <TouchableOpacity style={styles.iconSlot} onPress={onPress} hitSlop={HIT_SLOP}>
        <View style={styles.addCircle}>
          <Text style={styles.addIcon}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // search
  return (
    <TouchableOpacity style={styles.iconSlot} onPress={onPress} hitSlop={HIT_SLOP}>
      <View style={styles.outlineCircle}>
        <Text style={styles.searchIcon}>🔍</Text>
      </View>
    </TouchableOpacity>
  );
};

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export const TopNavBar: React.FC<TopNavBarProps> = ({
  title,
  showBack = true,
  rightIcon = 'none',
  onBack,
  onRight,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconSlot}
            onPress={onBack}
            hitSlop={HIT_SLOP}
          >
            <View style={styles.outlineCircle}>
              <Text style={styles.chevron}>‹</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.iconSlot} />
        )}

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <RightIconView type={rightIcon} onPress={onRight} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: 12,
  },
  iconSlot: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Satoshi-Variable',
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
  },
  outlineCircle: {
    width: 34,
    height: 34,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCircle: {
    width: 34,
    height: 34,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    fontSize: 22,
    color: Colors.textPrimary,
    lineHeight: 26,
    marginLeft: -2,
  },
  searchIcon: {
    fontSize: 14,
  },
  addIcon: {
    fontSize: 20,
    color: Colors.textInverse,
    lineHeight: 22,
  },
  deleteIcon: {
    fontSize: 20,
  },
  editIcon: {
    fontSize: 18,
  },
});
