// components/ui/CollectionContainer.tsx

import React, { useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CollectionCard from './CollectionCard';

export interface Collection {
  id: string;
  title: string;
  subtitle?: string;
  note?: string;
  imageUris: string[];
}

interface Props {
  items: Collection[];
  isHorizontal: boolean;
  initialHorizontalOffset?: number;
  initialVerticalOffset?: number;
  onHorizontalScroll?: (offsetX: number) => void;
  onVerticalScroll?: (offsetY: number) => void;
  onPressItem?: (item: Collection) => void;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

export default function CollectionContainer({
  items,
  isHorizontal,
  initialHorizontalOffset = 0,
  initialVerticalOffset = 0,
  onHorizontalScroll,
  onVerticalScroll,
  onPressItem,
}: Props) {
  const insets = useSafeAreaInsets();

  const CARD_WIDTH = SCREEN_W * 0.4186;
  const CARD_HEIGHT = SCREEN_H * 0.25214;
  const CARD_SPACING = SCREEN_W * 0.02325;
  const CONTENT_PADDING_LEFT = SCREEN_W * 0.03953;

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
          <CollectionCard
            item={item}
            onPress={() => onPressItem?.(item)}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: CONTENT_PADDING_LEFT }}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
          onHorizontalScroll?.(e.nativeEvent.contentOffset.x)
        }
        scrollEventThrottle={16}
      />
    );
  }

  // Dikey mod – 2’li gruplar halinde gösterim
  const pairData: [Collection, Collection?][] = [];
  for (let i = 0; i < items.length; i += 2) {
    pairData.push([items[i], items[i + 1]]);
  }

  return (
    <FlatList
      ref={vRef}
      data={pairData}
      keyExtractor={(pair) => pair[0].id}
      renderItem={({ item: [item1, item2] }) => (
        <View style={styles.rowWrapper}>
          <CollectionCard item={item1} onPress={() => onPressItem?.(item1)} />
          {item2 ? (
            <CollectionCard item={item2} onPress={() => onPressItem?.(item2)} />
          ) : (
            <View style={{ width: CARD_WIDTH, height: CARD_HEIGHT, marginRight: CARD_SPACING }} />
          )}
        </View>
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: SCREEN_W * 0.02093 }}
      onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
        onVerticalScroll?.(e.nativeEvent.contentOffset.y)
      }
      scrollEventThrottle={16}
    />
  );
}

const styles = StyleSheet.create({
  rowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SCREEN_H * 0.01931,
  },
});
