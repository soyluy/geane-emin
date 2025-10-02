// src/app/screens/MainScreen.tsx
import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, Platform, StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { useCartVisibility } from '../navigation/CartVisibilityContext';
import { useNotificationVisibility } from '../navigation/NotificationVisibilityContext';
import { useUserMenuVisibility } from '../navigation/UserMenuVisibilityContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TopBox from '../components/ui/TopBox';
import LikedSectionContainer, { LIKED_SECTION_HEIGHT } from '../components/ui/LikedSectionContainer';
import FilterBar, { FILTERBAR_HEIGHT } from '../components/ui/FilterBar';
import ProductArea from '../components/ui/ProductArea';
import CategoryArea from '../components/ui/CategoryArea';

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
  const { userMenuVisible, setUserMenuVisible } = useUserMenuVisibility();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const translateYAnim = useRef(new Animated.Value(0)).current;
  const lastOffsetY = useRef(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const scrollRef = useRef<Animated.ScrollView>(null);

  const areas = useHomeProductAreas();
  
  // Debug: areas değerini kontrol et
  console.log('MainScreen areas:', areas);

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
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle="dark-content" 
      />
      <View style={styles.fullscreen}>
        <Animated.View style={[styles.topBoxWrapper, { transform: [{ translateY: translateYAnim }] }]}>
          <TopBox
            title="Ana Sayfa"
            onMenuPress={() => setUserMenuVisible(true)}
            onCartPress={() => setCartVisible(true)}
            onNotificationPress={() => setNotificationVisible(true)}
          />
        </Animated.View>

        <Animated.ScrollView
          ref={scrollRef}
          style={styles.container}
          contentContainerStyle={{ 
            paddingTop: TOPBOX_HEIGHT,
            paddingBottom: EXTRA_SCROLL_HEIGHT + 100 // ✅ Navigation bar için ek boşluk
          }}
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

          {Array.isArray(areas) && areas.length > 0 && areas.map(({ key, title, items }) => (
            <View style={styles.section} key={key}>
              <ProductArea title={title} items={items || []} />
            </View>
          ))}

          <View style={{ height: EXTRA_SCROLL_HEIGHT }} />
        </Animated.ScrollView>

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
