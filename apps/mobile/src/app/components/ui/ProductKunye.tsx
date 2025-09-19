// apps/mobile/src/app/components/ui/ProductKunye.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TextLayoutEventData,
  NativeSyntheticEvent,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AddButton from './addbutton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface ProductKunyeProps {
  imageUri: string;
  title: string;
  onAdd: () => void;
}

export default function ProductKunye({ imageUri, title, onAdd }: ProductKunyeProps) {
  // Tam ekran (status + nav bar DAHİL) taban
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

  // Container ve çerçeve ölçüleri
  const containerHeight = SCREEN_H * 0.12017;
  const frameWidth = SCREEN_W * 0.1511;
  const frameHeight = containerHeight * 0.80357;
  const frameMarginLeft = SCREEN_W * 0.03953;

  // Başlık ve konumlandırmalar
  const titleLeft = SCREEN_W * 0.22558;
  const titleTop = containerHeight * 0.19642;
  const frameTop = (containerHeight - frameHeight) / 2;

  const [isTitleMultiLine, setIsTitleMultiLine] = useState(false);
  const handleTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    setIsTitleMultiLine(e.nativeEvent.lines.length > 1);
  };

  // Tedarikçi bilgileri (placeholder)
  const supplierLogoUri =
    'https://static.ticimax.cloud/2248/Uploads/HeaderTasarim/Header8/36895123-3e13-4a3d-a972-65a6500f4ae8.jpg';
  const supplierName = 'Retrobird';
  const supplierTagText = 'Butik';

  // Tedarikçi satırı ve etiket ölçüleri
  const rowTop = containerHeight * 0.54464;
  const logoSize = containerHeight * 0.2;
  const nameGap = 4;
  const tagHeight = containerHeight * 0.14285;
  const tagTextBottomGap = tagHeight * 0.01875;
  const taglineTop = rowTop + logoSize;

  const navigation = useNavigation();
  const navigateToSellerProfile = () => {
    // @ts-ignore - tiplenmemiş navigation yapısı
    navigation.navigate('SellerProfileScreen');
  };

  return (
    <View style={[styles.container, { width: SCREEN_W, height: containerHeight }]}>
      <View
        style={[
          styles.frame,
          { width: frameWidth, height: frameHeight, marginLeft: frameMarginLeft, top: frameTop },
        ]}
      >
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      </View>

      <Text
        onTextLayout={handleTextLayout}
        style={[
          styles.title,
          {
            left: titleLeft,
            top: isTitleMultiLine ? frameTop : titleTop,
            fontSize: 14,
            letterSpacing: 14 * 0.04,
            right: frameMarginLeft,
          },
        ]}
      >
        {title}
      </Text>

      <TouchableOpacity onPress={navigateToSellerProfile} activeOpacity={0.7} style={StyleSheet.absoluteFill}>
        <View style={[styles.supplierRow, { left: titleLeft, top: rowTop }]}>
          <View
            style={{
              width: logoSize,
              height: logoSize,
              borderRadius: logoSize / 2,
              borderWidth: 1,
              borderColor: '#181818',
              overflow: 'hidden',
            }}
          >
            <Image source={{ uri: supplierLogoUri }} style={styles.logoImage} resizeMode="cover" />
          </View>
          <Text style={[styles.supplierName, { marginLeft: nameGap, fontSize: 12 }]}>{supplierName}</Text>
          <View
            style={[
              styles.tagBox,
              {
                marginLeft: nameGap,
                height: tagHeight,
                borderRadius: 0,
                justifyContent: 'flex-end',
                paddingBottom: tagTextBottomGap,
              },
            ]}
          >
            <Text style={styles.tagText}>{supplierTagText}</Text>
          </View>
        </View>

        <Text style={[styles.tagline, { left: titleLeft, top: taglineTop }]}>Tarafından Oluşturuldu</Text>
      </TouchableOpacity>

      <View
        style={{
          position: 'absolute',
          left: SCREEN_W * 0.80697,
          top: containerHeight * 0.58928,
        }}
      >
        <AddButton onPress={onAdd} />
      </View>

      <TouchableOpacity
        onPress={() => {}}
        style={{
          position: 'absolute',
          left: SCREEN_W * 0.9093,
          top: containerHeight * 0.58928,
          width: 28,
          height: 28,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <MaterialIcons name="more-vert" size={30} color="#181818" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    position: 'relative',
    justifyContent: 'center',
  },
  frame: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#BFBFBF',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '90%',
    height: '90%',
    borderRadius: 10,
  },
  title: {
    position: 'absolute',
    fontFamily: 'Inter-SemiBold',
    color: '#181818',
    flexWrap: 'wrap',
  },
  supplierRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  supplierName: {
    fontFamily: 'Inter-Medium',
    color: '#181818',
  },
  tagBox: {
    backgroundColor: '#F13957',
    paddingLeft: 3.5,
    paddingRight: 9,
  },
  tagText: {
    fontFamily: 'Inter-Black',
    fontSize: 10,
    color: '#FFFFFF',
  },
  tagline: {
    position: 'absolute',
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: '#414341',
  },
});
