// src/components/ui/FootnoteText.tsx

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

export interface FootnoteTextProps {
  /** Dip not metni */
  text: string;
}

export default function FootnoteText({ text }: FootnoteTextProps) {
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');
  // Sol/sağ kutu boşluğu oranı: ekran genişliğinin %2.558'i
  const H_MARGIN_RATIO = 0.02558;
  // Kutunun yükseklik oranı: ekran yüksekliğinin %4.506'sı
  const HEIGHT_RATIO   = 0.04506;

  const marginHorizontal = SCREEN_W * H_MARGIN_RATIO;
  const boxWidth         = SCREEN_W - 2 * marginHorizontal;
  const boxHeight        = SCREEN_H * HEIGHT_RATIO;

  return (
    <View
      style={[
        styles.container,
        {
          width: boxWidth,
          height: boxHeight,
          marginHorizontal,
        },
      ]}
    >
      <Text
        style={styles.text}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Bu iki satır metni dikeyde tam ortalar
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  text: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#676666',
    textAlign: 'left',
    lineHeight: 14, // fontSize 12 için biraz fazla satır yüksekliği vererek alt kuyruğun görünmesini garanti eder
  },
});
