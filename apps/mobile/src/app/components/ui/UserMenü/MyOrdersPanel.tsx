// src/app/components/ui/UserMenü/MyOrdersPanel.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props { 
  onClose: () => void; 
}

export default function MyOrdersPanel({ onClose }: Props) {
  console.log('[MyOrdersPanel] mounted');
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <Text style={styles.subtitle}>Sipariş geçmişiniz burada görünecek</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
  },
});