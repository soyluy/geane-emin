import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  BackHandler,
} from 'react-native';

import axios from 'axios';

import AppleIcon from '../../../assets/icons/appleiledevam-Vector.svg';
import GoogleIcon from '../../../assets/icons/googleiledevam-Vector.svg';

import CenteredModal from '../components/ui/CenteredModal';

// Modal içerikleri
import PhoneOtpContent from '../components/ui/PhoneOtpContent';
import EmailOtpContent from '../components/ui/EmailOtpContent';
import RegistrationPanel from '../components/ui/RegistrationPanel';
import PasswordContent from '../components/ui/PasswordContent';
import { API_BASE_URL } from '../constants/api';

// Yeni ayrıştırılmış bileşenler
import PrimaryAuthButton from '../components/ui/auth/PrimaryAuthButton';
import PhoneSelectorButton, { Country } from '../components/ui/auth/PhoneSelectorButton';
import EmailSelectorButton from '../components/ui/auth/EmailSelectorButton';
import SocialLoginButton from '../components/ui/auth/SocialLoginButton';
import CountryCodeModal from '../components/ui/auth/CountryCodeModal';

type LoginContentProps = {
  delayMs?: number;
  onGuestPress?: () => void;
  onButtonPress?: (type: string) => void;
};

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('screen');

const PANEL_RATIO = 0.70;
const PANEL_HEIGHT = SCREEN_H * PANEL_RATIO;
const SIDE_PADDING = SCREEN_W * 0.10465;
const BUTTON_WIDTH = SCREEN_W * 0.79069;
const BUTTON_HEIGHT = PANEL_HEIGHT * 0.06769;
const CENTER_LEFT = (SCREEN_W - BUTTON_WIDTH) / 2;

const TITLE_TOP = PANEL_HEIGHT * 0.045;
const PHONE_CONTAINER_TOP = PANEL_HEIGHT * 0.17384;
const PRIMARY_BUTTON_TOP = PANEL_HEIGHT * 0.29692;
const VEYA_TOP = PANEL_HEIGHT * 0.40615;
const EMAIL_TOP = PANEL_HEIGHT * 0.48307;
const GAP_BETWEEN_CONTAINERS = PANEL_HEIGHT * 0.03846;
const GOOGLE_TOP = EMAIL_TOP + BUTTON_HEIGHT + GAP_BETWEEN_CONTAINERS;
const APPLE_TOP = GOOGLE_TOP + BUTTON_HEIGHT + GAP_BETWEEN_CONTAINERS;
const INFO_TOP = PANEL_HEIGHT * 0.80923;

const OTP_SECONDS = 180; // 3 dk

// Modal içi sahne genişliği (CenteredModal içindeki panel genişliği ile aynı tutuldu)
const MODAL_PANEL_W = SCREEN_W * 0.98;

