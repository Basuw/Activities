import React from 'react';
import { Platform } from 'react-native';
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
}

/**
 * Cross-platform icon component.
 * - iOS  → native SF Symbol via react-native-sfsymbols
 * - Android → MaterialCommunityIcons
 */
const Icon: React.FC<IconProps> = ({ sfSymbol, androidIcon, size = 24, color }) => {
  if (Platform.OS === 'ios') {
    return <SFSymbol name={sfSymbol} size={size} color={color} />;
  }
  return <MaterialCommunityIcons name={androidIcon} size={size} color={color} />;
};

export default Icon;
