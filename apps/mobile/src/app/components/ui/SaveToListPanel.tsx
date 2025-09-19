// src/app/components/ui/SaveToListPanel.tsx

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  Pressable,
  BackHandler,
  PanResponder,
  Easing,
} from 'react-native';
import SaveListCard from './SaveListCard';

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('screen');
const INIT_HEIGHT = SCREEN_H * 0.3750;
const EXPAND_HEIGHT = SCREEN_H * 0.7;

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SaveToListPanel({ visible, onClose }: Props) {
  const translateY = useRef(new Animated.Value(SCREEN_H)).current;
  const isExpanded = useRef(false);

  // **Burada** üç bağımsız state:
  const [liked, setLiked] = useState(true);
  const [cart, setCart] = useState(false);
  const [dress, setDress] = useState(false);

  const showPanel = (h: number) => {
    Animated.timing(translateY, {
      toValue: SCREEN_H - h,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      isExpanded.current = h === EXPAND_HEIGHT;
    });
  };

  const hidePanel = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_H,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      isExpanded.current = false;
    });
  };

  const handleBack = () => {
    if (visible) {
      onClose();
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (visible) {
      showPanel(INIT_HEIGHT);
      BackHandler.addEventListener('hardwareBackPress', handleBack);
    } else {
      hidePanel();
    }
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBack);
    };
  }, [visible]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 5,
    onPanResponderRelease: (_, gs) => {
      if (gs.dy > 100) {
        onClose();
      } else if (gs.dy < -50 && !isExpanded.current) {
        showPanel(EXPAND_HEIGHT);
      } else {
        showPanel(isExpanded.current ? EXPAND_HEIGHT : INIT_HEIGHT);
      }
    },
  });

  return (
    <>
      {visible && (
        <Pressable style={styles.backdrop} onPress={onClose} />
      )}

      <Animated.View
        style={[styles.panel, { transform: [{ translateY }] }]}
        pointerEvents="box-none"
      >
        <View
          style={styles.inner}
          {...panResponder.panHandlers}
        >
          {/* Orijinal kart sırası ve stiller korunarak */}
          <SaveListCard
            label="Beğendiklerine Ekle"
            selected={liked}
            onToggle={() => setLiked(v => !v)}
          />
          <SaveListCard
            label="Sepete Ekle"
            selected={cart}
            onToggle={() => setCart(v => !v)}
          />
          <SaveListCard
            label="Elbiseler Listene Ekle"
            selected={dress}
            onToggle={() => setDress(v => !v)}
          />
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_W,
    height: SCREEN_H,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 98,
  },
  panel: {
    position: 'absolute',
    top: 0,
    width: SCREEN_W,
    height: SCREEN_H,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderColor: 'rgba(0,0,0,0.08)',
    borderWidth: 1,
    zIndex: 99,
    overflow: 'hidden',
  },
  inner: {
    paddingTop: 0,
    paddingBottom: 30,
  },
});
