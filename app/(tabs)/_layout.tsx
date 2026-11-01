import { NativeTabs } from 'expo-router/native-tabs';
import { Tabs, type BottomTabNavigationOptions } from 'expo-router/js-tabs';
import { Easing } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { GlassTabBar } from '@/components/features/GlassTabBar';
import { duration, travel } from '@/design-system/motion';
import { colors } from '@/design-system/tokens';

type Interpolator = NonNullable<BottomTabNavigationOptions['sceneStyleInterpolator']>;

// Tab scenes cross-fade; the incoming scene also rises ~10px (RN Animated, native driver → UI thread).
const fadeAndRise: Interpolator = ({ current }) => ({
  sceneStyle: {
    opacity: current.progress.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 1, 0] }),
    transform: [
      {
        translateY: current.progress.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [travel.tab, 0, travel.tab],
        }),
      },
    ],
  },
});

// Reduce Motion: keep the simple fade, drop the movement.
const fadeOnly: Interpolator = ({ current }) => ({
  sceneStyle: {
    opacity: current.progress.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 1, 0] }),
  },
});

// EXPERIMENTAL (docs/13-LIQUID-GLASS-FEASIBILITY.md): `EXPO_PUBLIC_NATIVE_TABS=true npx expo start` swaps the custom
// glass tab bar for the system UITabBar (Liquid Glass + native press-and-drag on iOS 26, minimize on scroll). It could not be
// verified from Windows, so the custom bar (press-hold lens drag) stays the default.
const NATIVE_TABS = process.env.EXPO_PUBLIC_NATIVE_TABS === 'true';

const NATIVE_ITEMS = [
  { name: 'index', label: 'Khám phá', sf: { default: 'house', selected: 'house.fill' } },
  { name: 'orders', label: 'Đơn của tôi', sf: { default: 'doc', selected: 'doc.fill' } },
  {
    name: 'pantry',
    label: 'Tủ thực phẩm',
    sf: { default: 'shippingbox', selected: 'shippingbox.fill' },
  },
  { name: 'account', label: 'Tài khoản', sf: { default: 'person', selected: 'person.fill' } },
] as const;

export default function TabsLayout() {
  const reduced = useReducedMotion();
  if (NATIVE_TABS) {
    return (
      <NativeTabs minimizeBehavior="onScrollDown" tintColor={colors.brand900}>
        {NATIVE_ITEMS.map((t) => (
          <NativeTabs.Trigger key={t.name} name={t.name}>
            <NativeTabs.Trigger.Icon sf={t.sf} />
            <NativeTabs.Trigger.Label>{t.label}</NativeTabs.Trigger.Label>
          </NativeTabs.Trigger>
        ))}
      </NativeTabs>
    );
  }
  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.canvas },
        animation: 'fade',
        sceneStyleInterpolator: reduced ? fadeOnly : fadeAndRise,
        transitionSpec: {
          animation: 'timing',
          config: { duration: duration.base, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
        },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="pantry" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}
