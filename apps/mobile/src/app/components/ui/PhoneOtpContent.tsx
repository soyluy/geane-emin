// mobile/src/app/components/ui/PhoneOtpContent.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
  Keyboard,
  Vibration,
  Platform,
} from "react-native";

type Props = {
  phoneDisplay?: string;
  /** Sunucudan gelen geçerlilik bitiş zamanı (ms epoch). Verilirse sayaç buradan hesaplanır. */
  expiresAt?: number;
  /** expiresAt yoksa fallback için başlangıç saniyesi (örn. 180) */
  initialSeconds?: number;
  onComplete?: (code: string) => void;
  onResend?: () => void;
  onHelpPress?: () => void;
  /** "Parola ile giriş yap" butonu için opsiyonel handler */
  onPasswordLogin?: () => void;
};

// ── Konum/ölçü sabitleri ──────────────────────────────────────────────────────
const TOP_TEXT_PCT = 0.15133;
const H_PAD_PCT = 0.08037;
const OTP_TOP_PCT = 0.42729;

// Konteynır ölçüleri ve boşluklar
const CODE_CONTAINER_H_PCT = 0.14243;      // %14.243 yükseklik
const CODE_CONTAINER_W_PCT = 0.83924;      // %83.924 genişlik
const TIMER_RIGHT_INSET_PCT = 0.030;       // sayaç ile sağ kenar arası küçük boşluk
const GAP_BELOW_CONTAINER_PCT = 0.02373;   // konteynır ile feedback (hata/başarı) arası boşluk

// countdown/yardım konumları (countdown konteynır içinde)
const RESEND_TOP = 0.32344;
const HELP_TOP_PCT = 0.84272;

// “Veya / Parola ile giriş” metninin konumu
const OR_TEXT_TOP_PCT = 0.64688; // modal üst kenarından %64,688

// Geçici doğrulama için (backend gelene kadar)
const DEFAULT_VALID_CODE = "000000";

type OtpStatus = "idle" | "verifying" | "success" | "error";

