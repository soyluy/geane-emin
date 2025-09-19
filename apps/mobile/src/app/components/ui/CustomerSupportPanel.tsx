import React from 'react';
import { Text, StyleSheet } from 'react-native';
import SlideInPanel from './SlideInPanel';
import BackButton from './BackButton';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function CustomerSupportPanel({ visible, onClose }: Props) {
  return (
    <SlideInPanel visible={visible} onClose={onClose}>
      <BackButton onPress={onClose} style={styles.backButton} />
      <Text style={styles.title}>Müşteri Hizmetleri</Text>
      {/* Orijinal içerik (Placeholder veya gerçek içerik) */}
    </SlideInPanel>
  );
}

const styles = StyleSheet.create({
  backButton: { position: 'absolute', top: 16, left: 16 },
  title: { marginTop: 48, fontSize: 18, fontWeight: '600' },
});