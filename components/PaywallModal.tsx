import { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DEMO_MODE, setPremium } from '@/lib/premium';
import { colors } from '@/lib/theme';

const BENEFICIOS = [
  'Acesso ilimitado a todas as aulas',
  'Guia completo da carteira fria (8 passos)',
  'Detector de golpes completo (10 tipos)',
  'Alertas de preço ilimitados',
  'Suporte prioritário via e-mail',
];

const PLANOS = [
  { id: 'mensal', nome: 'Mensal', preco: 'R$ 14,90/mês', destaque: false, badge: null as string | null },
  { id: 'anual', nome: 'Anual', preco: 'R$ 89,90/ano', destaque: true, badge: 'MAIS POPULAR • 7 dias grátis' as string | null },
  { id: 'vitalicio', nome: 'Vitalício', preco: 'R$ 199,00 único', destaque: false, badge: 'MELHOR VALOR' as string | null },
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function PaywallModal({ visible, onClose }: Props) {
  const [selectedPlan, setSelectedPlan] = useState('anual');

  async function handleActivate() {
    await setPremium(true);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.fechar} onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.fecharTexto}>✕</Text>
        </TouchableOpacity>

        <Image
          source={require('../assets/branding/bitora-logo-horizontal-dark.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.titulo}>Bitora Premium</Text>
        <Text style={styles.subtitulo}>Acesso completo para proteger seus Bitcoin</Text>

        <View style={styles.beneficiosBox}>
          {BENEFICIOS.map((b, i) => (
            <View key={i} style={styles.beneficioItem}>
              <Text style={styles.beneficioCheck}>✓</Text>
              <Text style={styles.beneficioTexto}>{b}</Text>
            </View>
          ))}
        </View>

        {PLANOS.map((plano) => {
          const selecionado = selectedPlan === plano.id;
          return (
            <TouchableOpacity
              key={plano.id}
              style={[
                styles.plano,
                selecionado && styles.planoSelecionado,
                plano.destaque && styles.planoDestaque,
              ]}
              onPress={() => setSelectedPlan(plano.id)}
              activeOpacity={0.85}
            >
              {plano.badge && (
                <Text style={[styles.planoBadge, plano.destaque && styles.planoBadgeDestaque]}>
                  {plano.badge}
                </Text>
              )}
              <View style={styles.planoRow}>
                <Text style={[styles.planoNome, selecionado && styles.planoNomeSelecionado]}>
                  {plano.nome}
                </Text>
                <Text style={[styles.planoPreco, selecionado && styles.planoPrecoSelecionado]}>
                  {plano.preco}
                </Text>
              </View>
              {selecionado && <View style={styles.planoRadio} />}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.cta} onPress={handleActivate} activeOpacity={0.85}>
          <Text style={styles.ctaTexto}>
            {DEMO_MODE ? '⚡ Ativar Premium Grátis (DEMO)' : 'Começar agora →'}
          </Text>
        </TouchableOpacity>

        {DEMO_MODE && (
          <Text style={styles.demoAviso}>Modo demonstração — sem cobrança real</Text>
        )}

        <View style={styles.footer}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.footerLink}>Restaurar compra</Text>
          </TouchableOpacity>
          <Text style={styles.footerSep}>•</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.footerLink}>Termos de uso</Text>
          </TouchableOpacity>
          <Text style={styles.footerSep}>•</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.footerLink}>Privacidade</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  conteudo: {
    padding: 24,
    paddingTop: 56,
    paddingBottom: 48,
  },
  fechar: {
    position: 'absolute',
    top: 16,
    right: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
  },
  fecharTexto: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: '700',
  },
  logo: {
    alignSelf: 'center',
    width: 160,
    height: 40,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  beneficiosBox: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
    gap: 12,
  },
  beneficioItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  beneficioCheck: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.success,
    lineHeight: 20,
    width: 18,
  },
  beneficioTexto: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
  plano: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#2A2A3E',
  },
  planoSelecionado: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(247,147,26,0.07)',
  },
  planoDestaque: {
    borderColor: colors.primary,
  },
  planoBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  planoBadgeDestaque: {
    color: colors.primary,
  },
  planoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planoNome: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMuted,
  },
  planoNomeSelecionado: {
    color: colors.text,
  },
  planoPreco: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMuted,
  },
  planoPrecoSelecionado: {
    color: colors.primary,
  },
  planoRadio: {
    position: 'absolute',
    right: 16,
    top: '50%',
  },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  ctaTexto: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
  },
  demoAviso: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  footerLink: {
    fontSize: 12,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
  footerSep: {
    fontSize: 12,
    color: '#444',
  },
});
