// src/app/components/ui/UserMenü/UserMenu.tsx
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, Animated, Image,
  PanResponder, BackHandler, Alert, Modal, Easing, Pressable, // ⬅️ StatusBar kaldırıldı
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ALT PANELLER
import CardPanel from '../CardPanel';
import MyOrdersPanel from './MyOrdersPanel';
import MyMessages from './MyMessages';
import CustomerSupportPanel from '../CustomerSupportPanel';
import AddressPanel from '../AddressPanel';
import PrivacyPanel from '../PrivacyPanel';
import HelpPanel from '../HelpPanel';
import AboutPanel from '../AboutPanel';

import { ScrollView, TouchableOpacity } from 'react-native';
import RightModal from '../Modals/RightModal';

// Icons for different panels
import FilterIcon from '../../../../../assets/icons/GravityUIIconsby/gravity-ui--bars-ascending-align-left-arrow-up.svg';
import SearchIcon from '../../../../../assets/icons/GravityUIIconsby/gravity-ui--magnifier.svg';
import CommentPlusIcon from '../../../../../assets/icons/GravityUIIconsby/gravity-ui--comment-plus.svg';
import NotificationIcon from '../../../../../assets/icons/nav/notification-active.svg';
import BookmarkIcon from '../../../../../assets/icons/nav/bookmark.svg';

const { width: SCREEN_W } = Dimensions.get('screen');

const MENU_W = SCREEN_W * 0.6;
const CONTENT_W = SCREEN_W * 0.8;

// Android stilinde hızlı animasyonlar
const OPEN_DUR = 250;  // Android: 250ms açılış
const CLOSE_DUR = 200; // Android: 200ms kapanış
const EASE_OUT = Easing.out(Easing.cubic);
const EASE_IN = Easing.in(Easing.cubic);
// Android stilinde çok şeffaf backdrop
const BACKDROP_MAX_MENU = 0.99;    // Daha belirgin karartma
const BACKDROP_MAX_CONTENT = 0.99; // İçerik için biraz daha az

const LINK_COLOR = '#4b4d50ff';

