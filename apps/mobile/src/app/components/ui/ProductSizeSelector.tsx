// apps/mobile/src/app/components/ui/ProductSizeSelector.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

interface SizeOption {
  label: string;
  value: string;
}

interface ProductSizeSelectorProps {
  sizeOptions: SizeOption[];
  onSelect?: (value: string) => void;
}

export default function ProductSizeSelector({ sizeOptions, onSelect }: ProductSizeSelectorProps) {
  // Tam ekran (status + nav bar DAHİL) taban
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

  // Figma oranları (yüzde bazlı)
  const CONTAINER_HEIGHT = SCREEN_H * 0.06437; // %6,437
  const GAP = SCREEN_W * 0.01627;              // %1,627
  const LEFT_PADDING = SCREEN_W * 0.03953;     // %3,953

  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={[styles.container, { height: CONTAINER_HEIGHT, paddingLeft: LEFT_PADDING }]}>
      {sizeOptions.map((option, index) => {
        const isSelected = selected === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => {
              setSelected(option.value);
              onSelect?.(option.value);
            }}
            style={[
              styles.box,
              {
                height: CONTAINER_HEIGHT,
                marginRight: index !== sizeOptions.length - 1 ? GAP : 0,
                backgroundColor: isSelected ? '#F13957' : '#ffffff',
                borderColor: isSelected ? '#F13957' : '#000000',
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Beden: ${option.label}`}
            accessibilityState={{ selected: isSelected }}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, { color: isSelected ? '#ffffff' : '#000000' }]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
});