const PhoneOtpContent: React.FC<Props> = ({
  phoneDisplay = "554 863 47 37",
  expiresAt,
  initialSeconds = 180,
  onComplete,
  onResend,
  onHelpPress,
  onPasswordLogin,
}) => {
  // Konteyner ölçümü
  const [containerW, setContainerW] = useState(0);
  const [containerH, setContainerH] = useState(0);
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setContainerW(width);
    setContainerH(height);
  }, []);

  // Kod state (tek gizli input + görsel gösterim)
  const [codeStr, setCodeStr] = useState("");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRef = useRef<TextInput | null>(null);
  const [otpStatus, setOtpStatus] = useState<OtpStatus>("idle");

  // Sayaç state: expiresAt varsa ona bağlı; yoksa local countdown
  const [remaining, setRemaining] = useState<number>(initialSeconds);

  // expiresAt verildiyse kalan süreyi bundan türet
  useEffect(() => {
    let interval: any;
    if (typeof expiresAt === "number") {
      const tick = () => {
        const now = Date.now();
        const left = Math.max(0, Math.floor((expiresAt - now) / 1000));
        setRemaining(left);
      };
      tick(); // ilk hesap
      interval = setInterval(tick, 1000);
      return () => clearInterval(interval);
    }
    // expiresAt yoksa local countdown
    setRemaining(initialSeconds);
    interval = setInterval(() => {
      setRemaining((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, initialSeconds]);

  const expired = remaining <= 0;

  // 00:09 biçimi
  const mmss = useMemo(() => {
    const m = Math.floor(Math.max(remaining, 0) / 60)
      .toString()
      .padStart(2, "0");
    const s = (Math.max(remaining, 0) % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [remaining]);

  // Konumlar
  const hPad = containerW * H_PAD_PCT;
  const textTop = containerH * TOP_TEXT_PCT;
  const otpTop = containerH * OTP_TOP_PCT;

  // kod konteynırı ölçüleri/konumu
  const codeContW = containerW * CODE_CONTAINER_W_PCT;
  const codeContH = containerH * CODE_CONTAINER_H_PCT;
  const codeContLeft = (containerW - codeContW) / 2;
  const codeContTop = otpTop;

  // Feedback konumu
  const feedbackTop = codeContTop + codeContH + containerH * GAP_BELOW_CONTAINER_PCT;

  // Tamamlandığında kontrol
  const validateIfComplete = (next: string[]) => {
    const joined = next.join("");
    if (joined.length !== 6 || next.includes("")) return;

    if (expired) {
      setOtpStatus("error");
      return;
    }

    Keyboard.dismiss();
    Vibration.vibrate(50);
    setOtpStatus("verifying");

    const isOk = joined === DEFAULT_VALID_CODE; // Backend gelene kadar
    if (isOk) {
      setOtpStatus("success");
      setTimeout(() => onComplete?.(joined), 600);
    } else {
      setOtpStatus("error");
      setCodeStr("");
      setCode(["", "", "", "", "", ""]);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  // Tek gizli input değişimi (yalnızca rakam, max 6)
  const onChangeHidden = (t: string) => {
    const digits = t.replace(/\D/g, "").slice(0, 6);
    setCodeStr(digits);
    const next = digits.padEnd(6, " ").split("").map((c) => (c.trim() ? c : ""));
    setCode(next);
    setOtpStatus("idle");
    validateIfComplete(next);
  };

  const onPressResend = () => {
    // UI temizliği – backend yeni expiresAt döndürürse sayaç otomatik senkron olur
    setCodeStr("");
    setCode(["", "", "", "", "", ""]);
    setOtpStatus("idle");
    inputRef.current?.focus();
    onResend?.();
    if (typeof expiresAt !== "number") {
      setRemaining(initialSeconds);
    }
  };

  const showError = otpStatus === "error";
  const showSuccess = otpStatus === "success";

  // Konteynır içindeki metin: girilen rakamlar arası boşluk / yer tutucu
  const visualCode = useMemo(() => {
    const slots = code.map((c) => (c ? c : "–"));
    return slots.join(" ");
  }, [code]);

  if (!containerH) {
    // İlk layout gelene kadar boş dönerek flicker’ı azalt
    return <View style={styles.root} onLayout={onLayout} />;
  }

  return (
    <View style={styles.root} onLayout={onLayout}>
      {/* Üst bilgilendirme metni */}
      <View style={[styles.absFullWidth, { top: textTop, left: hPad, right: hPad }]} pointerEvents="none">
        <Text style={styles.infoText} numberOfLines={2}>
          <Text style={styles.infoBold}>{phoneDisplay}</Text>
          <Text>{"  numarasına\n"}</Text>
          <Text>{"gönderdiğimiz kodu yazınız."}</Text>
        </Text>
      </View>

      {/* Kod Konteynırı (stroke: #303336, içi beyaz) + sayaç içeride sağda */}
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={[styles.absFullWidth, { top: codeContTop, left: codeContLeft, width: codeContW, height: codeContH }]}
      >
        <View style={styles.codeContainer}>
          {/* Görsel kod gösterimi */}
          <Text style={styles.codeText} numberOfLines={1} accessibilityLabel={`Girilen kod: ${codeStr || "boş"}`}>
            {visualCode}
          </Text>

          {/* Gizli input (autofill açık) */}
          <TextInput
            ref={inputRef}
            value={codeStr}
            onChangeText={onChangeHidden}
            keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            importantForAutofill="yes"
            maxLength={6}
            style={styles.hiddenInput}
            // Android’de bazı klavye uygulamaları için
            underlineColorAndroid="transparent"
          />

          {/* Sayaç — konteynırın içinde, sağ kenarda (codeContW bazlı inset) */}
          <View
            style={[
              styles.timerWrapRight,
              { right: codeContW * TIMER_RIGHT_INSET_PCT },
            ]}
          >
            <Text style={styles.countdownText}>{mmss}</Text>
          </View>
        </View>
      </Pressable>

      {/* Hata / Başarı */}
      {(showError || showSuccess || expired) && (
        <View style={[styles.absFullWidth, { top: feedbackTop, left: hPad, right: hPad }]}>
          {expired ? (
            <Text style={styles.errorText}>Süreniz doldu, lütfen tekrar deneyin.</Text>
          ) : showError ? (
            <Text style={styles.errorText}>*Kod yanlış. Kontrol ederek tekrar deneyin</Text>
          ) : (
            <Text style={styles.successText}>Kod Doğrulandı</Text>
          )}
        </View>
      )}

      {/* Kodu Tekrar Gönder */}
      <View
        style={[
          styles.absLeft,
          { top: containerH * RESEND_TOP, left: containerW * H_PAD_PCT }
        ]}
      >
        <TouchableOpacity onPress={onPressResend} activeOpacity={0.7}>
          <Text style={styles.resendText}>Kodu Tekrar Gönder</Text>
        </TouchableOpacity>
      </View>

      {/* “Veya / Parola ile giriş yap” — buton */}
      <View style={[styles.absCenter, { top: containerH * OR_TEXT_TOP_PCT }]}>
        <TouchableOpacity onPress={onPasswordLogin} activeOpacity={0.7}>
          <Text style={styles.orText} numberOfLines={2}>
            <Text style={styles.orMedium}>veya{"\n"}</Text>
            <Text style={styles.orBold}>Parola ile giriş yap</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Yardım Merkezi */}
      <View style={[styles.absCenter, { top: containerH * HELP_TOP_PCT }]}>
        <TouchableOpacity onPress={onHelpPress} hitSlop={8} activeOpacity={0.7}>
          <Text style={styles.helpText}>Yardım Merkezi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PhoneOtpContent;

const styles = StyleSheet.create({
  root: { flex: 1, position: "relative", backgroundColor: "transparent" },
  absFullWidth: { position: "absolute" },
  absCenter: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  absLeft: { position: "absolute", alignItems: "flex-start" },

  infoText: { fontSize: 16, lineHeight: 20, color: "#020202", fontFamily: "Inter-Bold", textAlign: "left" },
  infoBold: { fontFamily: "Inter-Bold", fontWeight: "700", color: "#020202" },

  // Sayaç tipleri (konteynır içinde kullanılıyor)
  countdownText: {
    fontSize: 14,
    lineHeight: 18,
    color: "#303336",
    fontFamily: "Inter-Regular",
    fontWeight: "700",
    textAlign: "right",
  },

  // Kod konteynırı stili
  codeContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#303336",   // stroke rengi
    borderRadius: 15,
    justifyContent: "center",
  },

  // Gizli input (odak almak için görünür ama neredeyse şeffaf)
  hiddenInput: {
    position: "absolute",
    left: 0, right: 0, top: 0, bottom: 0,
    opacity: 0.02,
  },

  // Kod görsel metni (ortada)
  codeText: {
    textAlign: "center",
    fontSize: 22,
    lineHeight: 26,
    color: "#303336",
    letterSpacing: 6, // slot hissi
    fontFamily: "Inter-Bold",
    fontWeight: "700",
  },

  timerWrapRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "flex-end",
  },

  // Tekrar gönder butonu
  resendText: { fontSize: 13, lineHeight: 20, color: "#303336", fontFamily: "Inter-Bold", fontWeight: "500" },

  // Feedback/metinler
  errorText: { fontSize: 12, lineHeight: 15, color: "#F13957", fontFamily: "Inter-Regular" },
  successText: { fontSize: 15, lineHeight: 19, color: "#303336", fontFamily: "Inter-Regular" },

  // “Veya / Parola ile giriş” metni
  orText: { textAlign: "center", lineHeight: 25, color: "#303336" },
  orMedium: { fontSize: 14, fontFamily: "Inter-Medium", fontWeight: "400" },
  orBold: { fontSize: 14, fontFamily: "Inter-Bold", fontWeight: "500", color: "#303336" },

  helpText: { fontSize: 14, lineHeight: 30, color: "#616161", fontFamily: "Inter-Medium", fontWeight: "700", textAlign: "center" },
});