const MENU_ITEMS = [
  { label: ' Siparişlerim', action: 'orderTracking' },
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

const PANEL_REGISTRY: Record<string, { 
  title: string; 
  Render: (p:{onClose:()=>void}) => JSX.Element;
  icons?: any[];
  iconsTopOffset?: number;
}> = {
  // Render should return only the panel body; RightModal wrapping is handled in renderContent
  orderTracking:   { 
    title: 'Siparişlerim',         
    Render: ({onClose}) => <MyOrdersPanel onClose={onClose} />,
    icons: [
      { icon: FilterIcon, onPress: () => console.log('Filter orders'), accessibilityLabel: 'Filtrele' },
      { icon: SearchIcon, onPress: () => console.log('Search orders'), accessibilityLabel: 'Ara' },
    ],
    iconsTopOffset: 0.19206 // %25 aşağısı
  },
  customerSupport: { 
    title: 'Müşteri Hizmetleri',   
    Render: ({onClose}) => <CustomerSupportPanel onClose={onClose} />,
    icons: [
      { icon: NotificationIcon, onPress: () => console.log('Notifications'), accessibilityLabel: 'Bildirimler' },
    ],
    iconsTopOffset: 0.30 // %30 aşağısı
  },
  inbox:           { 
    title: 'Gelen Kutusu',         
    Render: ({onClose}) => <MyMessages onClose={onClose} />,
    icons: [
      { icon: CommentPlusIcon, onPress: () => console.log('Yeni Mesaj'), accessibilityLabel: 'Yeni Mesaj' },
      { icon: SearchIcon, onPress: () => console.log('Mesaj Ara'), accessibilityLabel: 'Mesaj Ara' },
    ],
    iconsTopOffset: 0.19206 // Siparişlerim paneli ile aynı pozisyon
  },
  editAddresses:   { 
    title: 'Adreslerini Düzenle',  
    Render: ({onClose}) => <AddressPanel onClose={onClose} />,
    // İkon yok
  },
  manageCards:     { 
    title: 'Kart Ekle/Kaldır',     
    Render: ({onClose}) => <CardPanel onClose={onClose} />,
    // İkon yok
  },
  privacySettings: { 
    title: 'Hesap Gizliliği',      
    Render: ({onClose}) => <PrivacyPanel onClose={onClose} />,
    // İkon yok
  },
  helpCenter:      { 
    title: 'Yardım Merkezi',       
    Render: ({onClose}) => <HelpPanel onClose={onClose} />,
    icons: [
      { icon: SearchIcon, onPress: () => console.log('Search help'), accessibilityLabel: 'Yardımda Ara' },
    ]
  },
  about:           { 
    title: 'Hakkımızda',           
    Render: ({onClose}) => <AboutPanel onClose={onClose} />,
    // İkon yok
  },
};

interface UserMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigateToSellerForm?: () => void;
  onSelectPanel?: (panel: string) => void;
  selectedPanel: string | null;
  setSelectedPanel?: (panel: string | null) => void;
  disableBack?: boolean;
  onNavigateToProfile?: () => void;
  avatarUri?: string;
  displayName?: string;
}

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
}: UserMenuProps) {
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
      // Android stilinde smooth timing animasyonu
      Animated.timing(menuX, { 
        toValue: 0, 
        duration: OPEN_DUR, 
        useNativeDriver: true // Easing kaldırıldı, native driver için
      }),
      Animated.timing(backdrop, { 
        toValue: BACKDROP_MAX_MENU, 
        duration: OPEN_DUR, 
        useNativeDriver: true 
      }),
    ]).start(() => { isAnimating.current = false; });
  };

  const closeMenu = (cb?: () => void) => {
    if (isAnimating.current || isAnimatingContent.current) return;
    isAnimating.current = true;
    Animated.parallel([
      // Android stilinde hızlı kapanış
      Animated.timing(menuX, { 
        toValue: MENU_W, 
        duration: CLOSE_DUR, 
        useNativeDriver: true 
      }),
      Animated.timing(backdrop, { 
        toValue: 0, 
        duration: CLOSE_DUR, 
        useNativeDriver: true 
      }),
    ]).start(() => { 
      isAnimating.current = false; 
      if (cb && typeof cb === 'function') {
        cb();
      }
      if (onClose && typeof onClose === 'function') {
        onClose();
      }
    });
  };

  // Menü kapatma ama UserMenu'ü parent'a kapatma isteği göndermeyen versiyon
  // (RightModal açılacaksa kullan)
  const closeMenuLocal = (cb?: () => void) => {
    if (isAnimating.current || isAnimatingContent.current) return;
    isAnimating.current = true;
    Animated.parallel([
      Animated.timing(menuX, {
        toValue: MENU_W,
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
      // note: do NOT call onClose here - keep UserMenu mounted so RightModal can render
    });
  };

  const openContent = () => {
    if (isAnimatingContent.current) return;
    isAnimatingContent.current = true;

    // Android stilinde paralel animasyonlar
    Animated.timing(menuX, { 
      toValue: MENU_W, 
      duration: CLOSE_DUR, 
      useNativeDriver: true 
    }).start();
    
    Animated.timing(backdrop, { 
      toValue: BACKDROP_MAX_CONTENT, 
      duration: OPEN_DUR, 
      useNativeDriver: true 
    }).start();
    
    Animated.timing(contentX, { 
      toValue: 0, 
      duration: OPEN_DUR, 
      useNativeDriver: true 
    }).start(() => { isAnimatingContent.current = false; });
  };

  const closeContent = () => {
    if (isAnimatingContent.current) return;
    isAnimatingContent.current = true;

    // Android stilinde hızlı geri dönüş
    Animated.timing(contentX, { 
      toValue: CONTENT_W, 
      duration: CLOSE_DUR, 
      useNativeDriver: true 
    }).start(() => {
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
      closeMenu(); 
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, [visible, disableBack, selectedPanel]);

  const handleSelect = (action: string) => {
    if (action === 'orderTracking') {
      console.log('[UserMenu] orderTracking selected');
      // Eğer menü hâlâ açılma animasyonundaysa, hemen paneli set et
      if (isAnimating.current) {
        setSelectedPanel?.(action);
        onSelectPanel?.(action);
        closeMenuLocal();
        return;
      }
      // Normal akış: menüyü kapat ve callback ile paneli aç
      pendingAfterClose.current = () => {
        setSelectedPanel?.(action);
        onSelectPanel?.(action);
      };
      closeMenuLocal(() => { const fn = pendingAfterClose.current; pendingAfterClose.current = null; fn?.(); });
      return;
    }
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
      // For all other panels: set selected panel and close menu locally so RightModal can render
      setSelectedPanel?.(action);
      onSelectPanel?.(action);
      closeMenuLocal();
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
    console.log('[UserMenu] renderContent for', selectedPanel);
    const meta = PANEL_REGISTRY[selectedPanel];
    if (!meta) return null;
    const Body = meta.Render;

    // Wrap every panel in RightModal (PanelShell removed; render header + content here)
    return (
      <RightModal 
        visible={true} 
        onClose={closeContent} 
        title={meta.title}
        icons={meta.icons}
        iconsTopOffset={meta.iconsTopOffset}
      >
        <View style={{ flex: 1 }}>
          <ScrollView>
            <Body onClose={closeContent} />
          </ScrollView>
        </View>
      </RightModal>
    );
  };

  return (
    <>
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
            <Image source={require('../../../../../assets/images/LOGO.png')} style={styles.logo} resizeMode="contain" />
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

      {/* Render panel content inside RightModal for all selectedPanel values */}
      {selectedPanel && renderContent()}
    </Modal>
    </>
  );
}

const basePanel = {
  position: 'absolute' as const,
  top: 0,
  bottom: 0,
  right: 0,
  // Android stilinde hafif şeffaf beyaz
  backgroundColor: 'rgba(255, 255, 255, 0.96)',
  borderTopLeftRadius: 0,    // Android'de köşe yuvarlaklığı yok
  borderBottomLeftRadius: 0,
  overflow: 'hidden' as const,
  zIndex: 999,
  // Android stilinde hafif elevation
  elevation: 8,
  shadowColor: 'rgba(0, 0, 0, 0.15)',
  shadowOffset: { width: -2, height: 0 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  borderLeftWidth: 0, // Border kaldırıldı
};

const styles = StyleSheet.create({
  // Android stilinde daha belirgin backdrop
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.3)' },
  menuPanel: { ...basePanel, width: MENU_W },
  contentPanel: { ...basePanel, width: CONTENT_W },
  rightModalPanel: { 
    position: 'absolute' as const,
    top: 0,
    bottom: 0,
    right: 0,
    width: SCREEN_W * 0.75, // RightModal genişliği
    zIndex: 1000,
  },
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
