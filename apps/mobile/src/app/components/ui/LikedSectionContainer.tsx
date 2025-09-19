// mobile/src/app/components/ui/LikedSectionContainer.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import HeartIcon from '../../../../assets/icons/L.S.C.Healt-icon.svg';

export default function LikedSectionContainer() {
  // Tam ekran (status + nav bar DAHİL) taban
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

  // Statik oranlar (Figma yüzdeleri)
  const CONTAINER_HEIGHT = SCREEN_H * 0.25429; // %25,429
  const COVER_SIZE       = CONTAINER_HEIGHT * 0.75949;
  const COVER_TOP        = CONTAINER_HEIGHT * 0.11814;
  const COVER_LEFT       = SCREEN_W * 0.03953;
  const ICON_WIDTH       = COVER_SIZE * 0.26944;
  const ICON_HEIGHT      = COVER_SIZE * 0.2333;
  const TEXT_LEFT        = SCREEN_W * 0.03953;
  const TEXT_TOP         = CONTAINER_HEIGHT * 0.91983;

  return (
    <View style={[styles.container, { width: SCREEN_W, height: CONTAINER_HEIGHT }]}>
      {/* Kapak Görseli */}
      <Image
        source={{ uri: 'https://i.pinimg.com/736x/07/49/d9/0749d9133913b3e4c46389d96aac8e17.jpg' }}
        style={[
          styles.coverImage,
          {
            width: COVER_SIZE,
            height: COVER_SIZE,
            top: COVER_TOP,
            left: COVER_LEFT,
            borderRadius: 10,
          },
        ]}
      />

      {/* Karartma Katmanı */}
      <View
        style={[
          styles.overlay,
          {
            width: COVER_SIZE,
            height: COVER_SIZE,
            top: COVER_TOP,
            left: COVER_LEFT,
            borderRadius: 10,
          },
        ]}
      />

      {/* Kalp İkonu */}
      <View
        style={[
          styles.iconWrapper,
          {
            width: COVER_SIZE,
            height: COVER_SIZE,
            top: COVER_TOP,
            left: COVER_LEFT,
          },
        ]}
      >
        <HeartIcon width={ICON_WIDTH} height={ICON_HEIGHT} />
      </View>

      {/* “Beğendiklerim” Metni */}
      <Text
        style={[
          styles.label,
          {
            left: TEXT_LEFT,
            top: TEXT_TOP,
          },
        ]}
      >
        Beğendiklerim
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  coverImage: {
    position: 'absolute',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  iconWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 16,
    color: '#181818',
  },
});
