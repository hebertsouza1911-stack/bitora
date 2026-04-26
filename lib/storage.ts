import AsyncStorage from '@react-native-async-storage/async-storage';

export async function salvarProgresso(aulaId: string): Promise<void> {
  const raw = await AsyncStorage.getItem('aulas_concluidas');
  const concluidas: string[] = raw ? JSON.parse(raw) : [];
  if (!concluidas.includes(aulaId)) {
    concluidas.push(aulaId);
    await AsyncStorage.setItem('aulas_concluidas', JSON.stringify(concluidas));
  }
}

export async function buscarConcluidas(): Promise<string[]> {
  const raw = await AsyncStorage.getItem('aulas_concluidas');
  return raw ? JSON.parse(raw) : [];
}

export async function aulaConcluida(aulaId: string): Promise<boolean> {
  const concluidas = await buscarConcluidas();
  return concluidas.includes(aulaId);
}
