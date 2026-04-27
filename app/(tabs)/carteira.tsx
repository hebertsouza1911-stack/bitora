import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getProgressoCarteira, setProgressoCarteira } from '@/lib/storage';
import { colors } from '@/lib/theme';

const LARGURA_BARRA = Dimensions.get('window').width - 40;

const PASSOS = [
  {
    titulo: 'Pesquise e escolha sua hardware wallet',
    descricao: 'As mais recomendadas são Ledger Nano S Plus e Trezor Safe 3. Compare preços, interface e recursos antes de decidir.',
    alerta: null,
  },
  {
    titulo: 'Compre APENAS de revendedor oficial',
    descricao: 'No Brasil, a KriptoBR é revendedora oficial de ambas as marcas. Evite Mercado Livre, OLX ou qualquer vendedor de terceiros.',
    alerta: '⚠️ Hardware wallets de segunda mão ou de marketplaces podem já estar comprometidas — risco real de roubo.',
  },
  {
    titulo: 'Verifique o lacre ao receber',
    descricao: 'Antes de abrir a caixa, inspecione cuidadosamente o lacre e o estado da embalagem.',
    alerta: '🔴 Se o lacre estiver violado ou a embalagem danificada, NÃO USE. Entre em contato com o fabricante imediatamente.',
  },
  {
    titulo: 'Configure seguindo o manual oficial',
    descricao: 'Use somente o site e aplicativo oficial do fabricante (Ledger Live ou Trezor Suite). O processo irá gerar sua seed phrase.',
    alerta: null,
  },
  {
    titulo: 'Anote a seed phrase em papel',
    descricao: 'Escreva as palavras à mão, na ordem exata, no papel fornecido. Confirme duas vezes antes de finalizar.',
    alerta: '🔴 NUNCA fotografe. NUNCA digite no celular ou computador. NUNCA envie por mensagem. Apenas papel físico.',
  },
  {
    titulo: 'Faça um backup secundário',
    descricao: 'Crie uma segunda cópia da seed phrase e guarde em local físico diferente — casa de familiar de confiança ou cofre.',
    alerta: '⚠️ Um único backup pode ser destruído por fogo ou enchente. Dois locais separados = segurança real.',
  },
  {
    titulo: 'Teste a recuperação antes de usar',
    descricao: 'Faça um factory reset no dispositivo e restaure usando a seed phrase. Confirme que tudo funciona corretamente.',
    alerta: '⚠️ Teste isso ANTES de transferir qualquer valor significativo. Descobrir um erro depois pode custar tudo.',
  },
  {
    titulo: 'Envie um valor pequeno primeiro',
    descricao: 'Transfira o equivalente a R$ 50 em BTC para a nova carteira. Confirme que chegou. Só então transfira o restante.',
    alerta: null,
  },
];

export default function CarteiraScreen() {
  const [progresso, setProgresso] = useState<boolean[]>(Array(PASSOS.length).fill(false));

  useEffect(() => {
    getProgressoCarteira().then(setProgresso);
  }, []);

  async function togglePasso(idx: number) {
    const novo = [...progresso];
    novo[idx] = !novo[idx];
    setProgresso(novo);
    await setProgressoCarteira(novo);
  }

  const concluidos = progresso.filter(Boolean).length;
  const larguraPreenchida = LARGURA_BARRA * (concluidos / PASSOS.length);
  const tudo = concluidos === PASSOS.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>Guia: Carteira Fria</Text>
      <Text style={styles.subtitulo}>
        Siga os 8 passos para configurar sua hardware wallet com segurança.
      </Text>

      <View style={styles.progressoContainer}>
        <View style={styles.progressoHeader}>
          <Text style={styles.progressoTexto}>{concluidos} de {PASSOS.length} concluídos</Text>
          <Text style={styles.progressoPorcentagem}>
            {Math.round((concluidos / PASSOS.length) * 100)}%
          </Text>
        </View>
        <View style={styles.progressoBarra}>
          <View style={[styles.progressoPreenchimento, { width: larguraPreenchida }]} />
        </View>
      </View>

      {tudo && (
        <View style={styles.parabens}>
          <Text style={styles.parabensTitulo}>🎉 Configuração concluída!</Text>
          <Text style={styles.parabensTexto}>Seus bitcoins estão bem protegidos.</Text>
        </View>
      )}

      {PASSOS.map((passo, idx) => (
        <TouchableOpacity
          key={idx}
          style={[styles.passo, progresso[idx] && styles.passoConcluido]}
          onPress={() => togglePasso(idx)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, progresso[idx] && styles.checkboxMarcado]}>
            {progresso[idx] && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <View style={styles.passoConteudo}>
            <Text style={styles.passoNumero}>Passo {idx + 1}</Text>
            <Text style={[styles.passoTitulo, progresso[idx] && styles.tituloRiscado]}>
              {passo.titulo}
            </Text>
            <Text style={styles.passoDescricao}>{passo.descricao}</Text>
            {passo.alerta && (
              <View style={styles.alerta}>
                <Text style={styles.alertaTexto}>{passo.alerta}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
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
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: 24,
  },
  progressoContainer: {
    marginBottom: 24,
  },
  progressoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressoTexto: {
    fontSize: 13,
    color: '#C0C0D0',
  },
  progressoPorcentagem: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  progressoBarra: {
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressoPreenchimento: {
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  parabens: {
    backgroundColor: '#0D2010',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.success,
    alignItems: 'center',
  },
  parabensTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success,
    marginBottom: 4,
  },
  parabensTexto: {
    fontSize: 14,
    color: '#A0D0A0',
  },
  passo: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    alignItems: 'flex-start',
  },
  passoConcluido: {
    borderColor: '#2A3A2A',
    opacity: 0.75,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 2,
    flexShrink: 0,
  },
  checkboxMarcado: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  passoConteudo: {
    flex: 1,
  },
  passoNumero: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  passoTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  tituloRiscado: {
    color: '#666',
  },
  passoDescricao: {
    fontSize: 13,
    color: '#A0A0B0',
    lineHeight: 19,
  },
  alerta: {
    marginTop: 10,
    backgroundColor: '#1E0E0E',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
  },
  alertaTexto: {
    fontSize: 12,
    color: '#FF8080',
    lineHeight: 18,
  },
});
