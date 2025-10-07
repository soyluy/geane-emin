// src/app/components/ui/Modals/RightModal.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  PanResponder,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButtonIcon from '../../../../../assets/icons/backbutton.svg';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

const MODAL_W = SCREEN_W * 0.90; // %90 genişlik
const MODAL_H = SCREEN_H;        // modal yüksekliği (tam ekran)
const HEADER_Y = Math.round(MODAL_H * 0.07518); // %9.65 aşağısı - Başlık konumu
// İkonlar pozisyonu - sağ kenardan hesaplama
const ICONS_Y = Math.round(MODAL_H * 0.19206); // %19.206 aşağısı
const ICONS_RIGHT_MARGIN = Math.round(MODAL_W * 0.05813); // Sağ kenardan %5.813 sol

// Back button pozisyonu
const BACK_BUTTON_Y = Math.round(MODAL_H * 0.06652); // %6.652 aşağısı
const BACK_BUTTON_X = Math.round(MODAL_W * 0.05813); // %5.813 sağa

// RightModal özel header alanı - İkonların altından içerik başlasın
const HEADER_AREA_HEIGHT = ICONS_Y + 44 + 20; // İkon Y + İkon yükseklik + margin

// İkonlar arası mesafe
const ICON_SPACING = 50;

// Android stilinde hızlı animasyonlar
const OPEN_DUR = 250;  // Android: 250ms açılış
const CLOSE_DUR = 200; // Android: 200ms kapanış
const BACKDROP_MAX = 0.99; // Arka plan kararma

// Icon configuration type
interface IconConfig {
  icon: React.ComponentType<any>;
  onPress: () => void;
  accessibilityLabel: string;
}

type Props = {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title?: string;
  // Opsiyonel icon konfigürasyonu
  icons?: IconConfig[];
  // İkonlar için özel Y pozisyonu (varsayılan: %41.184)
  iconsTopOffset?: number;
};

