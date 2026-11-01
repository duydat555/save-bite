import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { GlassButton } from '@/components/ui/GlassButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Text } from '@/components/ui/Text';
import { PANTRY_TODAY } from '@/constants/pantry';
import { colors, fontFamily, layout } from '@/design-system/tokens';
import { usePantryDraft } from '@/store/pantryDraft';
import { formatDate, parseDate } from '@/utils/pantry';

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTH = (m: number, y: number) => `Tháng ${m}, ${y}`;

// SB-079 · Chọn ngày hạn · Use-by vs Best-before (full-height sheet): kind switch, month calendar, "Chưa rõ", confirm.
export default function PantryDateSheet() {
  const insets = useSafeAreaInsets();
  const { draft, set } = usePantryDraft();
  const picked = parseDate(draft.date);
  const base = picked ?? PANTRY_TODAY;
  const [year, setYear] = useState(Number(base.slice(0, 4)));
  const [month, setMonth] = useState(Number(base.slice(5, 7))); // 1–12

  const first = new Date(year, month - 1, 1).getDay(); // 0 = Sunday (CN)
  const days = new Date(year, month, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  const iso = (d: number) =>
    `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const step = (delta: number) => {
    const d = new Date(year, month - 1 + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth() + 1);
  };
  const atMin =
    year * 12 + month <=
    Number(PANTRY_TODAY.slice(0, 4)) * 12 + Number(PANTRY_TODAY.slice(5, 7)) - 12;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.head}>
        <Text variant="bold15" style={{ fontSize: 20, lineHeight: 26 }}>
          Ngày trên nhãn
        </Text>
        <GlassButton
          symbol="xmark"
          accessibilityLabel="Đóng"
          size={44}
          onPress={() => router.back()}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <SegmentedControl
          tabs={['Hạn sử dụng', 'Nên dùng trước']}
          index={draft.dateKind === 'use-by' ? 0 : 1}
          onChange={(i) => set({ dateKind: i === 0 ? 'use-by' : 'best-before' })}
        />
      </View>
      <Text variant="rowSub" color="textSecondary" style={{ marginTop: 10 }}>
        Giữ đúng loại ngày trên nhãn sản phẩm.
      </Text>

      <View style={styles.monthRow}>
        <Text variant="semi16">{MONTH(month, year)}</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ opacity: atMin ? 0.4 : 1 }}>
            <GlassButton
              symbol="chevron.left"
              accessibilityLabel="Tháng trước"
              size={44}
              onPress={() => !atMin && step(-1)}
            />
          </View>
          <GlassButton
            symbol="chevron.right"
            accessibilityLabel="Tháng sau"
            size={44}
            onPress={() => step(1)}
          />
        </View>
      </View>

      <View style={styles.week}>
        {WEEKDAYS.map((w) => (
          <Text key={w} variant="eyebrow" color="textSecondary" style={styles.cell}>
            {w}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((d, i) => {
          if (d == null) return <View key={i} style={styles.cell} />;
          const selected = picked === iso(d);
          const today = PANTRY_TODAY === iso(d);
          return (
            <PressableScale
              key={i}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Ngày ${d}`}
              onPress={() => set({ date: formatDate(iso(d)) })}
              style={styles.cell}
            >
              <View style={[styles.day, selected ? styles.daySel : today ? styles.dayToday : null]}>
                <Text
                  variant="bodyLg"
                  style={{
                    fontSize: 20,
                    fontFamily: fontFamily.regular,
                    color: selected ? colors.white : today ? colors.brand700 : colors.textPrimary,
                  }}
                >
                  {d}
                </Text>
              </View>
            </PressableScale>
          );
        })}
      </View>

      <Text variant="linkMedium14" color="brand900" style={{ marginTop: 14 }}>
        {draft.date || 'Chưa chọn ngày'}
      </Text>
      <Button
        label="Chưa rõ"
        variant="neutral"
        style={{ height: 48, marginTop: 10 }}
        onPress={() => set({ date: '' })}
      />

      <View style={[styles.footer, { bottom: insets.bottom + 20 }]}>
        <Button label="Xác nhận ngày hạn" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: layout.screenGutter, backgroundColor: colors.canvas },
  head: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  week: { flexDirection: 'row', marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%`,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  day: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
  daySel: { backgroundColor: colors.brand900 },
  dayToday: { backgroundColor: colors.brand100 },
  footer: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter },
});
