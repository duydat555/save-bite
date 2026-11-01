import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/design-system/tokens';

/* ReservationProgress (353×36): two pills joined by a 24×2 rule. */
export function ReservationProgress({
  step,
  chosenRange,
}: {
  step: 'slot' | 'review';
  chosenRange?: string;
}) {
  const review = step === 'review';
  return (
    <View style={styles.progress}>
      <View style={[styles.pill, { backgroundColor: review ? colors.brand100 : colors.brand900 }]}>
        <Text
          variant="eyebrow"
          color={review ? 'success' : 'white'}
          style={review ? { width: 97 } : undefined} // figma: fixed 97 wide → wraps to two lines
        >
          {review ? `1. Đã chọn ${chosenRange}` : '1. Chọn giờ nhận'}
        </Text>
      </View>
      <View style={styles.rule} />
      <View
        style={[styles.pill, { backgroundColor: review ? colors.brand900 : colors.surfaceSubtle }]}
      >
        <Text variant="meta" color={review ? 'white' : 'textSecondary'}>
          2. Kiểm tra biên lai
        </Text>
      </View>
    </View>
  );
}

/* OfferSummary (353×76): subtle card, 56pt photo. */
export function OfferSummary({
  image,
  title,
  merchant,
  line,
}: {
  image: ImageSource | number;
  title: string;
  merchant: string;
  line: string;
}) {
  return (
    <View style={styles.summary}>
      <Image source={image} contentFit="cover" style={styles.photo56} />
      <View style={styles.summaryText}>
        <Text variant="itemTitleRow" numberOfLines={1}>
          {title}
        </Text>
        <Text variant="helper" color="textSecondary">
          {merchant}
        </Text>
        <Text variant="bold13" color="price">
          {line}
        </Text>
      </View>
    </View>
  );
}

/* PickupSlot (353×78): selected = brand900 + check, closed = subtle + muted. */
export function PickupSlot({
  title,
  hint,
  selected,
}: {
  title: string;
  hint: string;
  selected?: boolean;
}) {
  return (
    <View
      accessibilityState={{ selected: !!selected, disabled: !selected }}
      style={[styles.slot, { backgroundColor: selected ? colors.brand900 : colors.surfaceSubtle }]}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <Text variant="priceRow" color={selected ? 'canvas' : 'textSecondary'}>
          {title}
        </Text>
        <Text variant="meta" color={selected ? 'canvas' : 'textSecondary'}>
          {hint}
        </Text>
      </View>
      {selected ? <SvgIcon name="selected-check" size={20} /> : null}
    </View>
  );
}

/* UnifiedReceiptCard (353×288) with the paper top perforation (353×12 crop of the receipt pattern). */
export function ReceiptCard({
  image,
  title,
  merchant,
  when,
  rows,
  totalLabel,
  total,
  perforated = false,
}: {
  image: ImageSource | number;
  title: string;
  merchant: string;
  when: string;
  rows: {
    label: string;
    value: string;
    tone?: 'default' | 'success' | 'muted';
    weight?: 'medium' | 'semi';
  }[];
  totalLabel: string;
  total: string;
  /** SB-053 shows the paper top perforation; SB-062 does not. */
  perforated?: boolean;
}) {
  return (
    <View style={styles.receiptWrap}>
      <View style={styles.receipt}>
        <View style={styles.receiptHead}>
          <Image source={image} contentFit="cover" style={styles.photo56} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="priceRow">{title}</Text>
            <Text variant="meta" color="textSecondary">
              {merchant}
            </Text>
            <Text variant="eyebrow" color="brand900">
              {when}
            </Text>
          </View>
        </View>
        <DashedRule />
        {rows.map((r) => (
          <View key={r.label} style={styles.receiptRow}>
            <Text variant="rowSub" color="textSecondary">
              {r.label}
            </Text>
            <Text
              variant={
                r.tone === 'success' ? 'link' : r.tone === 'muted' ? 'rowSub' : 'rowSubMedium'
              }
              color={
                r.tone === 'success'
                  ? 'success'
                  : r.tone === 'muted'
                    ? 'textSecondary'
                    : 'textPrimary'
              }
              style={styles.right}
            >
              {r.value}
            </Text>
          </View>
        ))}
        <DashedRule />
        <View style={styles.receiptRow}>
          <Text variant="bold15">{totalLabel}</Text>
          <Text variant="detailPrice" color="price" style={styles.right}>
            {total}
          </Text>
        </View>
      </View>
      {perforated ? (
        <View style={styles.perforation} pointerEvents="none">
          <SvgIcon name="pattern-receipt-rule" size={353} />
        </View>
      ) : null}
    </View>
  );
}

function DashedRule() {
  return (
    <View style={{ height: 1.5, alignSelf: 'stretch', overflow: 'hidden' }}>
      <SvgIcon name="dash-rule" size={311} />
    </View>
  );
}

const styles = StyleSheet.create({
  progress: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 36 },
  pill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  rule: { width: 24, height: 2, backgroundColor: colors.borderDefault },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 12,
    paddingRight: 14,
    paddingVertical: 10,
    borderRadius: radius.tile,
    backgroundColor: colors.surfaceSubtle,
  },
  photo56: { width: 56, height: 56, borderRadius: 10 },
  summaryText: { flex: 1, gap: 2, overflow: 'hidden' },
  slot: {
    height: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: radius.tile,
  },
  receiptWrap: { width: '100%' },
  receipt: {
    gap: 14,
    padding: 20,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.white,
  },
  receiptHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  receiptRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  right: { textAlign: 'right' },
  // figma: perforation strip sits on the card's top edge (y=169), 12 high, clipped from the 235-high pattern
  perforation: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 353,
    height: 12,
    overflow: 'hidden',
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
  },
});
