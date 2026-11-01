import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { usePantryDraft } from '@/store/pantryDraft';
import { colors, layout, radius } from '@/design-system/tokens';
import { OfferSummary, ReceiptCard } from '@/features/reserve/ReserveParts';
import type { ReservationWithOffer } from '@/types';
import { formatPrice, formatTimeRange } from '@/utils/format';

type P = { res: ReservationWithOffer };

function useParts(res: ReservationWithOffer) {
  const { offer } = res;
  return {
    offer,
    range: formatTimeRange(res.slotStart, res.slotEnd),
    price: formatPrice(offer.priceVnd),
    total: formatPrice(offer.priceVnd * res.quantity),
    summaryLine: `${res.quantity} phần · ${formatPrice(offer.priceVnd * res.quantity)} (Trả tại quầy)`,
  };
}

function Receipt({ res, cancelValue }: { res: ReservationWithOffer; cancelValue: string }) {
  const p = useParts(res);
  return (
    <ReceiptCard
      image={p.offer.image}
      title={p.offer.title}
      merchant={p.offer.merchant.name}
      when={`Hôm nay · ${p.range}`}
      rows={[
        { label: 'Số lượng × đơn giá', value: `${res.quantity} phần × ${p.price}` },
        { label: 'Phí giữ chỗ', value: '0đ (Miễn phí)', tone: 'success' },
        { label: 'Thanh toán', value: 'Trả trực tiếp tại quầy' },
        { label: 'Hủy đơn', value: cancelValue, tone: 'muted' },
      ]}
      totalLabel="Trả tại quầy"
      total={p.total}
    />
  );
}

function Timeline({ steps, current }: { steps: string[]; current: number }) {
  return (
    <View style={{ height: 56 }}>
      {steps.map((label, i) => (
        <View key={label} style={{ position: 'absolute', top: 0, width: 120, left: i * 128 }}>
          <View
            style={[
              styles.dot,
              i <= current ? { backgroundColor: colors.brand900 } : styles.dotTodo,
            ]}
          />
          {i < steps.length - 1 ? <View style={styles.rule} /> : null}
          <Text
            variant={i === current ? 'eyebrow' : 'meta'}
            color={i === current ? 'textPrimary' : 'textSecondary'}
            style={{ position: 'absolute', left: 0, top: 26 }}
          >
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}

function Shell({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title={title} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 200 }]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      <View style={[styles.footer, { bottom: insets.bottom + 20 }]}>{footer}</View>
    </View>
  );
}

/* SB-066 · Order Ready · READY state */
export function ReadyView({ res }: P) {
  const to = (
    path:
      | '/reserve/order/[id]/pass'
      | '/reserve/order/[id]/directions'
      | '/reserve/order/[id]/incident',
  ) => router.push({ pathname: path, params: { id: res.id } });
  return (
    <Shell
      title="Đơn đã sẵn sàng"
      footer={
        <>
          <Button label="Mở mã nhận món" onPress={() => to('/reserve/order/[id]/pass')} />
          <Button
            label="Chỉ đường tới điểm nhận"
            variant="neutral"
            style={{ height: 50 }}
            onPress={() => to('/reserve/order/[id]/directions')}
          />
          <PressableScale
            accessibilityRole="button"
            onPress={() => to('/reserve/order/[id]/incident')}
            style={styles.link}
          >
            <Text variant="linkMedium14" color="textSecondary">
              Báo sự cố
            </Text>
          </PressableScale>
        </>
      }
    >
      <View style={styles.statusRow}>
        <View style={[styles.pill, { backgroundColor: colors.brand100 }]}>
          <Text variant="eyebrow" color="success">
            Đã đóng gói sẵn sàng tại quầy
          </Text>
        </View>
        <Text variant="bold13" color="textSecondary">
          {res.ticketNo}
        </Text>
      </View>
      <Timeline steps={['Đã giữ chỗ', `Đến nhận ${res.slotStart}`, 'Hoàn tất']} current={1} />
      <View style={[styles.card, { backgroundColor: colors.brand100 }]}>
        <Text variant="semi14" color="success">
          Phần của bạn đã được đóng gói sẵn sàng
        </Text>
        <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 18 }}>
          {`Nhận ${formatTimeRange(res.slotStart, res.slotEnd)} theo giờ cửa hàng; trả tại quầy khi đến nhận.`}
        </Text>
      </View>
      <Receipt res={res} cancelValue={`Hủy miễn phí trước ${res.slotStart}`} />
    </Shell>
  );
}

/* SB-072 · Order Completed · Verified Receipt */
export function CompletedView({ res }: P) {
  const setDraft = usePantryDraft((s) => s.set);
  return (
    <Shell
      title="Đơn đã hoàn tất"
      footer={
        <>
          <Button
            label="Thêm món này vào Tủ thực phẩm"
            onPress={() => {
              setDraft({ name: res.offer.title });
              router.push('/account/pantry/add');
            }}
          />
          <PressableScale accessibilityRole="link" style={styles.link}>
            <Text variant="semi14" color="price">
              Xem tác động của bạn
            </Text>
          </PressableScale>
        </>
      }
    >
      <View style={[styles.pill, styles.pillOutline]}>
        <Text variant="eyebrow" color="success">
          Đã nhận món · 17:24, 19/10
        </Text>
      </View>
      <Receipt res={res} cancelValue="Đã hoàn tất" />
      <View
        style={[
          styles.card,
          { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.brand100 },
        ]}
      >
        <SymbolView name="leaf" size={16} tintColor={colors.brand900} />
        <Text variant="linkMedium14" color="brand900">
          Lần nhận này đã hoàn tất.
        </Text>
      </View>
      <View style={{ gap: 4 }}>
        <Text variant="bold15">Đánh giá trải nghiệm nhận món</Text>
        <Text variant="body" color="textSecondary" style={{ lineHeight: 20 }}>
          Chỉ đơn đã nhận mới được đánh giá. Phản hồi của bạn giúp người khác chọn đúng.
        </Text>
      </View>
    </Shell>
  );
}

