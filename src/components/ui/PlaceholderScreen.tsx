import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/Text';
import { layout } from '@/design-system/tokens';

type Props = { title: string; code: string };

/** Temporary tab content until the real screen (SB-xxx) is built. */
export function PlaceholderScreen({ title, code }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Text variant="brandTitle" color="brand900">
        {title}
      </Text>
      <Text variant="meta" color="textSecondary">
        {code} · chưa dựng
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 4, paddingHorizontal: layout.screenGutter },
});
