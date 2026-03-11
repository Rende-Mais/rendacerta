import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { Bank, calculateReturn, formatCurrency, INVESTMENT_LABELS } from '@/constants/data';
import { Colors, shadows } from '@/constants/colors';
import { BankLogo } from './BankLogo';
import { LiquidityPill } from './LiquidityPill';
import { Badge } from './ui/Badge';

interface OfferCardProps {
  bank: Bank;
  investmentAmount?: number;
  index?: number;
  onInvestPress?: (bank: Bank) => void;
}

export function OfferCard({ bank, investmentAmount = 1000, index = 0, onInvestPress }: OfferCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const { net, monthly } = calculateReturn(investmentAmount, bank.cdiRate, 12, bank.hasTax);

  const handleCardPress = () => {
    Haptics.selectionAsync();
    router.push({ pathname: '/banco/[id]', params: { id: bank.id } });
  };

  const handleInvestPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onInvestPress?.(bank);
  };

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 20 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
  };

  const isTopCard = bank.isRecommended;

  return (
    <Animated.View style={[{ transform: [{ scale }] }]}>
      <TouchableOpacity
        style={[
          styles.card,
          isTopCard && styles.topCard,
        ]}
        onPress={handleCardPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {isTopCard && (
          <View style={styles.recommendedBanner}>
            <Feather name="star" size={12} color={Colors.white} />
            <Text style={styles.recommendedText}>Indicação do Rende Mais</Text>
          </View>
        )}

        <View style={styles.header}>
          <BankLogo bank={bank} size={44} />
          <View style={styles.bankInfo}>
            <Text style={styles.bankName}>{bank.name}</Text>
            <Text style={styles.investmentType}>{INVESTMENT_LABELS[bank.investmentType]}</Text>
          </View>
          <Feather name="chevron-right" size={20} color={Colors.neutral[400]} />
        </View>

        <View style={styles.rateSection}>
          <Text style={styles.rateValue}>{bank.cdiRate.toFixed(1)}%</Text>
          <Text style={styles.rateLabel}>ao ano · {bank.cdiRate.toFixed(1)}% do CDI</Text>
        </View>

        <View style={styles.projection}>
          <Text style={styles.projectionValue}>
            ≈ {formatCurrency(monthly)}/mês
          </Text>
          <Text style={styles.projectionNote}>
            com {formatCurrency(investmentAmount)} investido por 12 meses
          </Text>
        </View>

        <View style={styles.pills}>
          <LiquidityPill type={bank.liquidity} />
          {bank.fgcCovered && <Badge label="FGC protegido" variant="fgc" size="sm" />}
          {!bank.hasTax && <Badge label="Sem IR" variant="brand" size="sm" />}
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.investButton}
          onPress={handleInvestPress}
          activeOpacity={0.85}
        >
          <Text style={styles.investButtonText}>Investir na {bank.shortName}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...shadows.level1,
  },
  topCard: {
    borderWidth: 1.5,
    borderColor: Colors.brand[200],
    ...shadows.level2,
  },
  recommendedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.brand[500],
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  recommendedText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
  },
  investmentType: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    marginTop: 1,
  },
  rateSection: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  rateValue: {
    fontSize: 34,
    fontFamily: 'Inter_700Bold',
    color: Colors.brand[500],
    letterSpacing: -1,
  },
  rateLabel: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
  },
  projection: {
    marginTop: 4,
  },
  projectionValue: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[950],
  },
  projectionNote: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
    marginTop: 2,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral[100],
    marginVertical: 14,
  },
  investButton: {
    backgroundColor: Colors.brand[500],
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  investButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
});
