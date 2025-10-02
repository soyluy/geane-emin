// mobile/src/app/components/ui/RegistrationPanel.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  LayoutChangeEvent,
  Keyboard,
  Dimensions,
  UIManager,
  findNodeHandle,
  Platform,
  Animated,
  TouchableOpacity,
} from 'react-native';

import FieldHeader, { NoteToken } from './FieldHeader';
import TextField from './TextField';
import DateOfBirthField from './DateOfBirthField';
import Button from './Button';
import BackButton from './BackButton';

type Props = {
  onPressTerms?: () => void;
  onPressPrivacy?: () => void;
  onSubmit?: () => void;
};

/* ================= Layout sabitleri (KORUNDU) ================= */
const BTN_TOP_PCT   = 0.83106;
const TERMS_TOP_PCT = 0.94234;
// Tam ekran (status + nav bar DAHİL) taban
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

/* ================= Metin sabitleri ================= */
const MSG_USERNAME_REQUIRED = 'kullanıcı adı gerekli';
const MSG_USERNAME_MIN2     = 'en az 2 harf';

const RegistrationPanel: React.FC<Props> = ({
  onPressTerms,
  onPressPrivacy,
  onSubmit,
}) => {
  // Ekran genişliğine göre yatay gutter
  const GUTTER = SCREEN_W * 0.03953;
  const SHOW_HIDE_EXTRA_RIGHT = 7;

  const [baseContainerH, setBaseContainerH] = useState(0);
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    if (baseContainerH === 0) setBaseContainerH(e.nativeEvent.layout.height);
  }, [baseContainerH]);

  const buttonTop = baseContainerH * BTN_TOP_PCT;
  const termsTop  = baseContainerH * TERMS_TOP_PCT;

  /* ================= Klavye / kaydırma (KORUNDU) ================= */
  const [keyboardH, setKeyboardH] = useState(0);
  const [isPwFocused, setIsPwFocused] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const passwordWrapRef = useRef<View>(null);

  // Son odaklanan alan (autoflow için)
  type FieldKey = 'username' | 'dob' | 'password' | null;
  const lastFocusedRef = useRef<FieldKey>(null);

  useEffect(() => {
    const onShow = (e: any) => setKeyboardH(e.endCoordinates?.height ?? 0);
    const onHide = () => {
      setKeyboardH(0);
      // Android geri ile klavye kapanınca: son odaklı alan geçerliyse sıradaki eksik alana ilerle
      advanceIfValidOnKeyboardHide();
    };
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      onShow
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      onHide
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);  

  useEffect(() => {
    if (!isPwFocused || keyboardH === 0) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
      return;
    }

    const handle = findNodeHandle(passwordWrapRef.current);
    if (!handle) return;

    UIManager.measureInWindow?.(handle, (_x, y, _w, h) => {
      const fieldBottom   = y + h;
      const visibleBottom = SCREEN_H - keyboardH;
      const PADDING       = 85;
      const needed        = fieldBottom + PADDING - visibleBottom;
      const shift         = Math.max(0, needed);

      Animated.timing(translateY, {
        toValue: -shift,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });
  }, [isPwFocused, keyboardH, translateY]);

  /* ================= Alan durumları ================= */
  // Kullanıcı adı
  const [username, setUsername] = useState<string>('');
  type UsernameErrorType = 'none' | 'required' | 'min2';
  const [usernameErrorType, setUsernameErrorType] = useState<UsernameErrorType>('none');
  const usernameRef = useRef<any>(null);
  const [usernameKey, setUsernameKey] = useState(0);
  const [usernameAutoFocus, setUsernameAutoFocus] = useState(false);

  // Doğum tarihi
  const [dobValid, setDobValid] = useState<boolean>(false);
  const [dobAutoOpenKey, setDobAutoOpenKey] = useState<number>(0); // DateOfBirthField destekliyorsa modal açma tetikleyici

  // Parola
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false); // Göster/Gizle durumunu tutar
  const [pwTokens, setPwTokens] = useState<NoteToken[]>([
    { text: 'en az 8 karakter' },
    { text: 'harf' },
    { text: 'rakam' },
    { text: 'özel karakter' },
  ]);
  const passwordRef = useRef<any>(null);
  const [passwordKey, setPasswordKey] = useState(0);
  const [passwordAutoFocus, setPasswordAutoFocus] = useState(false);

  /* ================= Kurallar ================= */
  const lettersCount = (s: string) => (s.match(/\p{L}/gu) || []).length;
  const isUsernameValid = (s: string) => lettersCount(s) >= 2;

  const evalPassword = (value: string) => {
    const hasLen    = value.length >= 8;
    const hasLetter = /\p{L}/u.test(value);
    const hasDigit  = /\p{N}/u.test(value);
    const hasSpec   = /[^\p{L}\p{N}\s]/u.test(value);
    return { hasLen, hasLetter, hasDigit, hasSpec };
  };
  const isPasswordValid = (value: string) => {
    const f = evalPassword(value);
    return f.hasLen && f.hasLetter && f.hasDigit && f.hasSpec;
  };

  /* ================= Parola – yazarken canlı ================= */
  const recomputeWhileTypingPw = (value: string) => {
    const { hasLen, hasLetter, hasDigit, hasSpec } = evalPassword(value);
    setPwTokens([
      { text: 'en az 8 karakter', active: hasLen },
      { text: 'harf',             active: hasLetter },
      { text: 'rakam',            active: hasDigit },
      { text: 'özel karakter',    active: hasSpec },
    ]);
  };

  // Tamamla'da: boşsa "parola gerekli"; özel karakter eksikse “özel karakter” kırmızı
  const markPostValidationErrors = () => {
    const trimmed = password.trim();
    if (!trimmed) {
      setPwTokens([
        { text: 'parola gerekli', error: true },
        { text: 'en az 8 karakter' },
        { text: 'harf' },
        { text: 'rakam' },
        { text: 'özel karakter' },
      ]);
      return;
    }
    const { hasLen, hasLetter, hasDigit, hasSpec } = evalPassword(trimmed);
    setPwTokens([
      { text: 'en az 8 karakter', active: hasLen },
      { text: 'harf',             active: hasLetter },
      { text: 'rakam',            active: hasDigit },
      { text: 'özel karakter',    active: hasSpec, error: !hasSpec },
    ]);
  };

  /* ================= Form geçerliği ================= */
  const isFormValid =
    isUsernameValid(username) &&
    dobValid &&
    isPasswordValid(password);

  /* ================= Autoflow (mevcut mantık – korunmuştur) ================= */
  const completion = {
    username: isUsernameValid(username),
    dob: dobValid,
    password: isPasswordValid(password),
  };

  // 1) Önce ref.focus() dener; olmazsa remount + autoFocus (fallback)
  const forceFocus = (which: 'username' | 'password') => {
    if (which === 'username') {
      lastFocusedRef.current = 'username';
      if (usernameRef.current?.focus) {
        usernameRef.current.focus();
      } else {
        setUsernameAutoFocus(true);
        setUsernameKey((k) => k + 1);
        requestAnimationFrame(() => setUsernameAutoFocus(false));
      }
    } else {
      lastFocusedRef.current = 'password';
      setIsPwFocused(true);
      if (passwordRef.current?.focus) {
        passwordRef.current.focus();
      } else {
        setPasswordAutoFocus(true);
        setPasswordKey((k) => k + 1);
        requestAnimationFrame(() => setPasswordAutoFocus(false));
      }
    }
  };

  const openDobModal = () => {
    lastFocusedRef.current = 'dob';
    setDobAutoOpenKey(Date.now()); // Bileşen destekliyorsa modalı açar (no-op ise bozulmaz)
  };

  const focusOrOpen = (key: Exclude<FieldKey, null>) => {
    if (key === 'username') forceFocus('username');
    else if (key === 'dob') openDobModal();
    else forceFocus('password');
  };

  const nextOrderAfter = (from: Exclude<FieldKey, null>): Exclude<FieldKey, null>[] => {
    if (from === 'username') return ['dob', 'password'];
    if (from === 'dob')      return ['password', 'username'];
    return ['username', 'dob']; // from === 'password'
  };

  const advanceFrom = (from: Exclude<FieldKey, null>) => {
    const order = nextOrderAfter(from);
    for (const k of order) {
      if (!completion[k]) {
        focusOrOpen(k);
        return;
      }
    }
    // Hepsi tamamsa bir şey yapma (buton aktif)
  };

  const advanceIfValidOnKeyboardHide = () => {
    const who = lastFocusedRef.current;
    if (who === 'username' && isUsernameValid(username)) {
      advanceFrom('username');
    } else if (who === 'password' && isPasswordValid(password)) {
      if (!completion.username)      focusOrOpen('username');
      else if (!completion.dob)      openDobModal();
    }
    // DOB için keyboardDidHide önemli değil; modal akışı onChange ile yönetiliyor
  };

  /* ================= Render ================= */
  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY }] }]}
      onLayout={onLayout}
    >
      {/* Üst bilgilendirme */}
      <View style={[styles.block, { paddingHorizontal: GUTTER, marginTop: baseContainerH * 0.05100 }]}>
        <Text style={styles.topMessage}>
          Bu hesap ile daha önce kayıt olunmadı. Kayıt işleminizi tamamlayın.
        </Text>
      </View>

      {/* Kullanıcı adı */}
      <View style={styles.block}>
        <FieldHeader
          title="Kullanıcı Adı Belirleyin"
          noteTokens={
            usernameErrorType === 'none'
              ? undefined
              : [{ text: usernameErrorType === 'required' ? MSG_USERNAME_REQUIRED : MSG_USERNAME_MIN2, error: true }]
          }
          variant="default"
          hideIcon
        />
      </View>
      <View style={styles.block}>
        <TextField
          key={`username-${usernameKey}`}   // remount için
          placeholder=""
          value={username}
          onFocus={() => { lastFocusedRef.current = 'username'; }}
          onChangeText={(v: string) => {
            setUsername(v);
            // Geçerliyse uyarıyı temizle
            if (usernameErrorType !== 'none' && isUsernameValid(v)) {
              setUsernameErrorType('none');
            }
          }}
          onSubmitEditing={() => {
            const trimmed = username.trim();
            if (!trimmed) {
              setUsernameErrorType('required'); // boş → gerekli
              return;
            }
            if (!isUsernameValid(trimmed)) {
              setUsernameErrorType('min2');     // 2 harf kuralı
              return;
            }
            setUsernameErrorType('none');
            advanceFrom('username');            // geçerli → sıradaki eksik
          }}
          // Fokus yöntemleri (biri tutmazsa diğeri)
          inputRef={usernameRef}
          autoFocus={usernameAutoFocus}
          returnKeyType="next"
          blurOnSubmit={false}
        />
      </View>

      {/* Doğum tarihi */}
      <View style={styles.block}>
        <FieldHeader title="Doğum Tarihiniz" variant="default" hideIcon />
      </View>
      <View style={styles.block}>
        <DateOfBirthField
          onChange={(v: any) => {
            const valid = !!(v?.isValid ?? v?.iso);
            setDobValid(valid);
            if (valid) advanceFrom('dob'); // seçildi → sıradaki eksik
          }}
          placeholder=""
          autoOpenKey={dobAutoOpenKey}     // destekliyorsa modalı açar
        />
      </View>

      {/* Parola */}
      <View style={styles.block}>
        <FieldHeader title="Parola" noteTokens={pwTokens} variant="default" hideIcon />
      </View>

      <View ref={passwordWrapRef} style={[styles.block, { position: 'relative' }]}>
        <TextField
          key={`password-${passwordKey}`}  // remount için
          placeholder=""
          secureTextEntry={!showPassword}
          value={password}
          onFocus={() => { lastFocusedRef.current = 'password'; setIsPwFocused(true); }}
          onBlur={() => setIsPwFocused(false)}
          onChangeText={(v: string) => {
            setPassword(v);
            recomputeWhileTypingPw(v);     // yazarken: yeşil/gri
          }}
          onSubmitEditing={() => {
            if (!completion.username)      focusOrOpen('username');
            else if (!completion.dob)      openDobModal();
          }}
          inputRef={passwordRef}
          autoFocus={passwordAutoFocus}
          returnKeyType="done"
        />

        {/* Alan boşken göster/gizle görünmesin; ilk karakterle birlikte belirsin */}
        {password.length > 0 && (
          <TouchableOpacity
            onPress={() => setShowPassword((s) => !s)}
            activeOpacity={0.7}
            style={[styles.showHideBtn, { right: GUTTER + SHOW_HIDE_EXTRA_RIGHT }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.showHideText}>{showPassword ? 'Gizle' : 'Göster'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tamamla */}
      <View style={[styles.absCenter, { top: buttonTop }]}>
        <Button
          title="Tamamla"
          mode="locked"
          lockedStyleType="primary"
          disabled={!isFormValid}
          isDisabled={!isFormValid}
          accessibilityState={{ disabled: !isFormValid }}
          style={!isFormValid ? styles.btnDisabled : undefined}
          onPress={() => {
            // Username hata seçimi
            const u = username.trim();
            if (!u) setUsernameErrorType('required');
            else if (!isUsernameValid(u)) setUsernameErrorType('min2');
            else setUsernameErrorType('none');

            // Parola uyarıları
            markPostValidationErrors();

            if (!isFormValid) {
              // Eksik varsa ilk eksik alana yönlendir
              if (!completion.username)      focusOrOpen('username');
              else if (!completion.dob)      openDobModal();
              else if (!completion.password) focusOrOpen('password');
              return;
            }
            onSubmit?.();
          }}
        />
      </View>

      {/* Hukuki metin */}
      <View style={[styles.absCenter, { top: termsTop, paddingHorizontal: GUTTER }]}>
        <Text style={styles.legalText}>
          Kaydolarak,{' '}
          <Text style={styles.legalBold} onPress={onPressTerms}>Kullanım Şartları</Text>{' '}
          ve{' '}
          <Text style={styles.legalBold} onPress={onPressPrivacy}>Gizlilik Politikası</Text>
          ’mızı kabul edersiniz
        </Text>
      </View>
    </Animated.View>
  );
};

export default RegistrationPanel;

/* =========================  STYLES  ========================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
  },
  block: { marginTop: 0 },
  topMessage: {
    fontSize: 16,
    lineHeight: 24,
    color: '#303336',
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  absCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  legalText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#303336',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  legalBold: {
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#303336',
  },

  /** Göster/Gizle — TextField sağ içi, dikeyde tam ortalı */
  showHideBtn: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  showHideText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#303336',
  },

  /** Pasif buton görseli */
  btnDisabled: {
    opacity: 0.4,
  },
});
