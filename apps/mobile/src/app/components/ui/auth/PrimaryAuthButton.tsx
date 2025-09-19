import React from 'react';
import { ViewStyle } from 'react-native';

// Mevcut Button bileşenini kullanıyoruz (LoginContent'teki aynı import yolu!)
import Button from '../Button';

type Props = {
  /** Şu anki giriş yöntemi (telefon mu e-posta mı) */
  authMethod: 'phone' | 'email';

  /** Basıldığında çalışacak fonksiyon (genelde openOtpModal(authMethod)) */
  onPress: () => void;

  /** Parent konumlandırma stilleri için */
  style?: ViewStyle;
};

const PrimaryAuthButton: React.FC<Props> = ({ authMethod, onPress, style }) => {
  return (
    <Button
      title={authMethod === 'phone' ? 'Telefon ile devam' : 'E-Posta ile devam'}
      mode="locked"
      lockedStyleType="primary"
      onPress={onPress}
      style={style}
    />
  );
};

export default PrimaryAuthButton;
