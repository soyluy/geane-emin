// components/ui/CurationCard.tsx

import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

interface Props {
  item: {
    id: string;
    title: string;
    imageUri: string;
  };
  size: number;
  onPress?: () => void;
}

export default function CurationCard({ item, size, onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.card, { width: size, height: size }]}
    >
      <Image
        source={{ uri: item.imageUri }}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#eee',
    borderRadius: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
