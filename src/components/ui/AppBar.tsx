import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { colors, layout } from '@/design-system/tokens';

import { GlassButton } from './GlassButton';
import { Text } from './Text';

type Props = {
  title: string;
  onBack?: () => void;
  /** Success screens swap the back button for a 44pt close button on the right (SB-056). */
  onClose?: () => void;
  /** Optional trailing action (text link such as "Sửa"). */
  right?: React.ReactNode;
};

/** Figma AppBar: 393×56, pl16 pr20; 50pt glass back button (chevron.left) + centred 17pt SemiBold title. */
export function AppBar({ title, onBack, onClose, right }: Props) {
  return (
    <View style={styles.bar}>
      {onClose ? (
        <View style={styles.closeWrap}>
          <GlassButton symbol="xmark" accessibilityLabel="Đóng" size={44} onPress={onClose} />
        </View>
      ) : (
        <GlassButton
          symbol="chevron.left"
          accessibilityLabel="Quay lại"
          onPress={onBack ?? (() => router.back())}
        />
      )}
      {right ? <View style={styles.right}>{right}</View> : null}
      <View style={styles.title} pointerEvents="none">
        <Text variant="appBarTitle">{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: layout.headerHeight,
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 20,
    backgroundColor: colors.canvas,
  },
  title: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  right: { position: 'absolute', right: 20, top: 0, bottom: 0, justifyContent: 'center' },
  closeWrap: { alignSelf: 'flex-end', marginRight: -4 }, // figma: Close 44 at x=333 (right edge 377)
});
