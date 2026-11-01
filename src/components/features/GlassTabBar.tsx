/* Reanimated shared values are mutable by design; the React Compiler immutability rule does not apply here. */
/* eslint-disable react-hooks/immutability */
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { router, type Href } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassSurface, useReduceTransparency } from '@/components/ui/GlassSurface';
import { Text } from '@/components/ui/Text';
import { duration, mapMotion, spring } from '@/design-system/motion';
import { colors, fontFamily, radius } from '@/design-system/tokens';

import { expandTabBar, tabBarMinimized } from './tabBarState';

// Figma BottomNav: Apple27 floating Tab Bar, 4 tabs. Labels localized; symbols are SF Symbols.
const TABS: Record<string, { label: string; symbol: SFSymbol; symbolActive: SFSymbol }> = {
  index: { label: 'Khám phá', symbol: 'house', symbolActive: 'house.fill' },
  orders: { label: 'Đơn của tôi', symbol: 'doc', symbolActive: 'doc.fill' },
  pantry: { label: 'Tủ thực phẩm', symbol: 'shippingbox', symbolActive: 'shippingbox.fill' },
  account: { label: 'Tài khoản', symbol: 'person', symbolActive: 'person.fill' },
};
const NAMES = Object.keys(TABS);

const BAR_HEIGHT = 64;
const BAR_MIN = 48; // minimized (icons only)
const BAR_MARGIN = 20;
const INSET = 4;
const LENS_SCALE = 1.2; // spec: 1.15–1.25

/**
 * Floating Liquid Glass tab bar (custom build — see docs/13-LIQUID-GLASS-FEASIBILITY.md).
 * - tap: selection haptic, the selection capsule slides with a spring (with squash & stretch from its velocity);
 * - press-and-hold anywhere on the bar, then drag: the capsule lifts into a magnifying lens (×1.2, taller than the bar),
 *   follows the finger, tabs under it light up, a haptic ticks at every tab boundary, and on release it springs to the
 *   nearest tab and only then switches the screen;
 * - scrolling down collapses the bar to icons only (tabBarState), scrolling up expands it;
 * - Reduce Motion: no lift / magnification / squash; Reduce Transparency: solid fills.
 * Everything per-frame is a worklet on the UI thread (no setState while dragging).
 */
export function GlassTabBar({ state, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const visible = state.routes.filter((r) => TABS[r.name]);
  const activeName = state.routes[state.index]?.name;
  return (
    <TabBarView
      bottomInset={insets.bottom}
      activeName={activeName}
      onSelect={(name) => {
        const route = visible.find((r) => r.name === name);
        if (!route) return;
        const event = emitter.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });
        if (name !== activeName && !event.defaultPrevented) navigateToTab(route.key);
      }}
    />
  );
}

/**
 * Same bar for screens pushed on the root stack (map, categories, saved…): Figma keeps the tab bar visible there.
 * The pill stays on Khám phá; picking a tab returns to the tab shell first.
 */
export function StackTabBar() {
  const insets = useSafeAreaInsets();
  return (
    <TabBarView
      bottomInset={insets.bottom}
      activeName="index"
      onSelect={(name) => {
        router.dismissAll();
        if (name !== 'index') router.navigate(`/(tabs)/${name}` as Href);
      }}
    />
  );
}

