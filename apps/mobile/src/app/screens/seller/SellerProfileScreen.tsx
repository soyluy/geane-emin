// SellerProfileScreen.tsx

import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

import BackButton from '../../components/ui/BackButton';
import SellerProfileKunye from '../../components/ui/SellerProfileKunye';
import CollectionArea from '../../components/ui/CollectionArea';
import FieldHeader from '../../components/ui/FieldHeader';
import CategoryStrip from '../../components/ui/CategoryStrip';
import AllPosts from '../../components/ui/AllPosts';
import { fakeProducts } from '../../data/fakeData'; // ✅ Ürünler import edildi

const { height: SCREEN_H } = Dimensions.get('screen');

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

export default function SellerProfileScreen() {
  return (
    <View style={styles.container}>
      <BackButton />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SellerProfileKunye />

        <CollectionArea
          title="Satıcının Koleksiyonları"
          items={collectionData}
          onPressItem={(item) => {
            console.log('Koleksiyon seçildi:', item.title);
          }}
        />

        <FieldHeader title="Kategoriler" />

        <CategoryStrip />

        {/* ✅ AllPosts bileşeni fakeProducts ile çağrıldı */}
        <AllPosts title="Tüm Ürünler" items={fakeProducts} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: SCREEN_H * 0.08, // BackButton kadar boşluk bırak
  },
});
