// components/ui/CategoryContainer.tsx

import React, { useEffect, useRef } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
} from 'react-native';
import CategoryCard, { CARD_SPACING, FIRST_CARD_MARGIN, ROW_SPACING } from './CategoryCard';
import { getCategoryCoverById } from '../../../assets/images/categoryCovers.manifest';

export interface Category {
  id: string;
  title: string;
}

interface Props {
  items?: Category[]; // opsiyonel
  isHorizontal?: boolean;
  initialHorizontalOffset?: number;
  initialVerticalOffset?: number;
  onHorizontalScroll?: (offsetX: number) => void;
  onVerticalScroll?: (offsetY: number) => void;
  onPressItem?: (item: Category) => void;
}

const { height: SCREEN_H } = Dimensions.get('screen');
const CONTAINER_PADDING_BOTTOM = SCREEN_H * 0.03; // Container alt padding

export default function CategoryContainer({
  items = [], // default boş dizi
  isHorizontal = true,
  initialHorizontalOffset = 0,
  initialVerticalOffset = 0,
  onHorizontalScroll,
  onVerticalScroll,
  onPressItem,
}: Props) {
  const hRef = useRef<FlatList>(null);
  const vRef = useRef<FlatList>(null);

  // runtime güvenlik
  const itemsSafe: Category[] = Array.isArray(items) ? items : [];

  useEffect(() => {
    if (isHorizontal && hRef.current) {
      hRef.current.scrollToOffset({
        offset: initialHorizontalOffset,
        animated: false,
      });
    }
    if (!isHorizontal && vRef.current) {
      vRef.current.scrollToOffset({
        offset: initialVerticalOffset,
        animated: false,
      });
    }
  }, []);

  // 📦 Dikey mod: 3'lü satırlara böl
  const tripleData: [Category, Category?, Category?][] = [];
  for (let i = 0; i < itemsSafe.length; i += 3) {
    tripleData.push([itemsSafe[i], itemsSafe[i + 1], itemsSafe[i + 2]]);
  }

  if (isHorizontal) {
    return (
      <FlatList
        ref={hRef}
        horizontal
        data={itemsSafe}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <CategoryCard
            title={item.title}
            imageSource={getCategoryCoverById(item.id)} // kapak bağlandı
            onPress={() => onPressItem?.(item)}
            marginLeft={index === 0 ? FIRST_CARD_MARGIN : CARD_SPACING}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
          onHorizontalScroll?.(e.nativeEvent.contentOffset.x)
        }
        scrollEventThrottle={16}
      />
    );
  }

  return (
    <FlatList
      ref={vRef}
      data={tripleData}
      keyExtractor={(triple) => triple[0].id}
      renderItem={({ item: [i1, i2, i3] }) => (
        <View style={styles.row}>
          <CategoryCard
            title={i1.title}
            imageSource={getCategoryCoverById(i1.id)}
            onPress={() => onPressItem?.(i1)}
            marginLeft={0}
          />

          {i2 ? (
            <CategoryCard
              title={i2.title}
              imageSource={getCategoryCoverById(i2.id)}
              onPress={() => onPressItem?.(i2)}
              marginLeft={CARD_SPACING}
            />
          ) : (
            <View style={{ flex: 1 }} />
          )}

          {i3 ? (
            <CategoryCard
              title={i3.title}
              imageSource={getCategoryCoverById(i3.id)}
              onPress={() => onPressItem?.(i3)}
              marginLeft={CARD_SPACING}
            />
          ) : (
            <View style={{ flex: 1 }} />
          )}
        </View>
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: FIRST_CARD_MARGIN,
        paddingBottom: CONTAINER_PADDING_BOTTOM,
      }}
      onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
        onVerticalScroll?.(e.nativeEvent.contentOffset.y)
      }
      scrollEventThrottle={16}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: ROW_SPACING,
  },
});
