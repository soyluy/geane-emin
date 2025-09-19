import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SCREEN_W = Dimensions.get('screen').width;

type AddressCardProps = {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
  selected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function AddressCard({
  fullName,
  phone,
  city,
  district,
  fullAddress,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
}: AddressCardProps) {
  return (
    <View style={styles.wrapper}>
      {/* Sağ üstte ikonlar ve seçim butonu */}
      <View style={styles.actionWrapper}>
        {onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.icon}>
            <MaterialIcons name="edit" size={20} color="#333" />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.icon}>
            <MaterialIcons name="delete" size={20} color="#333" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.selectButton} onPress={onSelect} activeOpacity={0.7}>
          <View
            style={[
              styles.circleOuter,
              selected && styles.circleSelected,
            ]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.addressBox}>
        <Text style={styles.line}>{fullName}</Text>
        <Text style={styles.line}>{phone}</Text>
        <Text style={styles.line}>{city} / {district}</Text>
        <Text style={styles.line}>{fullAddress}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 14,
  },
  actionWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
  },
  icon: {
    padding: 2,
  },
  selectButton: {
    padding: 4,
  },
  circleOuter: {
    width: 16,
    height: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  circleSelected: {
    backgroundColor: '#F13957',
    borderColor: '#F13957',
  },
  addressBox: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  line: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
});
