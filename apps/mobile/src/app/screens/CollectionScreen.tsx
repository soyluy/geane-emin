// screens/CollectionScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, FlatList, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Collection } from '../components/ui/CollectionContainer';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

export default function CollectionScreen() {
  const route = useRoute();
  const { item } = route.params as { item: Collection };

  const products = Array.from({ length: 8 }, (_, i) => ({
    id: `product-${i}`,
    title: `Ürün ${i + 1}`,
    imageUri: 'https://via.placeholder.com/300',
  }));

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.imageUris[0] }} style={styles.coverImage} />

      <View style={styles.textWrapper}>
        <Text style={styles.title}>{item.title}</Text>
        {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
        {item.note && <Text style={styles.note}>{item.note}</Text>}
      </View>

      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.imageUri }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const COVER_HEIGHT = SCREEN_H * 0.3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  coverImage: {
    width: SCREEN_W,
    height: COVER_HEIGHT,
  },
  textWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181818',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  note: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  grid: {
    paddingHorizontal: 12,
    gap: 12,
  },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: SCREEN_W * 0.5,
  },
  cardTitle: {
    padding: 8,
    fontSize: 13,
    color: '#181818',
  },
});
