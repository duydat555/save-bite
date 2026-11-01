import { Pressable, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { duration, press, spring } from '@/design-system/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style'> & {
  style?: React.ComponentProps<typeof Animated.View>['style'];
  /** Scale while pressed (default 0.97). Use `press.scaleSmall` for small round controls. */
  pressedScale?: number;
};

/**
 * Pressable with the app-wide touch feedback: scale to ~0.97 and dip opacity on press-in (timing, UI thread),
 * spring back on release. Reduce Motion keeps the opacity dip only.
 */
export function PressableScale({
  style,
  pressedScale = press.scale,
  onPressIn,
  onPressOut,
  disabled,
  ...rest
}: Props) {
  const reduced = useReducedMotion();
  const down = useSharedValue(0);

  const animated = useAnimatedStyle(() => ({
    opacity: 1 - down.value * (1 - press.opacity),
    transform: [{ scale: reduced ? 1 : 1 - down.value * (1 - pressedScale) }],
  }));

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={(e) => {
        down.value = withTiming(1, { duration: duration.fast });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        down.value = withSpring(0, spring.press);
        onPressOut?.(e);
      }}
      style={[style, animated]}
    />
  );
}
