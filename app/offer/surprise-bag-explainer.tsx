import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { GlassButton } from '@/components/ui/GlassButton';
import { SheetModal } from '@/components/ui/SheetModal';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import type { SvgName } from '@/design-system/icons/svg-data';

// SB-045 · Giải thích túi bất ngờ · Explainer Sheet. Sheet top at y=230 → 622 high.
export default function SurpriseBagExplainer() {
  return (
    <SheetModal height={622}>
      {({ dismiss, bottomInset }) => (
        <View style={styles.body}>
          <View style={styles.head}>
            <Text variant="displayEditorial" style={{ flex: 1 }}>
              {'Không chọn trước\ntừng món trong túi.'}
            </Text>
            <GlassButton symbol="xmark" accessibilityLabel="Đóng" size={44} onPress={dismiss} />
          </View>
          <Text variant="bodyMedium" style={styles.price}>
            29.000đ / túi · Nhận 18:00–19:00
          </Text>
          <Item
            icon="info"
            title="Món trong túi thay đổi"
            text="Tiệm chọn từ phần còn lại cuối ngày; không bảo đảm loại hay số chiếc bánh."
          />
          <Item
            icon="info"
            title="Giá túi 29.000đ"
            text="Tiệm chưa cung cấp giá gốc tham chiếu; bạn chỉ thấy giá phải trả khi nhận."
          />
          <Item
            icon="warning-circle"
            title="Thành phần chưa được xác nhận"
            text="Nếu dị ứng nghiêm trọng, đừng chọn túi khi chưa xác nhận được với cửa hàng."
          />
          <View style={[styles.cta, { bottom: bottomInset + 45 }]}>
            <Button label="Quay lại xem túi" onPress={dismiss} style={{ height: 50 }} />
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
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 36 },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  price: { marginTop: 20 },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 22 },
  cta: { position: 'absolute', left: 20, right: 20 },
});
