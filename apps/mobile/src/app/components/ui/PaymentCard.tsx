import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const SCREEN_W = Dimensions.get('screen').width;
const CARD_WIDTH = SCREEN_W * 0.65;
const CARD_HEIGHT = CARD_WIDTH * 0.58;

type PaymentCardProps = {
  maskedNumber: string;
  expiry: string;
  ownerMasked: string;
  cardType: string;
  selected?: boolean;
  onSelect?: () => void;
};

export default function PaymentCard({
  maskedNumber,
  expiry,
  ownerMasked,
  cardType,
  selected = false,
  onSelect,
}: PaymentCardProps) {
  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.85}
      style={[
        styles.card,
        selected && styles.selectedCard,
      ]}
    >
      <View style={styles.topRow}>
        <Text style={styles.cardNumber}>{maskedNumber}</Text>
        <View
          style={[
            styles.radio,
            selected && styles.radioSelected,
          ]}
        />
      </View>

      <Text style={styles.expiry}>{expiry}</Text>
      <Text style={styles.owner}>{ownerMasked}</Text>
      <Text style={styles.type}>{cardType}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#DDD',
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderColor: '#F13957',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  expiry: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
  },
  owner: {
    fontSize: 14,
    color: '#1C1C1E',
    marginTop: 6,
  },
  type: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    fontSize: 13,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#333',
    backgroundColor: '#fff',
  },
  radioSelected: {
    backgroundColor: '#F13957',
    borderColor: '#F13957',
  },
});
