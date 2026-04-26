import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import aulasData from '@/content/aulas.json';
import { aulaConcluida, salvarProgresso } from '@/lib/storage';

type Aula = {
  id: string;
  titulo: string;
  descricao: string;
  duracao: string;
  conteudo: string;
};

function renderConteudo(conteudo: string) {
  const linhas = conteudo.split('\n');
  return linhas.map((linha, i) => {
    if (linha.startsWith('## ')) {
      return <Text key={i} style={styles.h2}>{linha.slice(3)}</Text>;
    }
    if (linha.startsWith('### ')) {
      return <Text key={i} style={styles.h3}>{linha.slice(4)}</Text>;
    }
    if (linha.startsWith('> ')) {
      return (
        <View key={i} style={styles.blockquote}>
          <Text style={styles.blockquoteTexto}>{linha.slice(2)}</Text>
        </View>
      );
    }
    if (linha.startsWith('- **')) {
      const match = linha.match(/^- \*\*(.+?)\*\*: (.+)$/);
      if (match) {
        return (
          <View key={i} style={styles.liItem}>
            <Text style={styles.liPonto}>•</Text>
            <Text style={styles.liTexto}>
              <Text style={styles.bold}>{match[1]}: </Text>
              {match[2]}
            </Text>
          </View>
        );
      }
    }
    if (linha.trim() === '') {
      return <View key={i} style={styles.espaco} />;
    }
    const partes = linha.split(/\*\*(.+?)\*\*/g);
    if (partes.length > 1) {
      return (
        <Text key={i} style={styles.paragrafo}>
          {partes.map((p, j) =>
            j % 2 === 1 ? <Text key={j} style={styles.bold}>{p}</Text> : p
          )}
        </Text>
      );
    }
    return <Text key={i} style={styles.paragrafo}>{linha}</Text>;
  });
}

export default function AulaDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [concluida, setConcluida] = useState(false);

  const aula = (aulasData as Aula[]).find((a) => a.id === id);

  useEffect(() => {
    if (aula) {
      navigation.setOptions({ title: aula.titulo });
      aulaConcluida(aula.id).then(setConcluida);
    }
  }, [aula]);

  if (!aula) {
    return (
      <View style={styles.erro}>
        <Text style={styles.erroTexto}>Aula não encontrada.</Text>
      </View>
    );
  }

  async function marcarConcluida() {
    await salvarProgresso(aula!.id);
    setConcluida(true);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <View style={styles.meta}>
        <Text style={styles.duracao}>{aula.duracao}</Text>
        {concluida && <Text style={styles.badgeConcluida}>✓ Concluída</Text>}
      </View>

      {renderConteudo(aula.conteudo)}

      {!concluida && (
        <TouchableOpacity style={styles.botao} onPress={marcarConcluida} activeOpacity={0.85}>
          <Text style={styles.botaoTexto}>Marcar como concluída</Text>
        </TouchableOpacity>
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
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  duracao: {
    fontSize: 13,
    color: '#F7931A',
    fontWeight: '600',
  },
  badgeConcluida: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 16,
  },
  h3: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F7931A',
    marginBottom: 6,
    marginTop: 14,
  },
  paragrafo: {
    fontSize: 15,
    color: '#C8C8D8',
    lineHeight: 24,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  liItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 4,
  },
  liPonto: {
    color: '#F7931A',
    fontSize: 15,
    marginRight: 8,
    lineHeight: 24,
  },
  liTexto: {
    fontSize: 15,
    color: '#C8C8D8',
    lineHeight: 24,
    flex: 1,
  },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: '#F7931A',
    paddingLeft: 12,
    marginVertical: 12,
    backgroundColor: '#1A1A2E',
    borderRadius: 4,
    paddingVertical: 8,
    paddingRight: 8,
  },
  blockquoteTexto: {
    fontSize: 15,
    color: '#E0E0F0',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  espaco: {
    height: 8,
  },
  botao: {
    marginTop: 32,
    backgroundColor: '#F7931A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botaoTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  erro: {
    flex: 1,
    backgroundColor: '#0D0D1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  erroTexto: {
    color: '#888',
    fontSize: 16,
  },
});
