import type { ExpoConfig } from 'expo/config';

const ANDROID_TEST_APP_ID = 'ca-app-pub-3940256099942544~3347511713';
const IOS_TEST_APP_ID = 'ca-app-pub-3940256099942544~1458002511';

const config: ExpoConfig = {
  name: 'RendeMais',
  slug: 'rende-mais',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'rende-mais',
  userInterfaceStyle: 'dark',
  newArchEnabled: false,
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#FFFFFF',
  },
  ios: {
    supportsTablet: false,
  },
  android: {
    package: 'com.rendemais.app',
  },
  web: {
    favicon: './assets/images/icon.png',
  },
  plugins: [
    [
      'expo-router',
      {
        origin: 'https://replit.com/',
      },
    ],
    'expo-font',
    'expo-web-browser',
    [
      'react-native-google-mobile-ads',
      {
        androidAppId: process.env.EXPO_PUBLIC_ADMOB_APP_ID_ANDROID ?? ANDROID_TEST_APP_ID,
        iosAppId: process.env.EXPO_PUBLIC_ADMOB_APP_ID_IOS ?? IOS_TEST_APP_ID,
        userTrackingUsageDescription:
          'Usamos um identificador do dispositivo para exibir anuncios mais relevantes e medir o desempenho da publicidade.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: false,
  },
};

export default config;
