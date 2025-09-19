// screens/CurationScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

export default function CurationScreen() {
  const route = useRoute();
  const { item } = route.params as { item: { id: string; title: string; imageUri: string } };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.imageUri }} style={styles.coverImage} />
      <Text style={styles.title}>{item.title}</Text>
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
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#181818',
    padding: 16,
  },
});
