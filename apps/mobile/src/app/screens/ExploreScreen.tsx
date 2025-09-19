import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';

import DiscoverSearchBar from '../components/ui/DiscoverSearchBar';
import TopBox from '../components/ui/TopBox';
import FilterBar from '../components/ui/FilterBar';
import ImportantThingsCardsArea, { Card } from '../components/ui/ImportantThingsCardsArea';
import CollectionArea from '../components/ui/CollectionArea';
import CurationArea from '../components/ui/CurationArea';
import UserMenu from '../components/ui/UserMenu';
import CartPanel from '../components/ui/CartPanel';
import NotificationPanel from '../components/ui/NotificationPanel';

import { useCartVisibility } from '../navigation/CartVisibilityContext';
import { useNotificationVisibility } from '../navigation/NotificationVisibilityContext';

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('screen');
const TOPBOX_HEIGHT = SCREEN_H * 0.08698;
const EXTRA_SCROLL_HEIGHT = SCREEN_H * 0.15;

export default function ExploreScreen() {
  const scrollRef = useRef<Animated.ScrollView>(null);
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const lastOffsetY = useRef(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const { cartVisible, setCartVisible } = useCartVisibility();
  const { notificationVisible, setNotificationVisible } = useNotificationVisibility();

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const dy = y - lastOffsetY.current;
    const THRESHOLD = 10;

    if (dy > THRESHOLD && headerVisible) {
      Animated.timing(translateYAnim, {
        toValue: -TOPBOX_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setHeaderVisible(false);
    } else if (dy < -THRESHOLD && !headerVisible) {
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setHeaderVisible(true);
    }

    lastOffsetY.current = y;
  };

  const importantData: Card[] = [
    {
      title: 'Haftanın Enleri',
      imageUri: require('../../../assets/images/important-things/haftanin-enleri.jpg'),
    },
    {
      title: 'Keşif',
      imageUri: require('../../../assets/images/important-things/kesif.jpg'),
    },
    {
      title: 'Kombinler',
      imageUri: require('../../../assets/images/important-things/Kombinler.jpg'),
    },
  ];

  const collectionData = Array.from({ length: 12 }, (_, i) => ({
    id: `col-${i}`,
    title: `Koleksiyon ${i + 1}`,
    subtitle: '2025 Sezonu',
    note: 'Popüler Seçim',
    imageUris: [
      'https://via.placeholder.com/150/1',
      'https://via.placeholder.com/150/2',
      'https://via.placeholder.com/150/3',
    ],
  }));

  const curationData = Array.from({ length: 10 }, (_, i) => ({
    id: `cur-${i}`,
    title: `Kürasyon ${i + 1}`,
    imageUri: `https://via.placeholder.com/300?text=Kürasyon+${i + 1}`,
  }));

  return (
    <View style={styles.fullscreen}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Animated.View
        style={[
          styles.topBoxWrapper,
          { transform: [{ translateY: translateYAnim }] },
        ]}
      >
        <TopBox
          title="Keşfet"
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
        onScroll={handleScroll}
      >
        <DiscoverSearchBar />

        <FilterBar
          options={[
            'Tümü',
            'Kategoriler',
            'Yaşam Tarzları',
            'Etkinlikler',
            'Koleksiyonlar',
            'Stiller',
            'Moda ve Trendler',
          ]}
          defaultSelected="Tümü"
        />

        <ImportantThingsCardsArea data={importantData} />

        <CollectionArea
          title="#Öne Çıkan Koleksiyonlar"
          items={collectionData}
        />

        <CurationArea title="#Yaşam Tarzları" items={curationData} />
        <CurationArea title="#Stiller" items={curationData} />
        <CurationArea title="#Etkinlikler" items={curationData} />
        <CurationArea title="#Moda ve Tredler" items={curationData} />

        <View style={{ height: EXTRA_SCROLL_HEIGHT }} />
      </Animated.ScrollView>

      <UserMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigateToSellerForm={() => {
          console.log('Satıcı Başvurusuna yönlendirildi');
        }}
      />

      <CartPanel
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
      />

      <NotificationPanel
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBoxWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: TOPBOX_HEIGHT,
    zIndex: 10,
    elevation: 10,
  },
  container: {
    flex: 1,
  },
});
