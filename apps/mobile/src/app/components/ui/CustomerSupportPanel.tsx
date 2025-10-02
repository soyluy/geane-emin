import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface Props {
  onClose: () => void;
}

export default function CustomerSupportPanel({ onClose }: Props) {
  return (
    <>
      <Text style={styles.title}>Müşteri Hizmetleri</Text>
      {/* Orijinal içerik (Placeholder veya gerçek içerik) */}
    </>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 16, fontSize: 18, fontWeight: '600' },
});