// src/app/components/ui/AddButton.tsx
import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';

interface AddButtonProps {
  onPress?: () => void;
  size?: number;
}

export default function AddButton({
  onPress,
  size = 28,
}: AddButtonProps) {
  const imageUri =
    'https://i.pinimg.com/736x/8d/8f/f3/8d8ff371ae4e51434459dec530bfae10.jpg';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      {/* Alt katman: fotoğraf */}
      <Image source={{ uri: imageUri }} style={styles.image} />

      {/* Karartma katmanı (%40 opaklık) */}
      <View style={[styles.overlay, { borderRadius: size / 2 }]} />

      {/* “+” ikonu */}
      <Text style={[styles.plus, { fontSize: size * 0.5 }]}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  plus: {
    position: 'absolute',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
