// src/app/screens/CreateAccountScreen.tsx

import React, { useRef, useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FieldHeader from '../components/ui/FieldHeader';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';
import FootnoteText from '../components/ui/FootnoteText';
import BackButton from '../components/ui/BackButton';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const PANEL_RATIO         = 0.6942;   // panel yüksekliği %69,42
const BUTTON_POS_RATIO    = 0.73106;  // buton panel içindeki konumu %73,106
const AGREEMENT_POS_RATIO = 0.87326;  // metin panel içindeki konumu %87,326
const H_MARGIN_RATIO      = 0.1232;   // sol/sağ %12,32 boşluk

export default function CreateAccountScreen({ onBack }: { onBack: () => void }) {
  const insets      = useSafeAreaInsets();
  const panelHeight = SCREEN_H * PANEL_RATIO;

  // Dikey panel açılma animasyonu
  const translateY = useRef(
    new Animated.Value(panelHeight + insets.bottom)
  ).current;
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  // Yatay adım animasyonu
  const [currentStep, setCurrentStep] = useState(0);
  const slideX = useRef(new Animated.Value(0)).current;

  const goNext = () => {
    Animated.timing(slideX, {
      toValue: -SCREEN_W,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(1);
    });
  };

  const goPrev = () => {
    Animated.timing(slideX, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(0);
    });
  };

  // BackButton konum oranları
  const BACK_TOP_RATIO = 0.03540;   // ekran yüksekliğinin %3,540'i
  const BACK_LEFT_RATIO = 0.06046;  // ekran genişliğinin %6,046'si

  return (
    <View style={styles.container}>
      {/* Sol üst köşedeki geri butonu */}
      <View style={[
        styles.backButtonContainer,
        { top: SCREEN_H * BACK_TOP_RATIO, left: SCREEN_W * BACK_LEFT_RATIO }
      ]}>
        <BackButton onPress={onBack} />
      </View>

      {/* Panel ve içindeki yatay kayan adımlar */}
      <Animated.View
        style={[
          styles.panel,
          {
            height: panelHeight + insets.bottom,
            transform: [{ translateY }],
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <Animated.View
          style={{
            flexDirection: 'row',
            width: SCREEN_W * 2,
            transform: [{ translateX: slideX }],
          }}
        >
          {/* --- ADIM 1 --- */}
          <View style={{ width: SCREEN_W }}>
            <FieldHeader
              title="E-Posta Adresiniz"
              hideIcon={true}
            />
            <TextField placeholder="" />

            <FieldHeader
              title="Şifre Belirleyiniz"
              hideIcon={true}
            />
            <TextField placeholder="" />
            <FootnoteText text="En az 8 karakter kullanmalısın. Büyük harf, küçük harf, rakam içermeli" />

            <FieldHeader
              title="Şifrenizi Tekrar Yazınız"
              hideIcon={true}
            />
            <TextField placeholder="" />

            {/* Sonraki Butonu */}
            <View
              style={{
                position: 'absolute',
                top: panelHeight * BUTTON_POS_RATIO,
                left: 0,
                right: 0,
                alignItems: 'center',
              }}
            >
              <Button title="Sonraki" onPress={goNext} />
            </View>

            {/* Kullanım Şartları Metni */}
            <Text style={styles.agreementText}>
              Kaydolarak,{' '}
              <Text style={styles.bold}>Kullanım Şartları</Text> ve{' '}
              <Text style={styles.bold}>Gizlilik Politika</Text>’mızı kabul
              edersiniz
            </Text>
          </View>

          {/* --- ADIM 2 --- */}
          <View style={{ width: SCREEN_W }}>
            <FieldHeader
              title="Kullanıcı Adınızı Belirleyiniz"
              hideIcon={true}
            />
            <TextField placeholder="Örn: geane_kullanici" />

            <FieldHeader
              title="Doğum Tarihiniz"
              hideIcon={true}
            />
            <TextField placeholder="GG/AA/YYYY" />

            {/* Tamamla Butonu */}
            <View
              style={{
                position: 'absolute',
                top: panelHeight * BUTTON_POS_RATIO,
                left: 0,
                right: 0,
                alignItems: 'center',
              }}
            >
              <Button title="Tamamla" onPress={() => console.log('Tamamla')} />
            </View>

            {/* Kullanım Şartları Metni (Adım 2) */}
            <Text style={styles.agreementText}>
              Kaydolarak,{' '}
              <Text style={styles.bold}>Kullanım Şartları</Text> ve{' '}
              <Text style={styles.bold}>Gizlilik Politika</Text>’mızı kabul
              edersiniz
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: SCREEN_W,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  backButtonContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  agreementText: {
    position: 'absolute',
    top: SCREEN_H * PANEL_RATIO * AGREEMENT_POS_RATIO,
    left: SCREEN_W * H_MARGIN_RATIO,
    right: SCREEN_W * H_MARGIN_RATIO,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    textAlign: 'center',
    color: '#060606',
  },
  bold: {
    fontFamily: 'Inter_700Bold',
  },
});
