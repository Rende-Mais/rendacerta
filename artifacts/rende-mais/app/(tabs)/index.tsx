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
import { Feather } from '@expo/vector-icons';
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

type FilterType = 'todos' | 'imediata' | 'sem_ir' | 'fgc';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('todos');
  const [affiliateBank, setAffiliateBank] = useState<Bank | null>(null);
  const [lastUpdated] = useState(new Date());

  const FILTERS: { key: FilterType; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'imediata', label: 'Liquidez imediata' },
    { key: 'sem_ir', label: 'Sem imposto' },
    { key: 'fgc', label: 'FGC protegido' },
  ];

  const filteredBanks = BANKS.filter((b) => {
    if (selectedFilter === 'imediata') return b.liquidity === 'D+0';
    if (selectedFilter === 'sem_ir') return !b.hasTax;
    if (selectedFilter === 'fgc') return b.fgcCovered;
    return true;
  }).sort((a, b) => b.cdiRate - a.cdiRate);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

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
            title="Buscando as melhores taxas..."
            titleColor={Colors.neutral[500]}
          />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.subTitle}>Veja onde seu dinheiro rende mais hoje</Text>
          </View>
          <View style={styles.cdiBox}>
            <Text style={styles.cdiLabel}>CDI</Text>
            <Text style={styles.cdiValue}>{CURRENT_CDI_RATE}%</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Feather name="trending-up" size={16} color={Colors.brand[500]} />
            <Text style={styles.statValue}>{BANKS.length}</Text>
            <Text style={styles.statLabel}>bancos comparados</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Feather name="award" size={16} color={Colors.brand[500]} />
            <Text style={styles.statValue}>{Math.max(...BANKS.map(b => b.cdiRate)).toFixed(1)}%</Text>
            <Text style={styles.statLabel}>melhor taxa</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Feather name="clock" size={16} color={Colors.neutral[400]} />
            <Text style={styles.statValue}>{formatTime(lastUpdated)}</Text>
            <Text style={styles.statLabel}>atualizado</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {FILTERS.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[styles.filterPill, selectedFilter === key && styles.filterPillActive]}
              onPress={() => setSelectedFilter(key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, selectedFilter === key && styles.filterTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
            <View style={styles.emptyState}>
              <Feather name="search" size={40} color={Colors.neutral[300]} />
              <Text style={styles.emptyTitle}>Não encontramos opções com esse filtro.</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
  },
  subTitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    marginTop: 2,
  },
  cdiBox: {
    backgroundColor: Colors.brand[50],
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.brand[200],
  },
  cdiLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.brand[500],
    letterSpacing: 1,
  },
  cdiValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.brand[600],
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.neutral[200],
    marginVertical: 4,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  filterPillActive: {
    backgroundColor: Colors.brand[500],
    borderColor: Colors.brand[500],
  },
  filterText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[700],
  },
  filterTextActive: {
    color: Colors.white,
  },
  cards: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[500],
    textAlign: 'center',
  },
  emptyAction: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.brand[500],
  },
});
