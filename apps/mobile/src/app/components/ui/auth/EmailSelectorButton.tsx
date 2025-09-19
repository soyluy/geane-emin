import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';

// LoginContent'teki ikonla birebir aynı SVG (yol farkına dikkat!)
import MailIcon from '../../../../../assets/icons/e-postailedevam-Vector.svg';

type Props = {
  /** Bu buton aktif görünümde mi (input) yoksa pasif görünümde mi (ikon + label)? */
  isActive: boolean;

  /** E-posta input değeri ve değişim handler'ı */
  value: string;
  onChangeText: (v: string) => void;

  /**
   * Dış kapsayıcıya tıklandığında çalışır.
   * - Pasiften aktife geçiş için parent'ta swapPhoneEmail('email')
   * - Zaten aktifse input focus için parent'ta emailRef.current?.focus()
   */
  onPressSelect: () => void;

  /** Parent'taki TextInput ref'i (focus yönetimi bozulmasın diye) */
  inputRef: React.RefObject<TextInput>;

  /** Parent'ın verdiği kapsayıcı stil (LoginContent.styles.button) — ölçüler birebir kalsın */
  style?: ViewStyle;

  /** İstersen parent ek TextInput props geçebilir (opsiyonel) */
  inputProps?: Omit<TextInputProps, 'value' | 'onChangeText' | 'ref' | 'style' | 'placeholderTextColor'>;
};

const EmailSelectorButton: React.FC<Props> = ({
  isActive,
  value,
  onChangeText,
  onPressSelect,
  inputRef,
  style,
  inputProps,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPressSelect}
      style={style}
    >
      {isActive ? (
        <View style={s.emailRow}>
          <TextInput
            ref={inputRef}
            style={s.emailInput}
            placeholder="E-postanızı yazınız"
            placeholderTextColor="#8A8A8A"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            value={value}
            onChangeText={onChangeText}
            {...inputProps}
          />
        </View>
      ) : (
        <>
          <View style={s.iconContainer}>
            <MailIcon width={20} height={20} />
          </View>
          <View style={s.labelContainer}>
            <Text style={s.buttonText}>E-Posta ile devam</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  // LoginContent ile birebir aynı iç stiller:
  iconContainer: { justifyContent: 'center', alignItems: 'center' },
  labelContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingRight: 20 },
  buttonText: { fontSize: 15, color: '#000000', fontFamily: 'Inter_700Bold' },

  emailRow: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingRight: 16 },
  emailInput: { flex: 1, fontSize: 16, color: '#000000', fontFamily: 'Inter_400Regular', paddingVertical: 0 },
});

export default EmailSelectorButton;
