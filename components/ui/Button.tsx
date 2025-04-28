import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  // Determine styles based on props
  const buttonStyles = [
    styles.button,
    styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`],
    styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    fullWidth && styles.buttonFullWidth,
    disabled && styles.buttonDisabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}`],
    styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    disabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.white : Colors.primary.main}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Layout.borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSmall: {
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.m,
    minHeight: 32,
  },
  buttonMedium: {
    paddingVertical: Layout.spacing.s,
    paddingHorizontal: Layout.spacing.l,
    minHeight: 40,
  },
  buttonLarge: {
    paddingVertical: Layout.spacing.m,
    paddingHorizontal: Layout.spacing.xl,
    minHeight: 48,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary.main,
  },
  buttonSecondary: {
    backgroundColor: Colors.secondary.main,
  },
  buttonOutline: {
    backgroundColor: Colors.transparent,
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  buttonText: {
    backgroundColor: Colors.transparent,
    paddingHorizontal: 0,
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: Colors.grey[300],
    borderColor: Colors.grey[300],
  },
  text: {
    fontWeight: '600',
  },
  textSmall: {
    fontSize: 12,
  },
  textMedium: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 16,
  },
  textPrimary: {
    color: Colors.white,
  },
  textSecondary: {
    color: Colors.white,
  },
  textOutline: {
    color: Colors.primary.main,
  },
  textText: {
    color: Colors.primary.main,
  },
  textDisabled: {
    color: Colors.grey[600],
  },
});