import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, shadows } from '@/constants/colors';
import { BANKS, Bank, calculateReturn, calculateSavingsReturn, formatCurrency, INVESTMENT_LABELS, LIQUIDITY_LABELS } from '@/constants/data';
import { BankLogo } from '@/components/BankLogo';
import { RiskMeter } from '@/components/RiskMeter';

const INVESTMENT_VALUES = [1000, 5000, 10000, 50000];

export default function CompararScreen() {
  const insets = useSafeAreaInsets();
  const [selectedBanks, setSelectedBanks] = useState<string[]>([BANKS[0].id, BANKS[2].id]);
  const [investmentValue, setInvestmentValue] = useState(5000);
  const [months, setMonths] = useState(12);

  const toggleBank = (id: string) => {
    Haptics.selectionAsync();
    setSelectedBanks((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((b) => b !== id);
      }
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const comparedBanks = BANKS.filter((b) => selectedBanks.includes(b.id));

  const getReturn = (bank: Bank) => calculateReturn(investmentValue, bank.cdiRate, months, bank.hasTax);
  const savingsReturn = calculateSavingsReturn(investmentValue, months);

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={styles.title}>Comparar bancos</Text>
          <Text style={styles.subtitle}>Escolha até 3 bancos para comparar</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurar simulação</Text>
          <View style={styles.configCard}>
            <Text style={styles.configLabel}>Valor investido</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {INVESTMENT_VALUES.map((v) => (
                  <TouchableOpacity
                    key={v}
                    style={[styles.valuePill, investmentValue === v && styles.valuePillActive]}
                    onPress={() => { Haptics.selectionAsync(); setInvestmentValue(v); }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.valuePillText, investmentValue === v && styles.valuePillTextActive]}>
                      {formatCurrency(v)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Text style={[styles.configLabel, { marginTop: 16 }]}>Período</Text>
            <View style={styles.monthsRow}>
              {[3, 6, 12, 24].map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.monthPill, months === m && styles.monthPillActive]}
                  onPress={() => { Haptics.selectionAsync(); setMonths(m); }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.monthText, months === m && styles.monthTextActive]}>
                    {m === 12 ? '1 ano' : m === 24 ? '2 anos' : `${m} meses`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecionar bancos</Text>
          <View style={styles.bankGrid}>
            {BANKS.map((bank) => {
              const isSelected = selectedBanks.includes(bank.id);
              return (
                <TouchableOpacity
                  key={bank.id}
                  style={[styles.bankChip, isSelected && styles.bankChipSelected]}
                  onPress={() => toggleBank(bank.id)}
                  activeOpacity={0.8}
                >
                  <BankLogo bank={bank} size={28} />
                  <Text style={[styles.bankChipText, isSelected && styles.bankChipTextSelected]}>
                    {bank.shortName}
                  </Text>
                  {isSelected && (
                    <Feather name="check" size={14} color={Colors.brand[500]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {comparedBanks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comparação</Text>

            <View style={styles.compareGrid}>
              {comparedBanks.map((bank) => {
                const { net, monthly } = getReturn(bank);
                const vssSavings = net - savingsReturn;

                return (
                  <View key={bank.id} style={[styles.compareCard, bank.isRecommended && styles.compareCardTop]}>
                    {bank.isRecommended && (
                      <View style={styles.topBadge}>
                        <Text style={styles.topBadgeText}>Melhor</Text>
                      </View>
                    )}
                    <BankLogo bank={bank} size={36} />
                    <Text style={styles.compareBankName}>{bank.shortName}</Text>
                    <Text style={styles.compareRate}>{bank.cdiRate.toFixed(1)}%</Text>
                    <Text style={styles.compareRateLabel}>ao ano</Text>
                    <View style={styles.compareDivider} />
                    <Text style={styles.compareNetLabel}>Ganho líquido</Text>
                    <Text style={styles.compareNetValue}>{formatCurrency(net)}</Text>
                    <Text style={styles.compareMonthly}>{formatCurrency(monthly)}/mês</Text>
                    {vssSavings > 0 && (
                      <View style={styles.vsSavings}>
                        <Feather name="arrow-up" size={10} color={Colors.brand[500]} />
                        <Text style={styles.vsSavingsText}>+{formatCurrency(vssSavings)} vs poupança</Text>
                      </View>
                    )}
                    <View style={styles.compareDetails}>
                      <Text style={styles.compareDetailText}>
                        {bank.hasTax ? 'Com IR' : 'Sem IR'}
                      </Text>
                      <Text style={styles.compareDetailText}>
                        {LIQUIDITY_LABELS[bank.liquidity].label.split(' ').slice(0, 2).join(' ')}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.savingsCompareCard}>
              <Feather name="home" size={18} color={Colors.neutral[400]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.savingsLabel}>Poupança (referência)</Text>
                <Text style={styles.savingsValue}>{formatCurrency(savingsReturn)}</Text>
                <Text style={styles.savingsSub}>em {months} meses · 0,5% ao mês</Text>
              </View>
            </View>
          </View>
        )}

        {comparedBanks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Segurança dos bancos</Text>
            <View style={styles.riskCards}>
              {comparedBanks.map((bank) => (
                <View key={bank.id} style={styles.riskCard}>
                  <View style={styles.riskHeader}>
                    <BankLogo bank={bank} size={28} />
                    <Text style={styles.riskBankName}>{bank.shortName}</Text>
                  </View>
                  <RiskMeter score={bank.riskScore} level={bank.riskLevel} />
                  <Text style={styles.riskDesc}>{bank.description}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[950],
    marginBottom: 12,
  },
  configCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    ...shadows.level1,
  },
  configLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[500],
    letterSpacing: 0.5,
  },
  valuePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.neutral[100],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  valuePillActive: {
    backgroundColor: Colors.brand[500],
    borderColor: Colors.brand[500],
  },
  valuePillText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[700],
  },
  valuePillTextActive: {
    color: Colors.white,
  },
  monthsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  monthPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.neutral[100],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  monthPillActive: {
    backgroundColor: Colors.brand[500],
    borderColor: Colors.brand[500],
  },
  monthText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[700],
  },
  monthTextActive: {
    color: Colors.white,
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bankChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
  },
  bankChipSelected: {
    borderColor: Colors.brand[500],
    backgroundColor: Colors.brand[50],
  },
  bankChipText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[700],
  },
  bankChipTextSelected: {
    color: Colors.brand[600],
  },
  compareGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  compareCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    ...shadows.level1,
    position: 'relative',
  },
  compareCardTop: {
    borderWidth: 1.5,
    borderColor: Colors.brand[200],
    ...shadows.level2,
  },
  topBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: Colors.brand[500],
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  topBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  compareBankName: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[700],
  },
  compareRate: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.brand[500],
    marginTop: 2,
  },
  compareRateLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
  },
  compareDivider: {
    height: 1,
    backgroundColor: Colors.neutral[100],
    width: '100%',
    marginVertical: 6,
  },
  compareNetLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[400],
  },
  compareNetValue: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
    textAlign: 'center',
  },
  compareMonthly: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
  },
  vsSavings: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.brand[50],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 2,
  },
  vsSavingsText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.brand[600],
  },
  compareDetails: {
    gap: 2,
    width: '100%',
  },
  compareDetailText: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
    textAlign: 'center',
  },
  savingsCompareCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  savingsLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[500],
  },
  savingsValue: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[700],
  },
  savingsSub: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
  },
  riskCards: {
    gap: 12,
  },
  riskCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    ...shadows.level1,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  riskBankName: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[950],
  },
  riskDesc: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    lineHeight: 20,
  },
});
