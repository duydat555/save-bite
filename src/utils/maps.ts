import { Linking } from 'react-native';

/** "Chỉ đường": opens Apple Maps with walking directions to the coordinate. */
export function openDirections(latitude: number, longitude: number, name?: string) {
  const q = name ? `&q=${encodeURIComponent(name)}` : '';
  return Linking.openURL(`http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=w${q}`);
}
