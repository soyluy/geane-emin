import React, { useState, useRef } from 'react';
import { View, StyleSheet, Modal, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FieldHeader from './FieldHeader';
import CollectionContainer, { Collection } from './CollectionContainer';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/AppNavigator'; // 📌 Yol projenize göre ayarlanabilir

interface Props {
  title: string;
  items: Collection[];
  onIconPress?: () => void;
  onPressItem?: (item: Collection) => void;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

export default function CollectionArea({ title, items, onIconPress, onPressItem }: Props) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const H_IMAGE_H = SCREEN_H * 0.215;
  const H_TITLE_H = SCREEN_H * 0.041;
  const H_CARD_H = H_IMAGE_H + H_TITLE_H;
  const V_MODAL_RATIO = 0.95;

  const [isHorizontal, setIsHorizontal] = useState(true);
  const [initialHorizontalOffset, setInitialHorizontalOffset] = useState(0);
  const [initialVerticalOffset, setInitialVerticalOffset] = useState(0);
  const horizontalOffsetRef = useRef(0);
  const verticalOffsetRef = useRef(0);

  const toggleMode = () => {
    if (isHorizontal) {
      const x = horizontalOffsetRef.current;
      const idx = Math.round(x / (SCREEN_W * 0.27906 + SCREEN_W * 0.02325));
      const row = Math.floor(idx / 2);
      setInitialVerticalOffset(row * SCREEN_H * 0.384);
    } else {
      const y = verticalOffsetRef.current;
      const row = Math.round(y / (SCREEN_H * 0.384));
      const idx = row * 2;
      const x = idx * (SCREEN_W * 0.27906 + SCREEN_W * 0.02325);
      setInitialHorizontalOffset(x);
    }
    setIsHorizontal(prev => !prev);
    if (onIconPress) onIconPress();
  };

  // Varsayılan yönlendirme davranışı
  const handlePressItem = (item: Collection) => {
    if (onPressItem) {
      onPressItem(item);
    } else {
      navigation.navigate('CollectionScreen', { item });
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
        <CollectionContainer
          items={items}
          isHorizontal
          initialHorizontalOffset={initialHorizontalOffset}
          onHorizontalScroll={(offsetX) => (horizontalOffsetRef.current = offsetX)}
          onPressItem={handlePressItem}
        />
      ) : (
        <Modal visible animationType="slide" onRequestClose={toggleMode}>
          <View style={[styles.modalWrapper, { height: SCREEN_H * V_MODAL_RATIO }]}>
            <FieldHeader
              title={title}
              hideIcon={false}
              onIconPress={toggleMode}
              rotated={!isHorizontal}
            />
            <CollectionContainer
              items={items}
              isHorizontal={false}
              initialVerticalOffset={initialVerticalOffset}
              onVerticalScroll={(offsetY) => (verticalOffsetRef.current = offsetY)}
              onPressItem={handlePressItem}
            />
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#FFFFFF',
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: SCREEN_W,
  },
});
