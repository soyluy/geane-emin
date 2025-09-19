// components/ui/CurationContainer.tsx

import React, { useEffect, useRef } from 'react';
import {
  FlatList,
  View,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CurationCard from './CurationCard';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

export interface CurationItem {
  id: string;
  title: string;
  imageUri: string;
}

interface Props {
  items: CurationItem[];
  isHorizontal: boolean;
  initialHorizontalOffset?: number;
  initialVerticalOffset?: number;
  onHorizontalScroll?: (offsetX: number) => void;
  onVerticalScroll?: (offsetY: number) => void;
  onPressItem?: (item: CurationItem) => void;
}

export default function CurationContainer({
  items,
  isHorizontal,
  initialHorizontalOffset = 0,
  initialVerticalOffset = 0,
  onHorizontalScroll,
  onVerticalScroll,
  onPressItem,
}: Props) {
  const insets = useSafeAreaInsets();
  const safeH = SCREEN_H - insets.top - insets.bottom;

  const CARD_SIZE = safeH * 0.20386;
  const SPACING = SCREEN_W * 0.01627;
  const H_PADDING = SCREEN_W * 0.03953;

  const hRef = useRef<FlatList>(null);
  const vRef = useRef<FlatList>(null);

  useEffect(() => {
    if (isHorizontal && hRef.current) {
      hRef.current.scrollToOffset({ offset: initialHorizontalOffset, animated: false });
    }
    if (!isHorizontal && vRef.current) {
      vRef.current.scrollToOffset({ offset: initialVerticalOffset, animated: false });
    }
  }, []);

  if (isHorizontal) {
    return (
      <FlatList
        ref={hRef}
        horizontal
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CurationCard
            item={item}
            size={CARD_SIZE}
            onPress={() => onPressItem?.(item)}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: H_PADDING }}
        ItemSeparatorComponent={() => <View style={{ width: SPACING }} />}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
          onHorizontalScroll?.(e.nativeEvent.contentOffset.x)
        }
        scrollEventThrottle={16}
      />
    );
  }

  // Dikey mod: ikili gösterim
  const pairData: [CurationItem, CurationItem?][] = [];
  for (let i = 0; i < items.length; i += 2) {
    pairData.push([items[i], items[i + 1]]);
  }

  return (
    <FlatList
      ref={vRef}
      data={pairData}
      keyExtractor={(pair) => pair[0].id}
      renderItem={({ item: [i1, i2] }) => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING }}>
          <CurationCard item={i1} size={CARD_SIZE} onPress={() => onPressItem?.(i1)} />
          {i2 ? (
            <CurationCard item={i2} size={CARD_SIZE} onPress={() => onPressItem?.(i2)} />
          ) : (
            <View style={{ width: CARD_SIZE }} />
          )}
        </View>
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: H_PADDING }}
      onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
        onVerticalScroll?.(e.nativeEvent.contentOffset.y)
      }
      scrollEventThrottle={16}
    />
  );
}
