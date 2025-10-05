// mobile/src/app/components/ui/FieldHeader.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowDown from '../../../../assets/icons/arrow-down.svg';

/** Canlı doğrulama için opsiyonel token yapısı (geri uyumlu) */
export interface NoteToken {
  text: string;
  active?: boolean; // kriter sağlandı → yeşil
  error?: boolean;  // kriter önemli ve atlandı → kırmızı
}

interface FieldHeaderProps {
  title: string;
  note?: string;
  noteTokens?: NoteToken[];             // Notu token’lara bölüp renklendirmek istersen
  onIconPress?: () => void;
  hideIcon?: boolean;                   // Oku gizle
  rotated?: boolean;                    // İkon yönü değiştirilsin mi?
  variant?: 'default' | 'product';      // Varyant tipi: default veya product
}

export default function FieldHeader({
  title,
  note,
  noteTokens,
  onIconPress,
  hideIcon = false,
  rotated = false,
  variant = 'default',
}: FieldHeaderProps) {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

  // Ortak oranlar
  const paddingLeft = SCREEN_W * 0.03953;
  const paddingRight = SCREEN_W * 0.04651;

  // --- PRODUCT VARYANT ---
  if (variant === 'product') {
    const headerHeight  = SCREEN_H * 0.07296;
    const textBoxHeight = headerHeight * 0.35294;
    const topMargin     = headerHeight * 0.47058;

    return (
      <View style={[styles.container, { height: headerHeight }]}>
        <View
          style={[
            styles.wrapper,
            {
              height:   textBoxHeight,
              marginTop: topMargin,
              marginLeft: paddingLeft,
              marginRight: paddingRight,
            },
          ]}
        >
          <View style={styles.textContainer}>
            <Text
              style={styles.productTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
              {noteTokens && noteTokens.length > 0 ? (
                <>
                  {' '}
                  {noteTokens.map((t, idx) => (
                    <Text
                      key={`${t.text}-${idx}`}
                      style={[
                        styles.productNote,
                        t.active && styles.successGreen,
                        t.error  && styles.errorRed,
                      ]}
                    >
                      {t.text}
                      {idx !== noteTokens.length - 1 ? ', ' : ''}
                    </Text>
                  ))}
                </>
              ) : (
                note && <Text style={styles.productNote}> {note}</Text>
              )}
            </Text>
          </View>
          {!hideIcon && (
            <TouchableOpacity
              style={styles.iconBox}
              onPress={onIconPress}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowDown
                width={textBoxHeight * 0.8}
                height={textBoxHeight * 0.8}
                style={{ transform: [{ rotate: rotated ? '90deg' : '0deg' }] }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // --- DEFAULT VARYANT ---
  const headerHeight = SCREEN_H * 0.09227;
  const boxHeight    = headerHeight * 0.27906;
  const boxTop       = headerHeight * 0.48837;

  return (
    <View
      style={[
        styles.container,
        { height: headerHeight, paddingTop: insets.top },
      ]}
    >
      <View
        style={[
          styles.wrapper,
          {
            height:   boxHeight,
            top:      boxTop,
            left:     paddingLeft,
            right:    paddingRight,
            position: 'absolute',
          },
        ]}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
            {noteTokens && noteTokens.length > 0 ? (
              <>
                {' '}
                {noteTokens.map((t, idx) => (
                  <Text
                    key={`${t.text}-${idx}`}
                    style={[
                      styles.note,
                      t.active && styles.successGreen,
                      t.error  && styles.errorRed,
                    ]}
                  >
                    {t.text}
                    {idx !== noteTokens.length - 1 ? ', ' : ''}
                  </Text>
                ))}
              </>
            ) : (
              note && <Text style={styles.note}> {note}</Text>
            )}
          </Text>
        </View>
        {!hideIcon && (
          <TouchableOpacity
            style={styles.iconBox}
            onPress={onIconPress}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowDown
              width={boxHeight * 0.8}
              height={boxHeight * 0.8}
              style={{ transform: [{ rotate: rotated ? '90deg' : '0deg' }] }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { width: '100%', backgroundColor: '#ffffffff' },
  wrapper:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  textContainer:{ flex: 1, justifyContent: 'center' },

  // DEFAULT VARYANT
  title:        { fontSize: 14, fontWeight: '700', color: '#060606', textAlign: 'left' },
  note:         { fontSize: 11, fontFamily: 'Inter-Regular', color: '#616161' }, // varsayılan gri
  successGreen: { color: '#11A75C' },  // aktif kriter
  errorRed:     { color: '#F13957' },  // atlanan kritik kriter (özel karakter)

  // PRODUCT VARYANT
  productTitle: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: '#000' },
  productNote:  { fontSize: 12, fontFamily: 'Inter-Regular', color: '#616161' },

  iconBox:      { justifyContent: 'center', alignItems: 'center' },
});
