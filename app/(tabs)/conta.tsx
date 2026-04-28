import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DEMO_MODE, isPremium, onPremiumChange, setPremium } from '@/lib/premium';
import { colors } from '@/lib/theme';
import PaywallModal from '@/components/PaywallModal';

export default function ContaScreen() {
  const [premium, setPremiumState] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    isPremium().then(setPremiumState);
    return onPremiumChange(() => isPremium().then(setPremiumState));
  }, []);

  async function handleReset() {
    Alert.alert(
      'Resetar status',
      'Isso vai reverter para a versão gratuita (DEMO). Confirmar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar',
          style: 'destructive',
          onPress: async () => { await setPremium(false); },
        },
      ]
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>Conta</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Status do plano</Text>
        <View style={styles.statusRow}>
          <View style={[styles.badge, premium ? styles.badgePremium : styles.badgeFree]}>
            <Text style={[styles.badgeTexto, premium ? styles.badgeTextoPremium : styles.badgeTextoFree]}>
              {premium ? '⚡ Premium ativo' : 'Versão gratuita'}
            </Text>
          </View>
        </View>
        {premium ? (
          <Text style={styles.cardInfo}>
            Você tem acesso a todo o conteúdo do Bitora.
          </Text>
        ) : (
          <Text style={styles.cardInfo}>
            Aulas 1–3 e conteúdos parciais disponíveis. Faça upgrade para acesso completo.
          </Text>
        )}
      </View>

      {!premium && (
        <TouchableOpacity style={styles.botaoPremium} onPress={() => setShowPaywall(true)} activeOpacity={0.85}>
          <Text style={styles.botaoPremiumTexto}>⚡ Fazer upgrade para Premium</Text>
        </TouchableOpacity>
      )}

      {premium && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Assinatura</Text>
          <TouchableOpacity style={styles.botaoGerenciar} activeOpacity={0.85}>
            <Text style={styles.botaoGerenciarTexto}>Gerenciar assinatura</Text>
          </TouchableOpacity>
        </View>
      )}

      {DEMO_MODE && (
        <View style={styles.demoCard}>
          <Text style={styles.demoTitulo}>Modo demonstração</Text>
          <Text style={styles.demoTexto}>
            O app está em modo DEMO — nenhuma cobrança real acontece.
          </Text>
          <TouchableOpacity style={styles.botaoReset} onPress={handleReset} activeOpacity={0.85}>
            <Text style={styles.botaoResetTexto}>Resetar para versão gratuita</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoLinha}>Bitora</Text>
        <Text style={styles.infoLinhaDetalhe}>Versão 1.0.0 • Modo {DEMO_MODE ? 'Demo' : 'Produção'}</Text>
        <Text style={styles.infoLinhaDetalhe}>Educação Bitcoin para o Brasil</Text>
      </View>

      <PaywallModal visible={showPaywall} onClose={() => setShowPaywall(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  conteudo: {
    padding: 20,
    paddingBottom: 48,
    gap: 14,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 18,
    gap: 10,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardInfo: {
    fontSize: 13,
    color: '#A0A0B8',
    lineHeight: 19,
  },
  statusRow: {
    flexDirection: 'row',
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgePremium: {
    backgroundColor: 'rgba(247,147,26,0.15)',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  badgeFree: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  badgeTexto: {
    fontSize: 14,
    fontWeight: '700',
  },
  badgeTextoPremium: {
    color: colors.primary,
  },
  badgeTextoFree: {
    color: colors.textMuted,
  },
  botaoPremium: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botaoPremiumTexto: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
  },
  botaoGerenciar: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  botaoGerenciarTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  demoCard: {
    backgroundColor: '#1A1208',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#3A2A08',
    gap: 10,
  },
  demoTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C8A030',
  },
  demoTexto: {
    fontSize: 13,
    color: '#A08040',
    lineHeight: 18,
  },
  botaoReset: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A2A08',
  },
  botaoResetTexto: {
    fontSize: 13,
    color: '#C8A030',
    fontWeight: '600',
  },
  infoCard: {
    padding: 4,
    gap: 4,
    alignItems: 'center',
  },
  infoLinha: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  infoLinhaDetalhe: {
    fontSize: 12,
    color: '#555',
  },
});
