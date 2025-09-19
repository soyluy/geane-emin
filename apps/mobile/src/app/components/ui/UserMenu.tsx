// src/app/components/ui/UserMenu.tsx
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, Animated, Image,
  PanResponder, BackHandler, Alert, Modal, Easing, Pressable, // ⬅️ StatusBar kaldırıldı
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ALT PANELLER
import CardPanel from './CardPanel';
import OrderTrackingPanel from './OrderTrackingPanel';
import CustomerSupportPanel from './CustomerSupportPanel';
import InboxPanel from './InboxPanel';
import AddressPanel from './AddressPanel';
import PrivacyPanel from './PrivacyPanel';
import HelpPanel from './HelpPanel';
import AboutPanel from './AboutPanel';

import PanelShell from './PanelShell';

const { width: SCREEN_W } = Dimensions.get('screen');

const MENU_W = SCREEN_W * 0.6;
const CONTENT_W = SCREEN_W * 0.8;

const OPEN_DUR = 320;
const CLOSE_DUR = 260;
const EASE_OUT = Easing.out(Easing.cubic);
const EASE_IN = Easing.in(Easing.cubic);
const BACKDROP_MAX_MENU = 0.45;
const BACKDROP_MAX_CONTENT = 0.25;

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

const PANEL_REGISTRY: Record<string, { title: string; Render: (p:{onClose:()=>void}) => JSX.Element }> = {
  orderTracking:   { title: 'Sipariş Takip',        Render: ({onClose}) => <OrderTrackingPanel onClose={onClose} /> },
  customerSupport: { title: 'Müşteri Hizmetleri',   Render: ({onClose}) => <CustomerSupportPanel onClose={onClose} /> },
  inbox:           { title: 'Gelen Kutusu',         Render: ({onClose}) => <InboxPanel onClose={onClose} messages={[{ id:'1', title:'Yeni Mesaj', content:'Gelen kutun güncellendi.', date:'09.08.2025' }]} /> },
  editAddresses:   { title: 'Adreslerini Düzenle',  Render: ({onClose}) => <AddressPanel onClose={onClose} /> },
  manageCards:     { title: 'Kart Ekle/Kaldır',     Render: ({onClose}) => <CardPanel onClose={onClose} cards={[]} selectedCardId={null} onChangeSelected={()=>{}} onAddCard={()=>{}} onRemoveCard={()=>{}} /> },
  privacySettings: { title: 'Hesap Gizliliği',      Render: ({onClose}) => <PrivacyPanel onClose={onClose} /> },
  helpCenter:      { title: 'Yardım Merkezi',       Render: ({onClose}) => <HelpPanel onClose={onClose} /> },
  about:           { title: 'Hakkımızda',           Render: ({onClose}) => <AboutPanel onClose={onClose} /> },
};

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

  const menuX = useRef(new Animated.Value(MENU_W)).current;
  const contentX = useRef(new Animated.Value(CONTENT_W)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  const isAnimating = useRef(false);
  const isAnimatingContent = useRef(false);
  const pendingAfterClose = useRef<null | (() => void)>(null);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, gs) => Math.abs(gs.dx) > 6,
      onPanResponderMove: (_e, gs) => {
        const next = Math.min(Math.max(gs.dx, 0), MENU_W);
        menuX.setValue(next);
        backdrop.setValue((1 - next / MENU_W) * BACKDROP_MAX_MENU);
      },
      onPanResponderRelease: (_e, gs) => {
        const shouldClose = gs.dx > MENU_W * 0.32 || gs.vx > 0.8;
        shouldClose ? closeMenu() : openMenu();
      },
    })
  ).current;

  const openMenu = () => {
    if (isAnimating.current || isAnimatingContent.current) return;
    isAnimating.current = true;
    Animated.parallel([
      Animated.timing(menuX, { toValue: 0, duration: OPEN_DUR, easing: EASE_OUT, useNativeDriver: true }),
      Animated.timing(backdrop, { toValue: BACKDROP_MAX_MENU, duration: OPEN_DUR, easing: EASE_OUT, useNativeDriver: true }),
    ]).start(() => { isAnimating.current = false; });
  };

  const closeMenu = (cb?: () => void) => {
    if (isAnimating.current || isAnimatingContent.current) return;
    isAnimating.current = true;
    Animated.parallel([
      Animated.timing(menuX, { toValue: MENU_W, duration: CLOSE_DUR, easing: EASE_IN, useNativeDriver: true }),
      Animated.timing(backdrop, { toValue: 0, duration: CLOSE_DUR, easing: EASE_IN, useNativeDriver: true }),
    ]).start(() => { isAnimating.current = false; cb?.(); onClose?.(); });
  };

  const openContent = () => {
    if (isAnimatingContent.current) return;
    isAnimatingContent.current = true;

    Animated.timing(menuX, { toValue: MENU_W, duration: CLOSE_DUR, easing: EASE_IN, useNativeDriver: true }).start();
    Animated.timing(backdrop, { toValue: BACKDROP_MAX_CONTENT, duration: OPEN_DUR, easing: EASE_OUT, useNativeDriver: true }).start();
    Animated.timing(contentX, { toValue: 0, duration: OPEN_DUR, easing: EASE_OUT, useNativeDriver: true })
      .start(() => { isAnimatingContent.current = false; });
  };

  const closeContent = () => {
    if (isAnimatingContent.current) return;
    isAnimatingContent.current = true;

    Animated.timing(contentX, { toValue: CONTENT_W, duration: CLOSE_DUR, easing: EASE_IN, useNativeDriver: true })
      .start(() => {
        setSelectedPanel?.(null);
        isAnimatingContent.current = false;
        openMenu();
      });
  };

  // UI görünürlük/animasyon — BAR’A DOKUNMUYOR
  useEffect(() => {
    if (visible) {
      menuX.setValue(MENU_W);
      contentX.setValue(CONTENT_W);
      backdrop.setValue(0);
      requestAnimationFrame(openMenu);
    } else {
      menuX.setValue(MENU_W);
      contentX.setValue(CONTENT_W);
      backdrop.setValue(0);
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

  const renderContent = () => {
    if (!selectedPanel) return null;
    const meta = PANEL_REGISTRY[selectedPanel];
    if (!meta) return null;
    const Body = meta.Render;

    return (
      <PanelShell title={meta.title} onClose={closeContent}>
        <Body onClose={closeContent} />
      </PanelShell>
    );
  };

  return (
    <Modal
      transparent
      visible={visible}
      statusBarTranslucent
      presentationStyle="overFullScreen"
      animationType="none"
      onRequestClose={() => (selectedPanel ? closeContent() : closeMenu())}
    >
      <TouchableWithoutFeedback onPress={() => (selectedPanel ? closeContent() : closeMenu())}>
        <Animated.View style={[styles.backdrop, { opacity: backdrop }]} />
      </TouchableWithoutFeedback>

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
