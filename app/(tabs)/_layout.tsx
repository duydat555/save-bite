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

export default function TabsLayout() {
  const reduced = useReducedMotion();
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
      {/* Map keeps the tab bar visible (Figma SB-016) but is not a tab of its own */}
      <Tabs.Screen name="map" options={{ href: null }} />
    </Tabs>
  );
}
