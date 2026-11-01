import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/ui/PressableScale';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import type { SvgName } from '@/design-system/icons/svg-data';
import { colors, layout, radius } from '@/design-system/tokens';

/** "Selected item context" (SB-085/086/087): 28pt glyph at x0, copy at x40 — name 22 high, sub 18 high. */
export function ItemSummary({
  glyph,
  name,
  sub,
  height = 44,
}: {
  glyph: React.ReactNode;
  name: string;
  sub: string;
  height?: number;
}) {
  return (
    <View style={[styles.summary, { height }]}>
      <View style={styles.glyph}>{glyph}</View>
      <View style={{ flex: 1 }}>
        <Text variant="semi16" style={{ lineHeight: 22 }}>
          {name}
        </Text>
        <Text variant="meta" color="textSecondary" style={{ lineHeight: 18, marginTop: 4 }}>
          {sub}
        </Text>
      </View>
    </View>
  );
}

/**
 * Sticky CTA dock. Figma docks are 108 high at y=710 with the button at y+20 (SB-077/082/085/086/087) or y+18 (SB-083/084),
 * i.e. the button's bottom edge sits 36 / 38 above the home-indicator line (y=818). `offset` is that distance.
 */
export function StickyDock({
  children,
  offset = 36,
}: {
  children: React.ReactNode;
  offset?: number;
}) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.dock, { bottom: insets.bottom + offset }]}>{children}</View>;
}

/** Banner card (SB-083 warning / SB-084 danger / SB-088 note): 16 padding, title 16/22 SemiBold, body 15/22. */
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
      <Text variant="semi16" color={tone} style={{ lineHeight: 22 }}>
        {title}
      </Text>
      <Text variant="bodyLg" style={{ lineHeight: 22 }}>
        {body}
      </Text>
    </View>
  );
}

/** List row of SB-083/084/088/090: 32pt glyph at x0, copy at x44 (name 22 high + detail lines 18 high), optional caret. */
export function IconListRow({
  icon,
  title,
  titleColor,
  lines,
  height,
  caret,
  onPress,
}: {
  icon: SvgName;
  title: string;
  titleColor?: 'danger';
  lines: string[];
  height: number;
  caret?: boolean;
  onPress?: () => void;
}) {
  return (
    <PressableScale
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={[styles.listRow, { minHeight: height }]}
    >
      <SvgIcon name={icon} size={32} />
      <View style={{ flex: 1 }}>
        <Text variant="semi16" color={titleColor} style={{ fontSize: 15, lineHeight: 22 }}>
          {title}
        </Text>
        {lines.map((l) => (
          <Text
            key={l}
            variant="meta"
            color="textSecondary"
            style={{ fontSize: 13, lineHeight: 18 }}
          >
            {l}
          </Text>
        ))}
      </View>
      {caret ? <SvgIcon name="caret-right-16" size={16} /> : null}
    </PressableScale>
  );
}

export function GlyphIcon({ name, size = 28 }: { name: SvgName; size?: number }) {
  return <SvgIcon name={name} size={size} />;
}

export const flowStyles = StyleSheet.create({
  // figma: scroll content padding 20 horizontal; first block at y12 (SB-083/084/086/088/090) or y20 (SB-085)
  content: { gap: 16, paddingHorizontal: layout.screenGutter, paddingTop: 12 },
  note: { lineHeight: 18 },
});

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  glyph: { width: 28, alignItems: 'center' },
  dock: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter, gap: 8 },
  notice: { gap: 8, padding: 16, borderRadius: radius.md },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9 },
});
