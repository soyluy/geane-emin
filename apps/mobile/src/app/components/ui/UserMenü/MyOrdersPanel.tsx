// mobile/src/app/components/ui/UserMenü/MyOrdersPanel.tsx
import React, { useMemo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity, Modal, Animated } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');
const LEFT_PAD = SCREEN_W * 0.05813;
const RIGHT_PAD = SCREEN_W * 0.03953;
const V_GAP = SCREEN_H * 0.02467;
const COL_GAP = SCREEN_W * 0.02467;
const H_IMAGE_W = SCREEN_W * 0.27906;
const H_IMAGE_H = SCREEN_H * 0.21459;

import KebabIcon from '../../../../../assets/icons/nav/Kebab-menu.svg';
import { productsReady } from '../../../data/ProductData/ready/Ready';

interface Props {
  onClose: () => void;
}

const SimpleProductCard = React.memo(({ product }: { product: any }) => {
  const imageUrl = product.images?.[0]?.url || product.imageUrls?.[0] || '';
  return (
    <TouchableOpacity activeOpacity={0.8}>
      <Image
        source={{ uri: imageUrl }}
        style={{ width: H_IMAGE_W, height: H_IMAGE_H, borderRadius: 8 }}
        resizeMode="cover"
      />
      <View style={{ width: H_IMAGE_W }}>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.horizontalTitleText}>
          {product.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default function MyOrdersPanel(_: Props) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  console.log('MyOrdersPanel render - menuVisible:', menuVisible, 'selectedOrderId:', selectedOrderId);

  const rows = useMemo(() => {
    const list = productsReady.slice(0, 8);
    return list.map((p: any, idx: number) => ({
      id: p.id ?? String(idx),
      sequence: list.length - idx,
      product: p,
    }));
  }, []);

  const renderItem = useCallback(({ item }: any) => {
    // Kalan alan hesaplama
    const availableWidth = SCREEN_W - LEFT_PAD - RIGHT_PAD - H_IMAGE_W;
    const detailW = availableWidth - (COL_GAP * 2); // Sol ve sağ boşluk
    const cellH = H_IMAGE_H / 4;

    const handleKebabPress = () => {
      console.log('Kebab menü tıklandı, item ID:', item.id);
      setSelectedOrderId(item.id);
      setMenuVisible(true);
    };

    return (
      <View style={styles.block}>
        <View style={styles.headerRow}>
          <Text style={styles.sequenceText}>{item.sequence}.</Text>
          <TouchableOpacity 
            onPress={handleKebabPress} 
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{ 
              padding: 5,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text style={{ fontSize: 22, color: '#374151' }}>⋮</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.row, { paddingLeft: LEFT_PAD, paddingRight: RIGHT_PAD }]}>
          <SimpleProductCard product={item.product} />

          {/* Sipariş detayları - biraz daha sola çekilmiş */}
          <View style={[styles.detailsContainer, { 
            height: H_IMAGE_H, 
            width: detailW, 
            marginLeft: COL_GAP * 0.6,  // %40 azaltıldı
            marginRight: COL_GAP * 1.4  // %40 artırıldı
          }]}>
            {/* 1. Satır */}
            <View style={[styles.detailCell, { height: cellH }]}>
              <Text style={styles.detailText}>Sipariş Tarihi :</Text>
              <Text style={[styles.detailText, { marginTop: 1 }]}>00.00.0000</Text>
            </View>

            {/* 2. Satır */}
            <View style={[styles.detailCell, { height: cellH }]}>
              <Text style={styles.detailText}>Tedarikçi :</Text>
              <Text style={[styles.detailText, { marginTop: 1 }]}>RetroBird</Text>
            </View>

            {/* 3. Satır */}
            <View style={[styles.detailCell, { height: cellH }]}>
              <Text style={styles.detailText}>Toplam Tutar :</Text>
              <Text style={[styles.detailText, { marginTop: 1 }]}>₺0,00</Text>
            </View>

            {/* 4. Satır */}
            <View style={[styles.detailCell, { height: cellH }]}>
              <Text style={styles.detailText}>Durum :</Text>
              <Text style={[styles.detailText, { marginTop: 1 }]}>
                00.00.0000 tarihinde kargolandı
              </Text>
            </View>
          </View>
        </View>

        {/* Carousel Indicator Topları - Panel ortasında yatay ortalı */}
        <View style={[styles.indicatorContainer, { 
          marginTop: SCREEN_H * 0.01072,
        }]}>
          <View style={[styles.indicatorDot, styles.indicatorActive]} />
          <View style={[styles.indicatorDot, styles.indicatorInactive]} />
          <View style={[styles.indicatorDot, styles.indicatorInactive]} />
        </View>
      </View>
    );
  }, [setSelectedOrderId, setMenuVisible]);

  // Menü seçenek handler'ları
  const handleMenuOption = (option: string) => {
    setMenuVisible(false);
    setSelectedOrderId(null);
    
    switch (option) {
      case 'ask_seller':
        console.log('Satıcıya Sor seçildi, sipariş ID:', selectedOrderId);
        break;
      case 'customer_service':
        console.log('Geane Müşteri Hizmetleri seçildi, sipariş ID:', selectedOrderId);
        break;
      case 'return_request':
        console.log('İade Talebi seçildi, sipariş ID:', selectedOrderId);
        break;
      case 'download_invoice':
        console.log('Fatura İndir seçildi, sipariş ID:', selectedOrderId);
        break;
    }
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedOrderId(null);
  };

  // Yaklaşık satır yüksekliği: fotoğraf + başlık + indicator + boşluklar
  const ROW_HEIGHT = H_IMAGE_H + 8 /* başlık */ + (SCREEN_H * 0.01072) + 8 /* indicator */ + V_GAP + 12;
  const getItemLayout = useCallback((_: any, i: number) => ({
    length: ROW_HEIGHT,
    offset: ROW_HEIGHT * i,
    index: i,
  }), []);

  return (
    <View style={styles.container}>
      <FlatList
        data={rows}
        keyExtractor={(x) => x.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={4}
        initialNumToRender={4}
        windowSize={7}
        getItemLayout={getItemLayout}
        keyboardShouldPersistTaps="handled" // Dokunmaların geçmesini sağla
      />

      {/* Seçenek Menüsü Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeMenu}
        >
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Sipariş İşlemleri</Text>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => handleMenuOption('ask_seller')}
            >
              <Text style={styles.menuItemText}>📞 Satıcıya Sor</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => handleMenuOption('customer_service')}
            >
              <Text style={styles.menuItemText}>🎧 Geane Müşteri Hizmetleri</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => handleMenuOption('return_request')}
            >
              <Text style={styles.menuItemText}>↩️ İade Talebi</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, styles.lastMenuItem]} 
              onPress={() => handleMenuOption('download_invoice')}
            >
              <Text style={styles.menuItemText}>📄 Fatura İndir</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={closeMenu}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

/* — Styles — */
const DETAIL_FONT_SIZE = 11;
const DETAIL_LETTER_SPACING = DETAIL_FONT_SIZE * 0.02; // %2

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  block: { paddingTop: 8, paddingBottom: 12 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: LEFT_PAD,
    paddingRight: RIGHT_PAD,
  },
  sequenceText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  row: { marginTop: V_GAP, flexDirection: 'row', alignItems: 'flex-start' },
  detailsContainer: { justifyContent: 'space-between' }, // Eşit dağıtım
  detailCell: { justifyContent: 'center', alignItems: 'center' },
  detailText: {
    fontSize: DETAIL_FONT_SIZE,
    fontFamily: 'Inter-SemiBold',
    color: '#303336',
    textAlign: 'center',
    letterSpacing: DETAIL_LETTER_SPACING,
  },
  horizontalTitleText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#303336',
    marginTop: 8,
    lineHeight: 14,
    width: '100%',
  },
  // Carousel Indicator Topları
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center', // Yatay ortalama
    gap: 8, // Toplar arası 8px boşluk
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
  },
  indicatorActive: {
    backgroundColor: '#F13957', // Aktif top rengi
  },
  indicatorInactive: {
    backgroundColor: '#D9D9D9', // Pasif top rengi
  },
  // Seçenek Menüsü Stilleri
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    width: '100%',
    maxWidth: SCREEN_W * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    textAlign: 'left',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    textAlign: 'center',
  },
});
