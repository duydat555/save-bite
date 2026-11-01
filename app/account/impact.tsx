import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { impactStats } from '@/data/mock/orders';
import { colors, layout, radius } from '@/design-system/tokens';
import { accountService } from '@/services/accountService';
import type { ImpactEntry } from '@/types';

// SB-100 · Tác động của bạn · Verified Rescue. Total = sum of the completed-order amounts; each bar = amount / max amount.
const vnd = (n: number) => `${n.toLocaleString('vi-VN')}đ`;

export default function Impact() {
  const insets = useSafeAreaInsets();
  const [rows, setRows] = useState<ImpactEntry[] | null>(null);
  useEffect(() => {
    accountService.impact().then(setRows);
  }, []);
  const total = rows?.reduce((s, r) => s + r.amount, 0) ?? 0;
  const max = Math.max(...(rows?.map((r) => r.amount) ?? [1]));

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Tác động của bạn" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={{ flex: 1 }}>
            <Text variant="rowSubMedium" style={{ color: colors.brand100 }}>
              Đã nhận tại quầy
            </Text>
            <Text variant="displayHero" color="white" style={styles.big}>
              {`${impactStats.orders} phần`}
            </Text>
            <Text variant="meta" style={{ color: colors.brand100 }}>
              {`từ ${impactStats.orders} đơn đã nhận`}
            </Text>
            <View style={styles.rule} />
            <Text variant="bold12" color="white">
              {`${impactStats.items} món Pantry đã dùng kịp ngày hạn`}
            </Text>
          </View>
          <View style={styles.mascot}>
            <SvgIcon name="mam-carry" size={100} />
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <View style={styles.totalRow}>
            <Text variant="semi14" color="textSecondary">
              Đã trả tại quầy
            </Text>
            <Text variant="heroTitle" color="price" style={{ fontSize: 28, lineHeight: 34 }}>
              {vnd(total)}
            </Text>
          </View>

          {rows === null ? (
            <Skeleton height={190} radius={radius.md} />
          ) : (
            rows.map((r) => (
              <View key={r.id} style={styles.entry}>
                <Image source={r.image} contentFit="cover" style={styles.thumb} />
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={styles.entryTop}>
                    <Text variant="bold14" style={{ flex: 1 }} numberOfLines={1}>
                      {r.name}
                    </Text>
                    <Text variant="bold14">{vnd(r.amount)}</Text>
                  </View>
                  <Text variant="rowSub" color="textSecondary">
                    {r.date}
                  </Text>
                  <View style={styles.track}>
                    <View style={[styles.fill, { width: `${(r.amount / max) * 100}%` }]} />
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.note}>
          <Text variant="bold14">Các con số này được tính thế nào?</Text>
          <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 20 }}>
            Tổng số tiền đã thanh toán cho các đơn nhận thành công.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  // figma 461:4966: body at y12; hero 164, total row 40 at +20, entries 72 high every 84, disclosure (96) at +20
  content: { gap: 20, paddingHorizontal: layout.screenGutter, paddingTop: 12 },
  hero: {
    height: 164,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: radius.md,
    backgroundColor: colors.brand900,
  },
  big: {
    fontSize: 44,
    lineHeight: 52,
    letterSpacing: -0.66,
    fontFamily: 'BeVietnamPro_800ExtraBold',
  },
  rule: { height: 1, marginVertical: 10, backgroundColor: 'rgba(237,243,231,0.3)' },
  mascot: { position: 'absolute', left: 233, top: 14 }, // figma: 100×100 at (233,14)
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  entry: { height: 72, flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 56, height: 56, borderRadius: radius.input },
  entryTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  track: { height: 6, overflow: 'hidden', borderRadius: 3, backgroundColor: colors.surfaceSubtle },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.brand700 },
  note: {
    minHeight: 96,
    gap: 8,
    padding: 16,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
  },
});
