import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  cancelAnimation,
  FadeIn,
  ZoomIn,
  FadeInDown,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { SeedActivity } from '@/components/ui/SeedActivity';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { DEV_ENTRY_ENABLED } from '@/constants/app';
import { duration, easing } from '@/design-system/motion';
import { colors } from '@/design-system/tokens';
import { useSessionStore } from '@/store/sessionStore';

// SB-001 · Splash · Warm Start. Frame coordinates (393×852) are used directly: decorative, non-scrolling.
// Timeline: mark scales/fades in → title → tagline → seeds + caption; at 1.8 s the whole screen cross-fades out as
// the next screen fades in (the router `fade` animation).
const SPLASH_MS = 1800;

function useHydrated() {
  return useSyncExternalStore(
    (onChange) => useSessionStore.persist.onFinishHydration(onChange),
    () => useSessionStore.persist.hasHydrated(),
    () => false,
  );
}

function goNext() {
  const { user, isGuest, hasSeenOnboarding } = useSessionStore.getState();
  if (user || isGuest) router.replace('/(tabs)');
  else if (hasSeenOnboarding) router.replace('/(entry)/welcome');
  else router.replace('/(entry)/onboarding');
}

export default function Splash() {
  const { width } = useWindowDimensions();
  const hydrated = useHydrated();
  const reduced = useReducedMotion();
  const out = useSharedValue(1);

  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hold = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // start the exit fade early so navigation lands at SPLASH_MS
  const schedule = useCallback(
    (ms: number) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        out.value = withTiming(0, { duration: duration.base, easing: easing.exit }, (done) => {
          if (done) runOnJS(goNext)();
        });
      }, ms);
    },
    [out],
  );

  useEffect(() => {
    if (!hydrated) return;
    schedule(SPLASH_MS - duration.base);
    return () => {
      clearTimeout(timer.current);
      clearTimeout(hold.current);
    };
  }, [hydrated, schedule]);

  // Dev hub: touching the title pauses the auto-advance; holding it for 1.2 s opens the hub, releasing early resumes.
  const pressIn = () => {
    if (!DEV_ENTRY_ENABLED) return;
    clearTimeout(timer.current);
    cancelAnimation(out);
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared values are mutable by design
    out.value = 1;
    hold.current = setTimeout(() => router.push('/dev'), 1200);
  };
  const pressOut = () => {
    if (!DEV_ENTRY_ENABLED) return;
    clearTimeout(hold.current);
    schedule(SPLASH_MS - duration.base);
  };

  const container = useAnimatedStyle(() => ({ opacity: out.value }));

  const enter = (delay: number, rise = 0) => {
    if (reduced) return FadeIn.duration(duration.fast);
    if (rise) {
      return FadeInDown.delay(delay)
        .duration(duration.slow)
        .easing(easing.enter)
        .withInitialValues({ opacity: 0, transform: [{ translateY: rise }] });
    }
    return FadeIn.delay(delay).duration(duration.slow).easing(easing.enter);
  };

  return (
    <Animated.View style={[styles.container, container]}>
      <StatusBar style="light" />
      <Animated.View entering={FadeIn.duration(duration.slow * 2)} style={styles.watermarkPos}>
        <View style={styles.watermark}>
          <SvgIcon name="bag-mark-cream" size={256} />
        </View>
      </Animated.View>
      <Animated.View
        entering={
          reduced
            ? FadeIn.duration(duration.fast)
            : ZoomIn.duration(duration.slow)
                .easing(easing.enter)
                .withInitialValues({ transform: [{ scale: 0.88 }] })
        }
        style={[styles.mark, { left: (width - 112) / 2 }]}
      >
        <SvgIcon name="bag-mark-cream" size={112} />
      </Animated.View>
      {/* Dev hub shortcut: hold the title 1.2 s (not part of the design; dev / DEMO_MODE only) */}
      <Animated.View entering={enter(120, 10)} style={[styles.center, { top: 422 }]}>
        <Pressable onPressIn={pressIn} onPressOut={pressOut}>
          <Text variant="splashTitle" color="canvas" style={styles.centerText}>
            SaveBite
          </Text>
        </Pressable>
      </Animated.View>
      <Animated.View entering={enter(240, 10)} style={[styles.center, { top: 486 }]}>
        <Text variant="splashTagline" color="canvas" style={styles.centerText}>
          Phần ngon, chờ bạn ghé lấy.
        </Text>
      </Animated.View>
      <Animated.View entering={enter(420)} style={[styles.center, { top: 682 }]}>
        <SeedActivity />
      </Animated.View>
      <Animated.View entering={enter(480)} style={[styles.center, { top: 722 }]}>
        <CaptionFade />
      </Animated.View>
    </Animated.View>
  );
}

// figma: caption is 80% opaque — animate up to that value, not 1
function CaptionFade() {
  const o = useSharedValue(0);
  useEffect(() => {
    o.value = withDelay(480, withTiming(0.8, { duration: duration.slow }));
  }, [o]);
  const style = useAnimatedStyle(() => ({ opacity: o.value }));
  return (
    <Animated.View style={style}>
      <Text variant="splashCaption" color="canvas" style={styles.centerText}>
        Đang mở SaveBite
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden', backgroundColor: colors.brand900 },
  watermarkPos: { position: 'absolute', left: 248, top: 112 },
  watermark: { opacity: 0.04 }, // figma: 4%
  mark: { position: 'absolute', top: 286 },
  center: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  centerText: { textAlign: 'center' },
});