export default function RightModal({ 
  visible, 
  onClose, 
  children, 
  title = '', 
  icons = [], 
  iconsTopOffset 
}: Props) {
  console.log('[RightModal] render, visible=', visible);
  const insets = useSafeAreaInsets();

  // İkon Y pozisyonunu belirleme - custom offset veya varsayılan
  const FINAL_ICONS_Y = iconsTopOffset ? Math.round(MODAL_H * iconsTopOffset) : ICONS_Y;
  
  // Header area yüksekliği - ikonlar varsa hesapla
  const HEADER_AREA_HEIGHT = icons.length > 0 ? FINAL_ICONS_Y + 44 + 20 : HEADER_Y + 60;

  const modalX = useRef(new Animated.Value(MODAL_W)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  const isAnimating = useRef(false);

  const openModal = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    Animated.parallel([
      Animated.timing(modalX, { 
        toValue: 0, 
        duration: OPEN_DUR, 
        useNativeDriver: true 
      }),
      Animated.timing(backdrop, { 
        toValue: BACKDROP_MAX, 
        duration: OPEN_DUR, 
        useNativeDriver: true 
      }),
    ]).start(() => { isAnimating.current = false; });
  };

  const closeModal = (cb?: () => void) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    Animated.parallel([
      Animated.timing(modalX, { 
        toValue: MODAL_W, 
        duration: CLOSE_DUR, 
        useNativeDriver: true 
      }),
      Animated.timing(backdrop, { 
        toValue: 0, 
        duration: CLOSE_DUR, 
        useNativeDriver: true 
      }),
    ]).start(() => { isAnimating.current = false; cb?.(); onClose?.(); });
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => false, // TouchableOpacity'lerin çalışmasını sağla
      onStartShouldSetPanResponder: () => false, // TouchableOpacity'lerin çalışmasını sağla
      onMoveShouldSetPanResponderCapture: (_e, gs) => Math.abs(gs.dx) > 5, // Sadece belirgin kaydırmada aktif ol
      onMoveShouldSetPanResponder: (_e, gs) => Math.abs(gs.dx) > 5, // Sadece belirgin kaydırmada aktif ol
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => false, // Native responser'ları bloke etme
      onPanResponderMove: (_e, gs) => {
        const dx = Math.max(gs.dx, 0);
        const next = Math.min(dx, MODAL_W);
        modalX.setValue(next);
        backdrop.setValue((1 - next / MODAL_W) * BACKDROP_MAX);
      },
      onPanResponderRelease: (_e, gs) => {
        const shouldClose = gs.dx > MODAL_W * 0.32 || gs.vx > 0.8;
        shouldClose ? closeModal() : openModal();
      },
      onPanResponderTerminate: openModal,
    })
  ).current;

  const closeModalLocal = (cb?: () => void) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    Animated.parallel([
      Animated.timing(modalX, {
        toValue: MODAL_W,
        duration: CLOSE_DUR,
        useNativeDriver: true,
      }),
      Animated.timing(backdrop, {
        toValue: 0,
        duration: CLOSE_DUR,
        useNativeDriver: true,
      }),
    ]).start(() => {
      isAnimating.current = false;
      if (cb && typeof cb === 'function') cb();
    });
  };

  useEffect(() => {
    if (visible) {
      modalX.setValue(MODAL_W);
      requestAnimationFrame(openModal);
    } else {
      modalX.setValue(MODAL_W);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <TouchableWithoutFeedback onPress={() => closeModal()}>
        <Animated.View style={[styles.backdrop, { opacity: backdrop }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        {...pan.panHandlers}
        style={[
          styles.modalPanel,
          { transform: [{ translateX: modalX }], marginBottom: -insets.bottom },
        ]}
        accessibilityViewIsModal
        importantForAccessibility="yes"
      >
        {/* RightModal Özel Header Alanı */}
        <View style={[styles.headerArea, { height: HEADER_AREA_HEIGHT }]} />

        {/* Back Button */}
        <TouchableOpacity 
          style={[styles.backButton, { top: BACK_BUTTON_Y, left: BACK_BUTTON_X }]}
          onPress={() => closeModal()}
          accessibilityLabel="Geri"
        >
          <BackButtonIcon 
            width={42} 
            height={42} 
            fill="#303336"
            stroke="none"
          />
        </TouchableOpacity>

        {/* Modal Başlığı: modal yüksekliğinin %9.65 aşağısı */}
        <View style={[styles.header, { top: HEADER_Y }]}>
          <Text numberOfLines={1} style={styles.headerTitle}>
            {title}
          </Text>
        </View>

        {/* Dinamik İkonlar - Opsiyonel */}
        {icons.map((iconConfig, index) => {
          const IconComponent = iconConfig.icon;
          // Sağ kenardan konumlandırma: sıra korunarak, ters index kullanarak sağdan sola
          const reverseIndex = icons.length - 1 - index;
          const iconRight = ICONS_RIGHT_MARGIN + (reverseIndex * ICON_SPACING);
          
          return (
            <TouchableOpacity 
              key={`icon-${index}`}
              style={[styles.actionIcon, { top: FINAL_ICONS_Y, right: iconRight }]}
              onPress={iconConfig.onPress}
              accessibilityLabel={iconConfig.accessibilityLabel}
            >
              <IconComponent 
                width={22} 
                height={22} 
                fill="#303336"
                stroke="none"
              />
            </TouchableOpacity>
          );
        })}

        <View style={[styles.panelContent, { paddingBottom: insets.bottom, paddingTop: HEADER_AREA_HEIGHT }]}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0, 0, 0, 0.3)' 
  },
  modalPanel: { 
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: MODAL_W,
    backgroundColor: 'rgba(255, 255, 255, 0.99)',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    overflow: 'hidden',
    zIndex: 999,
    elevation: 8,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  panelContent: { 
    flex: 1 
  },
  // RightModal özel header alanı
  headerArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  header: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 1000,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#303336',
    fontFamily: 'Inter-SemiBold',
    fontWeight: '500',
    textAlign: 'center',
  },
  // Back Button
  backButton: {
    position: 'absolute',
    zIndex: 1000,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  // Dinamik Action Icon
  actionIcon: {
    position: 'absolute',
    zIndex: 1000,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});