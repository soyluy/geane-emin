// File: src/app/components/ui/UserMenu.tsx
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, Animated, Image,
  PanResponder, BackHandler, Platform, Alert, Modal, StatusBar, Easing, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';

// ALT PANELLER (SlideInPanel YOK!)
import CardPanel from './CardPanel';
import OrderTrackingPanel from './OrderTrackingPanel';
import CustomerSupportPanel from './CustomerSupportPanel';
import InboxPanel from './InboxPanel';
import AddressPanel from './AddressPanel';
import PrivacyPanel from './PrivacyPanel';
import HelpPanel from './HelpPanel';
import AboutPanel from './AboutPanel';

const { width: SCREEN_W } = Dimensions.get('screen');

// Menü paneli soldan (sağ kenardan) 0.6W, içerik paneli 0.8W
const MENU_W = SCREEN_W * 0.6;
const CONTENT_W = SCREEN_W * 0.8;

const OPEN_DUR = 320;
const CLOSE_DUR = 260;
const EASE_OUT = Easing.out(Easing.cubic);
const EASE_IN = Easing.in(Easing.cubic);
const BACKDROP_MAX = 0.45;

const LINK_COLOR = '#4b4d50ff';

const MENU_ITEMS = [
  { label: ' Sipariş Takip', action: 'orderTracking' },
  { label: ' Müşteri Hizmetleri', action: 'customerSupport' },
  { label: ' Gelen Kutusu', action: 'inbox' },
  { label: ' Adreslerini Düzenle', action: 'editAddresses' },
  { label: ' Kart Ekle/Kaldır', action: 'manageCards' },
  { label: ' Hesap Gizliliği', action: 'privacySettings' },
  { label: ' Satıcı Başvurusu', action: 'seller' },
  { label: ' Yardım Merkezi', action: 'helpCenter' },
  { label: ' Hakkımızda', action: 'about' },
  { label: ' Çıkış Yap', action: 'logout' },
];

