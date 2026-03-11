import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, shadows } from '@/constants/colors';
import { BANKS, calculateReturn, calculateSavingsReturn, formatCurrency, CURRENT_CDI_RATE } from '@/constants/data';
import { BankLogo } from '@/components/BankLogo';

function formatInput(raw: string): string {
  const nums = raw.replace(/\D/g, '');
  if (!nums) return '';
  const cents = parseInt(nums, 10);
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function parseValue(formatted: string): number {
  const clean = formatted.replace(/[R$\s.]/g, '').replace(',', '.');
  return parseFloat(clean) || 0;
}

const PERIOD_OPTIONS = [
  { label: '3 meses', months: 3 },
  { label: '6 meses', months: 6 },
  { label: '1 ano', months: 12 },
  { label: '2 anos', months: 24 },
  { label: '3 anos', months: 36 },
];

export default function CalcularScreen() {
  const insets = useSafeAreaInsets();
  const [inputValue, setInputValue] = useState('');
  const [selectedMonths, setSelectedMonths] = useState(12);
  const [selectedBankId, setSelectedBankId] = useState(BANKS[0].id);

  const amount = parseValue(inputValue);
  const selectedBank = BANKS.find((b) => b.id === selectedBankId) ?? BANKS[0];

  const result = useMemo(() => {
    if (amount <= 0) return null;
    return calculateReturn(amount, selectedBank.cdiRate, selectedMonths, selectedBank.hasTax);
  }, [amount, selectedBank, selectedMonths]);

  const savingsResult = useMemo(() => {
    if (amount <= 0) return 0;
    return calculateSavingsReturn(amount, selectedMonths);
  }, [amount, selectedMonths]);

  const handleInput = (text: string) => {
    const formatted = formatInput(text);
    setInputValue(formatted);
  };

  const getTaxInfo = () => {
    if (!selectedBank.hasTax) return 'Livre de imposto de renda';
    if (selectedMonths <= 6) return 'IR: 22,5% sobre o lucro';
    if (selectedMonths <= 12) return 'IR: 20% sobre o lucro';
    if (selectedMonths <= 24) return 'IR: 17,5% sobre o lucro';
    return 'IR: 15% sobre o lucro';
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={styles.title}>Calculadora</Text>
          <Text style={styles.subtitle}>Simule seu rendimento</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quanto você quer investir?</Text>
          <View style={styles.inputCard}>
            <Text style={styles.inputPrefix}>R$</Text>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={handleInput}
              placeholder="0,00"
              placeholderTextColor={Colors.neutral[300]}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Por quanto tempo?</Text>
          <View style={styles.periodsRow}>
            {PERIOD_OPTIONS.map(({ label, months }) => (
              <TouchableOpacity
                key={months}
                style={[styles.periodPill, selectedMonths === months && styles.periodPillActive]}
                onPress={() => { Haptics.selectionAsync(); setSelectedMonths(months); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.periodText, selectedMonths === months && styles.periodTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Em qual banco?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.bankList}>
              {BANKS.map((bank) => (
                <TouchableOpacity
                  key={bank.id}
                  style={[styles.bankOption, selectedBankId === bank.id && styles.bankOptionSelected]}
                  onPress={() => { Haptics.selectionAsync(); setSelectedBankId(bank.id); }}
                  activeOpacity={0.8}
                >
                  <BankLogo bank={bank} size={36} />
                  <Text style={[styles.bankOptionName, selectedBankId === bank.id && styles.bankOptionNameSelected]}>
                    {bank.shortName}
                  </Text>
                  <Text style={[styles.bankOptionRate, selectedBankId === bank.id && styles.bankOptionRateSelected]}>
                    {bank.cdiRate.toFixed(1)}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {result && amount > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resultado</Text>

            <View style={styles.resultCard}>
              <View style={styles.resultMain}>
                <Text style={styles.resultLabel}>Você terá no final</Text>
                <Text style={styles.resultTotal}>{formatCurrency(amount + result.net)}</Text>
                <Text style={styles.resultSub}>após {selectedMonths} {selectedMonths === 1 ? 'mês' : 'meses'}</Text>
              </View>

              <View style={styles.resultDivider} />

              <View style={styles.resultRow}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultItemLabel}>Lucro líquido</Text>
                  <Text style={[styles.resultItemValue, { color: Colors.brand[500] }]}>
                    +{formatCurrency(result.net)}
                  </Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultItemLabel}>Por mês</Text>
                  <Text style={[styles.resultItemValue, { color: Colors.brand[500] }]}>
                    ≈ {formatCurrency(result.monthly)}
                  </Text>
                </View>
              </View>

              <View style={styles.taxNote}>
                <Feather name="info" size={13} color={Colors.neutral[400]} />
                <Text style={styles.taxNoteText}>* {getTaxInfo()}</Text>
              </View>
            </View>

            <View style={styles.comparisonCard}>
              <Text style={styles.comparisonTitle}>Comparando com...</Text>
              <View style={styles.comparisonRow}>
                <View style={styles.comparisonItem}>
                  <Text style={styles.comparisonLabel}>Poupança</Text>
                  <Text style={styles.comparisonValue}>{formatCurrency(savingsResult)}</Text>
                  <Text style={styles.comparisonDiff}>
                    {formatCurrency(result.net - savingsResult)} a menos
                  </Text>
                </View>
                <View style={[styles.comparisonDivider]} />
                <View style={styles.comparisonItem}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <BankLogo bank={selectedBank} size={18} />
                    <Text style={styles.comparisonLabel}>{selectedBank.shortName}</Text>
                  </View>
                  <Text style={[styles.comparisonValue, { color: Colors.brand[500] }]}>
                    {formatCurrency(result.net)}
                  </Text>
                  <Text style={[styles.comparisonDiff, { color: Colors.brand[500] }]}>
                    +{formatCurrency(result.net - savingsResult)} a mais
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.cdiBenchmark}>
              <Feather name="activity" size={16} color={Colors.neutral[500]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.benchmarkTitle}>CDI atual: {CURRENT_CDI_RATE}% ao ano</Text>
                <Text style={styles.benchmarkDesc}>
                  {selectedBank.shortName} paga {selectedBank.cdiRate.toFixed(1)}% do CDI — acima da média do mercado
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyCalc}>
            <Feather name="edit-3" size={40} color={Colors.neutral[200]} />
            <Text style={styles.emptyCalcText}>Digite um valor para ver a simulação</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[700],
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: Colors.brand[400],
    ...shadows.level1,
  },
  inputPrefix: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[400],
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
    paddingVertical: 16,
  },
  periodsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  periodPill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
  },
  periodPillActive: {
    backgroundColor: Colors.brand[500],
    borderColor: Colors.brand[500],
  },
  periodText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[700],
  },
  periodTextActive: {
    color: Colors.white,
  },
  bankList: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 16,
  },
  bankOption: {
    alignItems: 'center',
    gap: 6,
    padding: 14,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
    minWidth: 80,
  },
  bankOptionSelected: {
    borderColor: Colors.brand[500],
    backgroundColor: Colors.brand[50],
  },
  bankOptionName: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[600],
  },
  bankOptionNameSelected: {
    color: Colors.brand[600],
  },
  bankOptionRate: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[400],
  },
  bankOptionRateSelected: {
    color: Colors.brand[500],
  },
  resultCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    ...shadows.level2,
    borderWidth: 1,
    borderColor: Colors.brand[100],
  },
  resultMain: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  resultLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[500],
  },
  resultTotal: {
    fontSize: 40,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
    letterSpacing: -1,
    marginTop: 4,
  },
  resultSub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
    marginTop: 2,
  },
  resultDivider: {
    height: 1,
    backgroundColor: Colors.neutral[100],
    marginVertical: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  resultItem: {
    alignItems: 'center',
    gap: 4,
  },
  resultItemLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[400],
  },
  resultItemValue: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  taxNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[100],
  },
  taxNoteText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
    flex: 1,
  },
  comparisonCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    ...shadows.level1,
  },
  comparisonTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[500],
    marginBottom: 14,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonItem: {
    flex: 1,
    gap: 4,
  },
  comparisonDivider: {
    width: 1,
    height: 60,
    backgroundColor: Colors.neutral[200],
    marginHorizontal: 16,
  },
  comparisonLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[500],
  },
  comparisonValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[700],
  },
  comparisonDiff: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[400],
  },
  cdiBenchmark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  benchmarkTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[700],
  },
  benchmarkDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
    marginTop: 2,
  },
  emptyCalc: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyCalcText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[300],
    textAlign: 'center',
  },
});
