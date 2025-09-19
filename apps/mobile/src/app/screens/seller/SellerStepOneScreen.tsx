import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Platform,
  Animated,
  BackHandler,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import { Video } from 'expo-av';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import FieldHeader from '../../components/ui/FieldHeader';
import SelectableButtonGroup from '../../components/ui/SelectableButtonGroup';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const PANEL_RATIO = 0.6942;
const BOX_WIDTH = SCREEN_W * 0.9;               // %90 genişlik
const H_PADDING = SCREEN_W * 0.03953;           // %3,953 sol boşluk
const V_GAP_BEFORE = 25;                        // 25 br üst boşluk

export default function SellerStepOneScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const panelHeight = SCREEN_H * PANEL_RATIO + insets.bottom;

  // form verileri
  const [desc, setDesc] = useState('');
  const [social, setSocial] = useState('');
  const [website, setWebsite] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');

  // gönderildi mi?
  const [isSubmitted, setIsSubmitted] = useState(false);

  const panelTranslateY = useRef(new Animated.Value(panelHeight)).current;
  const boxOpacity     = useRef(new Animated.Value(1)).current;
  const [showPanel, setShowPanel] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (showPanel) {
          closePanel();
          return true;
        }
        return false;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [showPanel])
  );

  const openPanel = () => {
    setShowPanel(true);
    Animated.parallel([
      Animated.timing(boxOpacity,      { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.timing(panelTranslateY, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  };

  const closePanel = (callback?: () => void) => {
    Animated.timing(panelTranslateY, { toValue: panelHeight, duration: 600, useNativeDriver: true })
      .start(() => {
        setShowPanel(false);
        if (callback) callback();
        Animated.timing(boxOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
      });
  };

  const handleSubmit = () => {
    // paneli kapat, sonra onay mesajını göster
    closePanel(() => {
      setIsSubmitted(true);
    });
  };

  return (
    <View style={styles.container}>
      {/* Arka plan videosu */}
      <Video
        source={require('../../../../assets/videos/intro.mp4')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        shouldPlay isLooping isMuted ignoreSilentSwitch="obey"
      />

      {/* Geri butonu */}
      <BackButton
        style={styles.backButton}
        onPress={() => showPanel ? closePanel() : navigation.goBack()}
      />

      {/* Bilgilendirme kutusu */}
      <Animated.View
        pointerEvents={showPanel ? 'none' : 'auto'}
        style={[styles.box, { opacity: boxOpacity }]}
      >
        {isSubmitted ? (
          <>
            <Text style={styles.title}>Başvurunuz Alındı 🎉</Text>
            <Text style={styles.text}>
              İlginiz ve güveniniz için teşekkür ederiz. Başvurunuz başarıyla iletildi. Kısa süre içinde sizinle iletişime geçeceğiz.
            </Text>
            <Text style={styles.text}>
              GEANE ailesi olarak, sizinle çalışmayı dört gözle bekliyoruz!
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>GEANE, herkese açık bir satış platformu değildir.</Text>
            <Text style={styles.text}>
              Tedarikçilerimizi; iş modeli, ürün kalitesi ve uzun vadeli yaklaşımına göre değerlendiririz.
            </Text>
            <Text style={styles.text}>
              Satış yapmak ya da görünürlük sağlamak isteyen tüm butik, marka ve tasarımcılara özel çözümler sunarız.
            </Text>
            <View style={styles.buttonWrapper}>
              <Button title="Başvur" onPress={openPanel} />
            </View>
          </>
        )}
      </Animated.View>

      {/* Panel */}
      {showPanel && (
        <Animated.View
          style={[
            styles.panel,
            {
              height: panelHeight,
              transform: [{ translateY: panelTranslateY }],
              paddingBottom: insets.bottom,
            },
          ]}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <FieldHeader title="İşletmenizi Nasıl Tanımlarsınız ?" hideIcon />
              <SelectableButtonGroup
                options={[
                  'Butik','Marka','Terzi','Gelinlikçi','Tasarımcı','Yeni Girişim','Diğer',
                ]}
                maxSelection={7}
              />

              <FieldHeader title="Ürünlerinizi Nasıl Tedarik Ediyorsunuz ?" hideIcon />
              <SelectableButtonGroup
                options={['Kendim Üretirim','Dış Tedarikçilerle Çalışırım','Karışık']}
                maxSelection={1}
              />

              <FieldHeader title="Sipariş Üzerine mi Çalışıyorsunuz, Stoklu mu ?" hideIcon />
              <SelectableButtonGroup
                options={['Hazır Stok','Siparişle Üretim','İkisi Birden']}
                maxSelection={1}
              />

              <FieldHeader title="Fiziki Bir İşletmeniz Var mı ?" hideIcon />
              <SelectableButtonGroup
                options={['Var','Sadece İnternet Üzerinden Satış Yapıyorum']}
                maxSelection={1}
              />

              <FieldHeader title="Siparişlerinizi Ortalama Kargolama Süreniz ?" hideIcon />
              <SelectableButtonGroup
                options={['Aynı Gün','1-2 Gün','2 Gün+']}
                maxSelection={1}
              />

              {/* Metin Kutuları */}
              <TextInput
                placeholder="İşletmenizin tanımını buraya ekleyiniz…"
                placeholderTextColor="#616161"
                value={desc}
                onChangeText={setDesc}
                style={[styles.input, { marginTop: V_GAP_BEFORE }]}
              />
              <TextInput
                placeholder="Varsa sosyal medya adreslerinizi buraya ekleyiniz"
                placeholderTextColor="#616161"
                value={social}
                onChangeText={setSocial}
                style={styles.input}
              />
              <TextInput
                placeholder="Varsa web siteniz / satış kanalınızı buraya ekleyiniz"
                placeholderTextColor="#616161"
                value={website}
                onChangeText={setWebsite}
                style={styles.input}
              />
              <TextInput
                placeholder="Sizinle iletişime geçmek için iletişim kanalınızı buraya ekleyiniz"
                placeholderTextColor="#616161"
                value={contact}
                onChangeText={setContact}
                style={styles.input}
              />
              <TextInput
                placeholder="Başvuru formunda ilettiğiniz bilgilere ek olarak iletmek istediğiniz bir mesajınız varsa buraya ekleyiniz"
                placeholderTextColor="#616161"
                value={message}
                onChangeText={setMessage}
                style={[styles.input, { minHeight: 100 }]}
                multiline
              />

              {/* Gönder Butonu */}
              <View style={styles.sendWrapper}>
                <Button
                  title="Gönder"
                  onPress={handleSubmit}
                  mode="static"
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  box: {
    width: SCREEN_W * 0.88,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    alignItems: 'center',
  },
  title:   { fontSize: 14, fontWeight: '600', textAlign: 'center', color: '#111', marginBottom: 12 },
  text:    { fontSize: 14, textAlign: 'center', color: '#444', marginBottom: 12, lineHeight: Platform.OS === 'ios' ? 20 : 22 },
  buttonWrapper: { marginTop: 10, alignItems: 'center', width: '100%' },
  panel:   { position: 'absolute', bottom: 0, left: 0, width: SCREEN_W, backgroundColor: '#fff', zIndex: 20, paddingTop: 20 },
  input: {
    width: BOX_WIDTH,
    marginLeft: H_PADDING,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 17,
    paddingRight: 13,
    color: '#616161',
    fontSize: 14,
    backgroundColor: '#fff',
    marginBottom: 25,
  },
  sendWrapper: { alignItems: 'center', marginBottom: 20 },
});
