// File: src/app/components/ui/CenteredModal.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Pressable,
  Easing,
  Text,
} from 'react-native';
import { Portal } from 'react-native-portalize'; // ✅ Portal import

type Props = {
  visible: boolean;
  onClose: () => void;
  closeOnBackdropPress?: boolean;
  children?: React.ReactNode;
};

const SCREEN = Dimensions.get('screen');
const SCREEN_W = SCREEN.width;
const SCREEN_H = SCREEN.height;

const OPEN_DUR = 320;
const CLOSE_DUR = 260;
const EASE_OUT = Easing.out(Easing.cubic);
const EASE_IN = Easing.in(Easing.cubic);
const BACKDROP_MAX = 0.45;

export default function CenteredModal({
  visible,
  onClose,
  closeOnBackdropPress = false,
  children,
}: Props) {
  const backdrop = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.98)).current;
  const panelOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: BACKDROP_MAX,
          duration: OPEN_DUR,
          easing: EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: OPEN_DUR,
          easing: EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(panelOpacity, {
          toValue: 1,
          duration: OPEN_DUR,
          easing: EASE_OUT,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 0,
          duration: CLOSE_DUR,
          easing: EASE_IN,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.98,
          duration: CLOSE_DUR,
          easing: EASE_IN,
          useNativeDriver: true,
        }),
        Animated.timing(panelOpacity, {
          toValue: 0,
          duration: CLOSE_DUR,
          easing: EASE_IN,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const PANEL_W = SCREEN_W * 0.98;
  const PANEL_H = SCREEN_H * 0.36;

  return (
    <Portal>
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        {/* Backdrop */}
        <Animated.View
          pointerEvents={visible ? 'auto' : 'none'}
          style={[styles.backdrop, { opacity: backdrop }]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => {
              if (closeOnBackdropPress) onClose?.();
            }}
          />
        </Animated.View>

        {/* Panel tam ortalanmış */}
        <Animated.View
          pointerEvents={visible ? 'auto' : 'none'}
          style={[
            styles.panelAbsolute,
            {
              width: PANEL_W,
              height: PANEL_H,
              transform: [
                { translateX: -PANEL_W / 2 },
                { translateY: -PANEL_H / 2 },
                { scale },
              ],
              opacity: panelOpacity,
            },
          ]}
        >
          {/* Sağ üst × */}
          <Pressable
            onPress={onClose}
            hitSlop={10}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Kapat"
          >
            <Text style={styles.closeTxt}>×</Text>
          </Pressable>

          {/* İçerik */}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  panelAbsolute: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    zIndex: 2,
  },
  closeTxt: {
    fontSize: 22,
    lineHeight: 22,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
  },
});
