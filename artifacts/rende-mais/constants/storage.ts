export const STORAGE_KEYS = {
  ONBOARDING_COMPLETE: 'onboarding_complete',
  USER_PROFILE: 'user_profile',
  FAVORITES: 'favorites',
} as const;

export type AmountRange = 'ate_5k' | '5k_20k' | 'acima_20k';
export type LiquidityPreference = 'imediata' | 'meses' | 'longo';
export type RiskPreference = 'taxa' | 'seguranca';

export interface UserProfile {
  availableAmount: AmountRange;
  liquidityPref: LiquidityPreference;
  riskPref: RiskPreference;
}

export const AMOUNT_RANGES: Record<AmountRange, { label: string; value: number }> = {
  ate_5k: { label: 'Até R$ 5.000', value: 2500 },
  '5k_20k': { label: 'Entre R$ 5.000 e R$ 20.000', value: 12500 },
  acima_20k: { label: 'Mais de R$ 20.000', value: 30000 },
};
