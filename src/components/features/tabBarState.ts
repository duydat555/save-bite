import { makeMutable, useAnimatedScrollHandler, withTiming } from 'react-native-reanimated';

import { duration, easing } from '@/design-system/motion';

/** 0 = tab bar expanded, 1 = minimized (icons only). Module-level so every screen's scroll view can drive the one bar. */
export const tabBarMinimized = makeMutable(0);
const lastY = makeMutable(0);

/** Programmatic expand (tab change, tap on the minimized bar). */
export function expandTabBar() {
  tabBarMinimized.value = withTiming(0, { duration: duration.base, easing: easing.standard });
}

/**
 * Apple-Music-style behaviour: scrolling down past ~40pt collapses the tab bar, scrolling up (or reaching the top)
 * opens it again. Plug into an `Animated.ScrollView`: `onScroll={useTabBarScroll()}` + `scrollEventThrottle={16}`.
 * Runs as a worklet on the UI thread — no React state is touched while scrolling.
 */
export function useTabBarScroll() {
  return useAnimatedScrollHandler({
    onScroll: (e) => {
      const y = e.contentOffset.y;
      const dy = y - lastY.value;
      lastY.value = y;
      if (y < 40) {
        if (tabBarMinimized.value !== 0)
          tabBarMinimized.value = withTiming(0, { duration: duration.base });
      } else if (dy > 6) {
        if (tabBarMinimized.value !== 1)
          tabBarMinimized.value = withTiming(1, { duration: duration.base });
      } else if (dy < -6) {
        if (tabBarMinimized.value !== 0)
          tabBarMinimized.value = withTiming(0, { duration: duration.base });
      }
    },
  });
}
