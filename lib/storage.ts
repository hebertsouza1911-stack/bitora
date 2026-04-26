import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_AULAS = 'aulas_concluidas';
const CHAVE_CARTEIRA = 'carteira_fria_progresso';
const TOTAL_PASSOS_CARTEIRA = 8;

// ── Aulas ─────────────────────────────────────────────────────────────────────

export async function getAulasConcluidas(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(CHAVE_AULAS);
  return raw ? JSON.parse(raw) : [];
}

export async function marcarAulaConcluida(aulaId: string): Promise<void> {
  const concluidas = await getAulasConcluidas();
  if (!concluidas.includes(aulaId)) {
    concluidas.push(aulaId);
    await AsyncStorage.setItem(CHAVE_AULAS, JSON.stringify(concluidas));
  }
}

export async function isAulaConcluida(aulaId: string): Promise<boolean> {
  const concluidas = await getAulasConcluidas();
  return concluidas.includes(aulaId);
}

// ── Carteira Fria ──────────────────────────────────────────────────────────────

export async function getProgressoCarteira(): Promise<boolean[]> {
  const raw = await AsyncStorage.getItem(CHAVE_CARTEIRA);
  return raw ? JSON.parse(raw) : Array(TOTAL_PASSOS_CARTEIRA).fill(false);
}

export async function setProgressoCarteira(passos: boolean[]): Promise<void> {
  await AsyncStorage.setItem(CHAVE_CARTEIRA, JSON.stringify(passos));
}

// ── Aliases retrocompatíveis (usados nos arquivos existentes) ──────────────────

export async function salvarProgresso(aulaId: string): Promise<void> {
  return marcarAulaConcluida(aulaId);
}

export async function buscarConcluidas(): Promise<string[]> {
  return getAulasConcluidas();
}

export async function aulaConcluida(aulaId: string): Promise<boolean> {
  return isAulaConcluida(aulaId);
}
