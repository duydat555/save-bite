import type { ViewStyle } from 'react-native';

// Figma effect values not exposed via MCP yet (docs/02 · Shadow = TBD).
// `glass` is an approximation requested by the user (soft shadow under glass buttons / tab bar).
export const shadows = {
  glass: {
    shadowColor: '#092F29',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
} satisfies Record<string, ViewStyle>;
