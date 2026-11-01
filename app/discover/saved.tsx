import Animated from 'react-native-reanimated';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTabBarScroll } from '@/components/features/tabBarState';
import { StackTabBar } from '@/components/features/GlassTabBar';
import { GlassButton } from '@/components/ui/GlassButton';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius } from '@/design-system/tokens';
import { CategoryHeader, CategoryRow } from '@/features/discovery/CategoryParts';
import { offerService } from '@/services/offerService';
import { useSavedStore } from '@/store/savedStore';
import type { OfferWithMerchant } from '@/types';

// SB-033 · Yêu thích & Đã lưu. Heart on Khám phá (SB-014) → here; search button → SB-019. Rows show only the merchant name.
export default function Saved() {
  const onTabBarScroll = useTabBarScroll();
  const ids = useSavedStore((s) => s.ids);
  const [offers, setOffers] = useState<OfferWithMerchant[]>([]);
  useEffect(() => {
    offerService.listOffers().then(setOffers);
  }, []);
  const saved = ids.map((id) => offers.find((o) => o.id === id)).filter((o) => !!o);

  return (
    <View style={styles.container}>
      <CategoryHeader
        title="Đã lưu"
        right={
          <GlassButton
            symbol="magnifyingglass"
            accessibilityLabel="Tìm kiếm"
            onPress={() => router.push('/discover/search')}
          />
        }
      />
      <Animated.ScrollView
        onScroll={onTabBarScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <SvgIcon name="heart" size={28} />
          <View style={{ gap: 2 }}>
            <Text variant="title20" style={{ fontSize: 18, lineHeight: 24 }}>
              Để dành lúc muốn ghé lấy
            </Text>
            <Text variant="rowSub" color="textSecondary">{`${saved.length} món đã lưu`}</Text>
          </View>
        </View>
        {saved.map((o) => (
          <CategoryRow key={o.id} offer={o} merchantLine={o.merchant.name} />
        ))}
        <View style={styles.note}>
          <SvgIcon name="info" size={20} />
          <Text variant="bodyLg" color="textSecondary" style={{ flex: 1, lineHeight: 22 }}>
            Lưu món không giữ chỗ. Giá, số lượng và giờ nhận có thể thay đổi khi bạn quay lại.
          </Text>
        </View>
      </Animated.ScrollView>
      <StackTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: {
    gap: 12,
    paddingHorizontal: layout.screenGutter,
    paddingTop: 12,
    paddingBottom: layout.scrollBottomPadding,
  },
  banner: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.brand100,
  },
  note: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: radius.tile,
    backgroundColor: colors.surfaceSubtle,
  },
});
