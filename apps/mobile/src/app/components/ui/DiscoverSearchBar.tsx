import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import SearchIcon from '../../../../assets/icons/nav/search-active.svg';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

// Oranlar
const CONTAINER_HEIGHT_RATIO = 0.12231;
const BAR_HEIGHT_RATIO = 0.35087;
const BAR_WIDTH_RATIO = 0.9209;
const ICON_LEFT_PADDING_RATIO = 0.03787;
const BAR_RADIUS = 23;

export default function DiscoverSearchBar() {
  const containerHeight = SCREEN_H * CONTAINER_HEIGHT_RATIO;
  const barHeight = containerHeight * BAR_HEIGHT_RATIO;
  const barWidth = SCREEN_W * BAR_WIDTH_RATIO;
  const iconLeftPadding = barWidth * ICON_LEFT_PADDING_RATIO;

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      <View
        style={[
          styles.searchBar,
          {
            width: barWidth,
            height: barHeight,
            borderRadius: BAR_RADIUS,
            paddingLeft: iconLeftPadding + 24,
            borderWidth: 1,
            borderColor: '#181818', // dış çerçeve rengi
            backgroundColor: '#FFFFFF', // iç renk
          },
        ]}
      >
        <SearchIcon
          width={20}
          height={20}
          style={[
            styles.icon,
            {
              position: 'absolute',
              left: iconLeftPadding,
            },
          ]}
        />
        <TextInput
          style={styles.input}
          placeholder="Ne bulmak istiyorsun"
          placeholderTextColor="#888"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_W,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Keşfet ekranı zemin rengi
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 14,
    includeFontPadding: false,
    textAlignVertical: 'center',
    paddingVertical: Platform.OS === 'ios' ? 6 : 0,
    color: '#000',
  },
  icon: {
    color: '#888',
  },
});
