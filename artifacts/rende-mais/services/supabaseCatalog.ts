import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  BANKS,
  CURRENT_CDI_RATE,
  type Bank,
  type InvestmentType,
  type LiquidityType,
  type RiskLevel,
} from '@/constants/data';
import { STORAGE_KEYS, type UserProfile } from '@/constants/storage';
import {
  DEFAULT_ADS_CONFIG,
  getLocalAdsFallbackConfig,
  type AdEventType,
  type AdFormat,
  type AdPlacement,
  type AdsConfig,
} from '@/services/adMonetization';

type AppConfigRow = {
  key: string;
  value: unknown;
};

type InstitutionRow = {
  id: string;
  name: string;
  short_name: string;
  brand_color: string | null;
  logo_url: string | null;
  fgc_covered: boolean | null;
  risk_score: number | null;
  risk_level: string | null;
  description: string | null;
  affiliate_base_url: string | null;
};

type OfferRow = {
  id: string;
  institution_id: string;
  investment_type: string;
  cdi_rate: number | string;
  liquidity: string;
  minimum_amount: number | string | null;
  has_tax: boolean | null;
  recommendation_score: number | null;
  is_featured: boolean | null;
  details_json: {
    affiliate_url?: string;
    logo_text?: string;
  } | null;
};

type RateHistoryRow = {
  offer_id: string;
  cdi_rate: number | string;
  reference_date: string;
};

export type RemoteCatalog = {
  banks: Bank[];
  currentCdiRate: number;
  contentVersion: string | null;
  adsConfig: AdsConfig;
};

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }

  if (supabaseClient) {
    return supabaseClient;
  }

  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return supabaseClient;
}

