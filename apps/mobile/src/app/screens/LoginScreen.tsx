// apps/mobile/src/app/screens/LoginScreen.tsx

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BackButton from '../components/ui/BackButton';
import FieldHeader from '../components/ui/FieldHeader';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');
const PANEL_HEIGHT_RATIO = 0.57939;  // %57,939
const BUTTON_TOP_RATIO   = 0.56481;  // %56,481
const FORGOT_TOP_RATIO   = 0.71481;  // %71,481
const HELP_TOP_RATIO     = 0.82777;  // %82,777
const SIDE_MARGIN_RATIO  = 0.34883;  // %34,883

interface LoginScreenProps {
  onBack: () => void;
  onLogin: (email: string, password: string) => void;
}

export default function LoginScreen({
  onBack,
  onLogin
}: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  // SafeArea dahil toplam yükseklik
  const fullH  = SCREEN_H + insets.top + insets.bottom;
  const panelH = fullH * PANEL_HEIGHT_RATIO;

  // Aşağıdan yukarı kayan panel animasyonu
  const slideAnim = useRef(new Animated.Value(panelH + insets.bottom)).current;
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  // Giriş Yap butonuna basıldığında çağrılır
  const handleLogin = () => {
    onLogin(email, password);
  };

  return (
    <View style={styles.container}>
      {/* Geri Butonu */}
      <BackButton
        onPress={onBack}
        style={{
          position: 'absolute',
          top:    insets.top + 8,
          left:   8,
          zIndex: 10,
        }}
      />

      {/* Kayarak çıkan panel */}
      <Animated.View
        style={[
          styles.panel,
          {
            height: panelH + insets.bottom,
            paddingBottom: insets.bottom,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* E-Posta Alanı */}
        <FieldHeader title="E-Posta Adresiniz" hideIcon />
        <TextField
          placeholder="example@mail.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Şifre Alanı */}
        <FieldHeader title="Şifreniz" hideIcon />
        <TextField
          placeholder="Şifrenizi girin"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Giriş Yap Butonu */}
        <View
          style={{
            position: 'absolute',
            top:    panelH * BUTTON_TOP_RATIO,
            left:   0,
            right:  0,
            alignItems: 'center',
          }}
        >
          <Button
            title="Giriş Yap"
            onPress={handleLogin}
          />
        </View>

        {/* Şifremi Unuttum */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            top:   panelH * FORGOT_TOP_RATIO,
            left:  0,
            right: 0,
            alignItems: 'center',
          }}
          onPress={() => console.log('Şifremi Unuttum')}
        >
          <Text style={styles.forgotText}>Şifremi Unuttum</Text>
        </TouchableOpacity>

        {/* Yardım Merkezi */}
        <Text
          style={{
            position: 'absolute',
            top:    panelH * HELP_TOP_RATIO,
            left:   SCREEN_W * SIDE_MARGIN_RATIO,
            right:  SCREEN_W * SIDE_MARGIN_RATIO,
            textAlign: 'center',
            fontFamily: 'Inter_700Bold',
            fontSize: 14,
          }}
        >
          Yardım Merkezi
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  panel: {
    position: 'absolute',
    bottom:   0,
    left:     0,
    width:    SCREEN_W,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  forgotText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
});
