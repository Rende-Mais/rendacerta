import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { BANKS, CURRENT_CDI_RATE } from '@/constants/data';
import { OfferCard } from '@/components/OfferCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { AffiliateSheet } from '@/components/AffiliateSheet';
import { Bank } from '@/constants/data';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'Bom dia';
  if (hour >= 12 && hour < 18) return 'Boa tarde';
  if (hour >= 18 && hour < 23) return 'Boa noite';
  return 'Oi';
}

type FilterType = 'todos' | 'imediata' | 'sem_ir';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'imediata', label: 'Saque quando quiser' },
  { key: 'sem_ir', label: 'Sem imposto' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [loading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('todos');
  const [affiliateBank, setAffiliateBank] = useState<Bank | null>(null);

  const filteredBanks = BANKS.filter((b) => {
    if (selectedFilter === 'imediata') return b.liquidity === 'D+0';
    if (selectedFilter === 'sem_ir') return !b.hasTax;
    return true;
  }).sort((a, b) => b.cdiRate - a.cdiRate);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.brand[500]}
          />
        }
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.headline}>
            Veja onde seu{'\n'}dinheiro rende mais
          </Text>

          {/* CDI banner */}
          <View style={styles.cdiBanner}>
            <Text style={styles.cdiBannerText}>
              Taxa CDI hoje:{' '}
              <Text style={styles.cdiBannerValue}>{CURRENT_CDI_RATE}% ao ano</Text>
            </Text>
          </View>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {FILTERS.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[styles.filter, selectedFilter === key && styles.filterActive]}
              onPress={() => setSelectedFilter(key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, selectedFilter === key && styles.filterTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Count */}
        <View style={styles.listHeader}>
          <Text style={styles.listCount}>
            {filteredBanks.length} {filteredBanks.length === 1 ? 'opção' : 'opções'} encontradas
          </Text>
        </View>

        {/* Cards */}
        <View style={styles.cards}>
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            filteredBanks.map((bank, index) => (
              <OfferCard
                key={bank.id}
                bank={bank}
                index={index}
                onInvestPress={(b) => setAffiliateBank(b)}
              />
            ))
          )}

          {!loading && filteredBanks.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Nenhuma opção com esse filtro</Text>
              <TouchableOpacity onPress={() => setSelectedFilter('todos')}>
                <Text style={styles.emptyAction}>Ver todos</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <AffiliateSheet
        bank={affiliateBank}
        visible={!!affiliateBank}
        onClose={() => setAffiliateBank(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: Colors.white,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[400],
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  headline: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
    lineHeight: 36,
    marginBottom: 18,
  },
  cdiBanner: {
    backgroundColor: Colors.brand[50],
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.brand[100],
  },
  cdiBannerText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[600],
  },
  cdiBannerValue: {
    fontFamily: 'Inter_700Bold',
    color: Colors.brand[600],
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  filter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.neutral[100],
  },
  filterActive: {
    backgroundColor: Colors.neutral[950],
  },
  filterText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[600],
  },
  filterTextActive: {
    color: Colors.white,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  listCount: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[400],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cards: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
  },
  emptyAction: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.brand[500],
  },
});
