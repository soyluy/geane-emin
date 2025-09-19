import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProductKunye from './ProductKunye';
import ProductDescription from './ProductDescription';
import FieldHeader from './FieldHeader';
import ProductColorSelector from './ProductColorSelector';
import ProductSizeSelector from './ProductSizeSelector';

interface ProductDetailPanelProps {
  imageUri: string;
  title: string;
  description?: string;
  imageHeight: number;
  onAdd: () => void;
}

export default function ProductDetailPanel({
  imageUri,
  title,
  description,
  imageHeight,
  onAdd,
}: ProductDetailPanelProps) {
  const PANEL_BORDER_RADIUS = 15;
  const PANEL_OVERLAP = imageHeight * 0.0155;

  const colorOptions = [
    { name: 'Siyah', imageUri: 'https://via.placeholder.com/150/000000' },
    { name: 'Kırmızı', imageUri: 'https://via.placeholder.com/150/F13957' },
    { name: 'Bej', imageUri: 'https://via.placeholder.com/150/EAD8C0' },
  ];

  const sizeOptions = [
    { label: 'XS', value: 'xs' },
    { label: 'S', value: 's' },
    { label: 'M', value: 'm' },
    { label: 'L', value: 'l' },
    { label: 'XL', value: 'xl' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          marginTop: -PANEL_OVERLAP,
          borderTopLeftRadius: PANEL_BORDER_RADIUS,
          borderTopRightRadius: PANEL_BORDER_RADIUS,
          borderBottomLeftRadius: PANEL_BORDER_RADIUS,
          borderBottomRightRadius: PANEL_BORDER_RADIUS,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.15)',
        },
      ]}
    >
      <ProductKunye imageUri={imageUri} title={title} onAdd={onAdd} />
      <ProductDescription description={description} />
      <FieldHeader title="Renk Seçenekleri" variant="product" hideIcon />
      <ProductColorSelector colorOptions={colorOptions} />
      <FieldHeader title="Beden" note="*seçim yapınız" variant="product" hideIcon />
      <ProductSizeSelector sizeOptions={sizeOptions} />
      <FieldHeader title="Ürün Detayları" variant="product" />
      <FieldHeader title="Beden Tablosu" variant="product" />
      <FieldHeader title="Mağaza Değerlendirmeleri" variant="product" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
});
