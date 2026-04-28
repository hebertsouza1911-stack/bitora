import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import PaywallModal from '@/components/PaywallModal';
import {
  BitcoinPriceData,
  downsample,
  formatBRL,
  formatBTC,
  getBitcoinHistory,
  getBitcoinPrice,
} from '@/lib/bitcoin-price';
import { colors } from '@/lib/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 64;
const DAYS_OPTIONS: (7 | 30 | 90)[] = [7, 30, 90];

export default function MeuBitcoinScreen() {
  // ─── Preço ────────────────────────────────────────────────────────────────
  const [priceData, setPriceData] = useState<BitcoinPriceData | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Gráfico ──────────────────────────────────────────────────────────────
  const [chartDays, setChartDays] = useState<7 | 30 | 90>(30);
  const [rawPrices, setRawPrices] = useState<number[]>([]);
  const [chartLoading, setChartLoading] = useState(true);

  // ─── Calculadora ──────────────────────────────────────────────────────────
  const [brlInput, setBrlInput] = useState('');
  const [btcInput, setBtcInput] = useState('');

  // ─── Conversor de Sats ────────────────────────────────────────────────────
  const [satsInput, setSatsInput] = useState('');
  const [satExpanded, setSatExpanded] = useState(false);

  // ─── Alerta ───────────────────────────────────────────────────────────────
  const [alertPrice, setAlertPrice] = useState<number | null>(null);
  const [alertInput, setAlertInput] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);

  // ─── Efeitos ──────────────────────────────────────────────────────────────

  useEffect(() => {
    loadPrice();
    loadChart(30);
    loadAlert();
    intervalRef.current = setInterval(loadPrice, 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    loadChart(chartDays);
  }, [chartDays]);

  // ─── Loaders ──────────────────────────────────────────────────────────────

  async function loadPrice() {
    try {
      const data = await getBitcoinPrice();
      setPriceData(data);
    } catch {
      // mantém estado atual
    } finally {
      setPriceLoading(false);
    }
  }

  async function loadChart(days: 7 | 30 | 90) {
    setChartLoading(true);
    try {
      const prices = await getBitcoinHistory(days);
      setRawPrices(prices);
    } catch {
      // mantém estado atual
    } finally {
      setChartLoading(false);
    }
  }

  async function loadAlert() {
    const saved = await AsyncStorage.getItem('alerta_btc');
    if (saved) setAlertPrice(parseFloat(saved));
  }

  // ─── Calculadora ──────────────────────────────────────────────────────────

  const currentPrice = priceData?.brl ?? null;

  function calcBtcFromBrl(text: string) {
    setBrlInput(text);
    const num = parseFloat(text.replace(/\./g, '').replace(',', '.'));
    if (currentPrice && !isNaN(num) && num > 0) {
      setBtcInput((num / currentPrice).toFixed(8));
    } else {
      setBtcInput('');
    }
  }

  function calcBrlFromBtc(text: string) {
    setBtcInput(text);
    const num = parseFloat(text.replace(',', '.'));
    if (currentPrice && !isNaN(num) && num > 0) {
      setBrlInput(formatBRL(num * currentPrice).replace('R$ ', ''));
    } else {
      setBrlInput('');
    }
  }

  function applyQuick(amount: number) {
    setBrlInput(amount.toLocaleString('pt-BR'));
    if (currentPrice) setBtcInput((amount / currentPrice).toFixed(8));
  }

  // ─── Alerta ───────────────────────────────────────────────────────────────

  async function createAlert() {
    if (alertPrice !== null) { setShowPaywall(true); return; }
    const num = parseFloat(alertInput.replace(/\./g, '').replace(',', '.'));
    if (isNaN(num) || num <= 0) return;
    await AsyncStorage.setItem('alerta_btc', String(num));
    setAlertPrice(num);
    setAlertInput('');
  }

  async function removeAlert() {
    await AsyncStorage.removeItem('alerta_btc');
    setAlertPrice(null);
  }

  // ─── Dados do gráfico ─────────────────────────────────────────────────────

  const chartPoints = downsample(rawPrices.filter(v => isFinite(v) && v > 0), 30);
  const hasChart = chartPoints.length > 1;

  const chartData = {
    labels: Array(chartPoints.length).fill(''),
    datasets: [{ data: hasChart ? chartPoints : [40000, 40001] }],
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(247, 147, 26, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
    propsForDots: { r: '0' },
    propsForBackgroundLines: { stroke: 'transparent' },
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  const change = priceData?.brl_24h_change ?? 0;
  const changePositive = change >= 0;

  const sats = parseFloat(satsInput);
  const satsBtc = isNaN(sats) ? 0 : sats / 1e8;
  const satsBrl = currentPrice && satsBtc > 0 ? satsBtc * currentPrice : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Bloco 1: Preço ──────────────────────────────────────────────── */}
      <View style={styles.priceCard}>
        <Text style={styles.priceLabel}>Preço do Bitcoin</Text>
        {priceLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
        ) : (
          <>
            <Text style={styles.priceValue}>
              {priceData ? formatBRL(priceData.brl) : '—'}
            </Text>
            <Text style={[styles.priceChange, { color: changePositive ? colors.success : colors.danger }]}>
              {changePositive ? '↑' : '↓'} {Math.abs(change).toFixed(2).replace('.', ',')}% (24h)
            </Text>
            {priceData?.fromCache && (
              <Text style={styles.cacheAviso}>
                Sem conexão — preço atualizado às {priceData.cacheTime}
              </Text>
            )}
          </>
        )}
      </View>

      {/* ── Bloco 2: Gráfico ────────────────────────────────────────────── */}
      <View style={styles.bloco}>
        <Text style={styles.blocoTitulo}>Histórico de preço</Text>
        <View style={styles.periodBotoes}>
          {DAYS_OPTIONS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.periodBotao, chartDays === d && styles.periodBotaoAtivo]}
              onPress={() => setChartDays(d)}
            >
              <Text style={[styles.periodTexto, chartDays === d && styles.periodTextoAtivo]}>
                {d}d
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {chartLoading || !hasChart ? (
          <View style={styles.chartPlaceholder}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <LineChart
            data={chartData}
            width={CHART_WIDTH}
            height={180}
            chartConfig={chartConfig}
            bezier
            withVerticalLabels={false}
            withHorizontalLabels={true}
            withInnerLines={false}
            withOuterLines={false}
            formatYLabel={(v) => {
              const n = parseFloat(v);
              if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
              if (n >= 1000) return `${Math.round(n / 1000)}k`;
              return String(Math.round(n));
            }}
            style={styles.chart}
          />
        )}
      </View>

      {/* ── Bloco 3: Calculadora ────────────────────────────────────────── */}
      <View style={styles.bloco}>
        <Text style={styles.blocoTitulo}>Calculadora</Text>
        <View style={styles.calcRow}>
          <View style={styles.calcCampo}>
            <Text style={styles.calcLabel}>BRL</Text>
            <TextInput
              style={styles.calcInput}
              value={brlInput}
              onChangeText={calcBtcFromBrl}
              placeholder="0,00"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
            />
          </View>
          <Text style={styles.calcSeta}>⇄</Text>
          <View style={styles.calcCampo}>
            <Text style={styles.calcLabel}>BTC</Text>
            <TextInput
              style={styles.calcInput}
              value={btcInput}
              onChangeText={calcBrlFromBtc}
              placeholder="0,00000000"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
            />
          </View>
        </View>
        <View style={styles.quickRow}>
          {[100, 500, 1000, 5000].map((v) => (
            <TouchableOpacity key={v} style={styles.quickBotao} onPress={() => applyQuick(v)}>
              <Text style={styles.quickTexto}>R$ {v.toLocaleString('pt-BR')}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Bloco 4: Conversor de Satoshis ──────────────────────────────── */}
      <TouchableOpacity
        style={styles.bloco}
        onPress={() => setSatExpanded(!satExpanded)}
        activeOpacity={0.85}
      >
        <View style={styles.satHeader}>
          <Text style={styles.blocoTitulo}>💡 O que são satoshis?</Text>
          <Text style={styles.chevron}>{satExpanded ? '▲' : '▼'}</Text>
        </View>
        {satExpanded && (
          <View>
            <Text style={styles.satTexto}>
              1 BTC = 100.000.000 satoshis (sats). É a menor unidade do Bitcoin.
            </Text>
            <TextInput
              style={[styles.calcInput, { marginTop: 12 }]}
              value={satsInput}
              onChangeText={setSatsInput}
              placeholder="Digite a quantidade de sats"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
            {satsInput !== '' && satsBtc > 0 && (
              <View style={styles.satResultado}>
                <Text style={styles.satResultText}>{formatBTC(satsBtc)}</Text>
                {satsBrl !== null && (
                  <Text style={styles.satResultText}>{formatBRL(satsBrl)}</Text>
                )}
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>

      {/* ── Bloco 5: Alerta de Preço ─────────────────────────────────────── */}
      <View style={styles.bloco}>
        <Text style={styles.blocoTitulo}>🔔 Alerta de preço</Text>
        {alertPrice !== null ? (
          <View style={styles.alertaAtivo}>
            <Text style={styles.alertaAtivoTexto}>
              Alerta configurado: {formatBRL(alertPrice)}
            </Text>
            <TouchableOpacity style={styles.alertaRemover} onPress={removeAlert}>
              <Text style={styles.alertaRemoverTexto}>Remover</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.alertaForm}>
            <TextInput
              style={styles.alertaInput}
              value={alertInput}
              onChangeText={setAlertInput}
              placeholder="Me avise quando BTC chegar a R$..."
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.alertaCriar} onPress={createAlert}>
              <Text style={styles.alertaCriarTexto}>Criar alerta</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <PaywallModal visible={showPaywall} onClose={() => setShowPaywall(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: 16, paddingBottom: 48 },

  // ── Preço ──────────────────────────────────────────────────────────────────
  priceCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  priceChange: { fontSize: 15, fontWeight: '700' },
  cacheAviso: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 8,
    fontStyle: 'italic',
  },

  // ── Blocos genéricos ───────────────────────────────────────────────────────
  bloco: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  blocoTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },

  // ── Gráfico ────────────────────────────────────────────────────────────────
  periodBotoes: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  periodBotao: {
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: colors.background,
  },
  periodBotaoAtivo: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(247,147,26,0.12)',
  },
  periodTexto: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  periodTextoAtivo: { color: colors.primary },
  chartPlaceholder: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: { borderRadius: 8 },

  // ── Calculadora ────────────────────────────────────────────────────────────
  calcRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
  },
  calcCampo: { flex: 1 },
  calcLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  calcInput: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  calcSeta: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: '700',
    paddingBottom: 12,
  },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickBotao: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  quickTexto: { fontSize: 13, color: colors.primary, fontWeight: '600' },

  // ── Satoshis ───────────────────────────────────────────────────────────────
  satHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chevron: { fontSize: 10, color: colors.textMuted },
  satTexto: {
    fontSize: 13,
    color: '#C0C0D0',
    lineHeight: 19,
    marginTop: 8,
  },
  satResultado: { marginTop: 12, gap: 4 },
  satResultText: { fontSize: 16, color: colors.primary, fontWeight: '700' },

  // ── Alerta ─────────────────────────────────────────────────────────────────
  alertaAtivo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  alertaAtivoTexto: { fontSize: 14, color: colors.text, flex: 1 },
  alertaRemover: {
    backgroundColor: `${colors.danger}22`,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  alertaRemoverTexto: { fontSize: 13, color: colors.danger, fontWeight: '700' },
  alertaForm: { gap: 10 },
  alertaInput: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  alertaCriar: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  alertaCriarTexto: { fontSize: 15, fontWeight: '700', color: '#000' },

});
