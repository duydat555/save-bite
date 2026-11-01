import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { SheetModal } from '@/components/ui/SheetModal';
import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/design-system/tokens';
import { useOffer } from '@/features/offer/useOffer';
import { useUi } from '@/store/uiStore';
import { formatPrice, formatTimeRange } from '@/utils/format';

// SB-054 · Confirm Reservation Sheet (over SB-053; top ≈ y332 → 520 high). "Xác nhận giữ chỗ" closes the sheet and asks
// SB-053 to start the processing state (SB-055); "Xem lại đơn" just closes it.
export default function ConfirmSheet() {
  const { offerId, qty } = useLocalSearchParams<{ offerId: string; qty?: string }>();
  const n = Math.max(1, Number(qty) || 1);
  const offer = useOffer(offerId);

  return (
    <SheetModal height={520}>
      {({ dismiss, bottomInset }) => (
        <View style={styles.body}>
          <Text variant="title20">{`Xác nhận giữ ${n} phần?`}</Text>
          <View style={styles.card}>
            <Text variant="bold15" style={{ fontSize: 16 }}>
              Không thu tiền online
            </Text>
            <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 20 }}>
              {offer
                ? `Bạn thanh toán ${formatPrice(offer.priceVnd * n)} trực tiếp tại ${offer.merchant.name}.`
                : ' '}
            </Text>
          </View>
          <Line label="Món" value={offer ? `${offer.title} × ${n}` : ' '} />
          <Line
            label="Nhận lúc"
            value={offer ? `Hôm nay · ${formatTimeRange(offer.pickupStart, offer.pickupEnd)}` : ' '}
          />
          <Line label="Trả tại quầy" value={offer ? formatPrice(offer.priceVnd * n) : ' '} price />
          <View style={[styles.cta, { bottom: bottomInset + 14 }]}>
            <Button
              label="Xác nhận giữ chỗ"
              onPress={() => {
                useUi.getState().requestConfirm();
                dismiss();
              }}
            />
            <Button
              label="Xem lại đơn"
              variant="neutral"
              style={{ height: 52 }}
              onPress={dismiss}
            />
          </View>
        </View>
      )}
    </SheetModal>
  );
}

function Line({ label, value, price }: { label: string; value: string; price?: boolean }) {
  return (
    <View style={styles.line}>
      <Text variant="rowSub" color="textSecondary" style={{ fontSize: 14 }}>
        {label}
      </Text>
      <Text
        variant="bold14"
        color={price ? 'price' : 'textPrimary'}
        style={{ fontSize: price ? 15 : 14 }}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, gap: 12, paddingHorizontal: 20, paddingTop: 34 },
  card: {
    gap: 4,
    padding: 14,
    borderRadius: radius.tile,
    backgroundColor: colors.brand100,
  },
  line: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cta: { position: 'absolute', left: 20, right: 20, gap: 8 },
});
