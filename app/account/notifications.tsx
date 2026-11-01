import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { GlassButton } from '@/components/ui/GlassButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { Skeleton } from '@/components/ui/Skeleton';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import type { SvgName } from '@/design-system/icons/svg-data';
import { colors, layout, radius } from '@/design-system/tokens';
import { accountService } from '@/services/accountService';
import { useDevFlags } from '@/store/devFlags';
import type { NotificationItem } from '@/types';

// SB-095 · Thông báo (list, filter chips Tất cả / Đơn hàng / Tủ thực phẩm) and SB-096 (empty state). The empty state is
// shown when there are no notifications (dev hub "Xóa thông báo"). Entry point (bell on Khám phá?) is not drawn → dev hub.
const FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'order', label: 'Đơn hàng' },
  { key: 'pantry', label: 'Tủ thực phẩm' },
] as const;

export default function Notifications() {
  const insets = useSafeAreaInsets();
  const cleared = useDevFlags((s) => s.notificationsCleared);
  const [items, setItems] = useState<NotificationItem[] | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all');

  useEffect(() => {
    accountService.notifications().then(setItems);
  }, []);

  const list = cleared ? [] : items;
  const shown = list?.filter((n) => filter === 'all' || n.group === filter) ?? [];
  const groups = (['order', 'pantry'] as const)
    .map((g) => shown.filter((n) => n.group === g))
    .filter((g) => g.length > 0);

  const settings = () => router.push('/account/notification-settings');
  const header = (
    <>
      <View style={{ height: insets.top }} />
      <View>
        <AppBar title="Thông báo" />
        <View style={styles.sliders}>
          <GlassButton
            symbol="slider.horizontal.3"
            accessibilityLabel="Tùy chọn thông báo"
            onPress={settings}
          />
        </View>
      </View>
    </>
  );

  if (list && list.length === 0) {
    return (
      <View style={styles.container}>
        {header}
        <View style={styles.empty}>
          <SvgIcon name="mam-quiet" size={150} />
          <Text variant="largeTitle" style={{ fontSize: 28, lineHeight: 34, marginTop: 28 }}>
            Một chút yên tĩnh.
          </Text>
          <Text variant="bodyLg" style={{ lineHeight: 22 }}>
            Khi có đơn cần nhận hoặc thực phẩm gần ngày hạn, lời nhắc sẽ nằm ở đây.
          </Text>
          <Text variant="meta" color="textSecondary">
            Bạn tự chọn loại nhắc và khung giờ phù hợp.
          </Text>
        </View>
        <View style={[styles.dock, { bottom: insets.bottom + 20 }]}>
          <Button label="Tùy chọn nhắc nhở" onPress={settings} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {header}
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.chips}>
          {FILTERS.map((f) => (
            <PressableScale
              key={f.key}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === f.key }}
              onPress={() => setFilter(f.key)}
              style={[styles.chip, filter === f.key ? styles.chipOn : styles.chipOff]}
            >
              <Text variant="semi14" color={filter === f.key ? 'white' : 'textPrimary'}>
                {f.label}
              </Text>
            </PressableScale>
          ))}
        </View>
        <Text variant="meta" color="textSecondary">
          {filter === 'all' ? 'Tất cả thông báo' : FILTERS.find((f) => f.key === filter)?.label}
        </Text>
        {list === null ? (
          <Skeleton height={160} radius={radius.md} />
        ) : (
          groups.map((g) => (
            <View key={g[0].id} style={styles.group}>
              {g.map((n, i) => (
                <View key={n.id} style={[styles.row, i < g.length - 1 && styles.divider]}>
                  <View style={styles.dotCol}>{n.unread ? <View style={styles.dot} /> : null}</View>
                  <View style={[styles.tile, n.tone === 'warm' && styles.tileWarm]}>
                    {n.icon === 'receipt' ? (
                      <SymbolView name="doc.text" size={20} tintColor={colors.warning} />
                    ) : (
                      <SvgIcon name={n.icon as SvgName} size={22} />
                    )}
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text variant="bold14" style={{ lineHeight: 20 }}>
                      {n.title}
                    </Text>
                    <Text variant="meta" color="textSecondary" style={{ lineHeight: 18 }}>
                      {n.subtitle}
                    </Text>
                    <Text variant="meta" color="textSecondary" style={{ lineHeight: 18 }}>
                      {n.when}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  sliders: { position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center' },
  // figma 133:3547: chips 48 high (3 equal, gap 12) at y12, caption y76, groups y110 / y302 with 88-high rows, 16 gaps
  content: { gap: 16, paddingHorizontal: layout.screenGutter, paddingTop: 12 },
  chips: { flexDirection: 'row', gap: 12 },
  chip: {
    flex: 1,
    height: 48,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  chipOn: { backgroundColor: colors.brand900 },
  chipOff: { borderWidth: 1, borderColor: colors.borderDefault, backgroundColor: colors.canvas },
  group: {
    paddingHorizontal: 0,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  row: {
    height: 88,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    gap: 12,
  },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.borderDefault },
  dotCol: { position: 'absolute', left: 6, top: 41, width: 5, height: 5 },
  dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.brand900 },
  tile: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.input,
    backgroundColor: colors.brand100,
  },
  tileWarm: { backgroundColor: colors.warningBg },
  empty: { gap: 12, paddingHorizontal: layout.screenGutter, paddingTop: 36 },
  dock: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter },
});