function TabBarView({
  bottomInset,
  activeName,
  onSelect,
}: {
  bottomInset: number;
  activeName: string | undefined;
  onSelect: (name: string) => void;
}) {
  const { width } = useWindowDimensions();
  const reduced = useReducedMotion();
  const solid = useReduceTransparency();
  const barWidth = width - BAR_MARGIN * 2;
  const tabWidth = (barWidth - INSET * 2) / NAMES.length;
  const activeIndex = Math.max(NAMES.indexOf(activeName ?? 'index'), 0);

  const pillX = useSharedValue(activeIndex * tabWidth);
  const lifted = useSharedValue(0);
  const dragging = useSharedValue(false);
  const hoverIdx = useSharedValue(activeIndex);
  const stretch = useSharedValue(0);

  // committed selection → slide the capsule (spring) unless the user is dragging it
  useEffect(() => {
    if (dragging.value) return;
    const target = activeIndex * tabWidth;
    hoverIdx.value = activeIndex;
    pillX.value = reduced
      ? withTiming(target, { duration: duration.fast })
      : withSpring(target, spring.snappy);
  }, [activeIndex, tabWidth, reduced, pillX, hoverIdx, dragging]);

  // squash & stretch from the capsule's own velocity (per-frame delta, worklet)
  useAnimatedReaction(
    () => pillX.value,
    (cur, prev) => {
      if (prev == null || reduced) return;
      const v = Math.min(Math.abs(cur - prev) / 38, 1);
      stretch.value = withTiming(v * 0.18, { duration: 60 });
    },
  );

  const commit = (i: number) => {
    if (NAMES[i] !== activeName) onSelect(NAMES[i]);
  };
  const tick = () => Haptics.selectionAsync();
  const press = (i: number) => {
    Haptics.selectionAsync();
    expandTabBar();
    onSelect(NAMES[i]);
  };

  // press-and-hold (180 ms), then drag from anywhere on the bar
  const pan = Gesture.Pan()
    .activateAfterLongPress(180)
    .onStart((e) => {
      dragging.value = true;
      expandTabBar();
      if (!reduced) lifted.value = withSpring(1, mapMotion.pin);
      else lifted.value = withTiming(1, { duration: duration.fast });
      const x = Math.min(Math.max(e.x - INSET - tabWidth / 2, 0), (NAMES.length - 1) * tabWidth);
      pillX.value = withSpring(x, spring.snappy);
      hoverIdx.value = Math.round(x / tabWidth);
      runOnJS(tick)();
    })
    .onUpdate((e) => {
      const x = Math.min(Math.max(e.x - INSET - tabWidth / 2, 0), (NAMES.length - 1) * tabWidth);
      pillX.value = x;
      const i = Math.round(x / tabWidth);
      if (i !== hoverIdx.value) {
        hoverIdx.value = i;
        runOnJS(tick)();
      }
    })
    .onFinalize(() => {
      if (!dragging.value) return;
      const i = hoverIdx.value;
      lifted.value = reduced
        ? withTiming(0, { duration: duration.fast })
        : withSpring(0, mapMotion.pin);
      pillX.value = withSpring(i * tabWidth, spring.snappy, (done) => {
        dragging.value = false;
        if (done) runOnJS(commit)(i);
      });
    });

  // collapsing bar
  const barStyle = useAnimatedStyle(() => ({
    height: interpolate(tabBarMinimized.value, [0, 1], [BAR_HEIGHT, BAR_MIN]),
  }));
  const lensH = useDerivedValue(
    () => interpolate(tabBarMinimized.value, [0, 1], [BAR_HEIGHT, BAR_MIN]) - INSET * 2,
  );

  const lensStyle = useAnimatedStyle(() => {
    const l = reduced ? 0 : lifted.value;
    const sx = (1 + stretch.value) * (1 + (LENS_SCALE - 1) * l);
    const sy = (1 - stretch.value * 0.45) * (1 + (LENS_SCALE - 1) * l * 0.9);
    return {
      height: lensH.value,
      transform: [
        { translateX: pillX.value },
        { translateY: -4 * l },
        { scaleX: sx },
        { scaleY: sy },
      ],
      shadowOpacity: 0.05 + 0.3 * lifted.value,
      shadowRadius: 4 + 14 * lifted.value,
      shadowOffset: { width: 0, height: 2 + 8 * lifted.value },
    };
  });
  const baseStyle = useAnimatedStyle(() => ({ opacity: 1 - lifted.value }));
  const glassStyle = useAnimatedStyle(() => ({ opacity: lifted.value }));
  const copyStyle = useAnimatedStyle(() => ({ transform: [{ translateX: -pillX.value }] }));

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: bottomInset }]}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[{ width: barWidth }, barStyle]} collapsable={false}>
          <GlassSurface variant="bar" radius={radius.pill} style={styles.fill}>
            <View style={styles.row}>
              {NAMES.map((name, i) => (
                <TabItem
                  key={name}
                  width={tabWidth}
                  tab={TABS[name]}
                  index={i}
                  position={pillX}
                  tabWidth={tabWidth}
                  focused={i === activeIndex}
                  onPress={() => press(i)}
                />
              ))}
            </View>
          </GlassSurface>

          {/* selection capsule → lens. Drawn outside the clipped glass so it can rise above the bar */}
          <Animated.View
            pointerEvents="none"
            style={[styles.lens, { width: tabWidth, left: INSET, top: INSET }, lensStyle]}
          >
            <Animated.View style={[StyleSheet.absoluteFill, styles.base, baseStyle]} />
            <Animated.View style={[StyleSheet.absoluteFill, styles.glass, glassStyle]}>
              {/* rim: 1.5pt chromatic fringe (blue top-left → white → pink bottom-right) */}
              <LinearGradient
                pointerEvents="none"
                colors={[
                  'rgba(130,190,255,0.9)',
                  'rgba(255,255,255,0.95)',
                  'rgba(255,160,195,0.75)',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.inner}>
                {solid ? (
                  <View
                    style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.92)' }]}
                  />
                ) : (
                  <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
                )}
                {/* magnified copy of the tab row, counter-translated so icons line up under the lens */}
                <Animated.View style={[styles.copy, { width: tabWidth * NAMES.length }, copyStyle]}>
                  {NAMES.map((name) => (
                    <View key={name} style={[styles.copyTab, { width: tabWidth }]}>
                      <SymbolView
                        name={TABS[name].symbolActive}
                        size={24}
                        tintColor={colors.textPrimary}
                      />
                      <Text variant="caption" style={styles.copyLabel}>
                        {TABS[name].label}
                      </Text>
                    </View>
                  ))}
                </Animated.View>
                {solid ? null : (
                  <LinearGradient
                    pointerEvents="none"
                    colors={[
                      'rgba(255,255,255,0.55)',
                      'rgba(255,255,255,0.05)',
                      'rgba(255,255,255,0.18)',
                    ]}
                    locations={[0, 0.55, 1]}
                    style={StyleSheet.absoluteFill}
                  />
                )}
                <View pointerEvents="none" style={styles.highlight} />
              </View>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

