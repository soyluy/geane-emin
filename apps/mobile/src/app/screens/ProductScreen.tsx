import React, { useState } from 'react';
import { StatusBar, View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import BackButton from '../components/ui/BackButton';
import ProductImageCarousel from '../components/ui/ProductImageCarousel';
import ProductDetailPanel from '../components/ui/ProductDetailPanel';
import ProductArea from '../components/ui/ProductArea';
import SaveToListPanel from '../components/ui/SaveToListPanel';
import { fakeProducts } from '../data/fakeData';

// Tip tanımları
type RootStackParamList = {
  Product: { images: string[]; price: string; title: string };
};

type ProductScreenRouteProp = RouteProp<RootStackParamList, 'Product'>;
type ProductScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Product'>;

export default function ProductScreen() {
  const navigation = useNavigation<ProductScreenNavigationProp>();
  const route = useRoute<ProductScreenRouteProp>();
  const { images, price, title } = route.params;
  const [imageHeight, setImageHeight] = useState<number>(0);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <View onLayout={e => setImageHeight(e.nativeEvent.layout.height)}>
          <ProductImageCarousel imageUris={images} price={price} />
        </View>

        <BackButton onPress={() => navigation.goBack()} />

        {imageHeight > 0 && (
          <>
            <ProductDetailPanel
              imageUri={images[0]}
              title={title}
              description="Bu açıklama metin, örnek olarak yazılmıştır. Backend uçları bağlanana kadar burada ürün açıklamasının nasıl göründüğünü görebilmek için bu metin yazılmıştır."
              imageHeight={imageHeight}
              onAdd={() => setIsPanelVisible(true)}
            />
            <ProductArea title="Beğendiklerin ile Benzer" items={fakeProducts} />
            <ProductArea title="Öne Çıkan Ürünler" items={fakeProducts} />
          </>
        )}
      </ScrollView>

      {/* Panel alttan açılır, yukarı kaydırılınca genişler, aşağı çekilince kapanır */}
      <SaveToListPanel visible={isPanelVisible} onClose={() => setIsPanelVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingBottom: 120, // ✅ Navigation bar için ekstra boşluk (MainScreen gibi)
    backgroundColor: '#fff',
  },
  backButtonWrapper: {
    position: 'absolute',
    top: (StatusBar.currentHeight || 0) + 8,
    left: 16,
    zIndex: 10,
  },
});