import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import {
  colors,
  type ColorToken,
  typography,
  type TypographyVariant,
} from '@/design-system/tokens';

export type TextProps = RNTextProps & {
  variant: TypographyVariant;
  color?: ColorToken;
};

export function Text({ variant, color = 'textPrimary', style, ...rest }: TextProps) {
  return <RNText {...rest} style={[typography[variant], { color: colors[color] }, style]} />;
}
