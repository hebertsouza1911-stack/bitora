import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'btc_price_cache';
const CACHE_TS_KEY = 'btc_price_cache_ts';

export interface BitcoinPriceData {
  brl: number;
  brl_24h_change: number;
  fromCache?: boolean;
  cacheTime?: string;
}

export async function getBitcoinPrice(): Promise<BitcoinPriceData> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl&include_24hr_change=true'
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const data: BitcoinPriceData = {
      brl: json.bitcoin.brl,
      brl_24h_change: json.bitcoin.brl_24h_change,
    };
    await AsyncStorage.multiSet([
      [CACHE_KEY, JSON.stringify(data)],
      [CACHE_TS_KEY, new Date().toISOString()],
    ]);
    return data;
  } catch {
    const [[, raw], [, ts]] = await AsyncStorage.multiGet([CACHE_KEY, CACHE_TS_KEY]);
    if (raw) {
      const cacheTime = ts
        ? new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        : '?';
      return { ...JSON.parse(raw), fromCache: true, cacheTime };
    }
    throw new Error('Sem dados de preço disponíveis');
  }
}

export async function getBitcoinHistory(days: 7 | 30 | 90): Promise<number[]> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=brl&days=${days}`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return (json.prices as [number, number][]).map(([, price]) => price);
}

export function formatBRL(value: number): string {
  const [int, dec] = value.toFixed(2).split('.');
  const intFormatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${intFormatted},${dec}`;
}

export function formatBTC(value: number): string {
  return `${value.toFixed(8).replace('.', ',')} BTC`;
}

export function downsample(arr: number[], maxPoints: number): number[] {
  if (arr.length <= maxPoints) return arr;
  const step = arr.length / maxPoints;
  return Array.from({ length: maxPoints }, (_, i) => arr[Math.floor(i * step)]);
}
