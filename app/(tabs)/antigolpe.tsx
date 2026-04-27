import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/lib/theme';

const GOLPES = [
  {
    icone: '💰',
    titulo: 'Promessa de retorno garantido',
    descricao: 'Qualquer um que prometa X% ao mês com garantia está mentindo.',
    exemplo: 'Esquemas como "Rende 8% ao mês garantido" são matematicamente impossíveis a longo prazo. Cripto é volátil por natureza — ninguém pode garantir retorno.',
    protecao: 'Se prometem rendimento fixo e garantido em cripto, é golpe. Desconfie sempre, sem exceção.',
  },
  {
    icone: '🔺',
    titulo: 'Pirâmide com bônus por indicação',
    descricao: 'Ganha mais quem traz mais gente. O dinheiro vem de novos entrantes, não de investimento real.',
    exemplo: 'Atlas Quantum, Braiscompany, Trust Investing, GAS Tecnologia — todas quebraram ou sumiram com o dinheiro dos participantes.',
    protecao: 'Se o modelo de ganho depende de indicações, é pirâmide financeira. Não entre, não indique.',
  },
  {
    icone: '📞',
    titulo: 'Suporte falso te chamando primeiro',
    descricao: 'Exchanges e carteiras nunca entram em contato primeiro. Se alguém te chama "para ajudar", é golpe.',
    exemplo: 'Golpistas monitoram grupos de cripto e abordam quem pede ajuda, fingindo ser suporte do Mercado Bitcoin, Ledger, Binance, etc.',
    protecao: 'Procure suporte VOCÊ pelos canais oficiais do site. Nunca aceite "ajuda" de quem te abordou.',
  },
  {
    icone: '🔑',
    titulo: 'Pedido de seed phrase',
    descricao: 'Nenhuma empresa, suporte ou especialista legítimo pede sua seed phrase. Jamais.',
    exemplo: 'Golpista finge ser da Ledger: "Sua conta foi comprometida, informe as 24 palavras para verificar." Em segundos a carteira é esvaziada.',
    protecao: 'Sua seed phrase é só sua. Nunca a digitize, fotografe ou envie para qualquer pessoa por qualquer motivo.',
  },
  {
    icone: '🔗',
    titulo: 'Link encurtado em e-mail ou SMS',
    descricao: 'Links como bit.ly/bitcoin-urgente escondem o destino real e podem levar a sites falsos.',
    exemplo: 'E-mail falso do Mercado Bitcoin com "Confirme seu login" leva para merc4do-bitcoin.com — visualmente idêntico, mas rouba suas credenciais.',
    protecao: 'Sempre acesse exchanges digitando o endereço direto no navegador. Adicione nos favoritos.',
  },
  {
    icone: '📺',
    titulo: 'Influencer pedindo pra mandar BTC pra dobrar',
    descricao: 'Perfis hackeados ou falsos de famosos prometem dobrar qualquer Bitcoin enviado.',
    exemplo: 'Live falsa no YouTube com imagem de Elon Musk: "Envie 0.1 BTC e receba 0.2 de volta em 10 minutos". Nunca recebe nada de volta.',
    protecao: 'Ninguém dobra Bitcoin. Toda oferta de "envie e receba o dobro" é roubo puro e simples.',
  },
  {
    icone: '🪂',
    titulo: 'Airdrop pedindo conexão de carteira',
    descricao: 'Sites falsos pedem para conectar sua carteira para "reivindicar tokens grátis" e drenam tudo.',
    exemplo: 'Anúncio de airdrop exclusivo em rede social. Você conecta a MetaMask e assina uma transação que concede acesso total à sua carteira.',
    protecao: 'Desconfie de qualquer airdrop. Nunca conecte sua carteira principal a sites desconhecidos. Use carteira separada para experimentos.',
  },
  {
    icone: '📱',
    titulo: 'Aplicativo fora da loja oficial',
    descricao: 'Apps de exchanges ou carteiras de fontes não oficiais podem ser versões modificadas para roubar dados.',
    exemplo: 'Busca no Google retorna anúncio falso de "Ledger Live download". O app parece idêntico, mas captura sua seed phrase na configuração inicial.',
    protecao: 'Só baixe da App Store, Google Play ou do site oficial digitado manualmente no navegador.',
  },
  {
    icone: '📷',
    titulo: 'QR code recebido de terceiros',
    descricao: 'QR codes de pagamento podem ter sido substituídos pelo endereço do golpista sem que você perceba.',
    exemplo: 'Você vai pagar alguém via Bitcoin. A pessoa manda o QR por WhatsApp — mas o endereço no código é de outra carteira controlada pelo fraudador.',
    protecao: 'Sempre confirme pelo menos os 4 primeiros e 4 últimos caracteres do endereço antes de enviar. Nunca confie só no QR.',
  },
  {
    icone: '⏰',
    titulo: 'Pressão psicológica e urgência',
    descricao: '"Última chance", "só hoje", "sua conta será bloqueada" — golpe sempre usa urgência para você não pensar.',
    exemplo: '"Detectamos atividade suspeita. Transfira seus fundos AGORA para este endereço seguro antes que sua conta seja bloqueada em 2 horas."',
    protecao: 'Pare, respire, desconfie. Empresas legítimas não exigem ação imediata com ameaças. Urgência artificial é sinal claro de golpe.',
  },
];

