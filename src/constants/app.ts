export const APP_NAME = 'SaveBite';

// Figma source of truth (see docs/01-FIGMA-INVENTORY.md)
export const FIGMA_FILE_KEY = '7suZz9C8oL5zV2NMxlsIVI';

/**
 * Hidden entries to the dev hub (splash long-press, 5 taps on the Account title, long-press on the profile card,
 * `savebite://dev`). Enabled in development builds or when `EXPO_PUBLIC_DEMO_MODE=true`; never in a finished build.
 */
export const DEV_ENTRY_ENABLED = __DEV__ || process.env.EXPO_PUBLIC_DEMO_MODE === 'true';
