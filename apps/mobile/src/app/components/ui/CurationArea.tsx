import React, { useState, useRef } from 'react';
import { View, StyleSheet, Modal, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FieldHeader from './FieldHeader';
import CurationContainer, { CurationItem } from './CurationContainer';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/AppNavigator'; // yol projene göre ayarlanabilir

interface Props {
  title: string;
  items: CurationItem[];
  onIconPress?: () => void;
  onPressItem?: (item: CurationItem) => void;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

export default function CurationArea({ title, items, onIconPress, onPressItem }: Props) {
  const insets = useSafeAreaInsets();
  const safeH = SCREEN_H - insets.top - insets.bottom;
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [isHorizontal, setIsHorizontal] = useState(true);
  const [initialHorizontalOffset, setInitialHorizontalOffset] = useState(0);
  const [initialVerticalOffset, setInitialVerticalOffset] = useState(0);
  const horizontalOffsetRef = useRef(0);
  const verticalOffsetRef = useRef(0);

  const toggleMode = () => {
    if (isHorizontal) {
      const x = horizontalOffsetRef.current;
      const idx = Math.round(x / (SCREEN_W * 0.4186 + SCREEN_W * 0.01627));
      const row = Math.floor(idx / 2);
      setInitialVerticalOffset(row * safeH * 0.223);
    } else {
      const y = verticalOffsetRef.current;
      const row = Math.round(y / (safeH * 0.223));
      const idx = row * 2;
      const x = idx * (SCREEN_W * 0.4186 + SCREEN_W * 0.01627);
      setInitialHorizontalOffset(x);
    }
    setIsHorizontal((prev) => !prev);
    onIconPress?.();
  };

  // ✅ Yönlendirme davranışı
  const handlePressItem = (item: CurationItem) => {
    if (onPressItem) {
      onPressItem(item);
    } else {
      navigation.navigate('CurationScreen', { item });
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
        <View style={{ height: safeH * 0.20386 }}>
          <CurationContainer
            items={items}
            isHorizontal
            initialHorizontalOffset={initialHorizontalOffset}
            onHorizontalScroll={(offsetX) => (horizontalOffsetRef.current = offsetX)}
            onPressItem={handlePressItem}
          />
        </View>
      ) : (
        <Modal visible animationType="slide" onRequestClose={toggleMode}>
          <View style={[styles.modalWrapper, { height: SCREEN_H * 0.95 }]}>
            <FieldHeader
              title={title}
              hideIcon={false}
              onIconPress={toggleMode}
              rotated={!isHorizontal}
            />
            <CurationContainer
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
    backgroundColor: '#fff',
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    width: SCREEN_W,
  },
});