export default function AntiGolpeScreen() {
  const [expandido, setExpandido] = useState<number | null>(null);

  function toggle(idx: number) {
    setExpandido(expandido === idx ? null : idx);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>🚨 Detector de Golpes</Text>
      <Text style={styles.subtitulo}>
        Conheça os 10 golpes mais comuns. Toque em cada card para ver um exemplo real e como se proteger.
      </Text>

      {GOLPES.map((golpe, idx) => (
        <TouchableOpacity
          key={idx}
          style={[styles.card, expandido === idx && styles.cardExpandido]}
          onPress={() => toggle(idx)}
          activeOpacity={0.85}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.icone}>{golpe.icone}</Text>
            <View style={styles.cardTexto}>
              <Text style={styles.cardTitulo}>{golpe.titulo}</Text>
              <Text style={styles.cardDescricao}>{golpe.descricao}</Text>
            </View>
            <Text style={styles.chevron}>{expandido === idx ? '▲' : '▼'}</Text>
          </View>

          {expandido === idx && (
            <View style={styles.detalhes}>
              <View style={styles.blocoExemplo}>
                <Text style={styles.legendaExemplo}>Exemplo real</Text>
                <Text style={styles.detalheTexto}>{golpe.exemplo}</Text>
              </View>
              <View style={styles.blocoProtecao}>
                <Text style={styles.legendaProtecao}>✓ Como se proteger</Text>
                <Text style={styles.detalheTexto}>{golpe.protecao}</Text>
              </View>
            </View>
          )}
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
    padding: 16,
    paddingBottom: 48,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 19,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
  },
  cardExpandido: {
    borderLeftColor: colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  icone: {
    fontSize: 22,
    flexShrink: 0,
    marginTop: 1,
  },
  cardTexto: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.danger,
    marginBottom: 3,
    lineHeight: 20,
  },
  cardDescricao: {
    fontSize: 13,
    color: '#A0A0B8',
    lineHeight: 18,
  },
  chevron: {
    fontSize: 10,
    color: '#555',
    flexShrink: 0,
    marginTop: 4,
  },
  detalhes: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#2A2A3E',
    paddingTop: 14,
    gap: 10,
  },
  blocoExemplo: {
    backgroundColor: '#110808',
    borderRadius: 8,
    padding: 12,
  },
  blocoProtecao: {
    backgroundColor: '#081108',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2A4A2A',
  },
  legendaExemplo: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.danger,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  legendaProtecao: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.success,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  detalheTexto: {
    fontSize: 13,
    color: '#C0C0D0',
    lineHeight: 19,
  },
});
