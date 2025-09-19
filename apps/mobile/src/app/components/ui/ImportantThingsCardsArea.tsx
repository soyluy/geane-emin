// apps/mobile/src/app/components/ui/ImportantThingsCardsArea.tsx

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import FieldHeader from './FieldHeader';
import ImportantThingsCards, { Card } from './ImportantThingsCards';

const { height: SCREEN_H } = Dimensions.get('screen');
// Kart alanı yüksekliğini Madde 5’teki %44,957 oranına göre hesaplıyoruz:
const CARD_AREA_HEIGHT = SCREEN_H * 0.44957;

interface ImportantThingsCardsAreaProps {
  data: Card[];
}

export default function ImportantThingsCardsArea({ data }: ImportantThingsCardsAreaProps) {
  return (
    <>
      {/* ProductArea’daki headerWrapper gibi */}
      <View style={styles.headerWrapper}>
        <FieldHeader title="Önemli Şeyler" />
      </View>

      {/* Kartlar sabit yükseklikteki wrapper içinde */}
      <View style={[styles.cardsWrapper, { height: CARD_AREA_HEIGHT }]}>
        <ImportantThingsCards data={data} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#FFFFFF',  // ProductArea’da da beyaz
  },
  cardsWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',  // istersen arkaplan rengi
  },
});
