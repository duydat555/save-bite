import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { GlassButton } from '@/components/ui/GlassButton';
import { SheetModal } from '@/components/ui/SheetModal';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import type { SvgName } from '@/design-system/icons/svg-data';
import { useOffer } from '@/features/offer/useOffer';
import { formatTimeRange } from '@/utils/format';

// SB-037 · Chất lượng, hạn & Hướng dẫn · Shelf Life (bottom sheet). Sheet top at y=252 → 600 high.
export default function ShelfLifeSheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const offer = useOffer(id);
  const range = offer ? formatTimeRange(offer.pickupStart, offer.pickupEnd) : '';

  return (
    <SheetModal height={600}>
      {({ dismiss, bottomInset }) => (
        <View style={styles.body}>
          <View style={styles.head}>
            <Text variant="title20">Chất lượng &amp; bảo quản</Text>
            <GlassButton symbol="xmark" accessibilityLabel="Đóng" size={44} onPress={dismiss} />
          </View>
          <Text variant="bodyLg" color="textSecondary" style={styles.intro}>
            Thông tin món cần được cửa hàng xác nhận trước khi bạn nhận.
          </Text>
          <Item
            icon="clock-24"
            title="Giờ nhận đã có"
            text={`Nhận ${range} theo giờ cửa hàng; trả tại quầy khi đến nhận.`}
          />
          <Item
            icon="calendar-24"
            title="Ngày hạn chưa được cung cấp"
            text="Chưa có ngày sản xuất, ngày hạn hoặc hướng dẫn bảo quản đã xác nhận."
          />
          <Item
            icon="info"
            title="Hỏi tại quầy trước khi nhận"
            text="Kiểm tra nhãn và hỏi nhân viên về thành phần, ngày hạn và cách bảo quản."
          />
          <View style={[styles.cta, { bottom: bottomInset + 45 }]}>
            <Button label="Quay lại món" onPress={dismiss} style={{ height: 50 }} />
          </View>
        </View>
      )}
    </SheetModal>
  );
}

function Item({ icon, title, text }: { icon: SvgName; title: string; text: string }) {
  return (
    <View style={styles.item}>
      <SvgIcon name={icon} size={24} />
      <View style={{ flex: 1, gap: 4 }}>
        <Text variant="suggestRow">{title}</Text>
        <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 18 }}>
          {text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 29 },
  head: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  intro: { marginTop: 16, lineHeight: 22 },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 24 },
  cta: { position: 'absolute', left: 20, right: 20 },
});