function TabItem({
  width,
  tab,
  index,
  position,
  tabWidth,
  focused,
  onPress,
}: {
  width: number;
  tab: (typeof TABS)[string];
  index: number;
  position: SharedValue<number>;
  tabWidth: number;
  focused: boolean;
  onPress: () => void;
}) {
  const reduced = useReducedMotion();
  // how much the capsule covers this tab (0–1), driven by the capsule position itself
  const cover = useDerivedValue(() =>
    interpolate(Math.abs(position.value / tabWidth - index), [0, 1], [1, 0], 'clamp'),
  );
  const icon = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + (reduced ? 0 : cover.value * 0.1) }],
  }));
  const label = useAnimatedStyle(() => ({
    opacity: interpolate(tabBarMinimized.value, [0, 0.6], [1, 0], 'clamp'),
    height: interpolate(tabBarMinimized.value, [0, 1], [14, 0]),
  }));
  const boldLabel = useAnimatedStyle(() => ({ opacity: cover.value }));

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={tab.label}
      onPress={onPress}
      style={[styles.tab, { width }]}
    >
      <Animated.View style={icon}>
        <SymbolView
          name={focused ? tab.symbolActive : tab.symbol}
          size={24}
          tintColor={colors.textPrimary}
        />
      </Animated.View>
      <Animated.View style={[label, styles.labelBox]}>
        <Text variant="caption">{tab.label}</Text>
        <Animated.View style={[StyleSheet.absoluteFill, boldLabel]}>
          <Text variant="caption" style={styles.activeLabel}>
            {tab.label}
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: BAR_MARGIN,
  },
  fill: { flex: 1 },
  row: { flex: 1, width: '100%', flexDirection: 'row', alignItems: 'center', padding: INSET },
  tab: { height: '100%', alignItems: 'center', justifyContent: 'center', gap: 2 },
  labelBox: { overflow: 'visible', justifyContent: 'center', alignItems: 'center' },
  activeLabel: { fontFamily: fontFamily.bold, backgroundColor: 'transparent', textAlign: 'center' },
  lens: {
    position: 'absolute',
    borderRadius: radius.pill,
    borderCurve: 'continuous',
    shadowColor: colors.textPrimary,
  },
  base: {
    borderRadius: radius.pill,
    backgroundColor: 'rgba(9,47,41,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  glass: { borderRadius: radius.pill, borderCurve: 'continuous', overflow: 'hidden' },
  copy: { position: 'absolute', left: 0, top: 0, bottom: 0, flexDirection: 'row' },
  copyTab: { height: '100%', alignItems: 'center', justifyContent: 'center', gap: 2 },
  copyLabel: { fontFamily: fontFamily.bold },
  inner: {
    position: 'absolute',
    left: 1.5,
    right: 1.5,
    top: 1.5,
    bottom: 1.5,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 2,
    left: '18%',
    right: '18%',
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
});
