import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';

import TextField from './ui/TextField';
import AddressCard from './ui/AddressCard';
import FieldHeader from './ui/FieldHeader';
import Button from './ui/Button';

const SCREEN_W = Dimensions.get('screen').width;

// Snap + ikinci kart görünsün ayarları
const SIDE = SCREEN_W * 0.03953;   // sol/sağ kenar boşluğu
const GAP = 14;                    // kartlar arası boşluk
const CARD_W = SCREEN_W * 0.65;    // kart genişliği

type Props = {
  mode?: 'shipping' | 'billing';
};

const initialAddresses = [
  {
    fullName: 'Emin Sarp',
    phone: '+90 532 000 00 00',
    city: 'İstanbul',
    district: 'Kadıköy',
    fullAddress: 'Moda Mah. Örnek Sok. No:5 D:3',
  },
  {
    fullName: 'Ayşe Yılmaz',
    phone: '+90 542 123 45 67',
    city: 'Ankara',
    district: 'Çankaya',
    fullAddress: 'Atatürk Blv. No:10',
  },
  {
    fullName: 'Ali Demir',
    phone: '+90 555 987 65 43',
    city: 'İzmir',
    district: 'Konak',
    fullAddress: 'Kordon Caddesi No:1',
  },
];

export default function AddressSection({ mode = 'shipping' }: Props) {
  const [hasAddress, setHasAddress] = useState(true);
  const [showForm, setShowForm] = useState(!hasAddress);
  const [addresses, setAddresses] = useState(initialAddresses);

  const scrollRef = useRef<ScrollView>(null);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    city: '',
    district: '',
    fullAddress: '',
  });

  const handleInput = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const title = mode === 'billing' ? 'Fatura Adresiniz' : 'Teslimat Adresiniz';
  const addButtonText =
    mode === 'billing'
      ? 'Yeni bir fatura adresi ekle'
      : 'Yeni bir teslimat adresi ekle';

  const scrollToStart = () => {
    scrollRef.current?.scrollTo({ x: 0, animated: true });
  };

  const handleSelect = (index: number) => {
    const selected = addresses[index];
    const remaining = addresses.filter((_, i) => i !== index);
    setAddresses([selected, ...remaining]);
    setTimeout(scrollToStart, 50); // state sonrası başa dön
  };

  if (!hasAddress || showForm) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <FieldHeader title={title} hideIcon={true} />

        <View style={styles.field}>
          <TextField
            placeholder="Ad Soyad"
            value={form.fullName}
            onChangeText={(val) => handleInput('fullName', val)}
          />
        </View>
        <View style={styles.field}>
          <TextField
            placeholder="Telefon Numarası"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(val) => handleInput('phone', val)}
          />
        </View>
        <View style={styles.field}>
          <TextField
            placeholder="İl"
            value={form.city}
            onChangeText={(val) => handleInput('city', val)}
          />
        </View>
        <View style={styles.field}>
          <TextField
            placeholder="İlçe"
            value={form.district}
            onChangeText={(val) => handleInput('district', val)}
          />
        </View>
        <View style={[styles.field, { marginBottom: 28 }]} >
          <TextField
            placeholder="Açık Adres"
            value={form.fullAddress}
            onChangeText={(val) => handleInput('fullAddress', val)}
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            setHasAddress(true);
            setShowForm(false);
          }}
        />
      </ScrollView>
    );
  }

  return (
    <View style={styles.addressWrapper}>
      <FieldHeader title={title} hideIcon={true} />

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        snapToInterval={CARD_W + GAP}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{
          paddingLeft: SIDE,
          paddingRight: Math.max(SIDE - GAP, 0),
        }}
      >
        {addresses.map((addr, index) => (
          <View key={index} style={{ width: CARD_W, marginRight: GAP }}>
            <AddressCard
              {...addr}
              selected={index === 0}
              onSelect={() => handleSelect(index)}
            />
          </View>
        ))}
      </ScrollView>

      {/* Beyaz zemin / siyah yazı kilitli buton */}
      <View style={{ marginTop: 10, marginLeft: SIDE, alignSelf: 'flex-start' }}>
        <Button
          title={addButtonText}
          mode="locked"
          lockedStyleType="secondary"
          onPress={() => setShowForm(true)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  addressWrapper: {
    gap: 12,
    paddingBottom: 20,
  },
  field: {
    marginHorizontal: 28,
    marginBottom: 24,
  },
  saveButton: {
    marginTop: 10,
    marginHorizontal: 28,
    backgroundColor: '#F13957',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