function toNumber(value: number | string | null | undefined, fallback = 0): number {
  if (value === null || value === undefined) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toLiquidity(value: string): LiquidityType {
  if (value === 'D+0' || value === 'D+1' || value === 'D+30' || value === 'no_vencimento') {
    return value;
  }

  return 'D+0';
}

function toInvestmentType(value: string): InvestmentType {
  if (value === 'CDB' || value === 'LCI' || value === 'LCA' || value === 'RDB') {
    return value;
  }

  return 'CDB';
}

function toRiskLevel(value: string | null | undefined): RiskLevel {
  if (value === 'baixo' || value === 'medio' || value === 'alto') {
    return value;
  }

  return 'baixo';
}

function buildLogoLabel(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'BK';
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

function pickConfigNumber(configs: AppConfigRow[], key: string, fallback: number): number {
  const row = configs.find((entry) => entry.key === key);
  if (!row) {
    return fallback;
  }

  if (typeof row.value === 'number') {
    return row.value;
  }

  if (typeof row.value === 'string') {
    const parsed = Number(row.value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  if (typeof row.value === 'object' && row.value !== null) {
    const value = (row.value as { value?: unknown }).value;
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    }
  }

  return fallback;
}

function pickConfigString(configs: AppConfigRow[], key: string): string | null {
  const row = configs.find((entry) => entry.key === key);
  if (!row) {
    return null;
  }

  if (typeof row.value === 'string') {
    return row.value;
  }

  if (typeof row.value === 'object' && row.value !== null) {
    const value = (row.value as { value?: unknown }).value;
    if (typeof value === 'string') {
      return value;
    }
  }

  return null;
}

function pickConfigBoolean(configs: AppConfigRow[], key: string, fallback: boolean): boolean {
  const row = configs.find((entry) => entry.key === key);
  if (!row) {
    return fallback;
  }

  if (typeof row.value === 'boolean') {
    return row.value;
  }

  if (typeof row.value === 'string') {
    const normalized = row.value.toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }

  if (typeof row.value === 'object' && row.value !== null) {
    const value = (row.value as { value?: unknown }).value;
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      const normalized = value.toLowerCase();
      if (normalized === 'true') return true;
      if (normalized === 'false') return false;
    }
  }

  return fallback;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export async function fetchRemoteCatalog(): Promise<RemoteCatalog | null> {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  const [institutionsResult, offersResult, configResult] = await Promise.all([
    client.from('institutions').select('*').eq('is_active', true),
    client.from('offers').select('*').eq('is_active', true),
    client.from('app_config').select('key,value'),
  ]);

  if (institutionsResult.error || offersResult.error || configResult.error) {
    throw new Error(
      institutionsResult.error?.message ??
        offersResult.error?.message ??
        configResult.error?.message ??
        'Erro ao carregar catalogo remoto',
    );
  }

  const institutions = (institutionsResult.data ?? []) as InstitutionRow[];
  const offers = (offersResult.data ?? []) as OfferRow[];
  const configs = (configResult.data ?? []) as AppConfigRow[];

  const institutionById = new Map(institutions.map((institution) => [institution.id, institution]));
  const offerIds = offers.map((offer) => offer.id);

  let historyByOffer = new Map<string, number[]>();
  if (offerIds.length > 0) {
    const historyResult = await client
      .from('offer_rate_history')
      .select('offer_id,cdi_rate,reference_date')
      .in('offer_id', offerIds)
      .order('reference_date', { ascending: true });

    if (historyResult.error) {
      throw new Error(historyResult.error.message);
    }

    const grouped = new Map<string, number[]>();
    for (const row of (historyResult.data ?? []) as RateHistoryRow[]) {
      const current = grouped.get(row.offer_id) ?? [];
      current.push(toNumber(row.cdi_rate));
      grouped.set(row.offer_id, current);
    }
    historyByOffer = grouped;
  }

  const banks: Bank[] = [];
  for (const offer of offers) {
    const institution = institutionById.get(offer.institution_id);
    if (!institution) {
      continue;
    }

    const rateHistory = historyByOffer.get(offer.id);
    const cdiRate = toNumber(offer.cdi_rate);

    banks.push({
      id: offer.id,
      institutionId: institution.id,
      offerId: offer.id,
      name: institution.name,
      shortName: institution.short_name,
      logo: offer.details_json?.logo_text ?? buildLogoLabel(institution.short_name || institution.name),
      logoUrl: institution.logo_url ?? undefined,
      color: institution.brand_color ?? '#000000',
      cdiRate,
      investmentType: toInvestmentType(offer.investment_type),
      liquidity: toLiquidity(offer.liquidity),
      minimumAmount: toNumber(offer.minimum_amount),
      fgcCovered: Boolean(institution.fgc_covered),
      riskScore: toNumber(institution.risk_score, 80),
      riskLevel: toRiskLevel(institution.risk_level),
      recommendationScore: toNumber(offer.recommendation_score, 0),
      isRecommended: Boolean(offer.is_featured),
      hasTax: Boolean(offer.has_tax),
      description: institution.description ?? 'Detalhes em atualizacao.',
      rateHistory: rateHistory && rateHistory.length > 0 ? rateHistory : [cdiRate],
      affiliateUrl:
        offer.details_json?.affiliate_url ?? institution.affiliate_base_url ?? 'https://www.google.com',
    });
  }

  banks.sort((a, b) => b.recommendationScore - a.recommendationScore || b.cdiRate - a.cdiRate);

  const currentCdiRate = pickConfigNumber(configs, 'current_cdi_rate', CURRENT_CDI_RATE);
  const contentVersion = pickConfigString(configs, 'content_version');
  const localAdsFallback = getLocalAdsFallbackConfig();
  const adsConfig: AdsConfig = {
    adsEnabled: pickConfigBoolean(configs, 'ads_enabled', localAdsFallback.adsEnabled),
    homeBannerEnabled: pickConfigBoolean(configs, 'home_banner_enabled', localAdsFallback.homeBannerEnabled),
    homeNativeEnabled: pickConfigBoolean(configs, 'home_native_enabled', localAdsFallback.homeNativeEnabled),
    homeNativeFrequency: pickConfigNumber(configs, 'home_native_frequency', localAdsFallback.homeNativeFrequency),
  };

  return {
    banks: banks.length > 0 ? banks : BANKS,
    currentCdiRate,
    contentVersion,
    adsConfig,
  };
}

function createInstallId(): string {
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `${Date.now().toString(36)}-${randomPart}`;
}

async function getOrCreateInstallId(): Promise<string> {
  const existing = await AsyncStorage.getItem(STORAGE_KEYS.INSTALL_ID);
  if (existing) {
    return existing;
  }

  const installId = createInstallId();
  await AsyncStorage.setItem(STORAGE_KEYS.INSTALL_ID, installId);
  return installId;
}

function getAppVersion(): string {
  return Constants.expoConfig?.version ?? 'dev';
}

function asUuidOrNull(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(value) ? value : null;
}

export async function trackAffiliateClickEvent(params: {
  bank: Bank;
  sourceScreen: string;
  sourceComponent?: string;
  profile?: UserProfile | null;
}): Promise<void> {
  const client = getSupabaseClient();
  if (!client) {
    return;
  }

  const installId = await getOrCreateInstallId();
  const institutionId = params.bank.institutionId ?? params.bank.id;
  const offerId = params.bank.offerId ?? params.bank.id;

  const payload = {
    install_id: installId,
    institution_id: asUuidOrNull(institutionId),
    offer_id: asUuidOrNull(offerId),
    source_screen: params.sourceScreen,
    source_component: params.sourceComponent ?? null,
    available_amount_range: params.profile?.availableAmount ?? null,
    liquidity_pref: params.profile?.liquidityPref ?? null,
    risk_pref: params.profile?.riskPref ?? null,
    app_version: getAppVersion(),
  };

  const { error } = await client.from('affiliate_clicks').insert(payload);
  if (error) {
    throw new Error(error.message);
  }
}

export async function trackAdEvent(params: {
  placement: AdPlacement;
  screen: string;
  adFormat: AdFormat;
  eventType: AdEventType;
  sourceComponent?: string;
  valueMicros?: number;
  currencyCode?: string;
}): Promise<void> {
  const client = getSupabaseClient();
  if (!client) {
    return;
  }

  const installId = await getOrCreateInstallId();

  const payload = {
    install_id: installId,
    placement: params.placement,
    screen: params.screen,
    source_component: params.sourceComponent ?? null,
    ad_network: 'admob',
    ad_format: params.adFormat,
    event_type: params.eventType,
    value_micros: params.valueMicros ?? null,
    currency_code: params.currencyCode ?? null,
    app_version: getAppVersion(),
  };

  const { error } = await client.from('ad_events').insert(payload);
  if (error) {
    throw new Error(error.message);
  }
}
