import mobileAds, {
  MaxAdContentRating,
  TestIds,
} from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

const ANDROID_TEST_APP_ID = 'ca-app-pub-3940256099942544~3347511713';
const IOS_TEST_APP_ID = 'ca-app-pub-3940256099942544~1458002511';

let initializationPromise: Promise<void> | null = null;

function getRequestConfiguration() {
  return {
    maxAdContentRating: MaxAdContentRating.PG,
    tagForChildDirectedTreatment: false,
    tagForUnderAgeOfConsent: false,
    testDeviceIdentifiers: __DEV__ ? ['EMULATOR'] : [],
  };
}

export function initializeMobileAds(): Promise<void> {
  if (!initializationPromise) {
    initializationPromise = mobileAds()
      .setRequestConfiguration(getRequestConfiguration())
      .then(() => mobileAds().initialize())
      .then(() => undefined);
  }

  return initializationPromise;
}

export function getBannerAdUnitId(): string | null {
  if (__DEV__) {
    return TestIds.BANNER;
  }

  if (Platform.OS === 'android') {
    return (
      process.env.EXPO_PUBLIC_ADMOB_BANNER_HOME_ANDROID ??
      process.env.EXPO_PUBLIC_ADMOB_BANNER_HOME ??
      null
    );
  }

  return process.env.EXPO_PUBLIC_ADMOB_BANNER_HOME_IOS ?? process.env.EXPO_PUBLIC_ADMOB_BANNER_HOME ?? null;
}

export function getNativeAdUnitId(): string | null {
  if (__DEV__) {
    return TestIds.NATIVE;
  }

  if (Platform.OS === 'android') {
    return (
      process.env.EXPO_PUBLIC_ADMOB_NATIVE_HOME_ANDROID ??
      process.env.EXPO_PUBLIC_ADMOB_NATIVE_HOME ??
      null
    );
  }

  return process.env.EXPO_PUBLIC_ADMOB_NATIVE_HOME_IOS ?? process.env.EXPO_PUBLIC_ADMOB_NATIVE_HOME ?? null;
}

export function getDefaultAndroidAppId(): string {
  return process.env.EXPO_PUBLIC_ADMOB_APP_ID_ANDROID ?? ANDROID_TEST_APP_ID;
}

export function getDefaultIosAppId(): string {
  return process.env.EXPO_PUBLIC_ADMOB_APP_ID_IOS ?? IOS_TEST_APP_ID;
}
