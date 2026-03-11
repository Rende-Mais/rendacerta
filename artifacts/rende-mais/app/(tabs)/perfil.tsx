import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, shadows } from '@/constants/colors';
import { STORAGE_KEYS, UserProfile, AMOUNT_RANGES } from '@/constants/storage';
import { CURRENT_CDI_RATE } from '@/constants/data';

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE).then((val) => {
      if (val) setProfile(JSON.parse(val));
    });
  }, []);

  const handleResetOnboarding = () => {
    Alert.alert(
      'Redefinir preferências',
      'Vai refazer as perguntas iniciais. Continua?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Redefinir',
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
            await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
            router.replace('/(onboarding)/boas-vindas');
          },
        },
      ]
    );
  };

  const getLiquidityLabel = () => {
    switch (profile?.liquidityPref) {
      case 'imediata': return 'Liquidez imediata';
      case 'meses': return 'Alguns meses';
      case 'longo': return 'Mais de 1 ano';
      default: return '—';
    }
  };

  const getRiskLabel = () => {
    switch (profile?.riskPref) {
      case 'taxa': return 'Maior taxa possível';
      case 'seguranca': return 'Segurança e proteção';
      default: return '—';
    }
  };

  const ProfileItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <View style={styles.profileItem}>
      <View style={styles.profileItemIcon}>
        <Feather name={icon as any} size={16} color={Colors.brand[500]} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.profileItemLabel}>{label}</Text>
        <Text style={styles.profileItemValue}>{value}</Text>
      </View>
    </View>
  );

  const MenuItem = ({ icon, label, onPress, destructive }: { icon: string; label: string; onPress: () => void; destructive?: boolean }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuItemIcon, destructive && styles.menuItemIconDestructive]}>
        <Feather name={icon as any} size={18} color={destructive ? Colors.error.DEFAULT : Colors.neutral[700]} />
      </View>
      <Text style={[styles.menuItemLabel, destructive && styles.menuItemLabelDestructive]}>{label}</Text>
      <Feather name="chevron-right" size={18} color={Colors.neutral[300]} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={styles.title}>Perfil</Text>
          <Text style={styles.subtitle}>Suas preferências e configurações</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.avatarCard}>
            <View style={styles.avatar}>
              <Feather name="user" size={40} color={Colors.brand[500]} />
            </View>
            <Text style={styles.avatarTitle}>Seu perfil de investidor</Text>
            <Text style={styles.avatarSub}>Baseado nas suas preferências</Text>
            <View style={styles.investorBadge}>
              <Feather name="shield" size={14} color={Colors.brand[500]} />
              <Text style={styles.investorBadgeText}>
                {profile?.riskPref === 'seguranca' ? 'Perfil conservador' : 'Perfil arrojado'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suas preferências</Text>
          <View style={styles.card}>
            <ProfileItem
              icon="dollar-sign"
              label="Valor disponível"
              value={profile?.availableAmount ? AMOUNT_RANGES[profile.availableAmount].label : '—'}
            />
            <View style={styles.itemDivider} />
            <ProfileItem
              icon="clock"
              label="Prazo preferido"
              value={getLiquidityLabel()}
            />
            <View style={styles.itemDivider} />
            <ProfileItem
              icon="target"
              label="Prioridade"
              value={getRiskLabel()}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mercado hoje</Text>
          <View style={styles.card}>
            <View style={styles.marketRow}>
              <View style={styles.marketItem}>
                <Text style={styles.marketLabel}>CDI</Text>
                <Text style={styles.marketValue}>{CURRENT_CDI_RATE}%</Text>
                <Text style={styles.marketSub}>ao ano</Text>
              </View>
              <View style={styles.marketDivider} />
              <View style={styles.marketItem}>
                <Text style={styles.marketLabel}>Poupança</Text>
                <Text style={[styles.marketValue, { color: Colors.neutral[500] }]}>6,17%</Text>
                <Text style={styles.marketSub}>ao ano</Text>
              </View>
              <View style={styles.marketDivider} />
              <View style={styles.marketItem}>
                <Text style={styles.marketLabel}>IPCA</Text>
                <Text style={[styles.marketValue, { color: Colors.warning.DEFAULT }]}>4,83%</Text>
                <Text style={styles.marketSub}>ao ano</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O que é o FGC?</Text>
          <View style={[styles.card, styles.fgcCard]}>
            <View style={styles.fgcHeader}>
              <View style={styles.fgcIconBox}>
                <Feather name="shield" size={20} color={Colors.fgc.badge} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fgcTitle}>Fundo Garantidor de Créditos</Text>
                <Text style={styles.fgcSub}>Protegido pelo governo federal</Text>
              </View>
            </View>
            <Text style={styles.fgcDesc}>
              O FGC garante até R$ 250.000 por CPF por instituição financeira. Se o banco quebrar, o governo devolve seu dinheiro. Todos os bancos listados aqui são cobertos pelo FGC.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          <View style={styles.card}>
            <MenuItem
              icon="sliders"
              label="Refazer preferências"
              onPress={handleResetOnboarding}
            />
            <View style={styles.itemDivider} />
            <MenuItem
              icon="info"
              label="Sobre o Rende Mais"
              onPress={() => {}}
            />
            <View style={styles.itemDivider} />
            <MenuItem
              icon="refresh-cw"
              label="Redefinir preferências"
              onPress={handleResetOnboarding}
              destructive
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Rende Mais v1.0.0</Text>
          <Text style={styles.footerDisclaimer}>
            As taxas exibidas são indicativas e podem variar. Não são recomendações de investimento. Consulte um especialista financeiro.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[400],
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  avatarCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    ...shadows.level1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
  },
  avatarSub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
  },
  investorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.brand[50],
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.brand[200],
  },
  investorBadgeText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.brand[600],
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.level1,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  profileItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileItemLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
  },
  profileItemValue: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[950],
    marginTop: 1,
  },
  itemDivider: {
    height: 1,
    backgroundColor: Colors.neutral[100],
    marginLeft: 66,
  },
  marketRow: {
    flexDirection: 'row',
    padding: 16,
  },
  marketItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  marketDivider: {
    width: 1,
    backgroundColor: Colors.neutral[200],
    marginVertical: 4,
  },
  marketLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[400],
  },
  marketValue: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.brand[500],
  },
  marketSub: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[300],
  },
  fgcCard: {
    padding: 16,
    gap: 12,
  },
  fgcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fgcIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.fgc.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fgcTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[950],
  },
  fgcSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.fgc.badge,
  },
  fgcDesc: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    lineHeight: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemIconDestructive: {
    backgroundColor: Colors.error.light,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[950],
  },
  menuItemLabelDestructive: {
    color: Colors.error.DEFAULT,
  },
  footer: {
    paddingHorizontal: 16,
    marginTop: 32,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[400],
  },
  footerDisclaimer: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[300],
    textAlign: 'center',
    lineHeight: 17,
  },
});
