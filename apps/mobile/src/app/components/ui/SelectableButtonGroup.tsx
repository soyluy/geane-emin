import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Button from './Button';

const { width: SCREEN_W } = Dimensions.get('screen');
const GAP_RATIO = 0.03953;           // %3,953 oranında boşluk
const GAP = SCREEN_W * GAP_RATIO;

interface SelectableButtonGroupProps {
  options: string[];
  maxSelection?: number;
  onChange?: (selected: string[]) => void;
}

export default function SelectableButtonGroup({
  options,
  maxSelection = Infinity,
  onChange,
}: SelectableButtonGroupProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleItem = (item: string) => {
    const isSelected = selectedItems.includes(item);
    let updated: string[] = [];

    if (isSelected) {
      updated = selectedItems.filter(i => i !== item);
    } else {
      if (maxSelection === 1) {
        updated = [item];
      } else if (selectedItems.length < maxSelection) {
        updated = [...selectedItems, item];
      } else {
        return;
      }
    }

    setSelectedItems(updated);
    onChange?.(updated);
  };

  return (
    <View style={styles.container}>
      {options.map(item => (
        <View key={item} style={styles.buttonWrapper}>
          <Button
            title={item}
            mode="selectable"
            selected={selectedItems.includes(item)}
            onPress={() => toggleItem(item)}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: GAP,
    rowGap: GAP,
    width: SCREEN_W,
    paddingLeft: GAP,     // %3,953 oranında sol boşluk
    paddingBottom: 0.1,     // Alt boşluk sıfırlandı
    marginBottom: 0,      // Dış boşluk sıfırlandı
  },
  buttonWrapper: {
    // Artık alt boşluk bırakmıyoruz
    // marginBottom: GAP, // ❌ kaldırıldı
  },
});
