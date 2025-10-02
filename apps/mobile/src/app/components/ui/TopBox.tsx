// File: src/app/components/ui/TopBox.tsx
import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MenuIcon from '../../../../assets/icons/topbox-menu-icon.svg';
import NotificationIcon from '../../../../assets/icons/nav/notification.svg';
import NotificationIconActive from '../../../../assets/icons/nav/notification-active.svg';
import CartIcon from '../../../../assets/icons/nav/cart.svg';
import CartIconActive from '../../../../assets/icons/nav/cart-active.svg';

type TopBoxProps = {
  title?: string;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onCartPress?: () => void;
  hasNotifications?: boolean;
  hasCartItems?: boolean;
};

export default function TopBox({
  title = 'Ana Sayfa',
  onMenuPress = () => {},
  onNotificationPress = () => {},
  onCartPress = () => {},
  hasNotifications = false,
  hasCartItems = false,
}: TopBoxProps) {
  // Tam ekran ölçüsü (status + nav bar DAHİL)
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');
  const HEIGHT = SCREEN_H * 0.0800;
  const H_PADDING = SCREEN_W * 0.03953;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      <SafeAreaView style={[styles.container, { paddingHorizontal: H_PADDING, paddingTop: 8, paddingBottom: 8 }]} edges={['top']}>
        {/* Sol: Başlık */}
        <Text style={styles.title}>{title}</Text>

        {/* Sağ: ikonlar */}
        <View style={styles.iconRow}>
          {/* Bildirim */}
          <TouchableOpacity
            onPress={onNotificationPress}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Bildirimler"
          >
            {hasNotifications ? (
              <NotificationIconActive width={24} height={24} />
            ) : (
              <NotificationIcon width={24} height={24} />
            )}
          </TouchableOpacity>

          {/* Sepet */}
          <TouchableOpacity
            onPress={onCartPress}
            style={[styles.iconButton, styles.iconSpacing]}
            accessibilityRole="button"
            accessibilityLabel="Sepet"
          >
            {hasCartItems ? (
              <CartIconActive width={24} height={24} />
            ) : (
              <CartIcon width={24} height={24} />
            )}
          </TouchableOpacity>

          {/* Menü */}
          <TouchableOpacity
            onPress={onMenuPress}
            style={[styles.iconButton, styles.iconSpacing]}
            accessibilityRole="button"
            accessibilityLabel="Menü"
          >
            <MenuIcon width={24} height={22} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent', // ✅ ŞEFFAF YAPILDI
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    color: '#303336',
    fontWeight: '500',
  },
  iconRow: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { padding: 8 },
  iconSpacing: { marginLeft: 12 },
});
