import React, { useState, useRef } from 'react';
import { View, StyleSheet, Modal, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FieldHeader from './FieldHeader';
import CategoryContainer, { Category } from './CategoryContainer';
import { CARD_WIDTH, CARD_SPACING } from './CategoryCard';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/AppNavigator';

interface Props {
  title: string;
  items?: Category[]; // ⬅️ opsiyonel yaptık
  onPressItem?: (item: Category) => void;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

const ROW_HEIGHT_RATIO = 0.223; // Safe area'ya göre satır yükseklik oranı

export default function CategoryArea({ title, items = [], onPressItem }: Props) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const safeH = SCREEN_H - insets.top - insets.bottom;

  const [isHorizontal, setIsHorizontal] = useState(true);
  const [initialHorizontalOffset, setInitialHorizontalOffset] = useState(0);
  const [initialVerticalOffset, setInitialVerticalOffset] = useState(0);

  const horizontalOffsetRef = useRef(0);
  const verticalOffsetRef = useRef(0);

  const ROW_HEIGHT = safeH * ROW_HEIGHT_RATIO;

  const itemsSafe: Category[] = Array.isArray(items) ? items : []; // ⬅️ güvenli

  const toggleMode = () => {
    // 🔐 Scroll offset'lerin kesin güncellendiğinden emin olmak için beklet
    setTimeout(() => {
      if (isHorizontal) {
        const x = horizontalOffsetRef.current;
        const index = Math.round(x / (CARD_WIDTH + CARD_SPACING));
        const row = Math.floor(index / 3);
        setInitialVerticalOffset(row * ROW_HEIGHT);
      } else {
        const y = verticalOffsetRef.current;
        const row = Math.round(y / ROW_HEIGHT);
        const index = row * 3;
        const x = index * (CARD_WIDTH + CARD_SPACING);
        setInitialHorizontalOffset(x);
      }

      setIsHorizontal((prev) => !prev);
    }, 100); // ☝️ FlatList offset'lerinin kesin gelmesini bekle
  };

  const handlePressItem = (item: Category) => {
    if (onPressItem) {
      onPressItem(item);
    } else {
      navigation.navigate('CategoryScreen', { item });
    }
  };

  return (
    <>
      <View style={styles.headerWrapper}>
        <FieldHeader
          title={title}
          hideIcon={false}
          onIconPress={toggleMode}
          rotated={!isHorizontal}
        />
      </View>

      {isHorizontal ? (
        <CategoryContainer
          items={itemsSafe} // ⬅️ güvenli
          isHorizontal
          onPressItem={handlePressItem}
          initialHorizontalOffset={initialHorizontalOffset}
          onHorizontalScroll={(offsetX) => (horizontalOffsetRef.current = offsetX)}
        />
      ) : (
        <Modal visible animationType="slide" onRequestClose={toggleMode}>
          <View style={styles.modalWrapper}>
            <FieldHeader
              title={title}
              hideIcon={false}
              onIconPress={toggleMode}
              rotated={!isHorizontal}
            />
            <CategoryContainer
              items={itemsSafe} // ⬅️ güvenli
              isHorizontal={false}
              onPressItem={handlePressItem}
              initialVerticalOffset={initialVerticalOffset}
              onVerticalScroll={(offsetY) => (verticalOffsetRef.current = offsetY)}
            />
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#ffffff',
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: SCREEN_W,
    paddingTop: 8,
  },
});
