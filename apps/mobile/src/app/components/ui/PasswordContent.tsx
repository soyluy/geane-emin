// PassworldContent.tsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  LayoutChangeEvent,
  StyleSheet,
} from "react-native";
import Button from "./Button"; // Button.tsx: genişliğini kendi belirler

type Props = {
  onForgotPress?: () => void; // İleride “Parolamı Unuttum” paneline bağlanacak
  onSuccess?: () => void;     // Başarılı girişte üstten navigasyon yaptırmak için
};

const H_PAD_PCT = 0.08037;     // modal genişliğinin %8,037'si
const TITLE_TOP_PCT = 0.18991; // %18,991
const FORGOT_TOP_PCT = 0.29080;// %29,080
const INPUT_TOP_PCT = 0.42729; // %42,729
const BUTTON_TOP_PCT = 0.69732;// %69,732  ← İSTEM: buton bu orana çekildi
const HELP_TOP_PCT = 0.84272;  // %84,272 (dokunulmadı)

const PRIMARY = "#F13957";
const BORDER  = "#020202";
const RADIUS  = 15;

// Varsayılan parola kuralı
const DEFAULT_PASSWORD = "1962534oOo";

const PassworldContent: React.FC<Props> = ({ onForgotPress, onSuccess }) => {
  const [containerW, setContainerW] = useState(0);
  const [containerH, setContainerH] = useState(0);
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<TextInput | null>(null);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setContainerW(width);
    setContainerH(height);
  }, []);

  const hPad     = useMemo(() => containerW * H_PAD_PCT, [containerW]);
  const titleTop = useMemo(() => containerH * TITLE_TOP_PCT, [containerH]);
  const forgotTop= useMemo(() => containerH * FORGOT_TOP_PCT, [containerH]);
  const inputTop = useMemo(() => containerH * INPUT_TOP_PCT, [containerH]);
  const btnTop   = useMemo(() => containerH * BUTTON_TOP_PCT, [containerH]);
  const helpTop  = useMemo(() => containerH * HELP_TOP_PCT, [containerH]);

  // giriş yüksekliğini (ve toggle box'ı) ekran yüksekliğine göre hesapla
  const inputH   = Math.max(44, containerH * 0.12 * 0.55);
  const eyeBox   = Math.max(40, inputH);
  const showToggle = password.length > 0;

  // Placeholder’dan yazmaya başlayınca eski hatayı temizle
  const handleChange = (txt: string) => {
    setPassword(txt);
    if (error) setError(null);
  };

  const validateAndSubmit = () => {
    setSubmitted(true);
    if (password === DEFAULT_PASSWORD) {
      // Başarılı → doğrulama metni görünsün, ardından üst bileşene başarıyı bildir
      // (navigasyonu üst komponent yapacak)
      setTimeout(() => onSuccess?.(), 0);
    } else {
      setError("PAROLA YANLIŞ");
    }
  };

  const showErr = !!error;
  const showOk  = submitted && !error && password.length > 0 && password === DEFAULT_PASSWORD;

  return (
    <View style={{ flex: 1, position: "relative" }} onLayout={onLayout}>
      {/* Başlık - İSTEM: “Parolanızı Giriniz” */}
      <View style={{ position: "absolute", top: titleTop, left: hPad }}>
        <Text
          style={{
            fontSize: 18,
            lineHeight: 22,
            color: "#303336",
            fontFamily: "Inter-Bold",
            fontWeight: "700",
          }}
        >
          Parolanızı Giriniz
        </Text>
      </View>

      {/* İSTEM: “Kodu yeniden gönder” yerine “Parolamı Unuttum” (buton yerine metin/bağlantı; konum/stil korunur) */}
      <View style={{ position: "absolute", top: forgotTop, left: hPad }}>
        <Text
          onPress={onForgotPress}
          style={{
            fontSize: 15,             // Inter Regular 15
            lineHeight: 19,
            color: "#616161",
            fontFamily: "Inter-Regular",
            fontWeight: "400",
          }}
        >
          Parolamı Unuttum
        </Text>
      </View>

      {/* Parola konteynırı (OTP sayaç TAMAMEN kaldırıldı, yerine Göster/Gizle eklendi) */}
      <View
        style={{
          position: "absolute",
          top: inputTop,
          left: hPad,
          right: hPad, // sol/sağ %8,037 boşluk
        }}
      >
        <Pressable
          onPress={() => inputRef.current?.focus()}
          style={[
            styles.inputWrap,
            { height: inputH, borderRadius: RADIUS, borderColor: BORDER },
          ]}
        >
          <TextInput
            ref={(el) => (inputRef.current = el)}
            value={password}
            onChangeText={handleChange}
            placeholder="Parolanızı yazınız"
            placeholderTextColor="#8A8A8A"
            secureTextEntry={secure}
            returnKeyType="done"
            onSubmitEditing={validateAndSubmit}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            autoComplete="password"
            style={[styles.input, { height: inputH }]}
          />
          {showToggle && (
            <Pressable
              onPress={() => setSecure((s) => !s)}
              hitSlop={16}
              style={[styles.eyeBtn, { height: eyeBox, width: eyeBox, borderRadius: RADIUS }]}
              accessibilityRole="button"
              accessibilityLabel={secure ? "Parolayı göster" : "Parolayı gizle"}
            >
              <Text style={styles.eyeTxt}>{secure ? "Göster" : "Gizle"}</Text>
            </Pressable>
          )}
        </Pressable>

        {/* Uyarı / Doğrulama metinleri - CAPS LOCK ve hedef içerikler */}
        {(showErr || showOk) && (
          <View style={{ marginTop: 8 }}>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 18,
                fontFamily: "Inter-Regular",
                fontWeight: "400",
                color: showErr ? PRIMARY : "#2FA84F",
              }}
            >
              {showErr ? "PAROLA YANLIŞ" : "PAROLA DOĞRULANDI"}
            </Text>
          </View>
        )}
      </View>

      {/* “Veya parola ile giriş yap” vb. ek butonlar TAMAMEN kaldırıldı */}

      {/* Giriş Yap butonu — genişliği Button.tsx kendisi belirliyor, merkezde ve %69,732 top */}
      <View
        style={{
          position: "absolute",
          top: btnTop,
          left: 0,
          right: 0,
          alignItems: "center",
        }}
      >
        <Button
          title="Giriş Yap"
          mode="locked"
          lockedStyleType="primary" // '#F13957'
          onPress={validateAndSubmit}
        />
      </View>

      {/* Yardım Merkezi (dokunulmadı) */}
      <View
        style={{
          position: "absolute",
          top: helpTop,
          left: 0,
          right: 0,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            lineHeight: 20,
            color: "#616161",
            fontFamily: "Inter-Medium",
            fontWeight: "500",
          }}
        >
          Yardım Merkezi
        </Text>
      </View>
    </View>
  );
};

export default PassworldContent;

const styles = StyleSheet.create({
  inputWrap: {
    width: "100%",
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    color: "#020202",
    fontFamily: "Inter-Bold",
    fontWeight: "700",
    includeFontPadding: false,
    paddingVertical: 0,
    paddingHorizontal: 0,
    fontSize: 16,
  },
  eyeBtn: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  eyeTxt: {
    fontSize: 14,
    lineHeight: 18,
    color: "#616161",
    fontFamily: "Inter-Medium",
    fontWeight: "500",
  },
});
