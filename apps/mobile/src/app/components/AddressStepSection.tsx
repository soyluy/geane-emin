import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Dimensions, StyleSheet } from 'react-native';
import AddressCard from './ui/AddressCard';
import FieldHeader from './ui/FieldHeader';

const { width: SCREEN_W } = Dimensions.get('screen');

interface AddressStepSectionProps {
  title: string;
}

// Mock data - gerçek projede API'den gelecek
const mockAddresses = [
  {
    title: 'Ev Adresim',
    address: 'Mustafa Kemal Mah. Atatürk Cad. No:123 Daire:5',
    district: 'Çankaya/Ankara'
  },
  {
    title: 'İş Adresim', 
    address: 'Kızılay Mah. Gazi Mustafa Kemal Blv. No:456',
    district: 'Çankaya/Ankara'
  }
];

export default function AddressStepSection({ title }: AddressStepSectionProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <View style={styles.addressWrapper}>
      <FieldHeader title={title} hideIcon={true} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.scrollContainer}
      >
        {mockAddresses.map((addr, index) => (
          <View
            key={index}
            style={[
              styles.cardSpacing,
              index === 0 && { marginLeft: SCREEN_W * 0.03953 },
            ]}
          >
            <AddressCard {...addr} />
          </View>
        ))}
      </ScrollView>

      {/* Farklı adres butonu (sabit, scroll'dan bağımsız) */}
      <TouchableOpacity
        style={styles.changeButton}
        onPress={() => setShowForm(true)}
      >
        <Text style={styles.changeText}>Farklı bir adres kullan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  addressWrapper: {
    marginBottom: 20,
  },
  scrollContainer: {
    paddingRight: SCREEN_W * 0.03953,
  },
  cardSpacing: {
    marginRight: SCREEN_W * 0.02,
  },
  changeButton: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  changeText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter_400Regular',
  },
});
