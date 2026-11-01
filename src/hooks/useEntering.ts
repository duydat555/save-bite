import { FadeIn, FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { duration, easing, stagger } from '@/design-system/motion';

/**
 * Entering animation for the first lists/cards: FadeInDown (12px) with a 50 ms stagger, only for the first
 * `stagger.max` items. Reduce Motion → a plain short fade, no movement, no stagger.
 */
export function useStaggerEntering() {
  const reduced = useReducedMotion();
  return (index: number, extraDelay = 0) => {
    if (reduced) return FadeIn.duration(duration.fast);
    if (index >= stagger.max) return undefined;
    return FadeInDown.delay(extraDelay + index * stagger.step)
      .duration(duration.base)
      .easing(easing.enter)
      .withInitialValues({ opacity: 0, transform: [{ translateY: stagger.distance }] });
  };
}
