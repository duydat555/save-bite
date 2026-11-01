import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { GlassButton } from '@/components/ui/GlassButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { SheetModal } from '@/components/ui/SheetModal';
import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/design-system/tokens';
import { budgetLabel, useFilters, type Kind } from '@/store/filterStore';

// SB-023 · Bộ lọc tổng hợp (sheet over Home). Sheet top ≈ y358 → 494 high (ESTIMATE from the screenshot).
// Rows open SB-024 / 025 / 026; "Áp dụng bộ lọc" shows the filtered list (SB-021 layout).
export default function FiltersSheet() {
  const f = useFilters();
  const toggleKind = (k: Kind) =>
    f.set({ kinds: f.kinds.includes(k) ? f.kinds.filter((x) => x !== k) : [...f.kinds, k] });

  return (
    <SheetModal height={494}>
      {({ dismiss, bottomInset }) => (
        <View style={styles.body}>
          <View style={styles.head}>
            <Text variant="title20" style={{ flex: 1 }}>
              Bộ lọc tìm kiếm
            </Text>
            <PressableScale accessibilityRole="button" onPress={f.reset} style={styles.reset}>
              <Text variant="linkMedium14" color="textSecondary">
                Đặt lại
              </Text>
            </PressableScale>
            <GlassButton symbol="xmark" accessibilityLabel="Đóng" size={44} onPress={dismiss} />
          </View>

          <Row
            label="Ngân sách mỗi phần"
            value={budgetLabel(f.budget)}
            onPress={() => router.push('/discover/filter-budget')}
          />
          <Row
            label="Giờ có thể nhận"
            value={f.slot ? `Hôm nay · ${f.slot.start}–${f.slot.end}` : 'Bất kỳ giờ nào'}
            onPress={() => router.push('/discover/filter-slots')}
          />

          <Text variant="rowSubMedium" color="textSecondary" style={{ marginTop: 14 }}>
            Loại ưu đãi
          </Text>
          <View style={styles.kinds}>
            {(
              [
                ['specific', 'Món cụ thể'],
                ['surprise', 'Túi bất ngờ'],
              ] as const
            ).map(([k, label]) => {
              const on = f.kinds.includes(k);
              return (
                <PressableScale
                  key={k}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  onPress={() => toggleKind(k)}
                  style={[styles.kind, on ? styles.kindOn : styles.kindOff]}
                >
                  {on ? (
                    <SymbolView name="checkmark" size={13} weight="bold" tintColor={colors.white} />
                  ) : null}
                  <Text variant="semi14" color={on ? 'white' : 'textPrimary'}>
                    {label}
                  </Text>
                </PressableScale>
              );
            })}
          </View>

          <Row
            label="Nhu cầu ăn uống"
            value={f.dietary.length ? f.dietary.join(', ') : 'Kiểm tra dị ứng ở chi tiết món'}
            small
            onPress={() => router.push('/discover/filter-dietary')}
          />

          <View style={[styles.cta, { bottom: bottomInset + 14 }]}>
            <Button
              label="Áp dụng bộ lọc"
              onPress={() => router.replace({ pathname: '/discover/results', params: { f: '1' } })}
            />
          </View>
        </View>
      )}
    </SheetModal>
  );
}

function Row({
  label,
  value,
  onPress,
  small,
}: {
  label: string;
  value: string;
  onPress: () => void;
  small?: boolean;
}) {
  return (
    <PressableScale accessibilityRole="button" onPress={onPress} style={styles.row}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="rowSubMedium" color="textSecondary">
          {label}
        </Text>
        <Text
          variant={small ? 'rowSub' : 'action17'}
          color={small ? 'textSecondary' : 'textPrimary'}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
      <SymbolView name="chevron.right" size={16} weight="medium" tintColor={colors.brand900} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 30 },
  head: { height: 44, flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  reset: { height: 44, justifyContent: 'center', paddingHorizontal: 8 },
  row: { minHeight: 64, flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  kinds: { flexDirection: 'row', gap: 12, marginTop: 8 },
  kind: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: radius.pill,
  },
  kindOn: { backgroundColor: colors.brand900 },
  kindOff: { backgroundColor: colors.surfaceSubtle },
  cta: { position: 'absolute', left: 20, right: 20 },
});
