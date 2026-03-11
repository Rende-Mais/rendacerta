import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LiquidityType, LIQUIDITY_LABELS } from '@/constants/data';
import { Colors } from '@/constants/colors';

interface LiquidityPillProps {
  type: LiquidityType;
}

export function LiquidityPill({ type }: LiquidityPillProps) {
  const { label, color } = LIQUIDITY_LABELS[type];

  const bgColors = {
    brand: Colors.brand[50],
    neutral: Colors.neutral[100],
    warning: Colors.warning.light,
  };
  const textColors = {
    brand: Colors.brand[600],
    neutral: Colors.neutral[700],
    warning: Colors.warning.DEFAULT,
  };

  return (
    <View style={[styles.pill, { backgroundColor: bgColors[color] }]}>
      <Text style={[styles.text, { color: textColors[color] }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});
