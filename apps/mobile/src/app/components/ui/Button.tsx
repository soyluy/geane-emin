import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';

const { height: SCREEN_H } = Dimensions.get('screen');
const HEIGHT_RATIO = 0.0375;
const BUTTON_HEIGHT = SCREEN_H * HEIGHT_RATIO;

type Mode = 'locked' | 'static' | 'selectable';
type LockedStyleType = 'primary' | 'secondary';

interface ButtonProps {
  title: string;
  mode: Mode;
  selected?: boolean; // sadece selectable için
  onPress?: () => void;
  lockedStyleType?: LockedStyleType; // sadece locked için
}

export default function Button({
  title,
  mode,
  selected = false,
  onPress,
  lockedStyleType = 'primary',
}: ButtonProps) {
  // Stil belirleme
  let containerStyle: ViewStyle = {};
  let textStyle: TextStyle = {};

  if (mode === 'locked') {
    if (lockedStyleType === 'primary') {
      containerStyle = styles.selectedContainer;
      textStyle = styles.selectedText;
    } else {
      containerStyle = styles.unselectedContainer;
      textStyle = styles.unselectedText;
    }
  } else if (mode === 'static') {
    containerStyle = styles.selectedContainer;
    textStyle = styles.selectedText;
  } else if (mode === 'selectable') {
    containerStyle = selected
      ? styles.selectedContainer
      : styles.unselectedContainer;
    textStyle = selected
      ? styles.selectedText
      : styles.unselectedText;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.button, containerStyle]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: BUTTON_HEIGHT,
    borderRadius: 15,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  selectedContainer: {
    backgroundColor: '#F13957',
    borderColor: '#F13957',
  },
  unselectedContainer: {
    backgroundColor: '#fff',
    borderColor: '#000',
  },
  text: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  selectedText: {
    color: '#fff',
  },
  unselectedText: {
    color: '#000',
  },
});
