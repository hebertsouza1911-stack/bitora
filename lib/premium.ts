import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEMO_MODE = true;

const PREMIUM_KEY = '@bitora:premium_status';

type Listener = () => void;
const listeners = new Set<Listener>();

export function onPremiumChange(fn: Listener): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

function notify() {
  listeners.forEach((fn) => fn());
}

export async function getPremiumStatus(): Promise<boolean> {
  const val = await AsyncStorage.getItem(PREMIUM_KEY);
  return val === 'true';
}

export const isPremium = getPremiumStatus;

export async function setPremium(value: boolean): Promise<void> {
  await AsyncStorage.setItem(PREMIUM_KEY, String(value));
  notify();
}
