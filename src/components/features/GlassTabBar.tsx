import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { router, type Href } from 'expo-router';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { GlassSurface } from '@/components/ui/GlassSurface';
import { Text } from '@/components/ui/Text';
import { duration, spring } from '@/design-system/motion';
import { colors, fontFamily, radius } from '@/design-system/tokens';

// Figma BottomNav: Apple27 floating Tab Bar, 4 tabs. Labels localized; symbols are SF Symbols.
const TABS: Record<string, { label: string; symbol: SFSymbol; symbolActive: SFSymbol }> = {
  index: { label: 'Khám phá', symbol: 'house', symbolActive: 'house.fill' },
  orders: { label: 'Đơn của tôi', symbol: 'doc', symbolActive: 'doc.fill' },
  pantry: { label: 'Tủ thực phẩm', symbol: 'shippingbox', symbolActive: 'shippingbox.fill' },
  account: { label: 'Tài khoản', symbol: 'person', symbolActive: 'person.fill' },
};

const BAR_HEIGHT = 64;
const BAR_MARGIN = 20;
const INSET = 4;

/**
 * Floating Liquid Glass tab bar. The scene is full-height behind it (this view is absolutely positioned), so
 * content scrolls underneath. A "pill" marks the selected tab and slides with a spring; the active icon scales up.
 * Geometry (height 64, margins 20, pill) is estimated from the SB-015 screenshot.
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
  const barWidth = width - BAR_MARGIN * 2;
  // Hidden routes (e.g. the map) are not tabs; while one is focused the pill stays on Khám phá (as in Figma).
  const visible = Object.keys(TABS).map((name) => ({ key: name, name }));
  const activeIndex = Math.max(
    visible.findIndex((r) => r.name === activeName),
    0,
  );
  const tabWidth = (barWidth - INSET * 2) / visible.length;

  const pillX = useSharedValue(activeIndex * tabWidth);
  useEffect(() => {
    const target = activeIndex * tabWidth;
    pillX.value = reduced
      ? withTiming(target, { duration: duration.fast })
      : withSpring(target, spring.snappy);
  }, [activeIndex, tabWidth, reduced, pillX]);

  const pillStyle = useAnimatedStyle(() => ({ transform: [{ translateX: pillX.value }] }));

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: bottomInset }]}>
      <GlassSurface variant="bar" radius={radius.pill} style={{ height: BAR_HEIGHT }}>
        <View style={styles.row}>
          <Animated.View
            style={[styles.pill, { width: tabWidth }, pillStyle]}
            pointerEvents="none"
          />
          {visible.map((route, index) => {
            const tab = TABS[route.name];
            const focused = activeIndex === index;
            return (
              <TabItem
                key={route.key}
                width={tabWidth}
                label={tab.label}
                symbol={focused ? tab.symbolActive : tab.symbol}
                focused={focused}
                onPress={() => {
                  Haptics.selectionAsync();
                  onSelect(route.name);
                }}
              />
            );
          })}
        </View>
      </GlassSurface>
    </View>
  );
}

function TabItem({
  width,
  label,
  symbol,
  focused,
  onPress,
}: {
  width: number;
  label: string;
  symbol: SFSymbol;
  focused: boolean;
  onPress: () => void;
}) {
  const reduced = useReducedMotion();
  const active = useSharedValue(focused ? 1 : 0);
  useEffect(() => {
    active.value = reduced
      ? withTiming(focused ? 1 : 0, { duration: duration.fast })
      : withSpring(focused ? 1 : 0, spring.bounce);
  }, [focused, reduced, active]);

  const icon = useAnimatedStyle(() => ({ transform: [{ scale: 1 + active.value * 0.1 }] }));

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.tab, { width }]}
    >
      <Animated.View style={icon}>
        <SymbolView name={symbol} size={24} tintColor={colors.textPrimary} />
      </Animated.View>
      <Text variant="caption" style={focused ? styles.activeLabel : undefined}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: BAR_MARGIN },
  row: { flex: 1, width: '100%', flexDirection: 'row', alignItems: 'center', padding: INSET },
  pill: {
    position: 'absolute',
    left: INSET,
    top: INSET,
    bottom: INSET,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(9,47,41,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  tab: { height: '100%', alignItems: 'center', justifyContent: 'center', gap: 2 },
  activeLabel: { fontFamily: fontFamily.bold },
});
