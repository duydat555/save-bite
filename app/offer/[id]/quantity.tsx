import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { SheetModal } from '@/components/ui/SheetModal';
import { Text } from '@/components/ui/Text';
import { colors } from '@/design-system/tokens';
import { useOffer } from '@/features/offer/useOffer';
import { OfferSummary } from '@/features/reserve/ReserveParts';
import { formatPrice } from '@/utils/format';

const MAX_PER_ORDER = 2;

// SB-050 · Quantity Sheet · Stock Limit (sheet top at y=432 → 420 high). Max = min(stock left, 2 per order).
export default function QuantitySheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const offer = useOffer(id);
  const [qty, setQty] = useState(1);

  const max = offer ? Math.min(offer.remaining, MAX_PER_ORDER) : MAX_PER_ORDER;
  const price = offer?.priceVnd ?? 0;

  return (
    <SheetModal height={420}>
      {({ dismiss, bottomInset }) => (
        <View style={styles.body}>
          <Text variant="title20">Chọn số lượng</Text>
          {offer ? (
            <View style={{ marginTop: 14 }}>
              <OfferSummary
                image={offer.image}
                title={offer.title}
                merchant={offer.merchant.name}
                line={`${qty} phần · ${formatPrice(price * qty)} (Trả tại quầy)`}
              />
            </View>
          ) : null}

          <View style={styles.stepper}>
            <Step
              symbol="minus"
              label="Giảm"
              disabled={qty <= 1}
              onPress={() => setQty((q) => q - 1)}
            />
            <Text variant="largeTitle" style={{ fontSize: 28, minWidth: 48, textAlign: 'center' }}>
              {qty}
            </Text>
            <Step
              symbol="plus"
              label="Tăng"
              primary
              disabled={qty >= max}
              onPress={() => setQty((q) => q + 1)}
            />
          </View>
          <Text variant="captionMeta" color="textSecondary" style={styles.limit}>
            {`Còn ${offer?.remaining ?? 0} phần · Tối đa ${MAX_PER_ORDER} phần/đơn`}
          </Text>

          <View style={styles.total}>
            <Text variant="linkMedium14" color="textSecondary">
              Tạm tính, trả tại quầy
            </Text>
            <Text variant="detailPrice" color="price">
              {formatPrice(price * qty)}
            </Text>
          </View>

          <View style={[styles.cta, { bottom: bottomInset + 20 }]}>
            <Button
              label="Tiếp tục chọn giờ nhận"
              onPress={() => {
                dismiss();
                setTimeout(
                  () =>
                    router.push({
                      pathname: '/reserve/[offerId]',
                      params: { offerId: id, qty: String(qty) },
                    }),
                  260,
                );
              }}
            />
          </View>
        </View>
      )}
    </SheetModal>
  );
}

function Step({
  symbol,
  label,
  primary,
  disabled,
  onPress,
}: {
  symbol: 'minus' | 'plus';
  label: string;
  primary?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={[styles.step, primary && !disabled ? styles.stepOn : styles.stepOff]}
    >
      <SymbolView
        name={symbol}
        size={20}
        weight="bold"
        tintColor={primary && !disabled ? colors.white : colors.textSecondary}
      />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 32 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    marginTop: 14,
  },
  step: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center', borderRadius: 27 },
  stepOn: { backgroundColor: colors.brand900 },
  stepOff: { backgroundColor: colors.surfaceSubtle },
  limit: { textAlign: 'center', marginTop: 12 },
  total: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cta: { position: 'absolute', left: 20, right: 20 },
});
