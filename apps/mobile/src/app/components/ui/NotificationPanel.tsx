import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  BackHandler,
} from 'react-native';

const { height: SCREEN_H } = Dimensions.get('screen');
const PANEL_H = SCREEN_H * 0.8;

type Props = {
  visible: boolean;
  onClose: () => void;
};

type NotificationType = 'order' | 'promo' | 'info';

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
};

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'order',
    title: 'Siparişiniz Onaylandı',
    message: '#12345 numaralı siparişiniz onaylandı.',
    date: '1 Ağustos',
    read: false,
  },
  {
    id: '2',
    type: 'promo',
    title: 'Yaz İndirimi Başladı!',
    message: 'Tüm ürünlerde %30’a varan indirimleri kaçırmayın.',
    date: '30 Temmuz',
    read: true,
  },
  {
    id: '3',
    type: 'info',
    title: 'Hesap Güvenliği',
    message: 'Şifrenizi en son 90 gün önce değiştirdiniz.',
    date: '28 Temmuz',
    read: true,
  },
];

export default function NotificationPanel({ visible, onClose }: Props) {
  const translateY = useRef(new Animated.Value(PANEL_H)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [open, setOpen] = useState(false);

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

  if (!visible && !open) return null;

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <View
      style={[
        styles.notificationItem,
        !item.read && styles.unreadItem,
      ]}
    >
      <View style={styles.notificationContent}>
        <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {Platform.OS === 'android' && (
        <StatusBar backgroundColor="rgba(0,0,0,0.4)" barStyle="light-content" animated />
      )}

      <TouchableWithoutFeedback onPress={closePanel}>
        <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.panel, { transform: [{ translateY }] }]}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.headerText}>🔔 Bildirimler</Text>
          </View>

          {mockNotifications.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Henüz bildirimin yok</Text>
            </View>
          ) : (
            <FlatList
              data={mockNotifications}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </SafeAreaView>
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
  header: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181818',
  },
  listContent: {
    paddingVertical: 8,
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  unreadItem: {
    backgroundColor: '#FAFAFA',
  },
  notificationContent: {
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    color: '#181818',
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  message: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  date: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
