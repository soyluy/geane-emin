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

// ✅ Boyut hesaplamaları - Tek kaynak
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

// Yatay kart boyutları
export const H_IMAGE_W = SCREEN_W * 0.27906;  // %27.906
export const H_IMAGE_H = SCREEN_H * 0.21459;  // %21.459  
export const H_TITLE_H = 20; // Başlık yüksekliği sabit
export const H_CARD_H = H_IMAGE_H + H_TITLE_H; // Toplam yükseklik

// Dikey kart boyutları
export const TITLE_BOX_H = SCREEN_H * 0.04296;

export interface ProductCardProps {
  product: any;             // Ready.ts ya da UIProduct türevleriyle uyum için geniş tip
  isHorizontal: boolean;
  // Dikey ölçüler (Container yalnızca V_CARD_W verir; geri kalan stil burada)
  V_CARD_W?: number;
}

function ProductCardInner({
  product,
  isHorizontal,
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

  // Başlık kısaltma fonksiyonu (36 karakter maksimum)
  const truncateTitle = (title: string, maxLength: number = 36) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  if (isHorizontal) {
    // — YATAY KART — (sadece fotoğraf + başlık, kapsayıcı yok)
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
          width: H_IMAGE_W,
          height: H_CARD_H,
        }}
      >
        {/* Ürün fotoğrafı - kapsayıcı yok */}
        <Image
          source={{ uri: imageUrls[0] }}
          style={{
            width: H_IMAGE_W,
            height: H_IMAGE_H,
            borderRadius: 8,
          }}
          resizeMode="cover"
        />

        {/* Başlık */}
        <Text 
          style={[styles.horizontalTitleText]}
          numberOfLines={1}
        >
          {truncateTitle(product.title, 36)}
        </Text>
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
          {imgs.map((_: any, idx: number) => (
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
  horizontalTitleText: {
    fontSize: 11,
    fontWeight: '500', // Medium
    fontFamily: 'Inter',
    color: '#303336',
    marginTop: 8,
    textAlign: 'left',
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
