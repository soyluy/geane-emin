import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

const HEADER_HEIGHT = SCREEN_H * 0.30579;
const TITLE_TOP = HEADER_HEIGHT * 0.35789;
const SAVE_COUNT_TOP = HEADER_HEIGHT * 0.78947;
const LEFT_PADDING = SCREEN_W * 0.03953;

interface CollectionDetailHeaderProps {
  imageUris: string[];
  title: string;
  saveCount: string;
  productCount: string;
}

export default function CollectionDetailHeader({
  imageUris,
  title,
  saveCount,
  productCount,
}: CollectionDetailHeaderProps) {
  const [img1, img2, img3] = imageUris;

  return (
    <View style={styles.container}>
      {/* Görsel alan */}
      <View style={styles.imageRow}>
        <Image source={{ uri: img1 }} style={styles.leftImage} />
        <View style={styles.rightColumn}>
          <Image source={{ uri: img2 }} style={styles.topRightImage} />
          <Image source={{ uri: img3 }} style={styles.bottomRightImage} />
        </View>
      </View>

      {/* Karartma katmanı */}
      <View style={styles.overlay} />

      {/* Metinler */}
      <Text style={[styles.title, { top: TITLE_TOP }]}>{title}</Text>
      <Text style={[styles.saveCount, { top: SAVE_COUNT_TOP }]}>{saveCount}</Text>
      <Text style={styles.productCount}>{productCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_W,
    height: HEADER_HEIGHT,
    position: 'relative',
  },
  imageRow: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  leftImage: {
    width: SCREEN_W * 0.5444,
    height: '100%',
  },
  rightColumn: {
    width: SCREEN_W * 0.4444,
    height: '100%',
  },
  topRightImage: {
    width: '100%',
    height: '48.88%',
  },
  bottomRightImage: {
    width: '100%',
    height: '48.88%',
    marginTop: '2.24%', // İki görsel arası boşluk
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_W,
    height: HEADER_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  title: {
    position: 'absolute',
    left: LEFT_PADDING,
    color: '#FFFFFF',
    fontSize: 27,
    fontFamily: 'RobotoFlex-Bold',
  },
  saveCount: {
    position: 'absolute',
    left: LEFT_PADDING,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'RobotoFlex-Light',
  },
  productCount: {
    position: 'absolute',
    left: LEFT_PADDING,
    bottom: HEADER_HEIGHT * 0.05,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto-Light',
  },
});
