import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { OfferCard } from '@/components/features/OfferCard';
import { Text } from '@/components/ui/Text';
import { colors } from '@/design-system/tokens';
import {
  CategoryHeader,
  CategoryIntro,
  CategoryRow,
  EditorialNote,
  categoryStyles,
} from '@/features/discovery/CategoryParts';
import { toCardProps } from '@/features/discovery/offerPresenter';
import { useStaggerEntering } from '@/hooks/useEntering';
import { offerService } from '@/services/offerService';
import type { OfferCategory, OfferWithMerchant } from '@/types';
import { openOffer } from '@/utils/navigation';

// SB-028 Bữa ăn · SB-029 Bánh mì & pastry · SB-030 Rau củ — one screen driven by `?cat=meal|bakery|produce`.
// Entered from the Khám phá category tiles; a hidden tab so the tab bar stays visible (as in Figma).
const CONFIG = {
  meal: {
    title: 'Bữa ăn',
    category: 'meal' as OfferCategory,
    heading: 'Bữa ngon,\nđúng giờ tan học.',
    sub: 'Chọn phần ăn phù hợp giờ tan học của bạn.',
    image: require('@assets/images/account/cat-meal-hero.png'),
  },
  bakery: {
    title: 'Bánh mì & pastry',
    category: 'bakery' as OfferCategory,
    heading: 'Hương bánh,\ncuối một ngày dài.',
    sub: 'Nhận bánh trong khung giờ của từng món.',
    image: require('@assets/images/account/cat-bakery-hero.png'),
  },
  produce: {
    title: 'Rau củ',
    category: 'produce' as OfferCategory,
    heading: 'Rau củ cho\nbữa cơm nhà.',
    sub: 'Chọn rau củ vừa đủ cho bữa tới.',
    image: require('@assets/images/account/cat-produce-hero.png'),
  },
};

export default function CategoryScreen() {
  const { cat } = useLocalSearchParams<{ cat?: keyof typeof CONFIG }>();
  const cfg = CONFIG[cat ?? 'meal'] ?? CONFIG.meal;
  const [offers, setOffers] = useState<OfferWithMerchant[]>([]);
  const entering = useStaggerEntering();

  useEffect(() => {
    offerService.listOffers().then(setOffers);
  }, []);

  const items = offers.filter((o) => o.category === cfg.category);
  const surprise =
    cfg.category === 'bakery' ? offers.find((o) => o.category === 'surprise') : undefined;

  return (
    <View style={styles.container}>
      <CategoryHeader title={cfg.title} />
      <ScrollView
        contentContainerStyle={categoryStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <CategoryIntro title={cfg.heading} sub={cfg.sub} image={cfg.image} />
        <Text variant="title20" style={categoryStyles.h2}>
          {cfg.category === 'bakery'
            ? `${items.length} món chọn sẵn · Tiệm Bánh A`
            : `${items.length} món đang có`}
        </Text>

        {cfg.category === 'bakery' ? (
          <View style={styles.grid}>
            {items.map((o, i) => (
              <Animated.View key={o.id} entering={entering(i)}>
                <OfferCard {...toCardProps(o)} onPress={() => openOffer(o.id)} />
              </Animated.View>
            ))}
          </View>
        ) : (
          items.map((o, i) => (
            <Animated.View key={o.id} entering={entering(i)}>
              <CategoryRow offer={o} />
            </Animated.View>
          ))
        )}

        {surprise ? (
          <View style={{ gap: 8 }}>
            <Text variant="semi14">Thêm một lựa chọn</Text>
            <CategoryRow offer={surprise} merchantLine={surprise.merchant.name} />
          </View>
        ) : null}

        {cfg.category === 'meal' ? (
          <EditorialNote
            icon="bowl-food"
            title="Nhận đúng giờ, ăn ngon hơn"
            body="Mang theo túi đựng nếu có. Hỏi cửa hàng về thành phần và cách bảo quản trước khi nhận."
          />
        ) : null}
        {cfg.category === 'produce' ? (
          <EditorialNote
            icon="carrot"
            title="Từ giỏ hàng vào tủ bếp"
            body="Thêm rau vào Tủ thực phẩm sau khi nhận. Hạn dùng do bạn nhập từ nhãn hoặc hướng dẫn cửa hàng."
          />
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  grid: { flexDirection: 'row', gap: 13 },
});
