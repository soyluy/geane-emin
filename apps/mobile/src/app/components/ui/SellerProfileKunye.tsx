import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ArrowDown from '../../../../assets/icons/arrow-down.svg';
import PlayerIcon from '../../../../assets/icons/Player-Vector.svg';
import Button from './Button';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

export default function SellerProfileKunye() {
  const [ekipAcik, setEkipAcik] = useState(false);

  const containerWidth = SCREEN_W;
  const containerHeight = SCREEN_H * 0.57933;

  const temekKunyeWidth = containerWidth;
  const temekKunyeHeight = containerHeight * 0.41666;

  const logoSize = temekKunyeWidth * 0.17209;
  const starGap = temekKunyeWidth * 0.00697;
  const afterStarsGap = temekKunyeWidth * 0.01162;

  const rating = 4.5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const textContainerHeight = containerHeight * 0.17592;
  const textLeft = containerWidth * 0.07906;
  const textRight = containerWidth * 0.07906;
  const textBottomSpacing = textContainerHeight * 0.21052;

  const videoHeight = containerHeight * 0.37037;
  const videoWidth = containerWidth * 0.32558;
  const videoTop = temekKunyeHeight + textContainerHeight;
  const videoLeft = containerWidth * 0.07906;

  return (
    <View style={[styles.container, { width: containerWidth, height: containerHeight }]}>
      {/* TEMEK KUNYE */}
      <View style={[styles.temekKunye, { width: temekKunyeWidth, height: temekKunyeHeight }]}>
        {/* Logo */}
        <Image
          source={{ uri: 'https://example.com/logo.jpg' }}
          style={[
            styles.logo,
            {
              width: logoSize,
              height: logoSize,
              left: temekKunyeWidth * 0.07906,
              top: temekKunyeHeight * 0.16444,
              borderRadius: logoSize / 2,
            },
          ]}
          resizeMode="cover"
        />

        {/* Tedarikçi İsmi */}
        <Text
          style={[
            styles.sellerName,
            {
              left: temekKunyeWidth * 0.28139,
              top: temekKunyeHeight * 0.20444,
            },
          ]}
        >
          Tedarikçi İsmi
        </Text>

        {/* Yıldızlar */}
        <View
          style={[
            styles.ratingRow,
            {
              left: temekKunyeWidth * 0.28139,
              top: temekKunyeHeight * 0.39555,
            },
          ]}
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const iconName =
              i < fullStars ? 'star' : i === fullStars && hasHalfStar ? 'star-half' : 'star-border';
            return (
              <Icon
                key={i}
                name={iconName}
                size={12}
                color="#616161"
                style={{ marginRight: i !== 4 ? starGap : 0 }}
              />
            );
          })}
          <Text style={[styles.ratingText, { marginLeft: afterStarsGap }]}>4.5 Değerlendirmeler (198)</Text>
          <ArrowDown width={12} height={12} style={styles.arrowIcon} />
        </View>

        {/* Takipçi Konteynırı */}
        <View
          style={{
            position: 'absolute',
            left: temekKunyeWidth * 0.07906,
            top: temekKunyeHeight * 0.56888,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={styles.profileRow}>
            {[
              'https://randomuser.me/api/portraits/women/10.jpg',
              'https://randomuser.me/api/portraits/men/11.jpg',
              'https://randomuser.me/api/portraits/women/12.jpg',
              'https://randomuser.me/api/portraits/men/13.jpg',
            ].map((uri, idx) => (
              <Image
                key={idx}
                source={{ uri }}
                style={{
                  position: 'absolute',
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#fff',
                  left: idx * 15,
                  backgroundColor: '#ccc',
                }}
              />
            ))}
          </View>
          <Text style={styles.followerText}>111 B Takipçi</Text>
        </View>

        {/* Ekip Üyeleri */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: temekKunyeWidth * 0.07906,
            top: temekKunyeHeight * 0.75555,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => setEkipAcik(!ekipAcik)}
          activeOpacity={0.7}
        >
          <Text style={styles.ekipBaslik}>Ekip Üyeleri</Text>
          <ArrowDown
            width={10}
            height={10}
            style={{
              marginLeft: 4,
              transform: [{ rotate: ekipAcik ? '180deg' : '0deg' }],
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            position: 'absolute',
            left: temekKunyeWidth * 0.07906,
            top: temekKunyeHeight * 0.75555 + 20,
            fontSize: 10,
            fontFamily: 'Inter-Medium',
            color: '#616161',
          }}
        >
          Tarafından Oluşturuldu
        </Text>

        {/* Butonlar */}
        <View
          style={{
            position: 'absolute',
            left: temekKunyeWidth * 0.48372,
            top: temekKunyeHeight * 0.74222,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Button title="Mesaj" mode="locked" lockedStyleType="secondary" />
          <View style={{ width: temekKunyeWidth * 0.02558 }} />
          <Button title="Takip Et" mode="locked" lockedStyleType="primary" />
        </View>
      </View>

      {/* TANITIM METNI KONTEYNERI */}
      <View
        style={{
          position: 'absolute',
          top: temekKunyeHeight,
          width: containerWidth,
          height: textContainerHeight,
        }}
      >
        <Text
          style={{
            position: 'absolute',
            left: textLeft,
            right: textRight,
            bottom: textBottomSpacing,
            fontSize: 10,
            lineHeight: 15,
            fontFamily: 'Inter-Regular',
            color: '#616161',
          }}
        >
          Buraya tanıtım metni geleceksadas
        </Text>
      </View>

      {/* Video Alanı */}
      <View
        style={[
          styles.videoPlaceholder,
          {
            left: videoLeft,
            top: videoTop,
            width: videoWidth,
            height: videoHeight,
          },
        ]}
      >
        <PlayerIcon width={20} height={20} />
      </View>

      {/* Aktif Ürün */}
      <View
        style={{
          position: 'absolute',
          right: containerWidth * 0.06511,
          top: containerHeight * 0.92962,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#F13957',
            marginRight: 6,
          }}
        />
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Inter-Medium',
            color: '#303336',
          }}
        >
          187 Aktif Ürün
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    position: 'relative',
  },
  temekKunye: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#FFFFFF',
  },
  logo: { position: 'absolute', borderWidth: 1, borderColor: '#181818' },
  sellerName: {
    position: 'absolute',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#303336',
  },
  ratingRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 11,
    color: '#181818',
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
  },
  arrowIcon: { marginLeft: 8 },
  profileRow: {
    position: 'relative',
    height: 20,
    width: 75,
    marginRight: 8,
  },
  followerText: {
    fontSize: 12,
    color: '#616161',
    fontFamily: 'Inter-Medium',
  },
  ekipBaslik: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#181818',
  },
  videoPlaceholder: {
    position: 'absolute',
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
