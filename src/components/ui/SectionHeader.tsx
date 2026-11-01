import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from './Text';

type Props = {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
  onPressTitle?: () => void;
};

export function SectionHeader({ title, actionLabel, onPressAction, onPressTitle }: Props) {
  return (
    <View style={styles.row}>
      <Pressable accessibilityRole={onPressTitle ? 'link' : undefined} onPress={onPressTitle}>
        <Text variant="sectionTitle">{title}</Text>
      </Pressable>
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
