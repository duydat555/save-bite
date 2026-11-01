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
    <SheetModal height={495}>
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

          <View style={styles.kindsBlock}>
            <Text variant="rowSubMedium" color="textSecondary" style={{ lineHeight: 20 }}>
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
                      <SymbolView
                        name="checkmark"
                        size={13}
                        weight="bold"
                        tintColor={colors.white}
                      />
                    ) : null}
                    <Text variant="semi14" color={on ? 'white' : 'textPrimary'}>
                      {label}
                    </Text>
                  </PressableScale>
                );
              })}
            </View>
          </View>

          <Row
            label="Nhu cầu ăn uống"
            value={f.dietary.length ? f.dietary.join(', ') : 'Kiểm tra dị ứng ở chi tiết món'}
            small
            height={56}
            onPress={() => router.push('/discover/filter-dietary')}
          />

          <View style={[styles.cta, { bottom: bottomInset + 12 }]}>
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
  height = 64,
}: {
  label: string;
  value: string;
  onPress: () => void;
  small?: boolean;
  height?: number;
}) {
  return (
    <PressableScale accessibilityRole="button" onPress={onPress} style={[styles.row, { height }]}>
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
  // figma: header at +29 (44), rows 64 high every 76, dietary row 56, CTA at +397 (52)
  body: { flex: 1, gap: 12, paddingHorizontal: 20, paddingTop: 29 },
  head: { height: 44, flexDirection: 'row', alignItems: 'center' },
  reset: { height: 44, justifyContent: 'center', paddingHorizontal: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  kindsBlock: { height: 80, gap: 12 },
  kinds: { flexDirection: 'row', gap: 8 },
  kind: {
    flex: 1,
    height: 44,
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
