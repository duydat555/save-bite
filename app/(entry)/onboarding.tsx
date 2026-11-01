import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  type FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { AnimatedPageDots } from '@/components/ui/PageDots';
import { Wordmark } from '@/components/ui/Wordmark';
import { travel } from '@/design-system/motion';
import { colors, layout } from '@/design-system/tokens';
import {
  OnboardingCopy,
  onboardingPages,
  ONBOARDING_STAGE_HEIGHT,
  type OnboardingPage,
} from '@/features/onboarding/OnboardingPages';
import { useSessionStore } from '@/store/sessionStore';

// SB-002 / SB-003 / SB-004. Header, dots and CTA are fixed chrome; stage + copy swipe as pages with a light parallax
// (stage lags, copy leads). Figma offsets are measured from the frame top; the status bar is 59, so they're taken
// relative to the inset.
export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<OnboardingPage>>(null);
  const [index, setIndex] = useState(0);
  const completeOnboarding = useSessionStore((s) => s.completeOnboarding);
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  const last = index === onboardingPages.length - 1;
  const finish = () => {
    completeOnboarding();
    router.replace('/(entry)/welcome');
  };
  const next = () => {
    if (last) return finish();
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };
  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={listRef as never}
        data={onboardingPages}
        keyExtractor={(p) => p.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item, index: i }) => (
          <Page page={item} i={i} width={width} scrollX={scrollX} top={insets.top + 56} />
        )}
      />

      <View style={[styles.header, { top: insets.top + 9 }]} pointerEvents="box-none">
        <Wordmark size="sm" />
      </View>
      <View style={[styles.skip, { top: insets.top - 4 }]}>
        <Button label="Bỏ qua" variant="subtle" onPress={finish} />
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <AnimatedPageDots count={onboardingPages.length} scrollX={scrollX} pageWidth={width} />
        <Button label={onboardingPages[index].cta} onPress={next} style={styles.cta} />
      </View>
    </View>
  );
}

function Page({
  page,
  i,
  width,
  scrollX,
  top,
}: {
  page: OnboardingPage;
  i: number;
  width: number;
  scrollX: SharedValue<number>;
  top: number;
}) {
  const reduced = useReducedMotion();
  // offset is 0 when this page is centred, so the static frame is untouched
  const stage = useAnimatedStyle(() => ({
    transform: [{ translateX: reduced ? 0 : (scrollX.value - i * width) * travel.parallaxStage }],
  }));
  const copy = useAnimatedStyle(() => {
    const offset = scrollX.value - i * width;
    return {
      opacity: reduced ? 1 : 1 - Math.min(Math.abs(offset) / width, 1) * 0.6,
      transform: [{ translateX: reduced ? 0 : offset * travel.parallaxCopy }],
    };
  });

  return (
    <View style={{ width, paddingHorizontal: layout.screenGutter, paddingTop: top }}>
      <Animated.View style={stage}>{page.stage}</Animated.View>
      <Animated.View style={[{ marginTop: 476 - 115 - ONBOARDING_STAGE_HEIGHT }, copy]}>
        <OnboardingCopy page={page} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  header: { position: 'absolute', left: layout.screenGutter },
  skip: { position: 'absolute', right: layout.screenGutter },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: 44,
    paddingHorizontal: layout.screenGutter,
  },
  cta: { alignSelf: 'stretch' },
});
