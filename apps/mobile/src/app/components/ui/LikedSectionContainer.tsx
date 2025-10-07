// mobile/src/app/components/ui/LikedSectionContainer.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import HeartIcon from '../../../../assets/icons/L.S.C.Healt-icon.svg';

export default function LikedSectionContainer() {
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

  const COVER_WIDTH = SCREEN_W * 0.4186;
  const COVER_HEIGHT = SCREEN_H * 0.19313;
  const PADDING_LEFT = SCREEN_W * 0.03953;
  const PADDING_TOP = SCREEN_H * 0.03;
  const ICON_WIDTH = COVER_WIDTH * 0.26944;
  const ICON_HEIGHT = COVER_HEIGHT * 0.2333;

  return (
    <View style={[styles.container, { 
      width: SCREEN_W, 
      paddingLeft: PADDING_LEFT,
      paddingTop: PADDING_TOP 
    }]}>
      <View style={styles.coverContainer}>
        <View style={[styles.coverWrapper, { width: COVER_WIDTH, height: COVER_HEIGHT }]}>
          <Image
            source={{ uri: 'https://i.pinimg.com/736x/07/49/d9/0749d9133913b3e4c46389d96aac8e17.jpg' }}
            style={styles.coverImage}
          />
          <View style={styles.overlay} />
          <View style={styles.iconWrapper}>
            <HeartIcon width={ICON_WIDTH} height={ICON_HEIGHT} />
          </View>
        </View>
      </View>
      <Text style={styles.label}>
        Beğendiklerim
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  coverContainer: {
    marginBottom: 8,
  },
  coverWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  iconWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 16,
    color: '#181818',
  },
});
