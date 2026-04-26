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
    <TouchableOpacity
      style={[styles.card, concluida && styles.cardConcluida]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.titulo} numberOfLines={2}>{titulo}</Text>
        {concluida && (
          <View style={styles.checkBadge}>
            <Text style={styles.checkTexto}>✓</Text>
          </View>
        )}
      </View>
      <Text style={styles.descricao} numberOfLines={2}>{descricao}</Text>
      <View style={styles.footer}>
        <Text style={styles.duracao}>⏱ {duracao}</Text>
        {concluida && <Text style={styles.concluidaLabel}>Concluída</Text>}
      </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    lineHeight: 22,
  },
  checkBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 14,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkTexto: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  descricao: {
    fontSize: 13,
    color: '#A0A0B8',
    marginBottom: 10,
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duracao: {
    fontSize: 12,
    color: '#F7931A',
    fontWeight: '600',
  },
  concluidaLabel: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
