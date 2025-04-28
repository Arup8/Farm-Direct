import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 'none' | 'low' | 'medium' | 'high';
  bordered?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export function Card({
  children,
  style,
  elevation = 'medium',
  bordered = false,
  padding = 'medium',
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        styles[`elevation${elevation.charAt(0).toUpperCase() + elevation.slice(1)}`],
        bordered && styles.bordered,
        styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.m,
    overflow: 'hidden',
  },
  elevationNone: {
    elevation: 0,
    shadowOpacity: 0,
  },
  elevationLow: {
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  elevationMedium: {
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  elevationHigh: {
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  bordered: {
    borderWidth: 1,
    borderColor: Colors.grey[200],
  },
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: Layout.spacing.s,
  },
  paddingMedium: {
    padding: Layout.spacing.m,
  },
  paddingLarge: {
    padding: Layout.spacing.l,
  },
});