// src/app/components/ui/PanelShell.tsx
import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  title: string;
  onClose: () => void;
  rightAction?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

const { width: SCREEN_W } = Dimensions.get('screen');
// UserMenu'daki içerik paneli genişliği = ekranın %80'i ile uyumlu
const PANEL_W = SCREEN_W * 0.8;

// UserMenu ile aynı his için benzer süre/easing değerleri
const OPEN_DUR = 320;
const CLOSE_DUR = 260;
const EASE_OUT = Easing.out(Easing.cubic);
const EASE_IN = Easing.in(Easing.cubic);

// Kapatma eşiği: panel genişliğinin ~%32'si veya yeterli hız (UserMenu ile aynı mantık)
const CLOSE_DISTANCE_RATIO = 0.32;
const CLOSE_VELOCITY = 0.8;

export default function PanelShell({ title, onClose, rightAction, footer, children }: Props) {
  const insets = useSafeAreaInsets();

  // Swipe için X konumu
  const translateX = useRef(new Animated.Value(0)).current;

  const pan = useRef(
    PanResponder.create({
      // Yatay hareket baskın ve sağa doğruysa pan başlasın; dikey scroll'u engellemeyelim
      onMoveShouldSetPanResponder: (_e, g) =>
        Math.abs(g.dx) > Math.abs(g.dy) && g.dx > 6,
      onPanResponderMove: (_e, g) => {
        if (g.dx > 0) {
          // sağa doğru çekişi panel genişliğiyle sınırla
          const next = Math.min(g.dx, PANEL_W);
          translateX.setValue(next);
        }
      },
      onPanResponderRelease: (_e, g) => {
        const shouldClose = g.dx > PANEL_W * CLOSE_DISTANCE_RATIO || g.vx > CLOSE_VELOCITY;
        if (shouldClose) {
          // Paneli tamamen sağa kaydırıp kapat
          Animated.timing(translateX, {
            toValue: PANEL_W,
            duration: CLOSE_DUR,
            easing: EASE_IN,
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          // Eski konumuna yumuşakça geri dön
          Animated.timing(translateX, {
            toValue: 0,
            duration: OPEN_DUR,
            easing: EASE_OUT,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      {...pan.panHandlers}
      style={[
        s.root,
        {
          // Başlık ve X butonu: safe-area + 40 (istediğin ayar)
          paddingTop: insets.top + 40,
          paddingBottom: Math.max(insets.bottom, 10),
          transform: [{ translateX }],
        },
      ]}
    >
      {/* Header (sol ok YOK; sağda X var) */}
      <View style={s.header}>
        <Text style={s.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={s.hright}>
          {rightAction}
          <TouchableOpacity
            onPress={onClose}
            style={s.hbtn}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            accessibilityLabel="Kapat"
            accessibilityRole="button"
          >
            <Text style={s.hicon}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* İçerik – sol boşluk kaldırıldı; içerideki komponentler spacing'ini kendi ayarlıyor */}
      <ScrollView contentContainerStyle={s.content}>
        {children}
      </ScrollView>

      {/* Footer (opsiyonel) */}
      {footer ? <View style={s.footer}>{footer}</View> : null}
    </Animated.View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  hbtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  hicon: { fontSize: 18 },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: '#222' },
  hright: { flexDirection: 'row', alignItems: 'center' },
  content: {
    paddingHorizontal: 0, // sol boşluk kaldırıldı
    paddingVertical: 0,
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
});
