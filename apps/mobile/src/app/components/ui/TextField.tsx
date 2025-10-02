// mobile/src/app/components/ui/TextField.tsx

import React, { forwardRef } from 'react';
import {
  TextInput,
  StyleSheet,
  Dimensions,
  TextInputProps,
  Platform,
} from 'react-native';

const TextField = forwardRef<TextInput, TextInputProps>((props, ref) => {
  // Tam ekran (status + nav bar DAHİL) taban
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

  const HEIGHT_RATIO = 0.04184;        // %4.184 yükseklik
  const BOX_HEIGHT = SCREEN_H * HEIGHT_RATIO;

  // Sol/sağ DIŞ boşluk (Figma %3,953)
  const H_GUTTER = SCREEN_W * 0.03953;

  return (
    <TextInput
      ref={ref}
      {...props}
      style={[
        styles.input,
        {
          // Dış boşluklar
          marginLeft: H_GUTTER,
          marginRight: H_GUTTER,

          // Yükseklik ve hizalama
          alignSelf: 'stretch',      // ebeveyni enine doldur (marginler düşülür)
          height: BOX_HEIGHT,
          textAlignVertical: 'center',
          includeFontPadding: false,
          ...(Platform.OS === 'ios' && { lineHeight: BOX_HEIGHT }), // iOS dikey merkez garantisi

          // İç boşluk (kutu içi)
          paddingHorizontal: 14,
        },
        props.style, // dışarıdan verilen stil (override)
      ]}
      placeholderTextColor="#888"
    />
  );
});

TextField.displayName = 'TextField';

export default TextField;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 0,
    fontSize: 14,
  },
});
