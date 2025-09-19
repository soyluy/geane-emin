import React from 'react';
import { TouchableOpacity, Dimensions, StyleSheet, GestureResponderEvent } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export interface BackButtonProps {
  /** Geri butonuna basıldığında çağrılacak fonksiyon */
  onPress: (event: GestureResponderEvent) => void;
}

export default function BackButton({ onPress }: BackButtonProps) {
  // Cihazın tam ekran boyutları
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

  // Dinamik boyut ve konum hesaplamaları
  const BUTTON_SIZE = SCREEN_W * 0.1;            // Ekran genişliğinin %10'u
  const ICON_SIZE   = BUTTON_SIZE * 0.5;         // Buton yarısı
  const OFFSET_LEFT = SCREEN_W * 0.05116;        // Sol kenardan %5,116
  const OFFSET_TOP  = SCREEN_H * 0.04800;        // Üst kenardan %4,800

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          borderRadius: BUTTON_SIZE / 2,
          left: OFFSET_LEFT,
          top: OFFSET_TOP,
        },
      ]}
    >
      <MaterialIcons name="arrow-back" size={ICON_SIZE} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    zIndex: 1000,                  // Her zaman üstte
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
