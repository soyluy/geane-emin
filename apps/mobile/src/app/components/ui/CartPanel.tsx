import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  BackHandler,
  Platform,
  PanResponder,
  Easing,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import StepBar from './StepBar';
import CartItemCard from './CartItemCard';
import AddressSection from '../../components/AddressSection';
import PaymentSection from '../../components/PaymentSection';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('screen');
const PANEL_H = SCREEN_H * 0.8;

const TAB_TITLES = ['Sepetiniz', 'Adresiniz', 'Ödeme Yöntemleri'];

const initialItems = [
  {
    id: '1',
    name: 'Oversize Tişört',
    price: 299,
    quantity: 2,
    color: 'Siyah',
    size: 'M',
    imageUri: 'https://example.com/image1.jpg',
  },
  {
    id: '2',
    name: 'Jean Pantolon',
    price: 499,
    quantity: 1,
    color: 'Açık Mavi',
    size: '32',
    imageUri: 'https://example.com/image2.jpg',
  },
  {
    id: '3',
    name: 'Sweatshirt',
    price: 399,
    quantity: 1,
    color: 'Beyaz',
    size: 'L',
    imageUri: 'https://example.com/image3.jpg',
  },
  {
    id: '4',
    name: 'Keten Gömlek',
    price: 329,
    quantity: 1,
    color: 'Bej',
    size: 'M',
    imageUri: 'https://example.com/image4.jpg',
  },
  {
    id: '5',
    name: 'Şort',
    price: 189,
    quantity: 2,
    color: 'Gri',
    size: 'L',
    imageUri: 'https://example.com/image5.jpg',
  },
];

export default function CartPanel({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const translateY = useRef(new Animated.Value(PANEL_H)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [items, setItems] = useState(initialItems);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(items.map(item => item.id)));

  const scrollRef = useRef<ScrollView>(null);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 10,
      onPanResponderMove: (_, gesture) => {
        const dy = Math.max(0, Math.min(PANEL_H, gesture.dy));
        translateY.setValue(dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > PANEL_H * 0.25) {
          closePanel();
        } else {
          Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const openPanel = () => {
    setOpen(true);
    translateY.setValue(PANEL_H);
    backdropAnim.setValue(0);

    Animated.sequence([
      Animated.timing(backdropAnim, {
        toValue: 0.5,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closePanel = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: PANEL_H,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setOpen(false);
      onClose();
    });
  };

  useEffect(() => {
    if (visible) openPanel();
    else if (open) closePanel();
  }, [visible]);

  useEffect(() => {
    if (!open) return;
    const onBackPress = () => {
      closePanel();
      return true;
    };
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    }
    return () => {
      if (Platform.OS === 'android') {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }
    };
  }, [open]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_W);
    if (index !== activeStep) {
      setActiveStep(index);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getSelectedIndex = (id: string) => {
    const selectedList = items.filter(item => selectedIds.has(item.id));
    return selectedList.findIndex(item => item.id === id);
  };

  const totalPrice = items
    .filter(i => selectedIds.has(i.id))
    .reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
    .toFixed(2);

  if (!open) return null;

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <TouchableWithoutFeedback onPress={closePanel}>
        <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View {...panResponder.panHandlers} style={[styles.panel, { transform: [{ translateY }] }]}>
        <StepBar
          labels={TAB_TITLES}
          activeIndex={activeStep}
          onSelect={(index) => {
            setActiveStep(index);
            scrollRef.current?.scrollTo({ x: SCREEN_W * index, animated: true });
          }}
        />

        {(activeStep === 0 || activeStep === 1) && (
          <View style={styles.infoLine}>
            <Text style={styles.infoText}>
              {selectedIds.size} ürün seçildi. Toplam: ₺{totalPrice}
            </Text>
          </View>
        )}

        <ScrollView
          horizontal
          pagingEnabled
          ref={scrollRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
        >
          {/* Sepetiniz */}
          <View style={styles.page}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  {...item}
                  selected={selectedIds.has(item.id)}
                  selectedIndex={
                    selectedIds.has(item.id)
                      ? getSelectedIndex(item.id) + 1
                      : undefined
                  }
                  onToggleSelect={() => handleToggleSelect(item.id)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Adresiniz */}
          <View style={[styles.page, { paddingHorizontal: 0 }]}>
            <AddressSection mode="shipping" />
            <View style={{ height: 0 }} />
            <AddressSection mode="billing" />
          </View>

          {/* Ödeme Yöntemleri */}
          <View style={styles.page}>
            <PaymentSection />
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    zIndex: 11,
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: PANEL_H,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    zIndex: 9999,
    elevation: 9999,
  },
  infoLine: {
    marginLeft: SCREEN_W * 0.03953,
    paddingTop: 28,
    paddingBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#181818',
  },
  scroll: {
    flex: 1,
  },
  page: {
    width: SCREEN_W,
    height: '100%',
    paddingTop: 12,
  },
});
