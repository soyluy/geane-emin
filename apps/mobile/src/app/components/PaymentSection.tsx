// components/PaymentSection.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import PaymentCard from './ui/PaymentCard';
import FieldHeader from './ui/FieldHeader'; // ✅ FieldHeader import

const { width: SCREEN_W } = Dimensions.get('screen');
const CARD_WIDTH = SCREEN_W * 0.65;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type CardData = {
  id: string;
  maskedNumber: string;
  expiry: string;
  ownerMasked: string;
  cardType: string;
};

type Props = {
  cards?: CardData[];
  gap?: number;
  sidePadding?: number;
  snap?: boolean;
  title?: string;
};

export default function PaymentSection({
  cards,
  gap = 12,
  sidePadding = 16,
  snap = true,
  title = 'Ödeme Kartınız',
}: Props) {
  const sample: CardData[] = useMemo(
    () => [
      { id: '1', maskedNumber: '**** **** **** 1234', expiry: '04/27', ownerMasked: 'E. SARP', cardType: 'VISA' },
      { id: '2', maskedNumber: '**** **** **** 5678', expiry: '06/28', ownerMasked: 'E. SARP', cardType: 'MASTERCARD' },
      { id: '3', maskedNumber: '**** **** **** 9012', expiry: '11/29', ownerMasked: 'E. SARP', cardType: 'AMEX' },
    ],
    []
  );

  const data = Array.isArray(cards) ? cards : sample;

  const [selectedId, setSelectedId] = useState<string | null>(data[0]?.id ?? null);
  const [list, setList] = useState<CardData[]>(data);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const init = [...data];
    if (selectedId) {
      init.sort((a, b) => (a.id === selectedId ? -1 : b.id === selectedId ? 1 : 0));
    }
    setList(init);
  }, [data]);

  const onSelect = (id: string) => {
    if (selectedId === id) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedId(id);
    setList((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.unshift(item);
      return next;
    });
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ x: 0, animated: true });
    });
  };

  const snapInterval = CARD_WIDTH + gap;
  const decel = snap ? 'fast' : 'normal';

  return (
    <View style={styles.section}>
      {/* ✅ FieldHeader varyant 1 + ikon kapalı */}
      <FieldHeader title={title} variant={1} hideIcon={true} />

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.row,
          { paddingLeft: sidePadding, paddingRight: sidePadding - gap },
        ]}
        snapToInterval={snap ? snapInterval : undefined}
        snapToAlignment={snap ? 'start' : undefined}
        decelerationRate={decel as any}
        disableIntervalMomentum={snap}
        pagingEnabled={false}
        scrollEventThrottle={16}
      >
        {list.map((card, idx) => {
          const isLast = idx === list.length - 1;
          return (
            <View
              key={card.id}
              style={{ width: CARD_WIDTH, marginRight: isLast ? 0 : gap }}
            >
              <TouchableOpacity activeOpacity={0.9} onPress={() => onSelect(card.id)}>
                <PaymentCard
                  maskedNumber={card.maskedNumber}
                  expiry={card.expiry}
                  ownerMasked={card.ownerMasked}
                  cardType={card.cardType}
                  selected={selectedId === card.id}
                  onSelect={() => onSelect(card.id)}
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
