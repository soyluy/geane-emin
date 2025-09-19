// src/app/screens/MainScreen.tsx
import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // ⬅️ useFocusEffect eklendi
import * as NavigationBar from 'expo-navigation-bar'; // ⬅️ nav bar kontrolü

import { useCartVisibility } from '../navigation/CartVisibilityContext';
import { useNotificationVisibility } from '../navigation/NotificationVisibilityContext';

import TopBox from '../components/ui/TopBox';
import LikedSectionContainer, { LIKED_SECTION_HEIGHT } from '../components/ui/LikedSectionContainer';
import FilterBar, { FILTERBAR_HEIGHT } from '../components/ui/FilterBar';
import ProductArea from '../components/ui/ProductArea';
import CategoryArea from '../components/ui/CategoryArea';

import UserMenu from '../components/ui/UserMenu';
import CartPanel from '../components/ui/CartPanel';
import NotificationPanel from '../components/ui/NotificationPanel';

import { HOME_CATEGORIES } from '../data/mainscreen/homeCategories';
import { useHomeProductAreas } from './home/useHomeProductAreas';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');
const TOPBOX_HEIGHT = SCREEN_H * 0.08698;
const EXTRA_SCROLL_HEIGHT = SCREEN_H * 0.2;

export default function MainScreen() {
  const { cartVisible, setCartVisible } = useCartVisibility();
  const { notificationVisible, setNotificationVisible } = useNotificationVisibility();
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const translateYAnim = useRef(new Animated.Value(0)).current;
  const lastOffsetY = useRef(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const scrollRef = useRef<Animated.ScrollView>(null);

  const areas = useHomeProductAreas();

  // ⬇️ EKRAN ODAKLANDIĞINDA nav bar'ı kesin olarak şeffaf/overlay yap
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS !== 'android') return;
      const apply = async () => {
        try {
          // İstersen opaklık: 0.0–1.0 (örn: 0.7). Tam şeffaf istiyorsan 0.0 yaz.
          await NavigationBar.setBackgroundColorAsync('rgba(255,255,255,0.0)');
          await NavigationBar.setButtonStyleAsync('dark');
          await NavigationBar.setBehaviorAsync('overlay-swipe');
          await NavigationBar.setVisibilityAsync('visible');
        } catch (e) {
          console.log('NavBar setup error (MainScreen):', e);
        }
      };
      apply();
      // geri dönüşte özel bir şey yapmaya gerek yok
      return () => {};
    }, [])
  );

  const handleScrollToProductArea = () => {
    const y = TOPBOX_HEIGHT + LIKED_SECTION_HEIGHT + FILTERBAR_HEIGHT;
    // @ts-ignore
    scrollRef.current?.getNode().scrollTo({ y, animated: true });
  };

  const onScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const dy = y - lastOffsetY.current;
    const THRESHOLD = 10;

    if (dy > THRESHOLD && headerVisible) {
      Animated.timing(translateYAnim, { toValue: -TOPBOX_HEIGHT, duration: 200, useNativeDriver: true }).start();
      setHeaderVisible(false);
    } else if (dy < -THRESHOLD && !headerVisible) {
      Animated.timing(translateYAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      setHeaderVisible(true);
    }
    lastOffsetY.current = y;
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.fullscreen}>
        <Animated.View style={[styles.topBoxWrapper, { transform: [{ translateY: translateYAnim }] }]}>
          <TopBox
            title="Ana Sayfa"
            onMenuPress={() => setMenuVisible(true)}
            onCartPress={() => setCartVisible(true)}
            onNotificationPress={() => setNotificationVisible(true)}
          />
        </Animated.View>

        <Animated.ScrollView
          ref={scrollRef}
          style={styles.container}
          contentContainerStyle={{ paddingTop: TOPBOX_HEIGHT }}
          scrollEventThrottle={16}
          onScroll={onScroll}
        >
          <View style={{ height: LIKED_SECTION_HEIGHT }}>
            <LikedSectionContainer />
          </View>

          <View style={{ height: FILTERBAR_HEIGHT }}>
            <FilterBar
              options={['Tümü', 'Takip Edilenler']}
              defaultSelected="Senin İçin"
              onIconPress={handleScrollToProductArea}
            />
          </View>

          <View style={styles.section}>
            <CategoryArea title="Kategoriler" items={HOME_CATEGORIES} />
          </View>

          {areas.map(({ key, title, items }) => (
            <View style={styles.section} key={key}>
              <ProductArea title={title} items={items} />
            </View>
          ))}

          <View style={{ height: EXTRA_SCROLL_HEIGHT }} />
        </Animated.ScrollView>

        <UserMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          onNavigateToSellerForm={() => {
            setMenuVisible(false);
            // @ts-ignore
            navigation.navigate('SellerStepOne');
          }}
          onSelectPanel={(panelName) => setActivePanel(panelName)}
          selectedPanel={activePanel}
          setSelectedPanel={setActivePanel}
        />
      </View>

      <CartPanel visible={cartVisible} onClose={() => setCartVisible(false)} />
      <NotificationPanel visible={notificationVisible} onClose={() => setNotificationVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  // Not: Tasarımın gereği beyaz zemin istiyorsan bırak; bar gerçekten şeffafsa kartlar kayarken barın arkasında görünecek.
  fullscreen: { flex: 1, backgroundColor: '#FFFFFF' },
  topBoxWrapper: { position: 'absolute', top: 0, left: 0, right: 0, height: TOPBOX_HEIGHT, zIndex: 10, elevation: 10 },
  container: { flex: 1 },
  section: { width: SCREEN_W },
});
