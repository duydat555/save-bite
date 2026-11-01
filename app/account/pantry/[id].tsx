import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { categoryMeta, dateKindLabel, freshnessLabel, storageLabel } from '@/constants/pantry';
import type { SvgName } from '@/design-system/icons/svg-data';
import { colors, layout, radius } from '@/design-system/tokens';
import { usePantryStore } from '@/store/pantryStore';
import { formatDate, freshnessOf } from '@/utils/pantry';

// SB-081 · Chi tiết thực phẩm · Ngày hạn & bảo quản. "Sửa" → SB-082, "Nhắc hạn" → SB-085, "Đánh dấu đã dùng" → SB-086,
// "Đánh dấu đã bỏ" → SB-087.
const tone = {
  good: { bg: colors.successBg, fg: colors.success },
  soon: { bg: colors.warningBg, fg: colors.warning },
  overdue: { bg: colors.dangerBg, fg: colors.danger },
};

export default function PantryDetail() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = usePantryStore((s) => s.items.find((i) => i.id === id));

  if (!item) {
    return (
      <View style={styles.center}>
        <Text variant="bodyMedium">Không tìm thấy thực phẩm này.</Text>
      </View>
    );
  }

  const fresh = freshnessOf(item.expiry);
  const t = tone[fresh];
  const go = (pathname: '/account/pantry/usage/[id]' | '/account/pantry/discard/[id]') =>
    router.push({ pathname, params: { id: item.id } });

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar
        title="Chi tiết thực phẩm"
        right={
          <PressableScale
            accessibilityRole="button"
            onPress={() =>
              router.push({ pathname: '/account/pantry/edit/[id]', params: { id: item.id } })
            }
            style={styles.edit}
          >
            <Text variant="semi16" color="brand900" style={{ fontSize: 15 }}>
              Sửa
            </Text>
          </PressableScale>
        }
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 20 + 52 + 8 + 52 + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          <View style={styles.tile}>
            <SvgIcon name={item.icon as SvgName} size={48} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text variant="bold15" style={{ fontSize: 22, lineHeight: 28 }}>
              {item.name}
            </Text>
            <Text
              variant="linkMedium14"
              color="textSecondary"
            >{`${item.quantity} · ${storageLabel[item.storage]}`}</Text>
            <Text variant="helper" color="textSecondary">
              {categoryMeta[item.category].label}
            </Text>
          </View>
        </View>

        <View style={[styles.expiry, { backgroundColor: t.bg }]}>
          <Text variant="rowSub" color="textSecondary">
            {dateKindLabel[item.dateKind]}
          </Text>
          <View style={styles.expiryRow}>
            <Text variant="bold15" style={{ fontSize: 28, lineHeight: 36, color: t.fg }}>
              {formatDate(item.expiry)}
            </Text>
            <View style={styles.pill}>
              <Text variant="semi14" style={{ fontSize: 13, color: t.fg }}>
                {freshnessLabel[fresh]}
              </Text>
            </View>
          </View>
        </View>

        <Row icon="map-pin" label="Nơi bảo quản" value={storageLabel[item.storage]} />
        <Row
          icon="bell"
          label="Nhắc hạn"
          value={
            item.reminder?.enabled
              ? `Trước ${item.reminder.daysBefore} ngày · ${item.reminder.time}`
              : 'Chưa bật lời nhắc'
          }
          onPress={() =>
            router.push({ pathname: '/account/pantry/reminder/[id]', params: { id: item.id } })
          }
        />

        <View style={styles.note}>
          <SvgIcon name="info" size={18} />
          <Text variant="rowSub" color="textSecondary" style={{ flex: 1, lineHeight: 20 }}>
            Ngày hạn do bạn nhập. Kiểm tra nhãn và hướng dẫn bảo quản trên bao bì.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { bottom: insets.bottom + 20 }]}>
        <Button label="Đánh dấu đã dùng" onPress={() => go('/account/pantry/usage/[id]')} />
        <PressableScale
          accessibilityRole="button"
          onPress={() => go('/account/pantry/discard/[id]')}
          style={styles.discard}
        >
          <Text variant="buttonLabel" color="danger">
            Đánh dấu đã bỏ
          </Text>
        </PressableScale>
      </View>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
  onPress,
}: {
  icon: SvgName;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <PressableScale accessibilityRole="button" onPress={onPress} style={styles.row}>
      <SvgIcon name={icon} size={20} />
      <Text variant="linkMedium14" color="textSecondary" style={{ flex: 1 }}>
        {label}
      </Text>
      <Text variant="semi14" style={{ fontSize: 15 }}>
        {value}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.canvas,
  },
  content: { gap: 16, paddingHorizontal: layout.screenGutter, paddingTop: 8 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  tile: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.brand100,
  },
  expiry: { gap: 6, padding: 16, borderRadius: radius.md },
  expiryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pill: {
    height: 38,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  edit: { height: 44, justifyContent: 'center', paddingHorizontal: 4 },
  row: { height: 44, flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: radius.tile,
    backgroundColor: colors.surfaceSubtle,
  },
  footer: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter, gap: 8 },
  discard: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
});
