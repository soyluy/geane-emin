// components/ui/CategoryCard.tsx

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageSourcePropType,
  NativeSyntheticEvent,
  ImageLoadEventData,
} from 'react-native';

// ⚠️ Kart ölçülerine DOKUNMUYORUZ — orijinal sabitler:
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen'); // mevcutta böyleydi

const CONTAINER_HEIGHT   = SCREEN_H * 0.19313;          // orijinal
const CARD_WIDTH         = SCREEN_W * 0.27906;          // orijinal
const TEXTBOX_SIDE_RATIO = 0.08333;                     // orijinal

interface Props {
  title: string;
  onPress?: () => void;
  marginLeft?: number;
  /** Kapak görseli (opsiyonel). Varsa arka plana basılır. */
  imageSource?: ImageSourcePropType;
}

export default function CategoryCard({
  title,
  onPress,
  marginLeft = 0,
  imageSource,
}: Props) {
  // Görsel doğal boyutları
  const [imgSize, setImgSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const handleLoad = (e: NativeSyntheticEvent<ImageLoadEventData>) => {
    const { width, height } = e.nativeEvent.source || { width: 0, height: 0 };
    if (width > 0 && height > 0) setImgSize({ w: width, h: height });
  };

  // ► COVER HESABI: boşluk KALMAYACAK (Fill)
  const fitted = useMemo(() => {
    const { w, h } = imgSize;
    if (w <= 0 || h <= 0) {
      // İlk frame: kasayı tamamen doldur (boşluk görünmesin)
      return { width: CARD_WIDTH, height: CONTAINER_HEIGHT };
    }
    const scale = Math.max(CARD_WIDTH / w, CONTAINER_HEIGHT / h);
    return { width: w * scale, height: h * scale };
  }, [imgSize]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.card,
        {
          width: CARD_WIDTH,
          height: CONTAINER_HEIGHT,
          marginLeft,
          borderRadius: 10,
          overflow: 'hidden', // taşanı kırp
        },
      ]}
    >
      {/* Görsel: kasayı boşluksuz dolduracak şekilde ölçeklenir ve merkeze oturur */}
      {imageSource ? (
        <View style={styles.imageFrame}>
          <Image
            source={imageSource}
            onLoad={handleLoad}
            // Ölçeklenmiş boyutta merkezde; kasaya sığması garanti (boşluk yok)
            style={{ width: fitted.width, height: fitted.height }}
            // Boyutu biz verdiğimiz için mod önemli değil; artefakt yaratmaması için 'stretch'
            resizeMode="stretch"
          />
        </View>
      ) : null}

      {/* Overlay (mevcut tasarım korunur) */}
      <View style={styles.overlay} />

      {/* Metin kutusu (mevcut tasarım korunur) */}
      <View
        style={[
          styles.textBox,
          { width: CARD_WIDTH * (1 - 2 * TEXTBOX_SIDE_RATIO) },
        ]}
      >
        <Text style={styles.textBoxText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#cccccc',   // Kapak yoksa devreye girer
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Görseli kasanın TAM ortasında tutan çerçeve
  imageFrame: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center', // merkezle
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    opacity: 0.1,
  },
  textBox: {
    justifyContent: 'center',
  },
  textBoxText: {
    color: '#ffffff',
    fontFamily: 'Inter-Black',
    fontSize: 18,
    textAlign: 'center',
  },
});
