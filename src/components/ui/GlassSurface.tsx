import { BlurView, type BlurTint } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState, type ReactNode } from 'react';
import {
  AccessibilityInfo,
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '@/design-system/tokens';

/**
 * Real iOS 26 Liquid Glass when available (expo-glass-effect, bundled in Expo Go SDK 58). On older iOS or if the
 * API reports unavailable we fall back to expo-blur. Either way the same extra layers are drawn so the surface
 * reads as glass: milky overlay, top sheen, 1px light→dark gradient rim, thin top highlight and a soft drop shadow.
 */
function detectNativeGlass(): boolean {
  if (Platform.OS !== 'ios') return false;
  try {
    return isLiquidGlassAvailable();
  } catch {
    return false;
  }
}
export const NATIVE_GLASS = detectNativeGlass();

type Props = {
  variant: 'circle' | 'pill' | 'bar';
  /** circle: diameter (default 50). pill/bar: size comes from `style`. */
  size?: number;
  /** bar corner radius (Figma tab bar capsule). Default 32. */
  radius?: number;
  /** Blur strength for the expo-blur fallback (40–80). */
  intensity?: number;
  tint?: BlurTint;
  /** White overlay strength; defaults depend on native glass (lighter) vs blur fallback. */
  overlay?: number;
  interactive?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export function useReduceTransparency() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let live = true;
    AccessibilityInfo.isReduceTransparencyEnabled().then((v) => live && setReduce(v));
    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduce);
    return () => {
      live = false;
      sub.remove();
    };
  }, []);
  return reduce;
}

export function GlassSurface({
  variant,
  size = 50,
  radius = 32,
  intensity = 60,
  tint = 'light',
  overlay,
  interactive = false,
  style,
  children,
}: Props) {
  const reduceTransparency = useReduceTransparency();
  const r = variant === 'circle' ? size / 2 : variant === 'pill' ? 999 : radius;
  const sizing: ViewStyle = variant === 'circle' ? { width: size, height: size } : {};
  const veil = overlay ?? (NATIVE_GLASS ? 0.14 : 0.32);

  return (
    <View style={[styles.shadow, { borderRadius: r }, sizing, style]}>
      {/* 1px rim: bright at the top, fading toward the bottom */}
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.45)', 'rgba(255,255,255,0.12)']}
        locations={[0, 0.45, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: r }]}
      />
      <View style={[styles.clip, { borderRadius: Math.max(r - 1, 0) }]}>
        {reduceTransparency ? (
          <View style={[StyleSheet.absoluteFill, styles.solid]} />
        ) : NATIVE_GLASS ? (
          <GlassView
            glassEffectStyle="regular"
            isInteractive={interactive}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
        )}
        {reduceTransparency ? null : (
          <>
            <View
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(255,255,255,${veil})` }]}
            />
            <LinearGradient
              pointerEvents="none"
              colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0)']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.sheen}
            />
            <View
              pointerEvents="none"
              style={[styles.highlight, { left: r * 0.5, right: r * 0.5 }]}
            />
          </>
        )}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // iOS only renders a shadow from a layer with some fill; this faint fill is invisible under the glass layers.
  shadow: {
    padding: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  clip: { flex: 1, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  solid: { backgroundColor: 'rgba(255,255,255,0.9)' },
  sheen: { position: 'absolute', left: 0, right: 0, top: 0, height: '48%' },
  highlight: {
    position: 'absolute',
    top: 1,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
