// src/app/components/ui/SaveListCard.tsx

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import HeartIcon from '../../../../assets/icons/L.S.C.Healt-icon.svg';
import CartIcon from '../../../../assets/icons/nav/cart.svg';

interface Props {
  label: string;
  selected: boolean;
  onToggle: () => void;
  image?: string;
}

export default function SaveListCard({
  label,
  selected,
  onToggle,
  image,
}: Props) {
  // Tam ekran (status + nav bar DAHİL) taban
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

  // Figma oranları
  const CARD_SIZE        = SCREEN_W * 0.21162;
  const LEFT_MARGIN      = SCREEN_W * 0.05116;
  const TOP_MARGIN       = SCREEN_W * 0.08;       // tasarımda genişliğe göre verilmiş
  const TEXT_MARGIN_LEFT = SCREEN_W * 0.04651;

  // 8px → Figma (932) ölçeği: 8 / 932 ≈ 0.00858
  const INITIAL_LABEL_MARGIN_TOP = SCREEN_H * 0.00858;

  // Icon boyutları (kart oranlarına göre)
  const ICON_WIDTH     = CARD_SIZE * 0.26944;
  const ICON_HEIGHT    = CARD_SIZE * 0.2333;
  const CART_ICON_SIZE = CARD_SIZE;

  const isCart  = label === 'Sepete Ekle';
  const isDress = label === 'Elbiseler Listene Ekle';
  const imageSource = image
    ? image
    : isDress
    ? 'https://i.pinimg.com/736x/1e/6b/9b/1e6b9b38f0a6c5a6e1dba970930ef5f6.jpg'
    : 'https://i.pinimg.com/736x/07/49/d9/0749d9133913b3e4c46389d96aac8e17.jpg';

  const labelMarginTop = useRef(
    new Animated.Value(selected ? 0 : INITIAL_LABEL_MARGIN_TOP)
  ).current;
  const removeOpacity = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(labelMarginTop, {
        toValue: selected ? 0 : INITIAL_LABEL_MARGIN_TOP,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(removeOpacity, {
        toValue: selected ? 1 : 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [selected, INITIAL_LABEL_MARGIN_TOP, labelMarginTop, removeOpacity]);

  const displayLabel = selected
    ? label.replace(/Ekle$/, '') + 'Eklendi !'
    : label;

  return (
    <View style={[styles.row, { marginLeft: LEFT_MARGIN, marginTop: TOP_MARGIN }]}>
      <View style={[styles.imageBox, { width: CARD_SIZE, height: CARD_SIZE }]}>
        {isCart ? (
          <View
            style={[
              styles.cartContainer,
              { width: CARD_SIZE, height: CARD_SIZE, borderRadius: 10 },
            ]}
          >
            <CartIcon width={CART_ICON_SIZE} height={CART_ICON_SIZE} />
          </View>
        ) : (
          <>
            <Image
              source={{ uri: imageSource }}
              style={[
                styles.coverImage,
                { width: CARD_SIZE, height: CARD_SIZE, borderRadius: 10 },
              ]}
            />
            <View
              style={[
                styles.overlay,
                { width: CARD_SIZE, height: CARD_SIZE, borderRadius: 10 },
              ]}
            />
            <View
              style={[
                styles.iconWrapper,
                { width: CARD_SIZE, height: CARD_SIZE },
              ]}
            >
              <HeartIcon width={ICON_WIDTH} height={ICON_HEIGHT} />
            </View>
          </>
        )}
      </View>

      <View
        style={[
          styles.textBox,
          { marginLeft: TEXT_MARGIN_LEFT, paddingTop: SCREEN_W * 0.03 },
        ]}
      >
        <TouchableOpacity onPress={onToggle}>
          <Animated.Text style={[styles.topText, { marginTop: labelMarginTop }]}>
            {displayLabel}
          </Animated.Text>
        </TouchableOpacity>

        <Animated.View style={{ opacity: removeOpacity, overflow: 'hidden' }}>
          {selected && (
            <TouchableOpacity onPress={onToggle}>
              <Text style={styles.bottomText}>Kaldır</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  imageBox: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  coverImage: {
    position: 'absolute',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  iconWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    justifyContent: 'flex-start',
  },
  topText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#303336',
  },
  bottomText: {
    fontFamily: 'Inter_300Light',
    fontSize: 16,
    color: '#303336',
    marginTop: 4,
  },
});
