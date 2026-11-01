import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { colors } from '@/design-system/tokens';
import { MapDisclosure } from '@/features/discovery/MapParts';
import { offerService } from '@/services/offerService';
import type { Merchant } from '@/types';

// SB-039 · Đường tới cửa hàng · Walking Map. Static map + "Điểm nhận" pin; the route sheet starts at y=514.
// The map is an illustration ("Ghim mẫu · Chưa xác minh vị trí"), not a real route.
export default function MerchantDirections() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [merchant, setMerchant] = useState<Merchant | null>(null);

  useEffect(() => {
    offerService
      .listOffers()
      .then((all) => setMerchant(all.find((o) => o.merchantId === id)?.merchant ?? null));
  }, [id]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@assets/images/onboarding/campus-map.png')}
        contentFit="cover"
        style={styles.map}
      />
      {/* AppBar sits on an opaque canvas strip above the map (Figma: map starts below the bar) */}
      <View style={{ backgroundColor: colors.canvas }}>
        <View style={{ height: insets.top }} />
        <AppBar title="Vị trí cửa hàng" />
      </View>

      <View style={styles.pin}>
        <View style={styles.pinBody}>
          <Text variant="semi14" color="white">
            Điểm nhận
          </Text>
        </View>
        <View style={styles.pinTail} />
      </View>
      <View style={styles.disclosure}>
        <MapDisclosure text="Vị trí và khoảng cách tham khảo" />
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom }]}>
        <Text variant="authTitle" style={{ lineHeight: 28 }}>
          {merchant?.name ?? ' '}
        </Text>
        <Text variant="authSub" color="textSecondary" style={styles.addr}>
          {merchant?.pickupPoint ?? ''}
        </Text>
        <Text variant="detailBody" color="textSecondary" style={styles.note}>
          Vị trí cửa hàng chưa được xác nhận. Hãy hỏi cửa hàng địa chỉ và lối vào trước khi đến
          nhận.
        </Text>
        <Button
          label="Xem chi tiết món"
          onPress={() => router.push({ pathname: '/offer/merchant/[id]/offers', params: { id } })}
          style={styles.cta}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  map: { position: 'absolute', left: 0, top: 0, right: 0, height: 540 },
  pin: { position: 'absolute', left: 218, top: 397, width: 92, alignItems: 'center' },
  pinBody: {
    height: 32,
    width: 92,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.price,
  },
  pinTail: {
    width: 10,
    height: 10,
    marginTop: -5,
    transform: [{ rotate: '45deg' }],
    backgroundColor: colors.price,
  },
  disclosure: { position: 'absolute', left: 16, top: 470 },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 514,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.canvas,
  },
  addr: { marginTop: 16, lineHeight: 20 },
  note: { marginTop: 16 },
  cta: { marginTop: 16 },
});
