import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from './Text';

type Props = { title: string; actionLabel?: string; onPressAction?: () => void };

export function SectionHeader({ title, actionLabel, onPressAction }: Props) {
  return (
    <View style={styles.row}>
      <Text variant="sectionTitle">{title}</Text>
      {actionLabel ? (
        <Pressable accessibilityRole="link" onPress={onPressAction}>
          <Text variant="link" color="brand900">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { height: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
