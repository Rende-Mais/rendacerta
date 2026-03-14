import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Animated,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '@/components/ui/AppIcon';
import { Colors } from '@/constants/colors';
import { Bank } from '@/constants/data';
import { OfferCard } from '@/components/OfferCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { AffiliateSheet } from '@/components/AffiliateSheet';
import { BannerAdSlot } from '@/components/ads/BannerAdSlot';
import { NativeOfferAdCard } from '@/components/ads/NativeOfferAdCard';
import { FilterSheet, FilterState, DEFAULT_FILTERS } from '@/components/FilterSheet';
import { useAppData } from '@/providers/AppDataProvider';
import { shouldInjectNativeAd, shouldShowHomeBanner } from '@/services/adMonetization';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'Bom dia';
  if (hour >= 12 && hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function countActiveFilters(f: FilterState): number {
  return [
    f.investmentType !== 'todos',
    f.liquidity !== 'todos',
    f.minRate > 0,
    f.fgcOnly,
    f.noTaxOnly,
    f.maxMinimum > 0,
  ].filter(Boolean).length;
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function applyFilters(banks: Bank[], f: FilterState): Bank[] {
  return banks
    .filter((b) => {
      if (f.investmentType !== 'todos' && b.investmentType !== f.investmentType) return false;
      if (f.liquidity !== 'todos' && b.liquidity !== f.liquidity) return false;
      if (f.minRate > 0 && b.cdiRate < f.minRate) return false;
      if (f.fgcOnly && !b.fgcCovered) return false;
      if (f.noTaxOnly && b.hasTax) return false;
      if (f.maxMinimum > 0 && b.minimumAmount > f.maxMinimum) return false;
      return true;
    })
    .sort((a, b) => b.cdiRate - a.cdiRate);
}

export default function HomeScreen() {
  const { banks, currentCdiRate, adsConfig, refreshCatalog, isCatalogLoading, trackAffiliateClick } = useAppData();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [affiliateBank, setAffiliateBank] = useState<Bank | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [bankQuery, setBankQuery] = useState('');

  const scrollY = useRef(new Animated.Value(0)).current;

  // Sticky header fade in on scroll
  const headerBlurOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const headerBgOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 0.1],
    extrapolate: 'clamp',
  });

  const normalizedQuery = normalizeText(bankQuery);
  const filteredBanks = applyFilters(banks, filters).filter((bank) => {
    if (!normalizedQuery) return true;
    const haystack = normalizeText(`${bank.name} ${bank.shortName}`);
    return haystack.includes(normalizedQuery);
  });
  const activeCount = countActiveFilters(filters);
  const showBannerSlot = shouldShowHomeBanner(adsConfig);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    void refreshCatalog()
      .catch((error) => {
        console.warn('Falha ao atualizar catalogo:', error);
      })
      .finally(() => setRefreshing(false));
  }, [refreshCatalog]);

  const handleApplyFilters = (f: FilterState) => {
    setFilters(f);
    setFilterOpen(false);
  };

  const handleInvestPress = (bank: Bank) => {
    void trackAffiliateClick({
      bank,
      sourceScreen: 'home',
      sourceComponent: 'offer_card_invest_button',
    });
    setAffiliateBank(bank);
  };

  return (
    <View style={styles.container}>
      {/* Animated sticky header */}
      <Animated.View
        style={[
          styles.stickyHeader,
          { paddingTop: insets.top, opacity: headerBlurOpacity, height: insets.top },
        ]}
        pointerEvents="none"
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: 'rgba(9,9,11,0.65)', opacity: headerBgOpacity },
          ]}
        />
        <View style={styles.stickyDivider} />
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.brand[500]}
          />
        }
        contentContainerStyle={{ paddingBottom: showBannerSlot ? 210 : 110 }}
      >
        {/* Hero header */}
        <View style={[styles.hero, { paddingTop: insets.top + 20 }]}>
          <View style={styles.heroTop}>
            <View style={styles.heroTextWrap}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.headline}>
                Onde <Text style={styles.headlineBrand}>rende mais</Text>{'\n'}hoje?
              </Text>
            </View>
          </View>

          <View style={styles.cdiRow}>
            {/* CDI pill */}
            <View style={styles.cdiBubbleWrap}>
              <View style={styles.cdiBubble}>
                <View style={styles.cdiBubbleOverlay} />
                <AppIcon name="activity" size={13} color={Colors.brand[500]} />
                <Text style={styles.cdiBubbleText}>
                  CDI atual:{' '}
                  <Text style={styles.cdiBubbleValue}>{currentCdiRate}% ao ano</Text>
                </Text>
              </View>
            </View>

            {/* Filter button */}
            <TouchableOpacity
              style={[styles.filterBtn, activeCount > 0 && styles.filterBtnActive]}
              onPress={() => setFilterOpen(true)}
              activeOpacity={0.8}
            >
              <AppIcon
                name="sliders"
                size={16}
                color={activeCount > 0 ? Colors.white : Colors.neutral[800]}
                weight={activeCount > 0 ? 'fill' : 'regular'}
              />
              <Text style={[styles.filterText, activeCount > 0 && styles.filterTextActive]}>
                Filtrar
              </Text>
              {activeCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{activeCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Bank search */}
        <View style={styles.searchWrap}>
          <AppIcon name="search" size={16} color={Colors.neutral[400]} />
          <TextInput
            style={styles.searchInput}
            value={bankQuery}
            onChangeText={setBankQuery}
            placeholder="Buscar banco pelo nome"
            placeholderTextColor={Colors.neutral[300]}
            returnKeyType="search"
          />
          {bankQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setBankQuery('')}
              style={styles.searchClear}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppIcon name="x" size={14} color={Colors.neutral[400]} />
            </TouchableOpacity>
          )}
        </View>

        {/* Active filter chips */}
        {activeCount > 0 && (
          <View style={styles.activeFiltersRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activeFiltersScroll}>
              {filters.investmentType !== 'todos' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>{filters.investmentType}</Text>
                </View>
              )}
              {filters.liquidity !== 'todos' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>{filters.liquidity}</Text>
                </View>
              )}
              {filters.minRate > 0 && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>{filters.minRate}%+ CDI</Text>
                </View>
              )}
              {filters.fgcOnly && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>FGC</Text>
                </View>
              )}
              {filters.noTaxOnly && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>Sem IR</Text>
                </View>
              )}
              {filters.maxMinimum > 0 && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>Mín. até R$ {filters.maxMinimum.toLocaleString('pt-BR')}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.clearChip} onPress={() => setFilters(DEFAULT_FILTERS)}>
                <AppIcon name="x" size={12} color={Colors.neutral[500]} />
                <Text style={styles.clearChipText}>Limpar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Count */}
        <View style={styles.listHeader}>
          <Text style={styles.listCount}>
            {filteredBanks.length} {filteredBanks.length === 1 ? 'opção encontrada' : 'opções encontradas'}
          </Text>
          {activeCount === 0 && (
            <Text style={styles.listSub}>ordenado por maior taxa</Text>
          )}
        </View>

        {/* Cards */}
        <View style={styles.cards}>
          {isCatalogLoading && filteredBanks.length === 0 ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredBanks.length > 0 ? (
            filteredBanks.map((bank, index) => (
              <React.Fragment key={bank.id}>
                <OfferCard
                  bank={bank}
                  index={index}
                  isBest={index === 0}
                  currentCdiRate={currentCdiRate}
                  onInvestPress={handleInvestPress}
                />
                {shouldInjectNativeAd(index + 1, adsConfig) ? <NativeOfferAdCard /> : null}
              </React.Fragment>
            ))
          ) : (
            <View style={styles.emptyState}>
              <AppIcon name="search" size={36} color={Colors.neutral[200]} />
              <Text style={styles.emptyTitle}>Nenhum banco com esses critérios</Text>
              <TouchableOpacity onPress={() => setFilters(DEFAULT_FILTERS)} style={styles.emptyBtn}>
                <Text style={styles.emptyBtnText}>Limpar filtros</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.ScrollView>

      <AffiliateSheet
        bank={affiliateBank}
        visible={!!affiliateBank}
        sourceScreen="home"
        onClose={() => setAffiliateBank(null)}
      />
      {showBannerSlot ? <BannerAdSlot /> : null}
      <FilterSheet
        visible={filterOpen}
        filters={filters}
        onApply={handleApplyFilters}
        onClose={() => setFilterOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Sticky header
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  stickyDivider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },

  // Hero
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: Colors.surface,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  heroTextWrap: {
    flexShrink: 1,
  },
  greeting: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[500],
    marginBottom: 5,
    letterSpacing: 0.2,
  },
  headline: {
    fontSize: 30,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  headlineBrand: {
    color: Colors.brand[600],
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    justifyContent: 'center',
    position: 'relative',
  },
  filterBtnActive: {
    backgroundColor: Colors.brand[500],
    borderColor: Colors.brand[500],
  },
  filterText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[800],
  },
  filterTextActive: {
    color: Colors.white,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.brand[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
  },

  // CDI + filter row
  cdiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  // CDI bubble
  cdiBubbleWrap: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(22,163,74,0.2)',
  },
  cdiBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  cdiBubbleOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(22,163,74,0.15)',
  },
  cdiBubbleText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
  },
  cdiBubbleValue: {
    fontFamily: 'Inter_700Bold',
    color: Colors.brand[600],
  },

  // Search
  searchWrap: {
    marginTop: 12,
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[900],
  },
  searchClear: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },

  // Active filters
  activeFiltersRow: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  activeFiltersScroll: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  activeChip: {
    backgroundColor: Colors.brand[50],
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.brand[200],
  },
  activeChipText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.brand[600],
  },
  clearChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  clearChipText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[500],
  },

  // List header
  listHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listCount: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
  },

  // Cards
  cards: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
  },
  emptyBtn: {
    backgroundColor: Colors.brand[500],
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  emptyBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.white,
  },
});
