// src/app/components/ui/AddressPanel.tsx
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AddressSection from '../../components/AddressSection';

interface Props {
  onClose: () => void;   // PanelShell'den gelir
}

export default function AddressPanel({ onClose }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AddressSection mode="shipping" />
        <AddressSection mode="billing" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 0,
    paddingVertical: 16,
  },
});
