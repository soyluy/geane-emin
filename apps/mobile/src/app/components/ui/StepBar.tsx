import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width: SCREEN_W } = Dimensions.get('screen');
const H_PADDING = SCREEN_W * 0.038;

interface StepBarProps {
  labels: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function StepBar({ labels, activeIndex, onSelect }: StepBarProps) {
  return (
    <View style={styles.container}>
      {labels.map((label, i) => {
        const isActive = activeIndex === i;

        return (
          <TouchableWithoutFeedback key={i} onPress={() => onSelect(i)}>
            <View
              style={[
                styles.button,
                {
                  backgroundColor: isActive ? '#F13957' : '#ffffff',
                  borderColor: isActive ? '#F13957' : '#181818',
                },
              ]}
            >
              <Text
                style={[
                  styles.label,
                  { color: isActive ? '#ffffff' : '#181818' },
                ]}
              >
                {label}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: H_PADDING,
    paddingTop: 28,
    paddingBottom: 8,
    gap: 10,
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
