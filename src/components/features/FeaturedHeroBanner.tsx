import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { PressableScale } from '@/components/ui/PressableScale';

import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/design-system/tokens';

type Props = {
  titleLines: [string, string]; // ["Túi bánh", "bất ngờ"]
  subtitle: string; // "29.000đ · 18:00–19:00"
  onPress?: () => void;
};

/** Figma FeaturedHeroBanner: full width × 112, brand900, r20; illustration 112×112 flush right. */
export function FeaturedHeroBanner({ titleLines, subtitle, onPress }: Props) {
  return (
    <PressableScale accessibilityRole="button" onPress={onPress} style={styles.banner}>
      <Image
        source={require('@assets/images/surprise-bag.png')}
        contentFit="cover"
        style={styles.art}
      />
      <View style={styles.copy}>
        <View>
          <Text variant="heroTitle" color="textInverse">
            {titleLines[0]}
          </Text>
          <Text variant="heroTitle" color="textInverse">
            {titleLines[1]}
          </Text>
        </View>
        <Text variant="heroSub" color="textInverse">
          {subtitle}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 112,
    overflow: 'hidden',
    borderRadius: radius.md,
    backgroundColor: colors.brand900,
  },
  art: { position: 'absolute', right: 0, top: 0, width: 112, height: 112 },
  copy: { position: 'absolute', left: 16, top: 16, width: 205, gap: 6 },
});
