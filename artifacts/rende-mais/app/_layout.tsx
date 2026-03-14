import 'react-native-url-polyfill/auto';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Colors } from '@/constants/colors';
import { AppDataProvider, useAppData } from '@/providers/AppDataProvider';
import { initializeMobileAds } from '@/services/mobileAds';

void SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="banco/[id]" options={{ headerShown: false, presentation: 'card' }} />
    </Stack>
  );
}

function BootstrapSplash() {
  return (
    <View style={styles.loading}>
      <View style={styles.splashBadge}>
        <Text style={styles.splashBadgeText}>RC</Text>
      </View>
      <Text style={styles.splashTitle}>Renda Certa</Text>
      <Text style={styles.splashSubtitle}>Carregando dados do mercado...</Text>
      <ActivityIndicator size="small" color={Colors.brand[500]} style={styles.splashLoader} />
    </View>
  );
}

function RootApp({ isFontsReady }: { isFontsReady: boolean }) {
  const { isCatalogLoading } = useAppData();

  useEffect(() => {
    void initializeMobileAds().catch(() => {});
  }, []);

  useEffect(() => {
    // Hide native splash as soon as JS is mounted; we keep our own bootstrap UI meanwhile.
    void SplashScreen.hideAsync().catch(() => {});
  }, []);

  if (!isFontsReady || isCatalogLoading) {
    return <BootstrapSplash />;
  }

  return <RootLayoutNav />;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const isFontsReady = fontsLoaded || Boolean(fontError);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppDataProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <RootApp isFontsReady={isFontsReady} />
            </GestureHandlerRootView>
          </AppDataProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
  },
  splashBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.glass.borderStrong,
    backgroundColor: Colors.glass.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  splashBadgeText: {
    color: Colors.neutral[900],
    fontFamily: 'Inter_700Bold',
    fontSize: 21,
    letterSpacing: 0.3,
  },
  splashTitle: {
    color: Colors.neutral[900],
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    letterSpacing: 0.2,
  },
  splashSubtitle: {
    color: Colors.neutral[500],
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    marginTop: 6,
  },
  splashLoader: {
    marginTop: 18,
  },
});
