import { StyleSheet, Text, View } from 'react-native';

export default function CarteiraScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔐</Text>
      <Text style={styles.titulo}>Carteira Fria</Text>
      <Text style={styles.descricao}>
        Aprenda a proteger seus bitcoins de forma segura usando carteiras offline.
      </Text>
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Em breve</Text>
        <Text style={styles.cardTexto}>
          Guias sobre hardware wallets, seed phrases e boas práticas de segurança.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D1A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  descricao: {
    fontSize: 15,
    color: '#B0B0C0',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#F7931A',
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F7931A',
    marginBottom: 8,
  },
  cardTexto: {
    fontSize: 14,
    color: '#B0B0C0',
    lineHeight: 20,
  },
});
