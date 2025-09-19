// src/app/components/ui/OrderTrackingPanel.tsx (GÜNCELLE)
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MyOrdersCard from './MyOrdersCard';

interface Props { onClose: () => void; } // prop aynı kalsın

export default function OrderTrackingPanel({ onClose }: Props) {
  return (
    <View style={styles.container}>
      {/* Header YOK – PanelShell veriyor */}
      <View style={styles.listArea}>
        <MyOrdersCard />
        <MyOrdersCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#fff' },
  listArea:{ gap:12 },
});
