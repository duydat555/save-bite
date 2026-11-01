import * as Haptics from 'expo-haptics';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import type { StyleProp, ViewStyle } from 'react-native';

import { press } from '@/design-system/motion';
import { colors, layout } from '@/design-system/tokens';

import { GlassSurface } from './GlassSurface';
import { PressableScale } from './PressableScale';

type Props = {
  symbol: SFSymbol;
  onPress?: () => void;
  accessibilityLabel: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

/** Round Liquid Glass button (Figma: Apple27 native Symbol Button, 50×50 / 44×44). */
export function GlassButton({
  symbol,
  onPress,
  accessibilityLabel,
  size = layout.glassButton,
  style,
}: Props) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      pressedScale={press.scaleSmall}
      onPress={() => {
        Haptics.selectionAsync();
        onPress?.();
      }}
      style={[{ width: size, height: size }, style]}
    >
      <GlassSurface variant="circle" size={size} interactive>
        <SymbolView name={symbol} size={Math.round(size * 0.44)} tintColor={colors.textPrimary} />
      </GlassSurface>
    </PressableScale>
  );
}
