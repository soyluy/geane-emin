import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import TopBox from '../components/ui/TopBox';
import UserMenu from '../components/ui/UserMenu';
import CartPanel from '../components/ui/CartPanel';
import NotificationPanel from '../components/ui/NotificationPanel'; // ✅ EKLENDİ

import ProfileCard from '../components/ui/ProfileCard';
import CurationArea from '../components/ui/CurationArea';
import CollectionArea from '../components/ui/CollectionArea';
import ProductArea from '../components/ui/ProductArea';

import { useCartVisibility } from '../navigation/CartVisibilityContext';
import { useNotificationVisibility } from '../navigation/NotificationVisibilityContext'; // ✅ EKLENDİ

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');
const TOPBOX_HEIGHT = SCREEN_H * 0.08698;

export default function SavedScreen() {
  const navigation = useNavigation();
  const { cartVisible, setCartVisible } = useCartVisibility();
  const { notificationVisible, setNotificationVisible } = useNotificationVisibility(); // ✅ EKLENDİ

  const [menuVisible, setMenuVisible] = useState(false);

  const translateYAnim = useRef(new Animated.Value(0)).current;
  const lastOffsetY = useRef(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const scrollRef = useRef<Animated.ScrollView>(null);

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

  const curationItems = [
    {
      id: 'cur1',
      title: 'Yaz Ruhu',
      image: { uri: 'https://via.placeholder.com/300x200.png?text=Kürasyon+1' },
    },
    {
      id: 'cur2',
      title: 'Minimal Günlük',
      image: { uri: 'https://via.placeholder.com/300x200.png?text=Kürasyon+2' },
    },
    {
      id: 'cur3',
      title: 'Parti Stili',
      image: { uri: 'https://via.placeholder.com/300x200.png?text=Kürasyon+3' },
    },
  ];

  const collectionItems = [
    {
      id: 'col1',
      title: 'Yazlık Elbiseler',
      subtitle: 'Favori parçalar',
      note: '12 ürün',
      imageUris: [
        'https://via.placeholder.com/300x300.png?text=Elbise+1',
        'https://via.placeholder.com/300x300.png?text=Elbise+2',
        'https://via.placeholder.com/300x300.png?text=Elbise+3',
      ],
    },
    {
      id: 'col2',
      title: 'Ofis Şıklığı',
      subtitle: 'Modern klasikler',
      note: '10 ürün',
      imageUris: [
        'https://via.placeholder.com/300x300.png?text=Ofis+1',
        'https://via.placeholder.com/300x300.png?text=Ofis+2',
        'https://via.placeholder.com/300x300.png?text=Ofis+3',
      ],
    },
    {
      id: 'col3',
      title: 'Denim Dünyası',
      subtitle: 'Klasik ve cool',
      note: '6 ürün',
      imageUris: [
        'https://via.placeholder.com/300x300.png?text=Denim+1',
        'https://via.placeholder.com/300x300.png?text=Denim+2',
        'https://via.placeholder.com/300x300.png?text=Denim+3',
      ],
    },
  ];

  const productItems = [
    {
      id: 'prod1',
      title: 'Linen Gömlek',
      price: 499,
      imageUrls: ['https://via.placeholder.com/300x300.png?text=Ürün+1'],
      category: 'Gömlek',
    },
    {
      id: 'prod2',
      title: 'Oversize T-shirt',
      price: 299,
      imageUrls: ['https://via.placeholder.com/300x300.png?text=Ürün+2'],
      category: 'T-shirt',
    },
    {
      id: 'prod3',
      title: 'Triko Crop',
      price: 399,
      imageUrls: ['https://via.placeholder.com/300x300.png?text=Ürün+3'],
      category: 'Üst',
    },
  ];

  return (
    <>
      {(cartVisible || notificationVisible) && (
        <StatusBar backgroundColor="rgba(0,0,0,0.4)" barStyle="light-content" animated />
      )}
      <View style={{ flex: 1 }}>
        <View style={styles.fullscreen}>
          <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

          <Animated.View
            style={[
              styles.topBoxWrapper,
              { transform: [{ translateY: translateYAnim }] },
            ]}
          >
            <TopBox
              title="Kaydedilenler"
              onMenuPress={() => setMenuVisible(true)}
              onCartPress={() => setCartVisible(true)}
              onNotificationPress={() => setNotificationVisible(true)} // ✅ EKLENDİ
            />
          </Animated.View>

          <Animated.ScrollView
            ref={scrollRef}
            style={styles.container}
            contentContainerStyle={{ paddingTop: TOPBOX_HEIGHT }}
            scrollEventThrottle={16}
            onScroll={handleScroll}
          >
            <ProfileCard
              profileImage="https://via.placeholder.com/150"
              fullName="İrem Aydın"
              followerCount="10,8B"
              followingCount="158"
              badgeText="10B"
              isOwnProfile={true}
              onEditPress={() => console.log("Düzenle")}
              onMenuPress={() => {}}
            />

            <CurationArea title="Kaydedilen Kürasyonlar" items={curationItems} />
            <CollectionArea title="Kaydedilen Koleksiyonlar" items={collectionItems} />
            <ProductArea title="Kaydedilen Ürünler" items={productItems} />
          </Animated.ScrollView>

          <UserMenu
            visible={menuVisible}
            onClose={() => setMenuVisible(false)}
            onNavigateToSellerForm={() =>
              navigation.navigate('SellerStepOne')
            }
          />

          <CartPanel
            visible={cartVisible}
            onClose={() => setCartVisible(false)}
          />
        </View>
      </View>

      <NotificationPanel
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
