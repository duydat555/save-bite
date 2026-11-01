import { Image, type ImageSource } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { OfferListRow } from '@/components/features/OfferListRow';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import type { SvgName } from '@/design-system/icons/svg-data';
import { colors, layout, radius } from '@/design-system/tokens';
import type { OfferWithMerchant } from '@/types';
import { formatMerchantLine, formatPrice, formatStock, formatTimeRange } from '@/utils/format';
import { openOffer } from '@/utils/navigation';

/** Top of every category / list screen of the Khám phá tab: status inset + AppBar that goes back to Home. */
export function CategoryHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <>
      <View style={{ height: insets.top }} />
      <AppBar title={title} onBack={() => router.navigate('/(tabs)')} right={right} />
    </>
  );
}

/** "Compact category introduction" (353×128): Fraunces 24/28 title + 13/19 sub on the left, 128 r20 photo on the right. */
export function CategoryIntro({
  title,
  sub,
  image,
}: {
  title: string;
  sub: string;
  image: ImageSource | number;
}) {
  return (
    <View style={styles.intro}>
      <View style={{ width: 209, gap: 8 }}>
        <Text variant="displayEditorial" style={styles.introTitle}>
          {title}
        </Text>
        <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 19 }}>
          {sub}
        </Text>
      </View>
      <Image source={image} contentFit="cover" style={styles.introPhoto} />
    </View>
  );
}

/** Row for list screens: 104 high on category pages (figma "Canonical fixture listing"). */
export function CategoryRow({
  offer,
  merchantLine,
}: {
  offer: OfferWithMerchant;
  merchantLine?: string;
}) {
  return (
    <OfferListRow
      image={offer.image}
      title={offer.listTitle ?? offer.title}
      merchantLine={merchantLine ?? formatMerchantLine(offer.merchant, 'row')}
      priceLabel={formatPrice(offer.priceVnd)}
      availabilityLabel={`${formatTimeRange(offer.pickupStart, offer.pickupEnd)} · ${formatStock(offer.remaining, offer.unit)}`}
      onPress={() => openOffer(offer.id)}
    />
  );
}

/** "Editorial note": brand100 r16 card with a 24pt glyph, 14 bold title and 13 body. */
export function EditorialNote({
  icon,
  title,
  body,
}: {
  icon: SvgName;
  title: string;
  body: string;
}) {
  return (
    <View style={styles.note}>
      <SvgIcon name={icon} size={24} />
      <View style={{ flex: 1, gap: 4 }}>
        <Text variant="bold14" style={{ lineHeight: 20 }}>
          {title}
        </Text>
        <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 18 }}>
          {body}
        </Text>
      </View>
    </View>
  );
}

export const categoryStyles = StyleSheet.create({
  content: {
    gap: 16,
    paddingHorizontal: layout.screenGutter,
    paddingTop: 20,
    paddingBottom: layout.scrollBottomPadding,
  },
  h2: { letterSpacing: -0.2 },
});

const styles = StyleSheet.create({
  intro: { height: 128, flexDirection: 'row', alignItems: 'center', gap: 16 },
  introTitle: { fontSize: 24, lineHeight: 28, letterSpacing: -0.36 },
  introPhoto: { width: 128, height: 128, borderRadius: 20 },
  note: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: radius.tile,
    backgroundColor: colors.brand100,
  },
});
