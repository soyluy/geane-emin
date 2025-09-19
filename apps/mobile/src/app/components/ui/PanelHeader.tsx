// File: src/app/components/ui/PanelHeader.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  title: string;
  onClose: () => void;
  containerStyle?: ViewStyle;  // panel bazlı override
  titleStyle?: TextStyle;      // panel bazlı override
  showDivider?: boolean;       // alt çizgi
  topPadding?: number;         // (ARTIK KULLANILMIYOR) iç boşluk değil istiyorsun, 0 kalsın
  topMargin?: number;          // ✅ dış boşluk (safe-area + 12px + bu değer)
};

const SAFE_HEADER_OFFSET = 32; // status bar altı için sabit ek marj

export default function PanelHeader({
  title,
  onClose,
  containerStyle,
  titleStyle,
  showDivider = true,
  topPadding = 0,   // istek üzerine 0 ve kullanılmıyor
  topMargin = 0,    // dış marj için panel bazlı ek mesafe (opsiyonel)
}: Props) {
  const insets = useSafeAreaInsets();

  // ÜSTÜNE BOŞLUK: safe-area + sabit 12 + opsiyonel topMargin
  const headerMarginTop = Math.max(insets.top, 0) + SAFE_HEADER_OFFSET + topMargin;

  return (
    <View style={[styles.header, { marginTop: headerMarginTop }, containerStyle]}>
      {/* Sol dengeleyici alan (başlık tam ortalansın) */}
      <View style={styles.sideSpace} />

      {/* Başlık metni */}
      <Text
        numberOfLines={1}
        style={[styles.title, titleStyle]}
        accessibilityRole="header"
        accessibilityLabel={title}
      >
        {title}
      </Text>

      {/* Çarpı butonu */}
      <Pressable
        onPress={onClose}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Paneli kapat"
        android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
        style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}
      >
        <Text style={styles.closeTxt}>×</Text>
      </Pressable>

      {showDivider && <View style={styles.divider} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    // DIŞ MARJ üstte veriliyor; içeride ekstra padding yok
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  sideSpace: { width: 40, height: 56 },
  title: {
    position: 'absolute',
    left: 52,
    right: 52,
    height: 56,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  closeBtn: {
    position: 'absolute',
    right: 12,
    height: 56,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeTxt: {
    fontSize: 26,
    lineHeight: 26,
    color: '#111',
    marginTop: -1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
});
