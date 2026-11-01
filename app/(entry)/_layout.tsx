import { Stack } from 'expo-router';

import { duration } from '@/design-system/motion';
import { colors } from '@/design-system/tokens';

// Login / register / verify-email are pushed (iOS horizontal slide); onboarding and welcome are entered by replace (fade).
export default function EntryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.canvas },
      }}
    >
      <Stack.Screen
        name="onboarding"
        options={{ animation: 'fade', animationDuration: duration.base }}
      />
      <Stack.Screen
        name="welcome"
        options={{ animation: 'fade', animationDuration: duration.base }}
      />
    </Stack>
  );
}
