import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import AulaCard from '@/components/AulaCard';
import aulasData from '@/content/aulas.json';
import { buscarConcluidas } from '@/lib/storage';

type Aula = {
  id: string;
  titulo: string;
  descricao: string;
  duracao: string;
  conteudo: string;
};

export default function AulasScreen() {
  const router = useRouter();
  const [concluidas, setConcluidas] = useState<string[]>([]);

  useEffect(() => {
    buscarConcluidas().then(setConcluidas);
  }, []);

  const aulas: Aula[] = aulasData;

  return (
    <View style={styles.container}>
      <Text style={styles.subtitulo}>
        {aulas.length} aula{aulas.length !== 1 ? 's' : ''} disponível{aulas.length !== 1 ? 'is' : ''}
      </Text>
      <FlatList
        data={aulas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <AulaCard
            titulo={item.titulo}
            descricao={item.descricao}
            duracao={item.duracao}
            concluida={concluidas.includes(item.id)}
            onPress={() => router.push(`/aula/${item.id}`)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D1A',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  subtitulo: {
    color: '#888',
    fontSize: 13,
    marginBottom: 16,
  },
  lista: {
    paddingBottom: 24,
  },
});
