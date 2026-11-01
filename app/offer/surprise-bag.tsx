import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/ui/PressableScale';
import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius } from '@/design-system/tokens';
import { offerService } from '@/services/offerService';
import type { OfferWithMerchant } from '@/types';
import { formatPrice, formatTimeRange } from '@/utils/format';
import { useSessionStore } from '@/store/sessionStore';
import { SURPRISE_OFFER_ID } from '@/utils/navigation';

// SB-044 · Túi bánh bất ngờ · Surprise Bag. The wavy wheat line is drawn as a vector (decorative, from the frame).
export default function SurpriseBag() {
  const insets = useSafeAreaInsets();
  const [offer, setOffer] = useState<OfferWithMerchant | null>(null);

  useEffect(() => {
    offerService.getOffer(SURPRISE_OFFER_ID).then((o) => setOffer(o ?? null));
  }, []);

  const price = offer ? formatPrice(offer.priceVnd) : '';
  const range = offer ? formatTimeRange(offer.pickupStart, offer.pickupEnd) : '';

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Túi bánh bất ngờ" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 + 52 + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Svg width={353} height={260} style={StyleSheet.absoluteFill}>
            <Path
              d="M0 200 C 60 170, 110 215, 180 205 S 300 175, 353 190"
              stroke={colors.wheatLight}
              strokeWidth={5}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
          <Image
            source={require('@assets/images/surprise-bag.png')}
            contentFit="contain"
            style={styles.bag}
          />
          <Text variant="bold13" color="white" style={styles.caption}>
            Minh họa · Tiệm Bánh A
          </Text>
        </View>

        <View style={{ gap: 6 }}>
          <Text variant="title20">Một túi nhỏ, bớt lãng phí</Text>
          <Text variant="priceRow" color="price">
            {`${price} · Nhận ${range}`}
          </Text>
        </View>
        <Text variant="bodyLg" color="textSecondary" style={{ lineHeight: 22 }}>
          Món bánh thay đổi theo phần còn lại cuối ngày. Nội dung túi không được bảo đảm trước.
        </Text>

        <View style={styles.notice}>
          <SvgIcon name="warn" size={18} />
          <View style={{ flex: 1, gap: 3 }}>
            <Text variant="noticeTitle" color="warning" style={{ fontSize: 13 }}>
              Thành phần &amp; dị ứng chưa xác nhận
            </Text>
            <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 18 }}>
              Không chọn nếu dị ứng nghiêm trọng và chưa xác nhận được thành phần với tiệm.
            </Text>
          </View>
        </View>

        <PressableScale
          accessibilityRole="link"
          onPress={() => router.push('/offer/surprise-bag-explainer')}
          style={styles.link}
        >
          <Text variant="semi14" color="brand900">
            Túi bất ngờ hoạt động thế nào?
          </Text>
        </PressableScale>
      </ScrollView>

      <View style={[styles.footer, { bottom: insets.bottom + 20 }]}>
        <Button
          label={`Chọn túi · ${price}`}
          onPress={() =>
            // Guests sign in first (SB-059), then continue to the reservation.
            useSessionStore.getState().user
              ? router.push({
                  pathname: '/reserve/[offerId]',
                  params: { offerId: SURPRISE_OFFER_ID },
                })
              : router.push({
                  pathname: '/offer/login-required',
                  params: { id: SURPRISE_OFFER_ID },
                })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 16, paddingHorizontal: layout.screenGutter, paddingTop: 4 },
  hero: { height: 260, overflow: 'hidden', borderRadius: 24, backgroundColor: colors.brand900 },
  bag: { position: 'absolute', left: 76, top: 8, width: 200, height: 220 },
  caption: { position: 'absolute', left: 50, bottom: 6 },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    backgroundColor: colors.warningBg,
  },
  link: { height: 44, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  footer: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter },
});
