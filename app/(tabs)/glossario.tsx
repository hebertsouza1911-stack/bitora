import { FlatList, StyleSheet, Text, View } from 'react-native';

const termos = [
  { termo: 'Bitcoin (BTC)', definicao: 'Primeira criptomoeda descentralizada, criada em 2009 por Satoshi Nakamoto.' },
  { termo: 'Blockchain', definicao: 'Registro público e imutável de todas as transações Bitcoin, organizado em blocos encadeados.' },
  { termo: 'Satoshi', definicao: 'Menor fração do Bitcoin: 0,00000001 BTC. Homenagem ao criador do Bitcoin.' },
  { termo: 'Wallet (Carteira)', definicao: 'Software ou hardware que armazena suas chaves privadas e permite enviar/receber Bitcoin.' },
  { termo: 'Seed Phrase', definicao: 'Sequência de 12 ou 24 palavras que serve como backup da sua carteira. Nunca compartilhe!' },
  { termo: 'Chave Privada', definicao: 'Código secreto que prova a posse dos seus bitcoins. Quem tiver a chave, tem os bitcoins.' },
  { termo: 'Chave Pública', definicao: 'Derivada da chave privada, usada para gerar endereços de recebimento.' },
  { termo: 'Mining (Mineração)', definicao: 'Processo de validar transações e adicionar novos blocos à blockchain, recompensado com bitcoins.' },
  { termo: 'Halving', definicao: 'Evento que reduz pela metade a recompensa dos mineradores, ocorre a cada ~4 anos.' },
  { termo: 'Lightning Network', definicao: 'Camada 2 do Bitcoin que permite transações instantâneas e de baixo custo.' },
];

export default function GlossarioScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={termos}
        keyExtractor={(item) => item.termo}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.termo}>{item.termo}</Text>
            <Text style={styles.definicao}>{item.definicao}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D1A',
  },
  lista: {
    padding: 16,
    paddingBottom: 32,
  },
  item: {
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#F7931A',
  },
  termo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F7931A',
    marginBottom: 4,
  },
  definicao: {
    fontSize: 13,
    color: '#C0C0D0',
    lineHeight: 19,
  },
});
