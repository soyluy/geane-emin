// app/components/ui/CardPanel.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PaymentSection from '../PaymentSection';

type Props = {
  onClose: () => void; // PanelShell'den gelir
};

export default function CardPanel({ onClose }: Props) {
  return (
    <View style={styles.container}>
      {/* Yalnızca içerik; başlık/kapatma artık PanelShell'de */}
      <PaymentSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 12,
  },
});
