// apps/mobile/src/app/components/ui/FilterBar.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FilterBarProps = {
  options?: string[];
  defaultSelected?: string;
};

export default function FilterBar({
  options,
  defaultSelected,
}: FilterBarProps) {
  const filters = options ?? ['Tümü', 'Takip Edilenler'];
  const [selected, setSelected] = useState(defaultSelected ?? filters[0]);

  // Tam ekran (status + nav bar DAHİL) taban
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

  // — Figma oranları —
  const FILTERBAR_HEIGHT_RATIO = 0.06008;  // %6,008
  const LEFT_MARGIN_RATIO      = 0.03953;  // %3,953
  const INTERNAL_MARGIN_RATIO  = 0.02093;  // %2,093

  const CONTAINER_HEIGHT = SCREEN_H * FILTERBAR_HEIGHT_RATIO;
  const BUTTON_HEIGHT    = CONTAINER_HEIGHT * 0.5;
  const SIDE_PADDING     = 12;
  const ROW_SPACING      = 9;

  // Container’ın sola vereceği padding: ilk butonun SOL_BOŞLUK – iç boşluk
  const CONTAINER_PADDING_LEFT =
    SCREEN_W * (LEFT_MARGIN_RATIO - INTERNAL_MARGIN_RATIO);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('@selectedFilter');
      if (saved && filters.includes(saved)) setSelected(saved);
    })();
  }, [filters]);

  const onSelect = async (f: string) => {
    setSelected(f);
    await AsyncStorage.setItem('@selectedFilter', f);
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: SCREEN_W,
          minHeight: CONTAINER_HEIGHT,       // tek satır yüksekliği
          paddingTop: BUTTON_HEIGHT,         // üst boşluk = buton yüksekliği
          paddingLeft: CONTAINER_PADDING_LEFT,
          rowGap: ROW_SPACING,               // RN >=0.71'de desteklenir
        },
      ]}
    >
      {filters.map((item) => (
        <TouchableOpacity
          key={item}
          activeOpacity={0.8}
          onPress={() => onSelect(item)}
          style={[
            styles.buttonBase,
            selected === item ? styles.selectedButton : styles.unselectedButton,
            {
              marginLeft: SCREEN_W * INTERNAL_MARGIN_RATIO,
              marginBottom: ROW_SPACING,     // rowGap desteklenmeyen cihazlar için emniyet
              height: BUTTON_HEIGHT,
              paddingHorizontal: SIDE_PADDING,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Filtre: ${item}`}
          accessibilityState={{ selected: selected === item }}
        >
          <Text style={selected === item ? styles.selectedText : styles.unselectedText}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  buttonBase: {
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#F13957',
  },
  unselectedButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#181818',
  },
  selectedText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#ffffff',
  },
  unselectedText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#303336',
  },
});