const LoginContent = ({ delayMs, onGuestPress, onButtonPress }: LoginContentProps) => {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const phoneTop = useRef(new Animated.Value(PHONE_CONTAINER_TOP)).current;
  const emailTop = useRef(new Animated.Value(EMAIL_TOP)).current;
  const phoneRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);

  // ========= Modal state (OTP + Password) =========
  const [isModalVisible, setModalVisible] = useState(false);
  // OTP türünü ayrı tuttuk; modal sayfası ise 'otp' | 'password'
  const [otpVariant, setOtpVariant] = useState<'phone' | 'email'>('phone');
  const [modalPage, setModalPage] = useState<'otp' | 'password'>('otp');

  // Modal içi yatay sahne kaydırma
  const modalSlideX = useRef(new Animated.Value(0)).current;
  const EASE_OUT = Easing.out(Easing.cubic);

  // E-posta input
  const [emailValue, setEmailValue] = useState<string>('');

  // Telefon input
  const [phoneValue, setPhoneValue] = useState<string>('');

  // Kayıt sahnesi kaydırma (Login <> Registration)
  const slideX = useRef(new Animated.Value(0)).current;
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [pendingOpenRegister, setPendingOpenRegister] = useState(false);

  // Ülke kodu seçimi
  const [country, setCountry] = useState<Country>({ name: 'Turkey', dial: '+90', iso2: 'TR' });
  const [isCountryModalVisible, setCountryModalVisible] = useState(false);

  // ====== OTP TTL ve UI reset yönetimi ======
  const [phoneExpiresAt, setPhoneExpiresAt] = useState<number | null>(null);
  const [emailExpiresAt, setEmailExpiresAt] = useState<number | null>(null);
  const [otpUIKey, setOtpUIKey] = useState(0);

  const ensureExpiresFor = (variant: 'phone' | 'email') => {
    const now = Date.now();
    if (variant === 'phone') {
      if (!phoneExpiresAt || phoneExpiresAt <= now) {
        setPhoneExpiresAt(now + OTP_SECONDS * 1000);
      }
    } else {
      if (!emailExpiresAt || emailExpiresAt <= now) {
        setEmailExpiresAt(now + OTP_SECONDS * 1000);
      }
    }
  };

  // --- ANA UYGULAMAYA GEÇ (MainScreen) ---
  const goMain = () => {
    onButtonPress?.('guest');
  };

  /**
   * GÜNCELLEME:
   * - "Telefon ile devam" TIKLANINCA: backend'e sormadan direkt PhoneOtpContent modalını aç.
   * - "E-posta ile devam" TIKLANINCA: backend'e sormadan direkt EmailOtpContent modalını aç.
   */
  const openOtpModal = (variant: 'phone' | 'email') => {
    // OTP sahnesini aktive et, modalı aç, süreyi ayarla, modal sahnesini başa sar
    setOtpVariant(variant);
    setModalPage('otp');
    setModalVisible(true);
    ensureExpiresFor(variant);
    modalSlideX.setValue(0);
  };

  // Parola modalını direkt aç (Google geçici yönlendirme için)
  const openPasswordModal = () => {
    setModalPage('password');
    setModalVisible(true);
    // Direkt parola ile açıldığında sahneyi sağa koy (solda OTP, sağda password)
    modalSlideX.setValue(-MODAL_PANEL_W);
  };

  const closeOtpModal = () => {
    setModalVisible(false);
    // Modal kapanınca iç sahneyi sıfırla, OTP UI’ı resetle
    modalSlideX.setValue(0);
    setModalPage('otp');
    setOtpUIKey((k) => k + 1);
  };

  const handleResendPhone = () => {
    setPhoneExpiresAt(Date.now() + OTP_SECONDS * 1000);
  };

  const handleResendEmail = () => {
    setEmailExpiresAt(Date.now() + OTP_SECONDS * 1000);
  };

  const openRegister = () => {
    setRegisterOpen(true);
    Animated.timing(slideX, {
      toValue: -SCREEN_W,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeRegister = () => {
    Animated.timing(slideX, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setRegisterOpen(false);
    });
  };

  useEffect(() => {
    if (!isModalVisible && pendingOpenRegister) {
      setPendingOpenRegister(false);
      openRegister();
    }
  }, [isModalVisible, pendingOpenRegister]);

  // Android geri tuşu
  useEffect(() => {
    const onBackPress = () => {
      if (isCountryModalVisible) {
        setCountryModalVisible(false);
        return true;
      }
      if (isModalVisible) {
        // Önce parola sahnesindeysek OTP’ye geri kaydır
        if (modalPage === 'password') {
          Animated.timing(modalSlideX, {
            toValue: 0,
            duration: 320,
            easing: EASE_OUT,
            useNativeDriver: true,
          }).start(() => {
            setModalPage('otp');
          });
          return true;
        }
        closeOtpModal();
        return true;
      }
      if (isRegisterOpen) {
        closeRegister();
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [isModalVisible, isRegisterOpen, isCountryModalVisible, modalPage]);

  const focusActiveInput = (method: 'phone' | 'email') => {
    requestAnimationFrame(() => {
      if (method === 'phone') phoneRef.current?.focus();
      else emailRef.current?.focus();
    });
  };

  const swapPhoneEmail = (newMethod: 'phone' | 'email') => {
    const toPhoneTop = newMethod === 'phone' ? PHONE_CONTAINER_TOP : EMAIL_TOP;
    const toEmailTop = newMethod === 'phone' ? EMAIL_TOP : PHONE_CONTAINER_TOP;

    Animated.parallel([
      Animated.timing(phoneTop, {
        toValue: toPhoneTop,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(emailTop, {
        toValue: toEmailTop,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start(() => {
      setAuthMethod(newMethod);
      focusActiveInput(newMethod);
    });
  };

  // ====== OTP → Parola kaydırma handler'ı (OTP içeriklerinden çağrılır) ======
  const slideToPassword = () => {
    setModalPage('password'); // state güncel — OTP sahnesi mounted kalıyor
    Animated.timing(modalSlideX, {
      toValue: -MODAL_PANEL_W,
      duration: 320,
      easing: EASE_OUT,
      useNativeDriver: true,
    }).start();
  };

  // ====== Parola → OTP geri dönüş (PasswordContent içinden “Şifremi unuttum”) ======
  const slideBackToOtp = () => {
    ensureExpiresFor(otpVariant);
    Animated.timing(modalSlideX, {
      toValue: 0,
      duration: 320,
      easing: EASE_OUT,
      useNativeDriver: true,
    }).start(() => {
      setModalPage('otp');
    });
  };

  return (
    <View style={styles.container}>
      {/* ===== SAHNE SARALAYICI: Solda Login, Sağda Kayıt ===== */}
      <Animated.View style={[styles.stageWrap, { transform: [{ translateX: slideX }] }]}>
        {/* SAYFA 1: LOGIN */}
        <View style={styles.page}>
          <View style={[styles.abs, { top: TITLE_TOP, left: SIDE_PADDING, right: SIDE_PADDING }]}>
            <Text style={styles.title}>Geane’ye giriş yapın veya yeni hesap oluşturun</Text>
          </View>

          {/* Ana CTA — Modal kontrolü */}
          <View style={[styles.absCenterFull, { top: PRIMARY_BUTTON_TOP, left: 0, right: 0 }]}>
            <PrimaryAuthButton
              authMethod={authMethod}
              onPress={() => openOtpModal(authMethod)}
            />
          </View>

          <View style={[styles.absCenterFull, { top: VEYA_TOP }]}>
            <Text style={styles.veyaText}>Veya</Text>
          </View>

          {/* Telefon seçeneği */}
          <Animated.View style={[styles.abs, { top: phoneTop, left: CENTER_LEFT }]}>
            <PhoneSelectorButton
              isActive={authMethod === 'phone'}
              value={phoneValue}
              onChangeText={setPhoneValue}
              country={country}
              onOpenCountry={() => setCountryModalVisible(true)}
              onPressSelect={() => {
                if (authMethod !== 'phone') {
                  swapPhoneEmail('phone');
                } else {
                  phoneRef.current?.focus();
                }
              }}
              inputRef={phoneRef}
              style={styles.button}
            />
          </Animated.View>

          {/* E-posta seçeneği */}
          <Animated.View style={[styles.abs, { top: emailTop, left: CENTER_LEFT }]}>
            <EmailSelectorButton
              isActive={authMethod === 'email'}
              value={emailValue}
              onChangeText={setEmailValue}
              onPressSelect={() => {
                if (authMethod !== 'email') swapPhoneEmail('email');
                else emailRef.current?.focus();
              }}
              inputRef={emailRef}
              style={styles.button}
            />
          </Animated.View>

          {/* Google */}
          <View style={[styles.abs, { top: GOOGLE_TOP, left: CENTER_LEFT }]}>
            <SocialLoginButton
              title="Google ile devam"
              icon={<GoogleIcon width={20} height={20} />}
              onPress={openPasswordModal} // geçici: Google yerine parola modalını açıyoruz
              style={styles.button}
            />
          </View>

          {/* Apple */}
          <View style={[styles.abs, { top: APPLE_TOP, left: CENTER_LEFT }]}>
            <SocialLoginButton
              title="Apple ile devam"
              icon={<AppleIcon width={20} height={20} />}
              onPress={() => onButtonPress?.('apple')}
              style={styles.button}
            />
          </View>

          {/* Alt bilgi (dokunulabilir bilgilendirme) */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (onGuestPress) onGuestPress();
              else goMain();
            }}
            style={[styles.abs, { top: INFO_TOP, left: SIDE_PADDING, right: SIDE_PADDING }]}
          >
            <Text style={styles.bottomInfoText}>
              <Text style={styles.infoBoldBlack}>Üye olmadan devam</Text>{' '}
              <Text style={styles.infoLight}>
                ederek alışveriş yapabilirsin; içeriklerle etkileşim ve size özel öneriler için giriş yapmanız gerekir.
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* SAYFA 2: KAYIT alanı */}
        <View style={styles.page}>
          <RegistrationPanel />
        </View>
      </Animated.View>

      {/* ===== Modal: OTP / Password İçerik — YATAY SAHNE ===== */}
      <CenteredModal visible={isModalVisible} onClose={closeOtpModal}>
        <Animated.View
          style={{
            width: MODAL_PANEL_W * 2,
            height: '100%',
            flexDirection: 'row',
            transform: [{ translateX: modalSlideX }],
          }}
        >
          {/* Sol sayfa: OTP (telefon veya e-posta) */}
          <View style={{ width: MODAL_PANEL_W, height: '100%' }}>
            {otpVariant === 'phone' ? (
              <PhoneOtpContent
                key={`phone-${otpUIKey}`}
                phoneDisplay="554 863 47 37"
                expiresAt={phoneExpiresAt ?? undefined}
                initialSeconds={OTP_SECONDS}
                onResend={handleResendPhone}
                onComplete={(code) => {
                  setPendingOpenRegister(true);
                  closeOtpModal();
                }}
                onPasswordLogin={slideToPassword}
              />
            ) : (
              <EmailOtpContent
                key={`email-${otpUIKey}`}
                email={emailValue || 'example@mail.com'}
                expiresAt={emailExpiresAt ?? undefined}
                initialSeconds={OTP_SECONDS}
                onResend={handleResendEmail}
                onComplete={(code) => {
                  setPendingOpenRegister(true);
                  closeOtpModal();
                }}
                onPasswordLogin={slideToPassword}
              />
            )}
          </View>

          {/* Sağ sayfa: Password */}
          <View style={{ width: MODAL_PANEL_W, height: '100%' }}>
            <PasswordContent
              // errorText="*Parola yanlış tekrar deneyin"
              errorText={null}
              loading={false}
              onForgotPress={slideBackToOtp}
              onHelpPress={() => {}}
              onSubmit={(pwd) => {
                // Başarılı giriş sonrası navigasyon
                closeOtpModal();
                goMain();
              }}
            />
          </View>
        </Animated.View>
      </CenteredModal>

      {/* Modal: Ülke Kodu Seçimi — ayrı bileşen */}
      <CountryCodeModal
        visible={isCountryModalVisible}
        activeCountry={country}
        onSelect={(c) => {
          setCountry(c);
          setCountryModalVisible(false);
          if (authMethod === 'phone') phoneRef.current?.focus();
        }}
        onClose={() => setCountryModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'relative', width: SCREEN_W, height: '100%', backgroundColor: '#ffffffff' },
  stageWrap: { position: 'relative', width: SCREEN_W * 2, height: '100%', flexDirection: 'row' },
  page: { position: 'relative', width: SCREEN_W, height: '100%' },
  abs: { position: 'absolute' },
  absCenterFull: { position: 'absolute', alignItems: 'center', justifyContent: 'center', width: '100%' },
  title: { fontSize: 18, fontWeight: '700', color: '#303336', fontFamily: 'Inter_700Bold' },

  // dış kapsayıcı boyutu — tüm butonlar bu stil ile geliyor
  button: {
    width: BUTTON_WIDTH, height: BUTTON_HEIGHT, borderRadius: 17, borderWidth: 1,
    borderColor: '#020202', backgroundColor: '#ffffff', flexDirection: 'row', alignItems: 'center', paddingLeft: 16,
  },

  veyaText: { fontSize: 16, color: '#303336', fontFamily: 'Inter_700Bold' },
  bottomInfoText: { fontSize: 14, lineHeight: 23, textAlign: 'center' },
  infoBoldBlack: { fontFamily: 'Inter_700Bold', color: '#000000' },
  infoLight: { fontFamily: 'Inter_300Light', color: '#303336' },
});

export default LoginContent;
