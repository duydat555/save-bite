import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandHeader } from '@/components/features/BrandHeader';
import { FeaturedHeroBanner } from '@/components/features/FeaturedHeroBanner';
import { OfferCard } from '@/components/features/OfferCard';
import { OfferListRow } from '@/components/features/OfferListRow';
import { CategoryTile } from '@/components/ui/CategoryTile';
import { GlassButton } from '@/components/ui/GlassButton';
import { SearchField } from '@/components/ui/SearchField';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Tag } from '@/components/ui/Tag';
import { Text } from '@/components/ui/Text';
import {
  colors,
  layout,
  radius,
  spacing,
  typography,
  type ColorToken,
  type TypographyVariant,
} from '@/design-system/tokens';
import { toCardProps, toRowProps } from '@/features/discovery/offerPresenter';
import { offerService } from '@/services/offerService';
import type { OfferWithMerchant } from '@/types';

// Dev-only gallery for the Phase 2 checkpoint: tokens + shared components + data layer.
export default function Foundations() {
  const insets = useSafeAreaInsets();
  const [offers, setOffers] = useState<OfferWithMerchant[] | null>(null);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    offerService.listOffers().then(setOffers);
  }, []);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 40 }}
    >
      <Block title="Colors">
        <View style={styles.swatches}>
          {(Object.keys(colors) as ColorToken[]).map((name) => (
            <View key={name} style={styles.swatch}>
              <View style={[styles.chip, { backgroundColor: colors[name] }]} />
              <Text variant="caption">{name}</Text>
              <Text variant="caption" color="textSecondary">
                {colors[name]}
              </Text>
            </View>
          ))}
        </View>
      </Block>

      <Block title="Typography · Be Vietnam Pro">
        {(Object.keys(typography) as TypographyVariant[]).map((variant) => (
          <View key={variant} style={styles.typeRow}>
            <Text variant="caption" color="textSecondary">
              {variant} · {typography[variant].fontSize}
              {'lineHeight' in typography[variant] ? `/${typography[variant].lineHeight}` : ''}
            </Text>
            <Text variant={variant}>Bánh mì men tự nhiên · 25.000đ · Nhận 17:00–18:00</Text>
          </View>
        ))}
      </Block>

      <Block title="Radius">
        <View style={styles.row}>
          {(['md', 'listRow', 'tile', 'input', 'thumb', 'tag'] as const).map((name) => (
            <View key={name} style={{ alignItems: 'center', gap: 4 }}>
              <View style={[styles.radiusBox, { borderRadius: radius[name] }]} />
              <Text variant="caption">
                {name} {radius[name]}
              </Text>
            </View>
          ))}
        </View>
      </Block>

      <Block title="Glass buttons (trên ảnh) · Tag · Icon SVG">
        <View style={styles.photo}>
          <Image
            source={require('@assets/images/offers/bread-sourdough.jpg')}
            contentFit="cover"
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.photoButtons}>
            <GlassButton symbol="heart" accessibilityLabel="Đã lưu" />
            <GlassButton symbol="bell" accessibilityLabel="Thông báo" />
            <GlassButton symbol="slider.horizontal.3" accessibilityLabel="Bộ lọc" />
          </View>
        </View>
        <View style={styles.row}>
          <Tag label="Còn 3 phần" />
          <SvgIcon name="bread" size={32} />
          <SvgIcon name="bowl-food" size={32} />
          <SvgIcon name="carrot" size={32} />
          <SvgIcon name="bag-mark-forest" size={24} />
        </View>
      </Block>

      <Block title="BrandHeader" flush>
        <BrandHeader title="Chào Minh Anh" areaLabel="Đà Nẵng · Khu học xá ▾" />
      </Block>

      <Block title="SearchField · CategoryTile · SectionHeader · Banner">
        <SearchField placeholder="Tìm bánh mì, cơm chiều, rau củ..." />
        <View style={styles.row}>
          <CategoryTile
            label="Tất cả"
            selected={category === 'all'}
            onPress={() => setCategory('all')}
            icon={<SvgIcon name="cat-all" size={24} />}
          />
          <CategoryTile
            label="Bánh mì"
            selected={category === 'bakery'}
            onPress={() => setCategory('bakery')}
            icon={<SvgIcon name="bread" size={32} />}
          />
          <CategoryTile
            label="Bữa ăn"
            selected={category === 'meal'}
            onPress={() => setCategory('meal')}
            icon={<SvgIcon name="bowl-food" size={32} />}
          />
          <CategoryTile
            label="Rau củ"
            selected={category === 'produce'}
            onPress={() => setCategory('produce')}
            icon={<SvgIcon name="carrot" size={32} />}
          />
        </View>
        <FeaturedHeroBanner titleLines={['Túi bánh', 'bất ngờ']} subtitle="29.000đ · 18:00–19:00" />
        <SectionHeader title="Chọn cho chiều nay" actionLabel="Bản đồ →" />
      </Block>

      <Block title="Offers (qua offerService, delay 200–500ms)">
        {offers === null ? (
          <Text variant="meta" color="textSecondary">
            Đang tải…
          </Text>
        ) : (
          <>
            <View style={[styles.row, { gap: spacing[15] }]}>
              {offers.slice(0, 2).map((o) => (
                <OfferCard key={o.id} {...toCardProps(o)} />
              ))}
            </View>
            {offers.slice(2).map((o) => (
              <OfferListRow key={o.id} {...toRowProps(o)} />
            ))}
          </>
        )}
      </Block>
    </ScrollView>
  );
}

function Block({
  title,
  children,
  flush,
}: {
  title: string;
  children: React.ReactNode;
  flush?: boolean;
}) {
  return (
    <View style={styles.block}>
      <View style={styles.blockTitle}>
        <Text variant="link" color="brand700">
          {title}
        </Text>
      </View>
      <View style={flush ? undefined : styles.blockBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.canvas },
  block: { marginBottom: spacing[24] },
  blockTitle: { paddingHorizontal: layout.screenGutter, paddingBottom: spacing[8] },
  blockBody: { paddingHorizontal: layout.screenGutter, gap: layout.sectionGap },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing[8] },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[12] },
  swatch: { width: 100, gap: 2 },
  chip: {
    height: 40,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  typeRow: { gap: 2 },
  radiusBox: {
    width: 56,
    height: 56,
    backgroundColor: colors.brand100,
    borderWidth: 1,
    borderColor: colors.brand700,
  },
  photo: { height: 120, overflow: 'hidden', borderRadius: radius.md },
  photoButtons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[12],
  },
});
