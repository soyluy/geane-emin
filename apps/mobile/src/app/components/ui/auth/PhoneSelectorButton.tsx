import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';

// LoginContent'teki ikonla birebir aynı SVG (yol farkına dikkat!)
import PhoneIcon from '../../../../../assets/icons/telefoniledevam-Vector.svg';

export type Country = { name: string; dial: string; iso2: string };

type Props = {
  /** Bu buton aktif görünümde mi (input + ülke kodu) yoksa pasif görünümde mi (ikon + label)? */
  isActive: boolean;

  /** Telefon input değeri ve değişim handler'ı */
  value: string;
  onChangeText: (v: string) => void;

  /** Ülke kodu bilgisi ve seçim modalını açan handler */
  country: Country;
  onOpenCountry: () => void;

  /**
   * Dış kapsayıcıya tıklandığında çalışır.
   * - Pasiften aktife geçiş için parent'ta swapPhoneEmail('phone')
   * - Zaten aktifse input focus için parent'ta phoneRef.current?.focus()
   */
  onPressSelect: () => void;

  /** Parent'taki TextInput ref'i (focus yönetimi bozulmasın diye) */
  inputRef: React.RefObject<TextInput>;

  /** Parent'ın verdiği kapsayıcı stil (LoginContent.styles.button) — ölçüler birebir kalsın */
  style?: ViewStyle;

  /** İstersen parent ek TextInput props geçebilir (opsiyonel) */
  inputProps?: Omit<TextInputProps, 'value' | 'onChangeText' | 'ref' | 'style' | 'placeholderTextColor'>;
};

const PhoneSelectorButton: React.FC<Props> = ({
  isActive,
  value,
  onChangeText,
  country,
  onOpenCountry,
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
        <View style={s.phoneRow}>
          {/* Ülke kodu TIKLANABİLİR */}
          <Pressable
            onPress={onOpenCountry}
            hitSlop={8}
            style={s.countryPress}
          >
            <Text style={s.countryText}>
              {country.name} ({country.dial})
            </Text>
          </Pressable>

          <TextInput
            ref={inputRef}
            style={s.phoneInput}
            placeholder="Telefon numarası"
            placeholderTextColor="#8A8A8A"
            keyboardType="phone-pad"
            returnKeyType="done"
            value={value}
            onChangeText={onChangeText}
            {...inputProps}
          />
        </View>
      ) : (
        <>
          <View style={s.iconContainer}>
            <PhoneIcon width={20} height={20} />
          </View>
          <View style={s.labelContainer}>
            <Text style={s.buttonText}>Telefon ile devam</Text>
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

  phoneRow: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingRight: 16 },
  countryPress: { marginRight: 10 },
  countryText: { fontSize: 16, color: '#000000', fontFamily: 'Inter_600SemiBold' },
  phoneInput: { flex: 1, fontSize: 16, color: '#303336', fontFamily: 'Inter_400Regular', paddingVertical: 0 },
});

export default PhoneSelectorButton;
