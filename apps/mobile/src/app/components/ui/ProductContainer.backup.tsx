// src/app/components/ui/ProductContainer.tsx
import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { View, FlatList, Dimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Product } from '../../data/fakeData';
import ProductCard, { TITLE_BOX_H } from './ProductCard'; // ✅ Sadece dikey için TITLE_BOX_H

export interface ProductContainerProps {
  isHorizontal: boolean;
  items: Product[];
  initialHorizontalOffset?: number;
  initialVerticalOffset?: number;
  onHorizontalScroll?: (offsetX: number) => void;
  onVerticalScroll?: (offsetY: number) => void;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

export default function ProductContainer({
  isHorizontal,
  items,
  initialHorizontalOffset = 0,
  initialVerticalOffset = 0,
  onHorizontalScroll,
  onVerticalScroll,
}: ProductContainerProps) {
  const insets = useSafeAreaInsets();
  const safeH = SCREEN_H - insets.top - insets.bottom;

  const hRef = useRef<FlatList>(null);
  const vRef = useRef<FlatList>(null);

  // — YATAY — (ProductCard'dan import edilen sabitler)
  const H_SPACING = SCREEN_W * 0.02325;
  const H_PADDING = SCREEN_W * 0.03953;

  // — DİKEY — (dizilim için gerekenler)
  const V_CARD_W = SCREEN_W * 0.46511;
  const V_ROW_SPACING = safeH * 0.01931;

  useEffect(() => {
    if (isHorizontal && hRef.current) {
      hRef.current.scrollToOffset({ offset: initialHorizontalOffset, animated: false });
    }
    if (!isHorizontal && vRef.current) {
      vRef.current.scrollToOffset({ offset: initialVerticalOffset, animated: false });
    }
  }, []);

  // ===================== YATAY =====================
  const renderHorizontalItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => (
      <View
        style={{
          /* ✅ Tamamen esnek - ProductCard kendi boyutunu belirlesin */
          marginRight: index === items.length - 1 ? 0 : H_SPACING,
        }}
      >
        <ProductCard
          product={item}
          isHorizontal
        />
      </View>
    ),
    [H_SPACING, items.length]
  );

  if (isHorizontal) {
    return (
      <FlatList
        ref={hRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: H_PADDING, alignItems: 'flex-start' }}
        onScroll={(e) => onHorizontalScroll?.(e.nativeEvent.contentOffset.x)}
        scrollEventThrottle={16}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        renderItem={renderHorizontalItem}
        /* ✅ getItemLayout kaldırıldı - esnek boyutlar için gerekli değil */
      />
    );
  }

  // ===================== DİKEY =====================

  // Çiftli satır verisi
  const pairData: [Product, Product?][] = useMemo(() => {
    const arr: [Product, Product?][] = [];
    for (let i = 0; i < items.length; i += 2) arr.push([items[i], items[i + 1]]);
    return arr;
  }, [items]);

  // Varsayılan AR (dizilim hesabı için)
  const getAr = useCallback((p?: Product) => {
    if (!p) return 0.75;
    const ar =
      (Array.isArray((p as any)?.images) && (p as any).images[0]?.ar) ||
      (typeof (p as any)?.primaryAr === 'number' && (p as any).primaryAr) ||
      0.75;
    return typeof ar === 'number' && ar > 0 ? ar : 0.75;
  }, []);

  // Satır yükseklikleri (görsel yüksekliği + Alt Kısım yüksekliği)
  const rowHeights = useMemo(
    () =>
      pairData.map(([a, b]) => {
        const h1 = a ? V_CARD_W / getAr(a) + TITLE_BOX_H : 0;
        const h2 = b ? V_CARD_W / getAr(b) + TITLE_BOX_H : 0;
        return Math.max(h1, h2);
      }),
    [pairData, V_CARD_W, getAr]
  );

  const rowOffsets = useMemo(() => {
    const offsets: number[] = [];
    let acc = V_ROW_SPACING; // ilk satır üst boşluk
    for (let i = 0; i < rowHeights.length; i++) {
      offsets[i] = acc;
      acc += rowHeights[i] + V_ROW_SPACING;
    }
    return offsets;
  }, [rowHeights, V_ROW_SPACING]);

  const getVerticalItemLayout = useCallback(
    (_: any, index: number) => ({
      length: rowHeights[index] + V_ROW_SPACING,
      offset: rowOffsets[index],
      index,
    }),
    [rowHeights, rowOffsets, V_ROW_SPACING]
  );

  return (
    <FlatList
      ref={vRef}
      data={pairData}
      keyExtractor={(pair) => pair[0].id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: SCREEN_W * 0.02093 }}
      onScroll={(e) => onVerticalScroll?.(e.nativeEvent.contentOffset.y)}
      scrollEventThrottle={16}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      renderItem={({ item: [prod1, prod2] }) => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: V_ROW_SPACING }}>
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
      )}
      getItemLayout={getVerticalItemLayout}
    />
  );
}

const styles = StyleSheet.create({
  // Container, kart iç stili taşımaz.
});
