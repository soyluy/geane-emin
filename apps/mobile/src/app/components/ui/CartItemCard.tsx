// mobile/src/app/components/ui/CartItemCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  imageUri?: string;
  sellerName?: string;
  sellerLogo?: string;
};

type CartItemCardProps = CartItem & {
  onRemove?: () => void;
  onQuantityChange?: (newQuantity: number) => void;
  selected?: boolean;
  selectedIndex?: number;
  onToggleSelect?: () => void;
  variant?: 1 | 2;

  /** Sipariş durumu için aktif adım (0: Alındı, 1: Hazırlanıyor, 2: Kargoda, 3: Teslim Edildi) */
  statusStep?: number;
};

const ORDER_STEPS = ['Alındı', 'Hazırlanıyor', 'Kargoda', 'Teslim Edildi'];

export default function CartItemCard({
  name,
  price,
  quantity,
  color,
  size,
  imageUri,
  sellerName = 'Mağaza Adı',
  sellerLogo = 'https://via.placeholder.com/24',
  onRemove,
  onQuantityChange,
  selected = true,
  selectedIndex,
  onToggleSelect,
  variant = 1,
  statusStep = 0,
}: CartItemCardProps) {
  // Tam ekran (status + nav bar DAHİL) taban
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

  const CARD_HEIGHT = variant === 1 ? SCREEN_H * 0.30 : SCREEN_H * 0.29;
  const CARD_WIDTH = variant === 1 ? '100%' : SCREEN_W * 0.72;

  const IMAGE_H = CARD_HEIGHT * (variant === 1 ? 0.7 : 0.6);
  const IMAGE_W = IMAGE_H * 0.75;
  const total = price * quantity;

  return (
    <View
      style={[
        styles.card,
        variant === 2 && styles.cardVariant2,
        {
          height: CARD_HEIGHT,
          width: CARD_WIDTH,
        },
      ]}
    >
      <View style={styles.sellerRow}>
        <Image source={{ uri: sellerLogo }} style={styles.sellerLogo} />
        <Text style={styles.sellerName}>{sellerName}</Text>
        <TouchableOpacity onPress={onToggleSelect} style={styles.selectButton}>
          <View
            style={[
              styles.circleOuter,
              selected && { backgroundColor: '#F13957', borderColor: '#F13957' },
            ]}
          >
            {selected ? (
              <Text style={styles.circleText}>{selectedIndex}</Text>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.contentRow, variant === 2 && styles.centeredContent]}>
        <Image
          source={{ uri: imageUri || 'https://via.placeholder.com/110' }}
          style={[styles.image, { width: IMAGE_W, height: IMAGE_H }]}
          resizeMode="cover"
        />

        <View
          style={[
            styles.info,
            { height: IMAGE_H },
            variant === 2 && styles.centeredInfo,
          ]}
        >
          <Text style={styles.name} numberOfLines={2}>{name}</Text>

          {variant === 2 ? (
            <View style={styles.detailColumn}>
              <Text style={styles.detail}>Beden: {size}</Text>
              <Text style={styles.detail}>Renk: {color}</Text>
            </View>
          ) : (
            <Text style={styles.detail}>
              Beden: {size}   •   Renk: {color}
            </Text>
          )}

          <View style={styles.priceBlock}>
            <Text style={styles.price}>{total.toFixed(2)} ₺</Text>
            <Text style={styles.unitPrice}>
              {price.toFixed(2)} TL x {quantity}
            </Text>
          </View>
        </View>

        {onRemove && (
          <View style={[styles.removeWrapper, { height: IMAGE_H }]}>
            <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
              <Text style={styles.removeText}>×</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* İlerleme çubuğu */}
      {variant === 2 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressLine} />
          <View style={styles.progressDots}>
            {ORDER_STEPS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index <= statusStep && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
          <View style={styles.progressLabels}>
            {ORDER_STEPS.map((label, index) => (
              <Text key={index} style={styles.progressLabel}>{label}</Text>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginVertical: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardVariant2: {
    marginHorizontal: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  sellerLogo: {
    width: 24,
    height: 24,
    borderRadius: 13,
    backgroundColor: '#BDBDBD',
    marginRight: 10,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  selectButton: {
    position: 'absolute',
    right: 0,
    top: -2,
    padding: 6,
  },
  circleOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#000',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  contentRow: {
    flexDirection: 'row',
  },
  centeredContent: {
    alignItems: 'center',
  },
  image: {
    borderRadius: 10,
    backgroundColor: '#EEE',
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  centeredInfo: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  detailColumn: {
    marginTop: 4,
  },
  detail: {
    fontSize: 12,
    color: '#777',
    lineHeight: 16,
  },
  priceBlock: {
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#303336',
  },
  unitPrice: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  removeWrapper: {
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  removeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    fontSize: 24,
    color: '#888',
  },
  progressContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  progressLine: {
    position: 'absolute',
    top: 10,
    height: 2,
    backgroundColor: '#E0E0E0',
    width: '80%',
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 4,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  progressDotActive: {
    backgroundColor: '#F13957',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  progressLabel: {
    fontSize: 10,
    color: '#555',
  },
});
