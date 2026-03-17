import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { usePathname } from 'expo-router';
import { Colors } from '@/constants/colors';

type ScreenFadeTransitionProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  durationMs?: number;
  offsetX?: number;
};

const TAB_ORDER = ['/(tabs)', '/(tabs)/index', '/(tabs)/comparar', '/(tabs)/calcular', '/(tabs)/perfil'] as const;
let lastTabIndex: number | null = null;

function getTabIndex(pathname: string): number | null {
  if (pathname === '/') return 0;
  const index = TAB_ORDER.indexOf(pathname as (typeof TAB_ORDER)[number]);
  return index >= 0 ? index : null;
}

export function ScreenFadeTransition({
  children,
  style,
  durationMs = 180,
  offsetX = 26,
}: ScreenFadeTransitionProps) {
  const isFocused = useIsFocused();
  const pathname = usePathname();
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isFocused) return;

    const currentIndex = getTabIndex(pathname);
    let startOffset = 0;

    if (currentIndex !== null && lastTabIndex !== null && currentIndex !== lastTabIndex) {
      const movingForward = currentIndex > lastTabIndex;
      startOffset = movingForward ? offsetX : -offsetX;
    }

    if (currentIndex !== null) {
      lastTabIndex = currentIndex;
    }

    opacity.setValue(0.9);
    translateX.setValue(startOffset);

    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: Math.max(120, durationMs - 20),
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: durationMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animation.start();
    return () => {
      animation.stop();
    };
  }, [isFocused, pathname, durationMs, offsetX, opacity, translateX]);

  return (
    <Animated.View style={[styles.container, style, { opacity, transform: [{ translateX }] }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
