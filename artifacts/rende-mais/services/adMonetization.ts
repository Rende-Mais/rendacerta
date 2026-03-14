import { Platform } from 'react-native';

export type AdPlacement = 'home_banner_bottom' | 'home_native_feed';
export type AdFormat = 'banner' | 'native';
export type AdEventType = 'impression' | 'click' | 'paid';

export type AdsConfig = {
  adsEnabled: boolean;
  homeBannerEnabled: boolean;
  homeNativeEnabled: boolean;
  homeNativeFrequency: number;
};

export const DEFAULT_ADS_CONFIG: AdsConfig = {
  adsEnabled: false,
  homeBannerEnabled: false,
  homeNativeEnabled: false,
  homeNativeFrequency: 8,
};

export const HOME_NATIVE_FIRST_INSERT_INDEX = 3;

export function isMobileAdsRuntimeSupported(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

export function getLocalAdsFallbackConfig(): AdsConfig {
  const hasAndroidIds = Boolean(
    process.env.EXPO_PUBLIC_ADMOB_APP_ID_ANDROID &&
      (process.env.EXPO_PUBLIC_ADMOB_BANNER_HOME_ANDROID || process.env.EXPO_PUBLIC_ADMOB_BANNER_HOME) &&
      (process.env.EXPO_PUBLIC_ADMOB_NATIVE_HOME_ANDROID || process.env.EXPO_PUBLIC_ADMOB_NATIVE_HOME),
  );
  const hasIosIds = Boolean(
    process.env.EXPO_PUBLIC_ADMOB_APP_ID_IOS &&
      (process.env.EXPO_PUBLIC_ADMOB_BANNER_HOME_IOS || process.env.EXPO_PUBLIC_ADMOB_BANNER_HOME) &&
      (process.env.EXPO_PUBLIC_ADMOB_NATIVE_HOME_IOS || process.env.EXPO_PUBLIC_ADMOB_NATIVE_HOME),
  );

  const shouldEnableForPlatform =
    (Platform.OS === 'android' && hasAndroidIds) || (Platform.OS === 'ios' && hasIosIds);

  if (!shouldEnableForPlatform) {
    return DEFAULT_ADS_CONFIG;
  }

  return {
    adsEnabled: true,
    homeBannerEnabled: true,
    homeNativeEnabled: true,
    homeNativeFrequency: DEFAULT_ADS_CONFIG.homeNativeFrequency,
  };
}

export function shouldShowHomeBanner(adsConfig: AdsConfig): boolean {
  return adsConfig.adsEnabled && adsConfig.homeBannerEnabled && isMobileAdsRuntimeSupported();
}

export function shouldInjectNativeAd(index: number, adsConfig: AdsConfig): boolean {
  if (!adsConfig.adsEnabled || !adsConfig.homeNativeEnabled || !isMobileAdsRuntimeSupported()) {
    return false;
  }

  if (index < HOME_NATIVE_FIRST_INSERT_INDEX) {
    return false;
  }

  return (index - HOME_NATIVE_FIRST_INSERT_INDEX) % Math.max(adsConfig.homeNativeFrequency, 1) === 0;
}
