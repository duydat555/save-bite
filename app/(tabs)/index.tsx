import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandHeader } from '@/components/features/BrandHeader';
import { FeaturedHeroBanner } from '@/components/features/FeaturedHeroBanner';
import { OfferCard } from '@/components/features/OfferCard';
import { OfferListRow } from '@/components/features/OfferListRow';
import { CategoryTile } from '@/components/ui/CategoryTile';
import { SearchField } from '@/components/ui/SearchField';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { demoUser } from '@/data/mock/users';
import { colors, layout } from '@/design-system/tokens';
import { DiscoverSkeleton } from '@/features/discovery/DiscoverSkeleton';
import { toCardProps, toRowProps } from '@/features/discovery/offerPresenter';
import { useStaggerEntering } from '@/hooks/useEntering';
import { offerService } from '@/services/offerService';
import { useSessionStore } from '@/store/sessionStore';
import { openOffer } from '@/utils/navigation';
import type { OfferWithMerchant } from '@/types';

// SB-015 · Discovery · Rescue Market (logged-in feed). Header 56 below the status bar, scroll area below it.
// Motion: staggered FadeInDown on first mount (first 8 blocks), skeleton while the mock repo loads, pull-to-refresh.
export default function DiscoverTab() {
  const insets = useSafeAreaInsets();
  const user = useSessionStore((s) => s.user);
  const [offers, setOffers] = useState<OfferWithMerchant[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const entering = useStaggerEntering();

  useEffect(() => {
    offerService.listOffers().then(setOffers);
  }, []);

  const onRefresh = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    setOffers(await offerService.listOffers());
    setRefreshing(false);
  }, []);

  // ASSUMPTION: guest greeting is not read yet (SB-013) — neutral "Chào bạn" until that frame is built.
  const greeting = `Chào ${user?.displayName ?? 'bạn'}`;

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <BrandHeader title={greeting} areaLabel={`${demoUser.area} ▾`} />
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
        // Figma: the scroll viewport is 703 tall and content keeps 104 clear above the tab bar
      >
        <Animated.View entering={entering(0)}>
          <SearchField
            placeholder="Tìm bánh mì, cơm chiều, rau củ..."
            onPressSearch={() => router.push('/discover/search')}
          />
        </Animated.View>

        <Animated.View entering={entering(1)} style={styles.categories}>
          <CategoryTile label="Tất cả" selected icon={<SvgIcon name="cat-all" size={24} />} />
          <CategoryTile label="Bánh mì" icon={<SvgIcon name="bread" size={32} />} />
          <CategoryTile label="Bữa ăn" icon={<SvgIcon name="bowl-food" size={32} />} />
          <CategoryTile label="Rau củ" icon={<SvgIcon name="carrot" size={32} />} />
        </Animated.View>

        <Animated.View entering={entering(2)}>
          <FeaturedHeroBanner
            titleLines={['Túi bánh', 'bất ngờ']}
            subtitle="29.000đ · 18:00–19:00"
          />
        </Animated.View>

        <Animated.View entering={entering(3)}>
          <SectionHeader
            title="Chọn cho chiều nay"
            actionLabel="Bản đồ →"
            onPressAction={() => router.navigate('/(tabs)/map')}
          />
        </Animated.View>

        {offers === null ? (
          <DiscoverSkeleton />
        ) : (
          <>
            <View style={styles.grid}>
              {offers
                .filter((o) => o.category !== 'surprise')
                .slice(0, 2)
                .map((o, i) => (
                  <Animated.View key={o.id} entering={entering(4 + i)}>
                    <OfferCard {...toCardProps(o)} onPress={() => openOffer(o.id)} />
                  </Animated.View>
                ))}
            </View>
            {offers
              .filter((o) => o.category !== 'surprise')
              .slice(2)
              .map((o, i) => (
                <Animated.View key={o.id} entering={entering(6 + i)}>
                  <OfferListRow {...toRowProps(o)} onPress={() => openOffer(o.id)} />
                </Animated.View>
              ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: {
    gap: layout.sectionGap,
    paddingHorizontal: layout.screenGutter,
    paddingTop: 4,
    paddingBottom: layout.scrollBottomPadding,
  },
  categories: { flexDirection: 'row', gap: 8, height: 64 },
  grid: { flexDirection: 'row', gap: 15 },
});
