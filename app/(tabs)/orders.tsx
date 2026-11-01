import * as Haptics from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OfferListRow } from '@/components/features/OfferListRow';
import { Button } from '@/components/ui/Button';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { LargeTitleBar } from '@/components/ui/LargeTitleBar';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Text } from '@/components/ui/Text';
import { completedOrders } from '@/data/mock/orders';
import { colors, layout } from '@/design-system/tokens';
import { useDevFlags } from '@/store/devFlags';
import { useStaggerEntering } from '@/hooks/useEntering';
import { ActiveOrderHeroCard, CompletedOrderRow } from '@/features/orders/OrderParts';
import { OrdersSkeleton } from '@/features/orders/OrdersSkeleton';
import { toRowProps } from '@/features/discovery/offerPresenter';
import { offerService } from '@/services/offerService';
import { orderService } from '@/services/orderService';
import { openOffer } from '@/utils/navigation';
import type { OfferWithMerchant, ReservationWithOffer } from '@/types';
import { formatPrice, formatTimeRange } from '@/utils/format';

const ACTIVE = ['awaiting_pickup', 'ready', 'closing_soon'];
const TABS = ['Tất cả', 'Đang chờ', 'Đã nhận'];

// SB-060 · My Orders · Overview. Active cards come from real (mock-persisted) reservations; the completed rows
// are the literal Figma fixtures. Empty state (SB-073) is outside Vòng 1.
// Motion: skeleton while loading, staggered entrance, sliding segmented thumb, pull-to-refresh.
export default function OrdersTab() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState(0);
  const [active, setActive] = useState<ReservationWithOffer[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const entering = useStaggerEntering();

  const load = useCallback(async () => {
    const list = await orderService.listReservations();
    setActive(list.filter((r) => ACTIVE.includes(r.status)));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const onRefresh = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const showActive = tab !== 2;
  const cleared = useDevFlags((s) => s.historyCleared);
  const showCompleted = tab !== 1 && !cleared;
  const nothing = active !== null && (!showActive || active.length === 0) && !showCompleted;

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <LargeTitleBar title="Đơn của tôi" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.brand900}
          />
        }
      >
        <Animated.View entering={entering(0)}>
          <SegmentedControl tabs={TABS} index={tab} onChange={setTab} />
        </Animated.View>

        {active === null ? (
          <OrdersSkeleton />
        ) : nothing ? (
          <EmptyOrders />
        ) : (
          <>
            {showActive
              ? active.map((r, i) => (
                  <Animated.View key={r.id} entering={entering(1 + i)}>
                    <ActiveOrderHeroCard
                      image={r.offer.image}
                      statusLine={`Chờ nhận · ${formatTimeRange(r.slotStart, r.slotEnd)}`}
                      title={r.offer.title}
                      meta={`${r.offer.merchant.name} · ${r.quantity} phần`}
                      payLine={`Trả ${formatPrice(r.offer.priceVnd * r.quantity)} tại quầy`}
                      onPress={() =>
                        router.push({ pathname: '/reserve/order/[id]', params: { id: r.id } })
                      }
                      onOpenCode={() =>
                        router.push({ pathname: '/reserve/order/[id]/pass', params: { id: r.id } })
                      }
                    />
                  </Animated.View>
                ))
              : null}

            {showCompleted ? (
              <Animated.View entering={entering(2 + active.length)} style={styles.completed}>
                <Text variant="bold15">Đã hoàn tất gần đây</Text>
                <View>
                  {completedOrders.map((o) => (
                    <CompletedOrderRow
                      key={o.id}
                      image={o.image}
                      title={o.title}
                      metaLine={o.metaLine}
                      priceVnd={o.priceVnd}
                    />
                  ))}
                </View>
              </Animated.View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: {
    gap: 16,
    paddingHorizontal: layout.screenGutter,
    paddingTop: 10,
    paddingBottom: layout.scrollBottomPadding,
  },
  completed: { gap: 13, paddingTop: 4 },
});

/* SB-073 · Lịch sử đơn trống · Tab Root: Mầm "Quiet", message, CTA and one suggested offer. */
function EmptyOrders() {
  const [offer, setOffer] = useState<OfferWithMerchant | null>(null);
  useEffect(() => {
    offerService
      .listOffers()
      .then((all) => setOffer(all.find((o) => o.id === 'offer-com-ga-ap-chao') ?? null));
  }, []);
  return (
    <View style={{ gap: 14 }}>
      <View style={{ alignItems: 'center', marginTop: 4 }}>
        <SvgIcon name="mam-quiet" size={140} />
      </View>
      <Text variant="bold15" style={{ fontSize: 20, lineHeight: 26, textAlign: 'center' }}>
        Chưa có đơn nào ở đây.
      </Text>
      <Text variant="bodyLg" color="textPrimary" style={{ textAlign: 'center', lineHeight: 24 }}>
        Khi bạn giữ chỗ, mã nhận và giờ hẹn sẽ nằm trong mục này.
      </Text>
      <Button label="Khám phá món hôm nay" onPress={() => router.navigate('/(tabs)')} />
      <Text variant="bold15" style={{ fontSize: 17, lineHeight: 22, marginTop: 56 }}>
        Ưu đãi cứu thực phẩm chiều nay
      </Text>
      {offer ? <OfferListRow {...toRowProps(offer)} onPress={() => openOffer(offer.id)} /> : null}
    </View>
  );
}
