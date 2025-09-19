// AllPosts.tsx

import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  ImageLoadEventData,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FieldHeader from './FieldHeader';
import { Product } from '../../data/fakeData';

interface AllPostsProps {
  title: string;
  items?: Product[]; // opsiyonel tanımlandı
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

export default function AllPosts({ title, items = [] }: AllPostsProps) {
  const insets = useSafeAreaInsets();
  const safeH = SCREEN_H - insets.top - insets.bottom;

  const V_CARD_W = SCREEN_W * 0.46511;
  const V_ROW_SPACING = safeH * 0.01931;
  const TITLE_BOX_H = 40;
  const PRICE_OFFSET = TITLE_BOX_H + 10;
  const PRICE_RT = V_CARD_W * 0.075;

  const ratios = useRef<Record<string, number>>({});
  const activeIndices = useRef<Record<string, number>>({});

  const formatPrice = (price: number) =>
    Number.isInteger(price) ? `₺${price}` : `₺${price.toFixed(2)}`;

  const pairData: [Product, Product?][] = [];
  for (let i = 0; i < items.length; i += 2) {
    if (items[i]) pairData.push([items[i], items[i + 1]]);
  }

  return (
    <View style={styles.wrapper}>
      <FieldHeader title={title} hideIcon />

      {pairData.map(([prod1, prod2], rowIndex) => (
        <View
          key={`row-${rowIndex}`}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: V_ROW_SPACING,
            paddingHorizontal: SCREEN_W * 0.02093,
          }}
        >
          {[prod1, prod2].map((prod) =>
            prod ? (
              <TouchableOpacity
                key={prod.id}
                activeOpacity={0.8}
                style={{
                  width: V_CARD_W,
                  position: 'relative',
                  backgroundColor: '#FFF',
                  borderRadius: 8,
                  overflow: 'hidden',
                  paddingBottom: TITLE_BOX_H,
                }}
              >
                {/* GÖRSEL */}
                <View>
                  <Image
                    source={{ uri: prod.imageUrls?.[0] }}
                    style={{
                      width: V_CARD_W,
                      aspectRatio: ratios.current[prod.id] ?? 0.75,
                      borderRadius: 15,
                    }}
                    resizeMode="cover"
                    onLoad={(e: NativeSyntheticEvent<ImageLoadEventData>) => {
                      const { width, height } = e.nativeEvent.source;
                      if (height > 0) {
                        ratios.current[prod.id] = width / height;
                      }
                    }}
                  />
                </View>

                {/* FİYAT */}
                <View
                  style={{
                    position: 'absolute',
                    bottom: PRICE_OFFSET,
                    right: PRICE_RT,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 12,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                  }}
                >
                  <Text style={styles.priceText}>{formatPrice(prod.price)}</Text>
                </View>

                {/* BAŞLIK */}
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    width: V_CARD_W * 0.8,
                    height: TITLE_BOX_H,
                    backgroundColor: '#FFF',
                    paddingTop: 8,
                    paddingHorizontal: 4,
                    justifyContent: 'flex-start',
                  }}
                >
                  <Text numberOfLines={2} style={styles.titleText}>
                    {prod.title}
                  </Text>
                </View>

                {/* EKLE BUTONU */}
                <View
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    overflow: 'hidden',
                    backgroundColor: '#000',
                  }}
                >
                  <Image
                    source={{
                      uri: 'https://i.pinimg.com/736x/ba/a9/62/baa96285b623f6f7ce08e6afd25ac46b.jpg',
                    }}
                    style={{ width: '100%', height: '100%' }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>+</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : null
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.1,
    lineHeight: 16,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});
