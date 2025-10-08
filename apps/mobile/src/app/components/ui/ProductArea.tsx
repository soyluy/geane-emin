// ProductArea.tsx

import React, { useState, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Modal, Dimensions, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FieldHeader from './FieldHeader';
import ProductCard, { TITLE_BOX_H } from './ProductCard';
// ✅ ProductContainer kaldırıldı - FlatList logic'i direkt burada

interface ProductAreaProps {
  title: string;
  items: any[];          // yansıtıcı: tip dayatmaz
  onIconPress?: () => void;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

function ProductArea({
  title,
  items,
  onIconPress,
}: ProductAreaProps) {
  const insets = useSafeAreaInsets();
  const safeH = SCREEN_H - insets.top - insets.bottom;

  // Yatay için sadece spacing ve padding (boyutlar ProductCard'da)
  const H_SPACING = SCREEN_W * 0.02325;
  const H_PADDING = SCREEN_W * 0.03953;
  const H_IMAGE_W = SCREEN_W * 0.27906; // Toggle hesaplaması için local sabit

  // Dikey metrikler
  const V_CARD_W = SCREEN_W * 0.46511;
  const V_ROW_SPACING = safeH * 0.01931;

  const [isHorizontal, setIsHorizontal] = useState(true);
  const [initialHorizontalOffset, setInitialHorizontalOffset] = useState(0);
  const [initialVerticalOffset, setInitialVerticalOffset] = useState(0);
  const horizontalOffsetRef = useRef(0);
  const verticalOffsetRef = useRef(0);
  const hRef = useRef<FlatList>(null);
  const vRef = useRef<FlatList>(null);

  // Dikey satır yükseklikleri ve ofsetleri (Container ile aynı formül)
  const getAr = (p: any) => {
    const ar =
      (p?.images && p.images[0] && typeof p.images[0].ar === 'number' && p.images[0].ar) ||
      (typeof p?.primaryAr === 'number' && p.primaryAr) ||
      0.75;
    return ar > 0 ? ar : 0.75;
  };

  const pairData = useMemo(() => {
    const arr: Array<[any, any | undefined]> = [];
    for (let i = 0; i < items.length; i += 2) arr.push([items[i], items[i + 1]]);
    return arr;
  }, [items]);

  const rowHeights = useMemo(
    () =>
      pairData.map(([a, b]) => {
        const h1 = a ? V_CARD_W / getAr(a) + TITLE_BOX_H : 0;
        const h2 = b ? V_CARD_W / getAr(b) + TITLE_BOX_H : 0;
        return Math.max(h1, h2);
      }),
    [pairData, V_CARD_W, TITLE_BOX_H]
  );

  const rowOffsets = useMemo(() => {
    const offsets: number[] = [];
    let acc = V_ROW_SPACING;
    for (let i = 0; i < rowHeights.length; i++) {
      offsets[i] = acc;
      acc += rowHeights[i] + V_ROW_SPACING;
    }
    return offsets;
  }, [rowHeights, V_ROW_SPACING]);

  const findNearestRowByOffset = (y: number) => {
    if (!rowOffsets.length) return 0;
    // y değeri hangi satıra daha yakınsa onu bul
    let row = 0;
    for (let i = 0; i < rowOffsets.length; i++) {
      const start = rowOffsets[i];
      const end = start + rowHeights[i] + V_ROW_SPACING;
      if (y >= start && y < end) {
        row = i;
        break;
      }
      if (y >= end) row = i; // son satıra yaklaşım
    }
    return row;
  };

  const toggleMode = () => {
    if (isHorizontal) {
      // Yatay -> Dikey
      const x = Math.max(0, horizontalOffsetRef.current - H_PADDING);
      const idx = Math.round(x / (H_IMAGE_W + H_SPACING)); // kart indeksi
      const row = Math.floor(idx / 2);
      const vOffset = rowOffsets[row] ?? 0;
      setInitialVerticalOffset(vOffset);
    } else {
      // Dikey -> Yatay
      const y = Math.max(0, verticalOffsetRef.current);
      const row = findNearestRowByOffset(y);
      const idx = row * 2; // satırın ilk kartı
      const x = H_PADDING + idx * (H_IMAGE_W + H_SPACING);
      setInitialHorizontalOffset(x);
    }
    setIsHorizontal((prev) => !prev);
    onIconPress?.();
  };

  // Render functions
  const renderHorizontalItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <View
        style={{
          marginRight: index === items.length - 1 ? 0 : H_SPACING,
        }}
      >
        <ProductCard product={item} isHorizontal />
      </View>
    ),
    [H_SPACING, items.length]
  );

  const renderVerticalItem = useCallback(
    ({ item: [prod1, prod2] }: { item: [any, any?] }) => (
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: V_ROW_SPACING 
      }}>
        {prod1 ? (
          <ProductCard product={prod1} isHorizontal={false} V_CARD_W={V_CARD_W} />
        ) : (
          <View style={{ width: V_CARD_W }} />
        )}

        {prod2 ? (
          <ProductCard product={prod2} isHorizontal={false} V_CARD_W={V_CARD_W} />
        ) : (
          <View style={{ width: V_CARD_W }} />
        )}
      </View>
    ),
    [V_CARD_W, V_ROW_SPACING]
  );

  const getVerticalItemLayout = useCallback(
    (_: any, index: number) => ({
      length: rowHeights[index] + V_ROW_SPACING,
      offset: rowOffsets[index],
      index,
    }),
    [rowHeights, rowOffsets, V_ROW_SPACING]
  );

  // Initialize scroll positions
  React.useEffect(() => {
    if (isHorizontal && hRef.current) {
      hRef.current.scrollToOffset({ offset: initialHorizontalOffset, animated: false });
    }
    if (!isHorizontal && vRef.current) {
      vRef.current.scrollToOffset({ offset: initialVerticalOffset, animated: false });
    }
  }, [isHorizontal, initialHorizontalOffset, initialVerticalOffset]);

  return (
    <>
      <View style={styles.headerWrapper}>
        <FieldHeader
          title={title}
          hideIcon={false}
          onIconPress={toggleMode}
          rotated={!isHorizontal}
        />
      </View>

      {isHorizontal ? (
        // HORIZONTAL MODE
        <FlatList
          ref={hRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ 
            paddingHorizontal: H_PADDING, 
            alignItems: 'flex-start' 
          }}
          onScroll={(e) => (horizontalOffsetRef.current = e.nativeEvent.contentOffset.x)}
          scrollEventThrottle={16}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          renderItem={renderHorizontalItem}
        />
      ) : (
        <Modal visible animationType="slide" onRequestClose={toggleMode}>
          <View style={[styles.modalWrapper, { height: SCREEN_H * 1 }]}>
            <FieldHeader
              title={title}
              hideIcon={false}
              onIconPress={toggleMode}
              rotated={!isHorizontal}
            />
            <FlatList
              ref={vRef}
              data={pairData}
              keyExtractor={(pair) => pair[0].id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: SCREEN_W * 0.02093 }}
              onScroll={(e) => (verticalOffsetRef.current = e.nativeEvent.contentOffset.y)}
              scrollEventThrottle={16}
              initialNumToRender={6}
              maxToRenderPerBatch={6}
              renderItem={renderVerticalItem}
              getItemLayout={getVerticalItemLayout}
            />
          </View>
        </Modal>
      )}
    </>
  );
}

export default React.memo(ProductArea);

const styles = StyleSheet.create({
  headerWrapper: { width: SCREEN_W },
  modalWrapper: {
    width: SCREEN_W,
    alignSelf: 'center',
    backgroundColor: '#FFF',
  },
});
