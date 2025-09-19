// apps/mobile/src/app/components/ui/ProductDescription.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface ProductDescriptionProps {
  /** Ürün açıklaması; verilmezse varsayılan metin gösterilir */
  description?: string;
}

export default function ProductDescription({
  description =
    'Bu açıklama metin, örnek olarak yazılmıştır. Backend uçları bağlanana kadar burada ürün açıklamasının nasıl göründüğünü görebilmek için bu metin yazılmıştır.',
}: ProductDescriptionProps) {
  // Tam ekran (status + nav bar DAHİL) taban
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

  // Figma oranları (yüzde bazlı)
  const paddingLeft = SCREEN_W * 0.03953;  // %3,953
  const paddingRight = SCREEN_W * 0.05116; // %5,116
  const paddingTop = SCREEN_H * 0.00751;   // 7px ≈ 7/932 = %0,751

  return (
    <View style={[styles.container, { paddingLeft, paddingRight, paddingTop }]}>
      <Text style={styles.text}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
  },
  text: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    letterSpacing: 0.12,
    lineHeight: 18,
    color: '#000',
  },
});
