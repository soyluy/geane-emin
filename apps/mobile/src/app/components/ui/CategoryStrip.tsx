// mobile/src/app/components/ui/CategoryStrip.tsx

import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native';

export interface CategoryStripProps {
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

export default function CategoryStrip({
  onEndReached,
  endReachedThreshold = 20,
}: CategoryStripProps) {
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();
  const CONTAINER_HEIGHT   = SCREEN_H * 0.19313;
  const CARD_WIDTH         = SCREEN_W * 0.27906;
  const FIRST_CARD_MARGIN  = SCREEN_W * 0.03953;
  const CARD_SPACING       = SCREEN_W * 0.02325;
  const TEXTBOX_SIDE_RATIO = 0.08333;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {
      contentOffset: { x: offsetX },
      layoutMeasurement: { width: viewWidth },
      contentSize: { width: contentWidth },
    } = e.nativeEvent;
    if (offsetX + viewWidth >= contentWidth - endReachedThreshold) {
      onEndReached?.();
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.scrollView, { height: CONTAINER_HEIGHT }]}
      contentContainerStyle={styles.contentContainer}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {/* İlk kart */}
      <View
        style={[
          styles.card,
          {
            width: CARD_WIDTH,
            height: CONTAINER_HEIGHT,
            marginLeft: FIRST_CARD_MARGIN,
            borderRadius: 10,
            overflow: 'hidden',            // köşe ovalliğini koru
          },
        ]}
      >
        <View style={styles.overlay} />
        <View
          style={[
            styles.textBox,
            { width: CARD_WIDTH * (1 - 2 * TEXTBOX_SIDE_RATIO) },
          ]}
        >
          <Text style={styles.textBoxText}>Sample Category</Text>
        </View>
      </View>

      {/* Diğer kartlar */}
      {[...Array(4)].map((_, i) => (
        <View
          key={i}
          style={[
            styles.card,
            {
              width: CARD_WIDTH,
              height: CONTAINER_HEIGHT,
              marginLeft: CARD_SPACING,
              borderRadius: 10,
              overflow: 'hidden',          // köşe ovalliğini koru
            },
          ]}
        >
          <View style={styles.overlay} />
          <View
            style={[
              styles.textBox,
              { width: CARD_WIDTH * (1 - 2 * TEXTBOX_SIDE_RATIO) },
            ]}
          >
            <Text style={styles.textBoxText}>Sample Category</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView:      { backgroundColor: '#ffffff' },
  contentContainer:{ flexDirection: 'row', alignItems: 'flex-start', paddingRight: 20 },
  card:            { backgroundColor: '#cccccc', justifyContent: 'center', alignItems: 'center' },
  overlay:         { ...StyleSheet.absoluteFillObject, backgroundColor: '#000000', opacity: 0.1 },
  textBox:         { justifyContent: 'center' },
  textBoxText:     { color: '#ffffff', fontFamily: 'Inter-Black', fontSize: 18, textAlign: 'center' },
});