export default function UserMenu({
  visible,
  onClose,
  onNavigateToSellerForm,
  onSelectPanel,
  selectedPanel,
  setSelectedPanel,
  disableBack = false,
  onNavigateToProfile,
  avatarUri,
  displayName = 'Emin Sarp',
}) {
  const insets = useSafeAreaInsets();

  // Menü paneli için animasyon
  const menuX = useRef(new Animated.Value(MENU_W)).current; // 0: açık, MENU_W: kapalı
  // İçerik paneli (alt paneller) için animasyon
  const contentX = useRef(new Animated.Value(CONTENT_W)).current; // 0: açık, CONTENT_W: kapalı
  // Tek backdrop
  const backdrop = useRef(new Animated.Value(0)).current;

  const isAnimating = useRef(false);
  const pendingAfterClose = useRef<null | (() => void)>(null);

  // Menü swipe kapama
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, gs) => Math.abs(gs.dx) > 6,
      onPanResponderMove: (_e, gs) => {
        const next = Math.min(Math.max(gs.dx, 0), MENU_W);
        menuX.setValue(next);
        backdrop.setValue((1 - next / MENU_W) * BACKDROP_MAX);
      },
      onPanResponderRelease: (_e, gs) => {
        const shouldClose = gs.dx > MENU_W * 0.32 || gs.vx > 0.8;
        shouldClose ? closeMenu() : openMenu();
      },
    })
  ).current;

  const setBarsForMenu = async () => {
    StatusBar.setBarStyle('light-content', true);
    if (Platform.OS === 'android') {
      try {
        await NavigationBar.setBehaviorAsync('overlay-swipe');
        await NavigationBar.setVisibilityAsync('immersive');
        await NavigationBar.setBackgroundColorAsync('#ffffff');
        await NavigationBar.setButtonStyleAsync('light');
      } catch {}
    }
  };

  const revertBars = async () => {
    StatusBar.setBarStyle('dark-content', true);
    if (Platform.OS === 'android') {
      try {
        await NavigationBar.setVisibilityAsync('visible');
        await NavigationBar.setBehaviorAsync('inset-swipe');
        await NavigationBar.setBackgroundColorAsync('#FFFFFF');
        await NavigationBar.setButtonStyleAsync('dark');
      } catch {}
    }
  };

  const openMenu = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    Animated.parallel([
      Animated.timing(menuX, { toValue: 0, duration: OPEN_DUR, easing: EASE_OUT, useNativeDriver: true }),
      Animated.timing(backdrop, { toValue: BACKDROP_MAX, duration: OPEN_DUR, easing: EASE_OUT, useNativeDriver: true }),
    ]).start(() => { isAnimating.current = false; });
  };

  const closeMenu = (cb?: () => void) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    Animated.parallel([
      Animated.timing(menuX, { toValue: MENU_W, duration: CLOSE_DUR, easing: EASE_IN, useNativeDriver: true }),
      Animated.timing(backdrop, { toValue: 0, duration: CLOSE_DUR, easing: EASE_IN, useNativeDriver: true }),
    ]).start(() => { isAnimating.current = false; cb?.(); onClose?.(); revertBars(); });
  };

  // İçerik panelini aç (menüyü ekrandan çek, içerik panelini getir)
  const openContent = () => {
    // menü offscreen
    Animated.timing(menuX, { toValue: MENU_W, duration: CLOSE_DUR, easing: EASE_IN, useNativeDriver: true }).start();
    // backdrop açık kalsın
    Animated.timing(backdrop, { toValue: BACKDROP_MAX, duration: OPEN_DUR, easing: EASE_OUT, useNativeDriver: true }).start();
    // içerik içeri girsin
    Animated.timing(contentX, { toValue: 0, duration: OPEN_DUR, easing: EASE_OUT, useNativeDriver: true }).start();
  };

  // İçerik panelini kapat (menüyü geri getir)
  const closeContent = () => {
    Animated.timing(contentX, { toValue: CONTENT_W, duration: CLOSE_DUR, easing: EASE_IN, useNativeDriver: true }).start(() => {
      setSelectedPanel?.(null);
      // menü geri gelsin
      openMenu();
    });
  };

  // visible değişimi
  useEffect(() => {
    if (visible) {
      menuX.setValue(MENU_W);
      contentX.setValue(CONTENT_W);
      backdrop.setValue(0);
      setBarsForMenu();
      requestAnimationFrame(openMenu);
    } else {
      // güvenlik için reset
      menuX.setValue(MENU_W);
      contentX.setValue(CONTENT_W);
      backdrop.setValue(0);
      revertBars();
    }
  }, [visible]);

  // Android geri tuşu
  useEffect(() => {
    if (!visible || disableBack) return;
    const onBack = () => {
      if (selectedPanel) { closeContent(); return true; }
      closeMenu(); return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, [visible, disableBack, selectedPanel]);

  const handleSelect = (action: string) => {
    if (action === 'seller') {
      pendingAfterClose.current = onNavigateToSellerForm || null;
      closeMenu(() => { const fn = pendingAfterClose.current; pendingAfterClose.current = null; fn?.(); });
      return;
    }
    if (action === 'logout') {
      Alert.alert('Çıkış', 'Hesabınızdan çıkmak istediğinize emin misiniz?', [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Çık', style: 'destructive', onPress: () => {} },
      ]);
      return;
    }
    setSelectedPanel?.(action);
    onSelectPanel?.(action);
    openContent();
  };

  const handleProfilePress = () => {
    if (!onNavigateToProfile) { closeMenu(); return; }
    closeMenu(() => onNavigateToProfile());
  };

  if (!visible) return null;

  const Avatar = () => {
    if (avatarUri) return <Image source={{ uri: avatarUri }} style={styles.avatarImg} />;
    const initials = displayName?.trim()?.split(/\s+/).map(w => w[0]).slice(0,2).join('').toUpperCase() || 'E';
    return <View style={styles.avatarFallback}><Text style={styles.avatarInitials}>{initials}</Text></View>;
  };

  // Seçilen panele göre içerik
  const renderContent = () => {
    switch (selectedPanel) {
      case 'orderTracking':       return <OrderTrackingPanel onClose={closeContent} />;
      case 'customerSupport':     return <CustomerSupportPanel visible={false} onClose={closeContent} />;
      case 'inbox':               return <InboxPanel onClose={closeContent} messages={[{ id:'1', title:'Yeni Mesaj', content:'Gelen kutun güncellendi.', date:'09.08.2025' }]} />;
      case 'editAddresses':       return <AddressPanel visible onClose={closeContent} />;
      case 'manageCards':         return <CardPanel cards={[]} selectedCardId={null} onChangeSelected={() => {}} onAddCard={() => {}} onRemoveCard={() => {}} onClose={closeContent} />;
      case 'privacySettings':     return <PrivacyPanel visible onClose={closeContent} />;
      case 'helpCenter':          return <HelpPanel visible onClose={closeContent} />;
      case 'about':               return <AboutPanel visible onClose={closeContent} />;
      default: return null;
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      statusBarTranslucent
      presentationStyle="overFullScreen"
      animationType="none"
      onRequestClose={() => (selectedPanel ? closeContent() : closeMenu())}
      onDismiss={revertBars}
    >
      {/* TEK BACKDROP */}
      <TouchableWithoutFeedback onPress={() => (selectedPanel ? closeContent() : closeMenu())}>
        <Animated.View style={[styles.backdrop, { opacity: backdrop }]} />
      </TouchableWithoutFeedback>

      {/* MENÜ PANELİ */}
      <Animated.View
        {...pan.panHandlers}
        style={[
          styles.menuPanel,
          { transform: [{ translateX: menuX }], marginBottom: -insets.bottom },
        ]}
        accessibilityViewIsModal
        importantForAccessibility="yes"
      >
        <View style={[styles.panelContent, { paddingTop: insets.top + 40, paddingBottom: insets.bottom }]}>
          <View style={styles.logoWrap}>
            <Image source={require('../../../../assets/images/LOGO.png')} style={styles.logo} resizeMode="contain" />
          </View>

          <Pressable
            onPress={handleProfilePress}
            android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
            style={({ pressed }) => [styles.profileRow, pressed && { opacity: 0.6 }]}
            accessibilityRole="button"
            accessibilityLabel={`Profili görüntüle – ${displayName} profili`}
          >
            <Avatar />
            <View style={styles.profileTexts}>
              <Text style={styles.username}>{displayName}</Text>
              <Pressable
                hitSlop={6}
                onPress={handleProfilePress}
                android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                style={({ pressed }) => [styles.profileLinkWrap, pressed && { opacity: 0.7 }]}
                accessibilityRole="button"
                accessibilityLabel="Profili görüntüle"
              >
                <Text style={styles.profileLink}>Profili görüntüle</Text>
              </Pressable>
            </View>
          </Pressable>

          <View style={styles.menuList}>
            {MENU_ITEMS.map((item) => (
              <TouchableWithoutFeedback key={item.action} onPress={() => handleSelect(item.action)}>
                <View style={styles.menuItem}>
                  <Text style={styles.menuText}>{item.label}</Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* İÇERİK PANELİ (AYNI MODAL İÇİNDE) */}
      {selectedPanel && (
        <Animated.View
          style={[
            styles.contentPanel,
            { transform: [{ translateX: contentX }], marginBottom: -insets.bottom },
          ]}
          accessibilityViewIsModal
          importantForAccessibility="yes"
        >
          {renderContent()}
        </Animated.View>
      )}
    </Modal>
  );
}

const basePanel = {
  position: 'absolute' as const,
  top: 0,
  bottom: 0,
  right: 0,
  backgroundColor: '#fff',
  borderTopLeftRadius: 15,
  borderBottomLeftRadius: 15,
  overflow: 'hidden' as const,
  zIndex: 999,
  elevation: 999,
  borderLeftWidth: 1,
  borderColor: 'rgba(0,0,0,0.08)',
};

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
  menuPanel: { ...basePanel, width: MENU_W },
  contentPanel: { ...basePanel, width: CONTENT_W },
  panelContent: { flex: 1 },
  logoWrap: { paddingHorizontal: 16, marginBottom: 12 },
  logo: { width: 90, height: 24 },
  profileRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  avatarImg: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEE' },
  avatarFallback: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E6E6E6', alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { fontSize: 14, fontWeight: '700', color: '#444' },
  profileTexts: { marginLeft: 10, flexShrink: 1 },
  username: { fontSize: 16, fontWeight: '600', color: '#303336' },
  profileLinkWrap: { alignSelf: 'flex-start', marginTop: 2 },
  profileLink: { fontSize: 12, fontWeight: '400', color: LINK_COLOR },
  menuList: { paddingVertical: 8 },
  menuItem: { paddingVertical: 16, paddingHorizontal: 16 },
  menuText: { fontSize: 16, color: '#303336', fontWeight: '600' },
});
