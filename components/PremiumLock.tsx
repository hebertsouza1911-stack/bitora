import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { isPremium, onPremiumChange } from '@/lib/premium';
import { colors } from '@/lib/theme';
import PaywallModal from './PaywallModal';

type Props = {
  children: React.ReactNode;
  active?: boolean;
  borderRadius?: number;
};

export default function PremiumLock({ children, active = true, borderRadius = 12 }: Props) {
  const [premium, setPremiumState] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    if (!active) return;
    isPremium().then(setPremiumState);
    return onPremiumChange(() => isPremium().then(setPremiumState));
  }, [active]);

  if (!active || premium) return <>{children}</>;

  return (
    <View style={{ borderRadius, overflow: 'hidden' }}>
      {children}
      <TouchableOpacity
        style={[StyleSheet.absoluteFillObject, styles.overlay]}
        onPress={() => setShowPaywall(true)}
        activeOpacity={0.9}
      >
        <View style={styles.lockBox}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.lockText}>Conteúdo Premium</Text>
          <Text style={styles.lockSub}>Toque para desbloquear</Text>
        </View>
      </TouchableOpacity>
      <PaywallModal visible={showPaywall} onClose={() => setShowPaywall(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(13,17,23,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBox: {
    alignItems: 'center',
    gap: 6,
  },
  lockIcon: {
    fontSize: 28,
  },
  lockText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  lockSub: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
