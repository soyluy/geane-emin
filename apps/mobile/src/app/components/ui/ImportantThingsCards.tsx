// apps/mobile/src/app/components/ui/ImportantThingsCards.tsx

import React from 'react';
import {
  Dimensions,
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
  ScrollView,
} from 'react-native';

export interface Card {
  title: string;
  image: ImageSourcePropType;
}

interface ImportantThingsCardsProps {
  data?: Card[];
}

export default function ImportantThingsCards({ data = [] }: ImportantThingsCardsProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

  // %3,953 boşluk
  const rawSpacing = screenWidth * 0.03953;
  const spacing = Math.round(rawSpacing);

  // Kart boyutu: (screenWidth - 3×spacing) / 2, tam sayıya yuvarla
  const rawCardSize = (screenWidth - spacing * 3) / 2;
  const cardSize = Math.floor(rawCardSize);

  // Satır sayısı ve container yüksekliği
  const rows = data.length > 2 ? 2 : 1;
  const containerHeight =
    rows > 1 ? screenHeight * 0.44957 : cardSize + spacing;

  // Kart grid’i
  const grid = (
    <View style={[styles.grid, { paddingLeft: spacing }]}>
      {data.map((item, index) => {
        const corner = index % 4;
        const br: any = {};
        const R = 15;
        if (corner === 0) br.borderTopLeftRadius = R;
        if (corner === 1) br.borderTopRightRadius = R;
        if (corner === 2) br.borderBottomLeftRadius = R;
        if (corner === 3) br.borderBottomRightRadius = R;

        return (
          <View
            key={index}
            style={[
              {
                width: cardSize,
                height: cardSize,
                marginLeft: index % 2 === 1 ? spacing : 0, // 2. kart vs.
                marginBottom: spacing,
              },
              br,
            ]}
          >
            <Image source={item.image} style={[styles.image, br]} />
            <View style={[styles.overlay, br]} />
            <View style={styles.textWrapper}>
              <Text style={styles.text}>{item.title}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { width: screenWidth, height: containerHeight },
      ]}
    >
      {data.length <= 4 ? (
        grid
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            width:
              Math.ceil(data.length / 2) * cardSize +
              (Math.ceil(data.length / 2) + 1) * spacing,
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {grid}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  textWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
});
