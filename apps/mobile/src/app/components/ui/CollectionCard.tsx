// components/ui/CollectionCard.tsx

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Collection } from './CollectionContainer';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

const CARD_WIDTH = SCREEN_W * 0.4186;
const CARD_HEIGHT = SCREEN_H * 0.25214;

interface Props {
  item: Collection;
  onPress?: () => void;
}

export default function CollectionCard({ item, onPress }: Props) {
  const [img1, img2, img3] = item.imageUris;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginRight: SCREEN_W * 0.02325,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
      }}
    >
      <View style={styles.tileContainer}>
        <View style={styles.imageContainer}>
          <View style={styles.leftImage}>
            {img1 && <Image source={{ uri: img1 }} style={styles.imageItem} />}
          </View>
          <View style={styles.rightColumn}>
            <View style={styles.topRightImage}>
              {img2 && <Image source={{ uri: img2 }} style={styles.imageItem} />}
            </View>
            <View style={styles.bottomRightImage}>
              {img3 && <Image source={{ uri: img3 }} style={styles.imageItem} />}
            </View>
          </View>
        </View>
        <View style={styles.textContainerFixed}>
          <View style={styles.topTextGroup}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>
            )}
          </View>
          {item.note && (
            <Text style={styles.note} numberOfLines={1}>{item.note}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tileContainer: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: '100%',
    height: '76.595%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftImage: {
    width: '54.44%',
    height: '100%',
    backgroundColor: '#eee',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    overflow: 'hidden',
  },
  rightColumn: {
    width: '44.44%',
    height: '100%',
    justifyContent: 'space-between',
  },
  topRightImage: {
    width: '100%',
    height: '48.88%',
    backgroundColor: '#eee',
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  bottomRightImage: {
    width: '100%',
    height: '48.88%',
    backgroundColor: '#eee',
    borderBottomRightRadius: 12,
    overflow: 'hidden',
  },
  imageItem: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textContainerFixed: {
    height: '23.405%',
    paddingHorizontal: 0,
    paddingVertical: 1,
    justifyContent: 'space-between',
  },
  topTextGroup: {
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#181818',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    lineHeight: 16,
    color: '#000',
  },
  note: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    lineHeight: 10,
    color: '#414341',
  },
});
