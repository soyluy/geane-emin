// src/app/components/ui/ProductCard.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Product: {
    images: string[];
    title: string;
    description: string;
    price: string;
  };
};

type ProductNavProp = StackNavigationProp<RootStackParamList, 'Product'>;

// ✅ Tek kaynak: Alt Kısım yüksekliği (Dikey) = SCREEN_H * 4.296%
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');
export const TITLE_BOX_H = SCREEN_H * 0.04296;

export interface ProductCardProps {
  product: any;             // Ready.ts ya da UIProduct türevleriyle uyum için geniş tip
  isHorizontal: boolean;
  // Yatay ölçüler (Container dizilim için de bildiriyor; stil tek kaynaktan burada uygulanıyor)
  H_CARD_W?: number;
  H_IMAGE_H?: number;
  H_TITLE_H?: number;
  H_PRICE_H?: number;
  // Dikey ölçüler (Container yalnızca V_CARD_W verir; geri kalan stil burada)
  V_CARD_W?: number;
}

function ProductCardInner({
  product,
  isHorizontal,
  H_CARD_W,
  H_IMAGE_H,
  H_TITLE_H,
  H_PRICE_H,
  V_CARD_W,
}: ProductCardProps) {
  const navigation = useNavigation<ProductNavProp>();

  // Hem Ready (images[]) hem eski yapı (imageUrls[]) ile uyum
  const imgs =
    Array.isArray(product?.images) && product.images.length
      ? product.images
      : Array.isArray(product?.imageUrls)
      ? product.imageUrls.map((url: string) => ({ url, ar: 0.75 }))
      : [];

  const imageUrls: string[] =
    Array.isArray(product?.imageUrls) && product.imageUrls.length
      ? product.imageUrls
      : imgs.map((im: any) => im.url);

  const primaryAr =
    (imgs[0]?.ar && typeof imgs[0].ar === 'number' && imgs[0].ar > 0 ? imgs[0].ar : undefined) ??
    (typeof product?.primaryAr === 'number' && product.primaryAr > 0 ? product.primaryAr : undefined) ??
    0.75;

  // ₺3.855 formatı (kuruş yok, binlik ayırıcı nokta)
  const formatPrice = (price: number) => '₺' + Math.floor(price).toLocaleString('tr-TR');

  if (isHorizontal) {
    // — YATAY KART —
    // Not: borderRadius sadece GÖRSEL KAPSAYICISINA uygulanıyor.
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('Product', {
            images: imageUrls,
            title: product.title,
            description: product.category,
            price: formatPrice(product.price),
          })
        }
        style={{
          width: H_CARD_W,
          height: (H_IMAGE_H ?? 0) + (H_TITLE_H ?? 0),
          backgroundColor: '#FFF',
          position: 'relative',
        }}
      >
        {/* Görsel kapsayıcısı */}
        <View
          style={{
            width: H_CARD_W,
            height: H_IMAGE_H,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <Image
            source={{ uri: imageUrls[0] }}
            style={{ width: H_CARD_W!, height: H_IMAGE_H! }}
            resizeMode="cover"
          />
          {/* Fiyat rozeti */}
          <View
            style={{
              position: 'absolute',
              bottom: 6,
              right: 10,
              height: H_PRICE_H,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 6,
            }}
          >
            <Text style={styles.priceText}>{formatPrice(product.price)}</Text>
          </View>
        </View>

        {/* Başlık */}
        <View
          style={{
            position: 'absolute',
            top: H_IMAGE_H,
            left: 0,
            width: H_CARD_W,
            height: H_TITLE_H,
            backgroundColor: '#FFF',
            paddingTop: 5,
            justifyContent: 'flex-start',
          }}
        >
          <Text numberOfLines={1} style={[styles.titleText, { textAlign: 'left' }]}>
            {product.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  // — DİKEY KART — (tek dış kapsayıcı; görsel + Alt Kısım + fiyat rozeti)
  const _V_CARD_W = V_CARD_W ?? SCREEN_W * 0.46511;
  const PRICE_OFFSET = TITLE_BOX_H + 10;      // fiyat rozeti, Alt Kısım üstünde
  const PRICE_RT = _V_CARD_W * 0.075;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('Product', {
          images: imageUrls,
          title: product.title,
          description: product.category,
          price: formatPrice(product.price),
        })
      }
      style={{
        width: _V_CARD_W,
        position: 'relative',
        backgroundColor: '#FFF',
        paddingBottom: TITLE_BOX_H, // Alt Kısım absolute olduğu için alan ayırıyoruz
      }}
    >
      {/* Görsel (slider) */}
      <FlatList
        data={imgs}
        keyExtractor={(_, idx) => idx.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ width: _V_CARD_W, borderRadius: 15, overflow: 'hidden' }}>
            <Image
              source={{ uri: item.url }}
              style={{
                width: _V_CARD_W,
                aspectRatio: typeof item.ar === 'number' && item.ar > 0 ? item.ar : primaryAr,
              }}
              resizeMode="cover"
            />
          </View>
        )}
      />

      {/* Dots */}
      {imgs.length > 1 && (
        <View
          style={{
            position: 'absolute',
            bottom: (_V_CARD_W / (primaryAr || 0.75)) * 0.04,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          {imgs.map((_, idx) => (
            <View
              key={idx}
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                marginHorizontal: 4,
                backgroundColor: '#000',
              }}
            />
          ))}
        </View>
      )}

      {/* === ALT KISIM: %100 genişlik, TITLE_BOX_H yükseklik === */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: _V_CARD_W,
          height: TITLE_BOX_H,        // ← tek kaynak
          backgroundColor: '#FFFFFF', // DEBUG
          flexDirection: 'row',
        }}
      >
        {/* Başlık Alanı (%75) */}
        <View
          style={{
            width: _V_CARD_W * 0.75,
            height: '100%',
            backgroundColor: '#FFFFFF', // DEBUG
            paddingTop: 8,
            paddingHorizontal: 4,
            justifyContent: 'flex-start',
          }}
        >
          <Text numberOfLines={2} style={styles.titleText}>
            {product.title}
          </Text>
        </View>

        {/* Ekle Butonu Alanı (%25) */}
        <View
          style={{
            width: _V_CARD_W * 0.25,
            height: '100%',
            backgroundColor: '#FFFFFF', // DEBUG
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingRight: 8,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              // TODO: Ekle/Save aksiyonu
            }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              overflow: 'hidden',
              backgroundColor: '#000',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Fiyat rozeti */}
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
        <Text style={styles.priceText}>{formatPrice(product.price)}</Text>
      </View>
    </TouchableOpacity>
  );
}

function areEqual(prev: ProductCardProps, next: ProductCardProps) {
  return (
    prev.isHorizontal === next.isHorizontal &&
    prev.H_CARD_W === next.H_CARD_W &&
    prev.H_IMAGE_H === next.H_IMAGE_H &&
    prev.H_TITLE_H === next.H_TITLE_H &&
    prev.H_PRICE_H === next.H_PRICE_H &&
    prev.V_CARD_W === next.V_CARD_W &&
    prev.product?.id === next.product?.id &&
    prev.product?.price === next.product?.price &&
    prev.product?.title === next.product?.title &&
    (prev.product?.imageUrls?.[0] ?? prev.product?.images?.[0]?.url) ===
      (next.product?.imageUrls?.[0] ?? next.product?.images?.[0]?.url)
  );
}

export default React.memo(ProductCardInner, areEqual);

const styles = StyleSheet.create({
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
