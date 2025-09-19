import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import FieldHeader from './FieldHeader';
import CartItemCard from './CartItemCard';

export default function MyOrdersCard() {
  const mockOrders = [
    {
      id: 'order1',
      name: 'Oversize Tişört',
      price: 499,
      quantity: 1,
      color: 'Gri',
      size: 'M',
      imageUri: 'https://via.placeholder.com/110',
      sellerName: 'CoolBrand',
      sellerLogo: 'https://via.placeholder.com/24',
    },
    {
      id: 'order2',
      name: 'Deri Ceket',
      price: 1704,
      quantity: 1,
      color: 'Siyah',
      size: 'L',
      imageUri: 'https://via.placeholder.com/110',
      sellerName: 'LeatherWorks',
      sellerLogo: 'https://via.placeholder.com/24',
    },
  ];

  return (
    <View style={styles.container}>
      <FieldHeader
        variant={2}
        title="2. Sipariş No: GEA- 20250805-001"
        hideIcon={true}
        style={styles.header}
      />

      <Text style={styles.infoText}>
        05.08.2025 tarihinde{' '}
        <Text style={styles.bold}>3</Text> ürün aldınız.
      </Text>
      <Text style={styles.infoText}>
        Toplam <Text style={styles.bold}>₺2.203.00</Text>
      </Text>

      {/* Yatay scroll ile kartlar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardScroll}
      >
        {mockOrders.map((item, index) => (
          <CartItemCard
            key={item.id}
            {...item}
            variant={2}
            selectedIndex={index + 1}
            onToggleSelect={() => {}}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    width: '100%',
    marginBottom: 0,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 17,
    color: '#000',
    marginTop: 8,
    marginLeft: '5%',
    textAlign: 'left',
  },
  bold: {
    fontFamily: 'Inter-SemiBold',
  },
  cardScroll: {
    paddingVertical: 16,
    paddingLeft: 0,
    gap: 0,
  },
});
