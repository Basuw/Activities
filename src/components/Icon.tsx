import React from 'react';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IconProps {
  /** SF Symbol name (iOS) */
  sfSymbol: string;
  /** MaterialCommunityIcons name (Android fallback) */
  androidIcon: string;
  size?: number;
  color?: string;
  /** Extra styles applied to the icon wrapper (useful for margins/alignment) */
  style?: StyleProp<ViewStyle>;
}

/**
 * Cross-platform icon component.
 * - iOS  → native SF Symbol via react-native-sfsymbols
 * - Android → MaterialCommunityIcons
 *
 * SFSymbol renders in a box of exactly `size × size` with no natural padding,
 * so we wrap it in a fixed-size View to guarantee consistent bounding boxes.
 */
const Icon: React.FC<IconProps> = ({ sfSymbol, androidIcon, size = 24, color, style }) => {
  if (Platform.OS === 'ios') {
    return (
      <View
        style={[
          { width: size, height: size, alignItems: 'center', justifyContent: 'center' },
          style,
        ]}>
        <SFSymbol name={sfSymbol} size={size} color={color} />
      </View>
    );
  }
  return (
    <View style={style}>
      <MaterialCommunityIcons name={androidIcon} size={size} color={color} />
    </View>
  );
};

export default Icon;
