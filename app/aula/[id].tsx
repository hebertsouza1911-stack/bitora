import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Quiz, { Pergunta } from '@/components/Quiz';
import aulasData from '@/content/aulas.json';
import { isAulaConcluida, marcarAulaConcluida } from '@/lib/storage';
import { colors } from '@/lib/theme';

type Aula = {
  id: string;
  titulo: string;
  descricao: string;
  duracao: string;
  conteudo: string;
  quiz?: Pergunta[];
};

function renderConteudo(conteudo: string) {
  return conteudo.split('\n').map((linha, i) => {
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
    if (linha.startsWith('- ')) {
      return (
        <View key={i} style={styles.liItem}>
          <Text style={styles.liPonto}>•</Text>
          <Text style={styles.liTexto}>{linha.slice(2)}</Text>
        </View>
      );
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
  const router = useRouter();
  const [concluida, setConcluida] = useState(false);

  const aula = (aulasData as Aula[]).find((a) => a.id === id);

  useEffect(() => {
    if (aula) {
      navigation.setOptions({ title: aula.titulo });
      isAulaConcluida(aula.id).then(setConcluida);
    }
  }, [aula]);

  if (!aula) {
    return (
      <View style={styles.erro}>
        <Text style={styles.erroTexto}>Aula não encontrada.</Text>
      </View>
    );
  }

  async function handleMarcarConcluida() {
    await marcarAulaConcluida(aula!.id);
    setConcluida(true);
  }

  function handleQuizConcluido(acertos: number) {
    if (acertos >= 2) handleMarcarConcluida();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <View style={styles.meta}>
        <View style={styles.tempoTag}>
          <Text style={styles.tempoTexto}>⏱ {aula.duracao} de leitura</Text>
        </View>
        {concluida && (
          <View style={styles.concluidaTag}>
            <Text style={styles.concluidaTagTexto}>✓ Concluída</Text>
          </View>
        )}
      </View>

      {renderConteudo(aula.conteudo)}

      {concluida ? (
        <View style={styles.concluidaBox}>
          <Text style={styles.concluidaTexto}>Você já concluiu esta aula. Bom trabalho!</Text>
        </View>
      ) : aula.quiz && aula.quiz.length > 0 ? (
        <Quiz perguntas={aula.quiz} onConcluir={handleQuizConcluido} />
      ) : (
        <TouchableOpacity style={styles.botao} onPress={handleMarcarConcluida} activeOpacity={0.85}>
          <Text style={styles.botaoTexto}>Marcar como concluída</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()} activeOpacity={0.7}>
        <Text style={styles.botaoVoltarTexto}>← Voltar à lista de aulas</Text>
      </TouchableOpacity>
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
    paddingBottom: 56,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  duracao: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  badgeConcluida: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '600',
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  h3: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
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
    color: colors.text,
  },
  liItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 4,
  },
  liPonto: {
    color: colors.primary,
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
    borderLeftColor: colors.primary,
    paddingLeft: 12,
    marginVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 4,
    paddingVertical: 10,
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
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botaoTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  concluidaBox: {
    marginTop: 32,
    backgroundColor: '#0D2010',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.success,
    alignItems: 'center',
  },
  concluidaTexto: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600',
  },
  erro: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  erroTexto: {
    color: colors.textMuted,
    fontSize: 16,
  },
  tempoTag: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  tempoTexto: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  concluidaTag: {
    backgroundColor: '#0D2010',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.success,
  },
  concluidaTagTexto: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '700',
  },
  botaoVoltar: {
    marginTop: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  botaoVoltarTexto: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
});
