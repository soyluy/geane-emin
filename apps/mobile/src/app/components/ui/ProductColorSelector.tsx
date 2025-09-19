// apps/mobile/src/app/components/ui/ProductColorSelector.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';

interface ColorOption {
  name: string;
  imageUri: string;
}

interface ProductColorSelectorProps {
  colorOptions: ColorOption[];
}

export default function ProductColorSelector({ colorOptions }: ProductColorSelectorProps) {
  // Tam ekran (status + nav bar DAHİL) taban
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

  // Figma oranları
  const CONTAINER_HEIGHT = SCREEN_H * 0.11373;    // %11,373
  const IMAGE_HEIGHT     = CONTAINER_HEIGHT * 0.78301;
  const IMAGE_WIDTH      = SCREEN_W * 0.13488;
  const IMAGE_MARGIN_LEFT= SCREEN_W * 0.03953;
  const IMAGE_GAP        = SCREEN_W * 0.05116;

  return (
    <View style={[styles.container, { height: CONTAINER_HEIGHT }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: IMAGE_MARGIN_LEFT }}
      >
        {colorOptions.map((option, index) => (
          <View
            key={option.name ?? String(index)}
            style={{
              marginLeft: index === 0 ? IMAGE_MARGIN_LEFT : IMAGE_GAP,
              alignItems: 'center',
            }}
          >
            <Image
              source={{ uri: option.imageUri }}
              style={{
                width: IMAGE_WIDTH,
                height: IMAGE_HEIGHT,
                borderRadius: 10,
              }}
              resizeMode="cover"
            />
            <Text style={styles.label}>{option.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    marginTop: 2,
    color: '#000',
  },
});
