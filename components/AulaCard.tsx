import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  titulo: string;
  descricao: string;
  duracao: string;
  concluida?: boolean;
  onPress: () => void;
};

export default function AulaCard({ titulo, descricao, duracao, concluida = false, onPress }: Props) {
  return (
    <TouchableOpacity style={[styles.card, concluida && styles.cardConcluida]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.titulo}>{titulo}</Text>
        {concluida && <Text style={styles.badge}>✓</Text>}
      </View>
      <Text style={styles.descricao}>{descricao}</Text>
      <Text style={styles.duracao}>{duracao}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F7931A',
  },
  cardConcluida: {
    borderLeftColor: '#4CAF50',
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titulo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  badge: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '700',
    marginLeft: 8,
  },
  descricao: {
    fontSize: 14,
    color: '#B0B0C0',
    marginBottom: 8,
  },
  duracao: {
    fontSize: 12,
    color: '#F7931A',
    fontWeight: '600',
  },
});
