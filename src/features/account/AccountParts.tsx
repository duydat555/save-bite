import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { PressableScale } from '@/components/ui/PressableScale';

import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import type { SvgName } from '@/design-system/icons/svg-data';
import { colors, radius } from '@/design-system/tokens';

/* ProfileHeaderCard (353×84): 52pt round avatar + name + area line. */
export function ProfileHeaderCard({ name, area }: { name: string; area: string }) {
  return (
    <PressableScale accessibilityRole="button" style={styles.profile}>
      <View style={styles.avatar}>
        {/* figma: the photo is a 222%×333% crop of the 52pt circle, offset (-75.56%, -51.67%) */}
        <Image
          source={require('@assets/images/avatar-minh-anh.png')}
          contentFit="cover"
          style={{
            position: 'absolute',
            width: 52 * 2.2222,
            height: 52 * 3.3333,
            left: -52 * 0.7556,
            top: -52 * 0.5167,
          }}
        />
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text variant="priceRow">{name}</Text>
        <Text variant="meta" color="textSecondary">
          {area}
        </Text>
      </View>
    </PressableScale>
  );
}

/* ImpactHeroCard (353×114): brand900 card, two stats, decorative disclosure at (319,18). */
export function ImpactHeroCard({
  label,
  stats,
}: {
  label: string;
  stats: { value: string; caption: string }[];
}) {
  return (
    <PressableScale accessibilityRole="button" style={styles.impact}>
      <Text variant="impactLabel" style={{ color: colors.brand100 }}>
        {label}
      </Text>
      <View style={styles.stats}>
        {stats.map((s) => (
          <View key={s.caption} style={{ flex: 1, gap: 2 }}>
            <Text variant="detailPrice" color="white">
              {s.value}
            </Text>
            <Text variant="helper" style={{ color: colors.brand100 }}>
              {s.caption}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.impactDisclosure}>
        <SvgIcon name="impact-disclosure" size={16} />
      </View>
    </PressableScale>
  );
}

export type SettingsRowData = { icon: SvgName; title: string; subtitle: string };

/** Section label (11pt Bold, secondary) + grouped rows on a subtle r16 card (72pt rows, 1px dividers). */
export function SettingsGroup({ label, rows }: { label: string; rows: SettingsRowData[] }) {
  return (
    <>
      <Text variant="eyebrowPill" color="textSecondary">
        {label}
      </Text>
      <View style={styles.group}>
        {rows.map((r, i) => (
          <PressableScale
            key={r.title}
            accessibilityRole="button"
            style={[styles.settingsRow, i < rows.length - 1 && styles.divider]}
          >
            <SvgIcon name={r.icon} size={24} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant="linkMedium14">{r.title}</Text>
              <Text variant="rowSub" color="textSecondary">
                {r.subtitle}
              </Text>
            </View>
            <SvgIcon name="disclosure" size={16} />
          </PressableScale>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  profile: {
    height: 84,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.white,
  },
  avatar: { width: 52, height: 52, overflow: 'hidden', borderRadius: radius.pill },
  impact: {
    height: 114,
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: radius.md,
    backgroundColor: colors.brand900,
  },
  stats: { flexDirection: 'row', gap: 16 },
  impactDisclosure: { position: 'absolute', left: 319, top: 18 },
  group: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: radius.tile,
    backgroundColor: colors.surfaceSubtle,
  },
  settingsRow: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.borderDefault },
});
