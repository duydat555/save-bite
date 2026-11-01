import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { colors, layout } from '@/design-system/tokens';
import {
  QuickChip,
  RecentRow,
  SearchInputBar,
  SuggestionRow,
} from '@/features/discovery/SearchParts';
import { useStaggerEntering } from '@/hooks/useEntering';
import { offerService } from '@/services/offerService';
import { useSearchStore } from '@/store/searchStore';
import type { OfferWithMerchant } from '@/types';
import { formatPrice, formatTimeRange } from '@/utils/format';
import { openOffer } from '@/utils/navigation';

// SB-019 · Search · Active Input & iOS Keyboard (empty query) and SB-020 · Gợi ý tìm kiếm (typing).
// Quick-chip destinations are an assumption (filtered results): the Figma prototype link is unread.
export default function Search() {
  const insets = useSafeAreaInsets();
  const { recent, add, clear } = useSearchStore();
  const [q, setQ] = useState('');
  const [matches, setMatches] = useState<OfferWithMerchant[]>([]);
  const entering = useStaggerEntering();

  useEffect(() => {
    let live = true;
    if (!q.trim()) return; // empty query renders the recent/quick view; stale matches are not shown
    offerService.searchOffers(q).then((r) => live && setMatches(r));
    return () => {
      live = false;
    };
  }, [q]);

  const submit = (text: string) => {
    if (!text.trim()) return;
    add(text);
    router.push({ pathname: '/discover/results', params: { q: text.trim() } });
  };

  const merchants = [...new Map(matches.map((o) => [o.merchant.id, o.merchant])).values()];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
      <View style={styles.pad}>
        <SearchInputBar
          value={q}
          onChangeText={setQ}
          onSubmit={() => submit(q)}
          onCancel={() => router.back()}
          autoFocus
        />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: 24 }]}
      >
        {q.trim() === '' ? (
          <>
            <View style={styles.sectionHead}>
              <Text variant="title20">Gần đây</Text>
              <PressableScale accessibilityRole="button" onPress={clear} style={styles.clear}>
                <Text variant="bodyMedium" color="textSecondary">
                  Xóa
                </Text>
              </PressableScale>
            </View>
            {recent.map((r, i) => (
              <Animated.View key={r} entering={entering(i)}>
                <RecentRow label={r} onPress={() => submit(r)} onFill={() => setQ(r)} />
              </Animated.View>
            ))}
            <Text variant="bold14" color="textSecondary" style={styles.quickTitle}>
              Gợi ý nhanh
            </Text>
            <View style={styles.quickRow}>
              <QuickChip
                symbol="tag"
                label="Tối đa 30.000đ"
                onPress={() =>
                  router.push({ pathname: '/discover/results', params: { max: '30000' } })
                }
              />
              <QuickChip
                symbol="clock"
                label="Nhận 17:00–18:00"
                onPress={() =>
                  router.push({ pathname: '/discover/results', params: { window: '17:00' } })
                }
              />
            </View>
          </>
        ) : (
          <>
            <Text variant="bold13" color="textSecondary" style={styles.suggestTitle}>
              {`Gợi ý cho “${q.trim()}”`}
            </Text>
            {matches.map((o, i) => (
              <Animated.View key={o.id} entering={entering(i)}>
                <SuggestionRow
                  image={o.image}
                  title={o.title}
                  subtitle={`${formatPrice(o.priceVnd)} · Nhận ${formatTimeRange(o.pickupStart, o.pickupEnd)}`}
                  onPress={() => openOffer(o.id)}
                />
              </Animated.View>
            ))}
            {merchants.length > 0 ? (
              <>
                <Text variant="bold13" color="textSecondary" style={styles.suggestTitle}>
                  Cửa hàng có món phù hợp
                </Text>
                {merchants.map((m) => (
                  <SuggestionRow
                    key={m.id}
                    title={m.name}
                    subtitle="Xem các món của cửa hàng"
                    rule={false}
                    onPress={() => submit(m.name)}
                  />
                ))}
              </>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  pad: { paddingHorizontal: layout.screenGutter },
  content: { paddingHorizontal: layout.screenGutter, paddingTop: 10 },
  sectionHead: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clear: { height: 44, justifyContent: 'center', paddingLeft: 16 },
  quickTitle: { marginTop: 18, marginBottom: 8 },
  quickRow: { flexDirection: 'row', gap: 8 },
  suggestTitle: { marginTop: 4, marginBottom: 6 },
});
