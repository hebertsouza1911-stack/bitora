import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type Pergunta = {
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
};

type Props = {
  perguntas: Pergunta[];
  onConcluir: (acertos: number, total: number) => void;
};

const LETRAS = ['A', 'B', 'C', 'D'];

export default function Quiz({ perguntas, onConcluir }: Props) {
  const [atual, setAtual] = useState(0);
  const [respostas, setRespostas] = useState<(number | null)[]>(perguntas.map(() => null));
  const [finalizado, setFinalizado] = useState(false);

  const perguntaAtual = perguntas[atual];
  const respostaAtual = respostas[atual];
  const respondeu = respostaAtual !== null;

  const acertos = respostas.filter((r, i) => r !== null && r === perguntas[i].correta).length;

  function selecionar(idx: number) {
    if (respondeu) return;
    const novas = [...respostas];
    novas[atual] = idx;
    setRespostas(novas);
  }

  function avancar() {
    if (atual + 1 >= perguntas.length) {
      const totalAcertos = respostas.filter((r, i) => r !== null && r === perguntas[i].correta).length;
      setFinalizado(true);
      onConcluir(totalAcertos, perguntas.length);
    } else {
      setAtual(atual + 1);
    }
  }

  function reiniciar() {
    setAtual(0);
    setRespostas(perguntas.map(() => null));
    setFinalizado(false);
  }

  if (finalizado) {
    const aprovado = acertos >= 2;
    return (
      <View style={styles.resultado}>
        <Text style={styles.emoji}>{aprovado ? '🎉' : '📚'}</Text>
        <Text style={styles.resultadoTitulo}>{acertos}/{perguntas.length} acertos</Text>
        <Text style={styles.resultadoTexto}>
          {aprovado
            ? 'Parabéns! Aula marcada como concluída.'
            : 'Você precisa de pelo menos 2 acertos. Revise o conteúdo e tente novamente!'}
        </Text>
        {!aprovado && (
          <TouchableOpacity style={styles.botaoReiniciar} onPress={reiniciar}>
            <Text style={styles.botaoReiniciarTexto}>Tentar novamente</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.quizLabel}>Quiz</Text>
        <Text style={styles.progresso}>{atual + 1} / {perguntas.length}</Text>
      </View>

      <Text style={styles.pergunta}>{perguntaAtual.pergunta}</Text>

      {perguntaAtual.opcoes.map((opcao, idx) => {
        const isCorreta = idx === perguntaAtual.correta;
        const isSelecionada = idx === respostaAtual;

        let estiloExtra = {};
        if (respondeu) {
          if (isCorreta) estiloExtra = styles.opcaoCorreta;
          else if (isSelecionada) estiloExtra = styles.opcaoErrada;
        } else if (isSelecionada) {
          estiloExtra = styles.opcaoSelecionada;
        }

        return (
          <TouchableOpacity
            key={idx}
            style={[styles.opcao, estiloExtra]}
            onPress={() => selecionar(idx)}
            activeOpacity={respondeu ? 1 : 0.75}
          >
            <Text style={styles.opcaoLetra}>{LETRAS[idx]}</Text>
            <Text style={styles.opcaoTexto}>{opcao}</Text>
            {respondeu && isCorreta && <Text style={styles.opcaoIcone}>✓</Text>}
            {respondeu && isSelecionada && !isCorreta && <Text style={styles.opcaoIcone}>✗</Text>}
          </TouchableOpacity>
        );
      })}

      {respondeu && (
        <View style={styles.explicacaoBox}>
          <Text style={styles.explicacaoLabel}>Explicação</Text>
          <Text style={styles.explicacaoTexto}>{perguntaAtual.explicacao}</Text>
        </View>
      )}

      {respondeu && (
        <TouchableOpacity style={styles.botaoAvancar} onPress={avancar}>
          <Text style={styles.botaoTexto}>
            {atual + 1 >= perguntas.length ? 'Ver resultado' : 'Próxima pergunta →'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#1E1E30',
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quizLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F7931A',
  },
  progresso: {
    fontSize: 14,
    color: '#666',
  },
  pergunta: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: '600',
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  opcaoSelecionada: {
    borderColor: '#F7931A',
  },
  opcaoCorreta: {
    borderColor: '#4CAF50',
    backgroundColor: '#0D2010',
  },
  opcaoErrada: {
    borderColor: '#F44336',
    backgroundColor: '#200D0D',
  },
  opcaoLetra: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F7931A',
    marginRight: 12,
    width: 18,
  },
  opcaoTexto: {
    fontSize: 14,
    color: '#C8C8D8',
    flex: 1,
    lineHeight: 20,
  },
  opcaoIcone: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
    color: '#FFFFFF',
  },
  explicacaoBox: {
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    padding: 14,
    marginTop: 4,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#F7931A',
  },
  explicacaoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F7931A',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  explicacaoTexto: {
    fontSize: 14,
    color: '#C8C8D8',
    lineHeight: 21,
  },
  botaoAvancar: {
    backgroundColor: '#F7931A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  botaoTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  resultado: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#1E1E30',
    paddingTop: 28,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  resultadoTitulo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  resultadoTexto: {
    fontSize: 15,
    color: '#B0B0C0',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  botaoReiniciar: {
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: '#F7931A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  botaoReiniciarTexto: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F7931A',
  },
});
