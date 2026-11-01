import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, layout } from '@/design-system/tokens';

type Props = {
  appBarTitle: string;
  title: string; // Fraunces editorial heading, 2 lines separated by \n
  intro: string;
  sections: { heading: string; text: string }[];
  secondary?: { label: string; onPress: () => void };
  primary: { label: string; onPress?: () => void };
};

/**
 * Shared layout of SB-042 / SB-043 (empty "reviews" states): brand100 card with the chat glyph, editorial title,
 * intro, small headed sections, optional neutral button, primary CTA pinned to the bottom.
 */
export function InfoStateScreen({
  appBarTitle,
  title,
  intro,
  sections,
  secondary,
  primary,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title={appBarTitle} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 + 52 + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <SvgIcon name="chat-circle-text" size={40} />
        </View>
        <Text variant="displayEditorial" style={{ marginTop: 14 }}>
          {title}
        </Text>
        <Text variant="bodyLg" color="textSecondary" style={styles.intro}>
          {intro}
        </Text>
        {sections.map((s) => (
          <View key={s.heading} style={{ gap: 12 }}>
            <Text variant="bold14">{s.heading}</Text>
            <Text variant="bodyLg" color="textSecondary" style={{ lineHeight: 22 }}>
              {s.text}
            </Text>
          </View>
        ))}
        {secondary ? (
          <Button
            label={secondary.label}
            variant="neutral"
            style={{ height: 48 }}
            onPress={secondary.onPress}
          />
        ) : null}
      </ScrollView>
      <View style={[styles.footer, { bottom: insets.bottom + 20 }]}>
        <Button label={primary.label} onPress={primary.onPress ?? (() => router.back())} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 16, paddingHorizontal: layout.screenGutter, paddingTop: 4 },
  card: {
    height: 146,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: colors.brand100,
  },
  intro: { lineHeight: 22 },
  footer: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter },
});
