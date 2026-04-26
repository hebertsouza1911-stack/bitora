import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import aulasData from '@/content/aulas.json';
import { getAulasConcluidas, getProgressoCarteira } from '@/lib/storage';

const TOTAL_AULAS = aulasData.length;
const TOTAL_PASSOS = 8;
const LARGURA = Dimensions.get('window').width - 48;

export default function InicioScreen() {
  const router = useRouter();
  const [aulasConcluidas, setAulasConcluidas] = useState<string[]>([]);
  const [passosCarteira, setPassosCarteira] = useState<boolean[]>(Array(TOTAL_PASSOS).fill(false));

  useFocusEffect(
    useCallback(() => {
      getAulasConcluidas().then(setAulasConcluidas);
      getProgressoCarteira().then(setPassosCarteira);
    }, [])
  );

  const totalConcluidas = aulasConcluidas.length;
  const totalPassos = passosCarteira.filter(Boolean).length;

  const proximaAula = (aulasData as { id: string }[]).find(
    (a) => !aulasConcluidas.includes(a.id)
  );

  const barraAulas = LARGURA * (totalConcluidas / TOTAL_AULAS);
  const barraCarteira = LARGURA * (totalPassos / TOTAL_PASSOS);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.saudacao}>Bem-vindo, bitcoiner! 👋</Text>
      <Text style={styles.subtitulo}>Acompanhe seu progresso abaixo.</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitulo}>📚 Aulas concluídas</Text>
          <Text style={styles.cardContador}>{totalConcluidas}/{TOTAL_AULAS}</Text>
        </View>
        <View style={styles.barraFundo}>
          <View style={[styles.barraPreenchida, styles.barraAulas, { width: barraAulas }]} />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitulo}>🔑 Carteira fria configurada</Text>
          <Text style={styles.cardContador}>{totalPassos}/{TOTAL_PASSOS}</Text>
        </View>
        <View style={styles.barraFundo}>
          <View style={[styles.barraPreenchida, styles.barraCarteira, { width: barraCarteira }]} />
        </View>
      </View>

      {proximaAula ? (
        <TouchableOpacity
          style={styles.botaoContinuar}
          onPress={() => router.push(`/aula/${proximaAula.id}`)}
          activeOpacity={0.85}
        >
          <Text style={styles.botaoContinuarTexto}>Continuar última aula →</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.parabens}>
          <Text style={styles.parabensTexto}>🎉 Todas as aulas concluídas! Parabéns!</Text>
        </View>
      )}

      <Text style={styles.sectionTitulo}>Próximos passos sugeridos</Text>

      {totalConcluidas === 0 && (
        <View style={styles.dica}>
          <Text style={styles.dicaTexto}>📖 Comece pela primeira aula para entender o que é Bitcoin.</Text>
        </View>
      )}
      {totalConcluidas > 0 && totalConcluidas < TOTAL_AULAS && (
        <View style={styles.dica}>
          <Text style={styles.dicaTexto}>🚀 Continue as aulas — você já avançou {Math.round((totalConcluidas / TOTAL_AULAS) * 100)}% do curso.</Text>
        </View>
      )}
      {totalPassos < TOTAL_PASSOS && (
        <View style={styles.dica}>
          <Text style={styles.dicaTexto}>🔑 Complete o guia da carteira fria para proteger seus Bitcoin com segurança máxima.</Text>
        </View>
      )}
      {totalConcluidas >= 3 && (
        <View style={styles.dica}>
          <Text style={styles.dicaTexto}>🛡️ Revise o detector de golpes — quem sabe é quem não cai.</Text>
        </View>
      )}
      {totalConcluidas === TOTAL_AULAS && totalPassos === TOTAL_PASSOS && (
        <View style={styles.dica}>
          <Text style={styles.dicaTexto}>✅ Você completou tudo! Compartilhe o conhecimento com alguém de confiança.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D1A',
  },
  conteudo: {
    padding: 20,
    paddingBottom: 48,
  },
  saudacao: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 13,
    color: '#888',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardContador: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F7931A',
  },
  barraFundo: {
    height: 8,
    backgroundColor: '#0D0D1A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barraPreenchida: {
    height: 8,
    borderRadius: 4,
  },
  barraAulas: {
    backgroundColor: '#F7931A',
  },
  barraCarteira: {
    backgroundColor: '#4CAF50',
  },
  botaoContinuar: {
    backgroundColor: '#F7931A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  botaoContinuarTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  parabens: {
    backgroundColor: '#0D2010',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  parabensTexto: {
    fontSize: 15,
    color: '#4CAF50',
    fontWeight: '700',
  },
  sectionTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  dica: {
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#F7931A',
  },
  dicaTexto: {
    fontSize: 13,
    color: '#C0C0D0',
    lineHeight: 19,
  },
});
