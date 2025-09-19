// src/app/components/ui/ProductImageCarousel.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface ProductImageCarouselProps {
  imageUris?: string[];
  price: string;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  imageUris = [],
  price,
}) => {
  // Tam ekran (status + nav bar DAHİL) taban
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

  const [activeIndex, setActiveIndex] = useState(0);
  const [ratios, setRatios] = useState<Record<string, number>>({});

  // viewability refs (sabit)
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const onViewableItemsChangedRef = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    }
  );

  // En-boy oranlarını hesapla
  useEffect(() => {
    if (!Array.isArray(imageUris)) return;
    imageUris.forEach((uri) => {
      if (ratios[uri] != null) return;
      Image.getSize(
        uri,
        (w, h) => setRatios((p) => ({ ...p, [uri]: w / h })),
        () => setRatios((p) => ({ ...p, [uri]: 1 }))
      );
    });
  }, [imageUris, ratios]);

  // Görsel yoksa placeholder
  if (imageUris.length === 0) {
    return (
      <View
        style={[
          styles.placeholderContainer,
          { width: SCREEN_W, aspectRatio: 1 },
        ]}
      >
        <Text style={styles.placeholderText}>Görsel yok</Text>
      </View>
    );
  }

  // İlk görselin oranı ve container yüksekliği
  const firstRatio = ratios[imageUris[0]] || 1;
  const containerHeight = SCREEN_W / firstRatio;

  return (
    <View style={{ width: SCREEN_W, aspectRatio: firstRatio }}>
      <FlatList
        data={imageUris}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        viewabilityConfig={viewConfigRef.current}
        onViewableItemsChanged={onViewableItemsChangedRef.current}
        style={{ flex: 1 }}
        renderItem={({ item }) => {
          const aspect = ratios[item] || firstRatio;
          return (
            <Image
              source={{ uri: item }}
              style={{
                width: SCREEN_W,
                height: undefined,
                aspectRatio: aspect,
              }}
              resizeMode="contain"
              accessibilityLabel="Ürün görseli"
            />
          );
        }}
      />

      {/* Fiyat rozeti */}
      <View
        style={[
          styles.priceContainer,
          {
            right: SCREEN_W * 0.05116,          // %5,116
            bottom: containerHeight * 0.0279,   // %2,79
          },
        ]}
      >
        <Text style={styles.priceText}>{price}</Text>
      </View>

      {/* Nokta göstergesi */}
      <View
        style={[
          styles.pagination,
          { width: SCREEN_W, bottom: containerHeight * 0.04031 }, // %4,031
        ]}
      >
        {imageUris.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              idx === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    color: '#888',
    fontSize: 14,
  },

  // Fiyat rozeti
  priceContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },

  // Dots
  pagination: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  inactiveDot: {
    backgroundColor: '#D9D9D9',
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
  },
});

export default ProductImageCarousel;
