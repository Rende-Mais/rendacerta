import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

type BadgeVariant = 'brand' | 'fgc' | 'neutral' | 'warning' | 'error';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  brand: { bg: Colors.brand[500], text: Colors.white },
  fgc: { bg: Colors.fgc.badge, text: Colors.white },
  neutral: { bg: Colors.neutral[100], text: Colors.neutral[700] },
  warning: { bg: Colors.warning.light, text: Colors.warning.DEFAULT },
  error: { bg: Colors.error.light, text: Colors.error.DEFAULT },
};

export function Badge({ label, variant = 'neutral', size = 'md' }: BadgeProps) {
  const vs = variantStyles[variant];
  return (
    <View style={[styles.badge, { backgroundColor: vs.bg }, size === 'sm' && styles.sm]}>
      <Text style={[styles.text, { color: vs.text }, size === 'sm' && styles.textSm]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 16,
  },
  textSm: {
    fontSize: 11,
  },
});
