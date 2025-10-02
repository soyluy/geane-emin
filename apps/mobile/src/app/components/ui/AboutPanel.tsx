import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface Props {
  onClose: () => void;
}

export default function AboutPanel({ onClose }: Props) {
  return (
    <>
      <Text style={styles.title}>Hakkımızda</Text>
      {/* Orijinal içerik */}
    </>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 16, fontSize: 18, fontWeight: '600' },
});
