import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';

type Props = {
  /** Butonun üstündeki yazı (ör: "Google ile devam" | "Apple ile devam") */
  title: string;

  /** İkon (örn. <GoogleIcon /> veya <AppleIcon />) */
  icon: React.ReactNode;

  /** Tıklama davranışı */
  onPress: () => void;

  /** Parent’ın verdiği kapsayıcı stil (LoginContent.styles.button) */
  style?: ViewStyle;
};

const SocialLoginButton: React.FC<Props> = ({ title, icon, onPress, style }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={style}>
      <View style={s.iconContainer}>{icon}</View>
      <View style={s.labelContainer}>
        <Text style={s.buttonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  iconContainer: { justifyContent: 'center', alignItems: 'center' },
  labelContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingRight: 20 },
  buttonText: { fontSize: 15, color: '#000000', fontFamily: 'Inter_700Bold' },
});

export default SocialLoginButton;
