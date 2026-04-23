import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontWeights } from '../theme/typography';
import { Radius, Spacing } from '../theme/spacing';
import {
  HomeIcon,
  TasksIcon,
  AppointmentsIcon,
  DocumentsIcon,
} from './TabIcons';

const ICON_SIZE = 26;
const ACTIVE_COLOR = Colors.textInverse;
const INACTIVE_COLOR = Colors.textSecondary;

function renderIcon(name: string, color: string) {
  switch (name) {
    case 'Home':         return <HomeIcon color={color} size={ICON_SIZE} />;
    case 'Tasks':        return <TasksIcon color={color} size={ICON_SIZE} />;
    case 'Appointments': return <AppointmentsIcon color={color} size={ICON_SIZE} />;
    case 'Documents':    return <DocumentsIcon color={color} size={ICON_SIZE} />;
    default:             return null;
  }
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = (options.tabBarLabel as string) ?? options.title ?? route.name;
        const isFocused = state.index === index;
        const iconColor = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.85}
            style={styles.tab}
          >
            <View style={[styles.tabInner, isFocused && styles.tabInnerActive]}>
              {renderIcon(route.name, iconColor)}
              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
    paddingHorizontal: Spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.large,   // 20px — matches Figma rounded square
    minWidth: 70,
  },
  tabInnerActive: {
    backgroundColor: Colors.primary,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Satoshi-Variable',
    fontWeight: FontWeights.semiBold,
    color: INACTIVE_COLOR,
    marginTop: 5,
  },
  labelActive: {
    color: ACTIVE_COLOR,
  },
});
