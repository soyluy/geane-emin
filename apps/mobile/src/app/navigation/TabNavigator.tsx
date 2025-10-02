// apps/mobile/src/app/navigation/TabNavigator.tsx
import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
import { useCartVisibility } from './CartVisibilityContext';
import { useNotificationVisibility } from './NotificationVisibilityContext';
import { useUserMenuVisibility } from './UserMenuVisibilityContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MainScreen from '../screens/MainScreen';
import ExploreScreen from '../screens/ExploreScreen';
import SavedScreen from '../screens/SavedScreen';
import UserMenu from '../components/ui/UserMenu';

// Pasif ikonlar
import HomeIcon from '../../../assets/icons/nav/home.svg';
import SearchIcon from '../../../assets/icons/nav/search.svg';
// Aktif ikonlar
import HomeIconActive from '../../../assets/icons/nav/home-active.svg';
import SearchIconActive from '../../../assets/icons/nav/search-active.svg';

/**
 * UX KARARLARI
 * - Bar yüksekliği: gerçek ekran yüksekliğinin %4.5'i (0.045)
 *   Clamp: min 48, max 60 px
 * - İkon boyutu: bar yüksekliğinin %56'sı
 *   Clamp: min 24, max 28 px
 * - Ekran yüksekliği = Dimensions.get('screen').height
 *   (status bar + Android sistem alt bar DAHİL)
 */
const SCREEN_H = Dimensions.get('screen').height;
const R_BAR = 0.045;
const MIN_BAR = 44;
const MAX_BAR = 60;
const BASE_TAB_H = Math.round(SCREEN_H * R_BAR);
const TAB_H_COMPUTED = Math.max(MIN_BAR, Math.min(MAX_BAR, BASE_TAB_H));

const R_ICON = 0.56;
const MIN_ICON = 24;
const MAX_ICON = 28;

const PROFILE_URL =
  'https://i.pinimg.com/736x/07/49/d9/0749d9133913b3e4c46389d96aac8e17.jpg';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { cartVisible } = useCartVisibility();
  const { notificationVisible } = useNotificationVisibility();
  const { userMenuVisible, setUserMenuVisible } = useUserMenuVisibility();
  
  const [activePanel, setActivePanel] = React.useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const TAB_H = useMemo(() => TAB_H_COMPUTED, []);
  const ICON_H = useMemo(
    () => Math.max(MIN_ICON, Math.min(MAX_ICON, Math.round(TAB_H * R_ICON))),
    [TAB_H]
  );

  // Sadece 3 ikon: Main, Explore, Saved
  const inactiveIcons: Record<string, any> = {
    Main: HomeIcon,
    Explore: SearchIcon,
  };
  const activeIcons: Record<string, any> = {
    Main: HomeIconActive,
    Explore: SearchIconActive,
  };

  // Dikey ortalama ve geniş tıklama alanı için dış sarmal
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <View style={{ height: TAB_H, justifyContent: 'center', alignItems: 'center' }}>
      {children}
    </View>
  );

  return (
    <>
    <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: 'transparent' }}
      screenOptions={({ route }) => ({
        safeAreaInsets: { bottom: 0, top: 0 },

        tabBarStyle:
          cartVisible || notificationVisible || userMenuVisible
            ? { display: 'none' }
            : {
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: TAB_H + insets.bottom, // ✅ Navigation bar için bottom inset eklendi
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderTopWidth: 0,
                borderTopColor: 'transparent',
                elevation: 0,
                shadowOpacity: 0,
                // ↩︎ Butonlar arası boşluk/kenar pedleri: ESKİ HALİ
                paddingHorizontal: 24,
                paddingTop: 0,
                paddingBottom: insets.bottom, // ✅ Alt boşluk navigation bar için
              },

        headerShown: false,
        tabBarShowLabel: false,

        tabBarItemStyle: {
          flex: 1,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 0,
          marginHorizontal: 0,
        },

        tabBarIconStyle: { marginTop: 0, marginBottom: 0 },
        tabBarActiveTintColor: '#303336',
        tabBarInactiveTintColor: '#616161',

        // Android gri ripple’ı/halkayı kapatmak için özel buton
        tabBarButton: (props) => (
          <Pressable
            {...props}
            android_ripple={undefined} // ripple yok
            style={styles.buttonBase}
            hitSlop={8}
            pressRetentionOffset={8}
          />
        ),

        tabBarIcon: ({ focused }) => {
          const w = ICON_H;
          const h = ICON_H;

          // En sağdaki buton (Saved) → PROFİL GÖRSELİ (ESKİ HALİ)
          if (route.name === 'Saved') {
            return (
              <Wrapper>
                <Image
                  source={{ uri: PROFILE_URL }}
                  style={[styles.profile, { width: w, height: h, borderRadius: w / 2 }]}
                />
              </Wrapper>
            );
          }

          const IconComponent = focused
            ? activeIcons[route.name]
            : inactiveIcons[route.name];

          return (
            <Wrapper>
              {IconComponent ? <IconComponent width={w} height={h} /> : null}
            </Wrapper>
          );
        },
      })}
    >
      <Tab.Screen name="Main" component={MainScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
    </Tab.Navigator>
    
    {/* GLOBAL USERMENU - Tüm ekranlar için ortak */}
    <UserMenu
      visible={userMenuVisible}
      onClose={() => setUserMenuVisible(false)}
      onNavigateToSellerForm={() => {
        setUserMenuVisible(false);
        console.log('Satıcı Başvurusuna yönlendirildi');
      }}
      onSelectPanel={setActivePanel}
      selectedPanel={activePanel}
      setSelectedPanel={setActivePanel}
      onNavigateToProfile={() => {
        setUserMenuVisible(false);
        console.log('Profile navigated');
      }}
      avatarUri={null}
      displayName="Kullanıcı"
    />
    </>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    flex: 1,
    height: '100%', // dikey ortalama için dış sarmalla uyumlu
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // görsel geri bildirim yok
  },
  profile: {
    resizeMode: 'cover',
  },
});
