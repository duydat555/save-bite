import { Easing, type WithSpringConfig } from 'react-native-reanimated';

/**
 * Single source of truth for motion. Every animation in the app takes its timing from here
 * (see docs/11-MOTION-SPEC.md). Values are tuned to feel like iOS: short, ease-out, spring for touch.
 */
export const duration = {
  fast: 150, // press feedback, fades under Reduce Motion
  base: 250, // tab/scene transitions, chips, fades
  slow: 350, // entrances, splash, success pop
} as const;

export const easing = {
  /** iOS-like standard curve for most movement. */
  standard: Easing.bezier(0.25, 0.1, 0.25, 1),
  /** Things appearing: decelerate into place. */
  enter: Easing.out(Easing.cubic),
  /** Things leaving: accelerate away. */
  exit: Easing.in(Easing.cubic),
} as const;

export const spring = {
  /** Tab-bar pill, segmented thumb: quick, no visible overshoot. */
  snappy: { damping: 20, stiffness: 320, mass: 0.7 },
  /** Pressable release. */
  press: { damping: 14, stiffness: 420, mass: 0.6 },
  /** Success pop / icon bounce: small, tasteful overshoot. */
  bounce: { damping: 11, stiffness: 190, mass: 0.9 },
} as const satisfies Record<string, WithSpringConfig>;

export const press = {
  scale: 0.97, // within the 0.96–0.98 range
  scaleSmall: 0.92, // small round controls (glass buttons)
  opacity: 0.9,
} as const;

export const stagger = {
  step: 50, // ms between items (40–60)
  max: 8, // only the first N items animate in
  distance: 12, // px travelled by FadeInDown
} as const;

export const travel = {
  tab: 10, // px a tab scene slides vertically while fading
  parallaxStage: 0.2, // onboarding: extra horizontal shift of the hero stage (× page offset)
  parallaxCopy: -0.1, // onboarding: opposite shift of the copy block
} as const;

/** Map screen (SB-016/017): iOS-like springs (damping 20–26, stiffness 180–260, mass 1) and camera timings. */
export const mapMotion = {
  camera: 450, // animateToRegion / fitToCoordinates (350–500 ms)
  pinIn: 280, // pin scale-in + fade
  pinStagger: 40, // ms between pins (30–50)
  sheet: { damping: 24, stiffness: 240, mass: 1 } as WithSpringConfig, // detent snap
  pin: { damping: 22, stiffness: 260, mass: 1 } as WithSpringConfig, // selected pin scale
  rubber: 0.3, // resistance past the first / last detent
  selectedScale: 1.12,
} as const;
