import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { Colors, shadows } from '@/constants/colors';
import { useAppData } from '@/providers/AppDataProvider';
import { getBannerAdUnitId } from '@/services/mobileAds';

export function BannerAdSlot() {
  const unitId = getBannerAdUnitId();
  const { adsConfig, trackAdEvent } = useAppData();
  const [isLoaded, setLoaded] = useState(false);
  const impressionLoggedRef = useRef(false);
  const clickLoggedRef = useRef(false);

  if (!adsConfig.adsEnabled || !adsConfig.homeBannerEnabled || !unitId) {
    return null;
  }

  return (
    <View style={styles.shell} pointerEvents="box-none">
      <View style={styles.card}>
        <Text style={styles.label}>Patrocinado</Text>
        <BannerAd
          unitId={unitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ networkExtras: { collapsible: 'bottom' } }}
          onAdLoaded={() => {
            setLoaded(true);
            if (impressionLoggedRef.current) return;
            impressionLoggedRef.current = true;
            void trackAdEvent({
              placement: 'home_banner_bottom',
              screen: 'home',
              adFormat: 'banner',
              eventType: 'impression',
            });
          }}
          onAdFailedToLoad={() => setLoaded(false)}
          onAdOpened={() => {
            if (clickLoggedRef.current) return;
            clickLoggedRef.current = true;
            void trackAdEvent({
              placement: 'home_banner_bottom',
              screen: 'home',
              adFormat: 'banner',
              eventType: 'click',
            });
          }}
          onPaid={(paid) => {
            void trackAdEvent({
              placement: 'home_banner_bottom',
              screen: 'home',
              adFormat: 'banner',
              eventType: 'paid',
              valueMicros: paid.value,
              currencyCode: paid.currency,
            });
          }}
        />
        {!isLoaded ? <View style={styles.loadingState} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 74,
    zIndex: 12,
  },
  card: {
    borderRadius: 16,
    backgroundColor: Colors.glass.surface,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 8,
    overflow: 'hidden',
    ...shadows.glass,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Colors.neutral[500],
    marginBottom: 6,
    marginLeft: 4,
  },
  loadingState: {
    height: 52,
  },
});
