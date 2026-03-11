import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { RiskLevel, getRiskColor, getRiskLabel } from '@/constants/data';

interface RiskMeterProps {
  score: number;
  level: RiskLevel;
}

export function RiskMeter({ score, level }: RiskMeterProps) {
  const color = getRiskColor(level);
  const label = getRiskLabel(level);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Segurança do banco</Text>
        <Text style={[styles.score, { color }]}>{score}/100</Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${score}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.levelLabel, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[700],
  },
  score: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  barBg: {
    height: 6,
    backgroundColor: Colors.neutral[200],
    borderRadius: 3,
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  levelLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});
