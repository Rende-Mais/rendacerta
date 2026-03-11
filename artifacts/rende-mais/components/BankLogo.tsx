import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Bank } from '@/constants/data';

interface BankLogoProps {
  bank: Bank;
  size?: number;
}

export function BankLogo({ bank, size = 40 }: BankLogoProps) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bank.color,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.3 }]}>{bank.logo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
});