/* SB-067 · Pickup Closing Soon · Urgent */
export function ClosingSoonView({ res }: P) {
  const p = useParts(res);
  return (
    <Shell
      title="Đơn của bạn"
      footer={
        <>
          <Button
            label="Xem chỉ đường nhanh"
            onPress={() =>
              router.push({ pathname: '/reserve/order/[id]/directions', params: { id: res.id } })
            }
          />
          <Button
            label="Liên hệ hỗ trợ nếu gặp sự cố"
            variant="neutral"
            style={{ height: 52 }}
            onPress={() =>
              router.push({ pathname: '/reserve/order/[id]/incident', params: { id: res.id } })
            }
          />
        </>
      }
    >
      <View
        style={[
          styles.alert,
          { backgroundColor: colors.warningBg, borderColor: colors.warningBorder },
        ]}
      >
        <SymbolView name="clock" size={22} tintColor={colors.warning} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text variant="semi16" color="warning">
            Còn 15 phút nữa hết giờ nhận
          </Text>
          <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 18 }}>
            {`Nhận ${p.range} theo giờ cửa hàng; trả tại quầy khi đến nhận.`}
          </Text>
        </View>
      </View>
      <OfferSummary
        image={p.offer.image}
        title={p.offer.title}
        merchant={p.offer.merchant.name}
        line={p.summaryLine}
      />
      <View style={styles.code}>
        <Text variant="helper" color="textSecondary">
          Mã dự phòng
        </Text>
        <Text variant="passCode" style={{ fontSize: 28 }}>
          {res.code}
        </Text>
      </View>
    </Shell>
  );
}

/* SB-068 · Pickup Expired · No-Show Policy */
export function ExpiredView({ res }: P) {
  const p = useParts(res);
  return (
    <Shell
      title="Đơn của bạn"
      footer={
        <>
          <Button label="Xem ưu đãi khác" onPress={() => router.replace('/(tabs)')} />
          <Button
            label="Gửi phản hồi / Báo lý do sự cố"
            variant="neutral"
            style={{ height: 52 }}
            onPress={() =>
              router.push({ pathname: '/reserve/order/[id]/incident', params: { id: res.id } })
            }
          />
        </>
      }
    >
      <View style={[styles.alert, { backgroundColor: colors.dangerBg, borderColor: '#F3CFCB' }]}>
        <SymbolView name="xmark" size={20} tintColor={colors.textSecondary} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text variant="semi16" color="danger">
            {`Đã qua khung nhận ${p.range}`}
          </Text>
          <Text variant="rowSub" color="danger" style={{ lineHeight: 18 }}>
            Mã nhận của đơn đã hết hiệu lực. Bạn có thể xem món khác hoặc gửi phản hồi về lần nhận
            này.
          </Text>
        </View>
      </View>
      <View style={[styles.card, { backgroundColor: colors.surfaceSubtle, gap: 6 }]}>
        <Text variant="bold13">Vì sao đơn hết hạn?</Text>
        <Text variant="helper" color="textSecondary" style={{ lineHeight: 16 }}>
          Đơn chuyển sang hết hạn sau khung nhận; mã nhận không còn dùng được. Nếu gặp vấn đề khi
          đến cửa hàng, hãy gửi phản hồi để được hỗ trợ.
        </Text>
      </View>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.brand100, flexDirection: 'row', gap: 14, alignItems: 'center' },
        ]}
      >
        <SymbolView name="doc.text" size={24} tintColor={colors.brand900} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text variant="bodyMedium">{`${p.offer.title} × ${res.quantity}`}</Text>
          <Text variant="rowSub" color="textSecondary">
            {p.offer.merchant.name}
          </Text>
          <Text variant="rowSub" color="textSecondary">
            Mã nhận hết hiệu lực · Chưa nhận món
          </Text>
        </View>
      </View>
      <Text variant="title20">Bạn có thể làm gì?</Text>
      <Text variant="bodyLg" color="textSecondary" style={{ lineHeight: 24 }}>
        Chọn món khác cho lần nhận mới. Nếu đã đến cửa hàng nhưng không nhận được món, hãy gửi phản
        hồi về lần nhận này.
      </Text>
    </Shell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 16, paddingHorizontal: layout.screenGutter, paddingTop: 7 },
  footer: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter, gap: 8 },
  statusRow: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pill: { height: 32, justifyContent: 'center', paddingHorizontal: 12, borderRadius: radius.pill },
  pillOutline: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.success,
  },
  card: { gap: 4, padding: 16, borderRadius: radius.tile },
  alert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  code: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 18,
    borderRadius: radius.tile,
    backgroundColor: colors.surfaceSubtle,
  },
  link: { height: 44, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', left: 0, top: 4, width: 14, height: 14, borderRadius: 7 },
  dotTodo: { borderWidth: 2, borderColor: colors.borderDefault, backgroundColor: colors.canvas },
  rule: {
    position: 'absolute',
    left: 18,
    top: 10,
    width: 104,
    height: 2,
    backgroundColor: colors.borderDefault,
  },
});
