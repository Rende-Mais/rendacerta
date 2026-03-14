import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors, shadows } from '@/constants/colors';

function SkeletonBox({ width, height, style }: { width?: number | string; height: number; style?: object }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.8, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width: width ?? '100%', height, borderRadius: 8, backgroundColor: Colors.neutral[200] },
        { opacity },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <SkeletonBox width={40} height={40} style={{ borderRadius: 20 }} />
        <View style={{ flex: 1, marginLeft: 12, gap: 6 }}>
          <SkeletonBox width="60%" height={16} />
          <SkeletonBox width="40%" height={12} />
        </View>
        <SkeletonBox width={70} height={24} style={{ borderRadius: 12 }} />
      </View>
      <View style={{ marginTop: 16, gap: 8 }}>
        <SkeletonBox width="50%" height={36} />
        <SkeletonBox width="80%" height={14} />
      </View>
      <View style={styles.pills}>
        <SkeletonBox width={120} height={28} style={{ borderRadius: 14 }} />
        <SkeletonBox width={90} height={28} style={{ borderRadius: 14 }} />
      </View>
      <SkeletonBox height={52} style={{ marginTop: 16, borderRadius: 12 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...shadows.level1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pills: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
});
