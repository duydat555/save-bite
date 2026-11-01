import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import type { SvgName } from '@/design-system/icons/svg-data';
import { colors, layout, radius } from '@/design-system/tokens';

/** Item line under the AppBar of SB-085/086/087: 24pt glyph + name (SemiBold 16) + "1 hộp · Ngăn mát" (12). */
export function ItemSummary({
  glyph,
  name,
  sub,
}: {
  glyph: React.ReactNode;
  name: string;
  sub: string;
}) {
  return (
    <View style={styles.summary}>
      <View style={styles.glyph}>{glyph}</View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="semi16" style={{ fontSize: 15 }}>
          {name}
        </Text>
        <Text variant="meta" color="textSecondary">
          {sub}
        </Text>
      </View>
    </View>
  );
}

/** Sticky CTA dock (Figma "Sticky action dock": 108 high, 20 gutter, button 52). */
export function StickyDock({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.dock, { bottom: insets.bottom + 20 }]}>{children}</View>;
}

/** Banner card used on SB-083 (warning) and SB-084 (danger): bold title + body on a tinted r20 card. */
export function NoticeCard({
  tone,
  title,
  body,
}: {
  tone: 'warning' | 'danger';
  title: string;
  body: string;
}) {
  return (
    <View
      style={[
        styles.notice,
        { backgroundColor: tone === 'warning' ? colors.warningBg : colors.dangerBg },
      ]}
    >
      <Text variant="bold15" color={tone} style={{ fontSize: 16 }}>
        {title}
      </Text>
      <Text variant="bodyLg" style={{ lineHeight: 22 }}>
        {body}
      </Text>
    </View>
  );
}

export function GlyphIcon({ name, size = 24 }: { name: SvgName; size?: number }) {
  return <SvgIcon name={name} size={size} />;
}

export const flowStyles = StyleSheet.create({
  content: { gap: 12, paddingHorizontal: layout.screenGutter, paddingTop: 6 },
  title: { fontSize: 24, lineHeight: 30 },
  note: { lineHeight: 20 },
});

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 },
  glyph: { width: 28, alignItems: 'center' },
  dock: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter, gap: 8 },
  notice: { gap: 6, padding: 16, borderRadius: radius.md },
});
