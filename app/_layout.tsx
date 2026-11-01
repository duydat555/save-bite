import { BeVietnamPro_400Regular } from '@expo-google-fonts/be-vietnam-pro/400Regular';
import { BeVietnamPro_500Medium } from '@expo-google-fonts/be-vietnam-pro/500Medium';
import { BeVietnamPro_600SemiBold } from '@expo-google-fonts/be-vietnam-pro/600SemiBold';
import { BeVietnamPro_700Bold } from '@expo-google-fonts/be-vietnam-pro/700Bold';
import { BeVietnamPro_800ExtraBold } from '@expo-google-fonts/be-vietnam-pro/800ExtraBold';
import { Fraunces_700Bold } from '@expo-google-fonts/fraunces/700Bold';
import { JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono/700Bold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { duration } from '@/design-system/motion';
import { colors } from '@/design-system/tokens';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BeVietnamPro_400Regular,
    BeVietnamPro_500Medium,
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
    BeVietnamPro_800ExtraBold,
    Fraunces_700Bold,
    JetBrainsMono_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.canvas }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        {/*
          Navigation motion (docs/11-MOTION-SPEC.md): pushes/pops use the native iOS horizontal slide; the entry flow
          and the tab shell cross-fade (they are entered by `replace`); full-screen modals (pickup code) rise from the
          bottom. Gesture-back is disabled where going back would break the flow (processing/success).
        */}
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 350,
            contentStyle: { backgroundColor: colors.canvas },
          }}
        >
          <Stack.Screen name="index" options={{ animation: 'fade' }} />
          <Stack.Screen
            name="(entry)"
            options={{ animation: 'fade', animationDuration: duration.base }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{ animation: 'fade', animationDuration: duration.slow, gestureEnabled: false }}
          />
          <Stack.Screen
            name="reserve/success"
            options={{ animation: 'fade', animationDuration: duration.slow, gestureEnabled: false }}
          />
          {/* Sheets own their scrim + slide animation (SheetModal), so the navigator animation is off */}
          <Stack.Screen
            name="offer/[id]/allergens"
            options={{
              presentation: 'transparentModal',
              animation: 'none',
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
          <Stack.Screen
            name="offer/[id]/shelf-life"
            options={{
              presentation: 'transparentModal',
              animation: 'none',
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
          <Stack.Screen
            name="offer/surprise-bag-explainer"
            options={{
              presentation: 'transparentModal',
              animation: 'none',
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
          <Stack.Screen
            name="account/pantry/add/category"
            options={{
              presentation: 'transparentModal',
              animation: 'none',
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
          <Stack.Screen
            name="account/pantry/add/date"
            options={{
              presentation: 'fullScreenModal',
              animation: 'slide_from_bottom',
              animationDuration: duration.slow,
            }}
          />
          <Stack.Screen
            name="offer/[id]/quantity"
            options={{
              presentation: 'transparentModal',
              animation: 'none',
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
          <Stack.Screen
            name="reserve/order/[id]/cancel"
            options={{
              presentation: 'transparentModal',
              animation: 'none',
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
          <Stack.Screen
            name="reserve/order/[id]/cancelled"
            options={{ animation: 'fade', gestureEnabled: false }}
          />
          <Stack.Screen
            name="offer/[id]/gallery"
            options={{
              presentation: 'fullScreenModal',
              animation: 'fade',
              animationDuration: duration.base,
            }}
          />
          <Stack.Screen
            name="reserve/order/[id]/pass"
            options={{
              presentation: 'fullScreenModal',
              animation: 'slide_from_bottom',
              animationDuration: duration.slow,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
