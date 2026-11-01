import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { SheetModal } from '@/components/ui/SheetModal';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/design-system/tokens';
import { useOffer } from '@/features/offer/useOffer';

// SB-036 · Thành phần & Cảnh báo Dị ứng · Allergen Sheet (bottom sheet over SB-034). Sheet top at y=332 → 520 high.
export default function AllergenSheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const offer = useOffer(id);

  return (
    <SheetModal height={520}>
      {({ dismiss, bottomInset }) => (
        <View style={styles.body}>
          <Text variant="title20" style={styles.title}>
            Thành phần &amp; dị ứng
          </Text>
          <Text variant="bold15" style={styles.name}>
            {offer?.title ?? ' '}
          </Text>
          <View style={styles.chip}>
            <Text variant="linkMedium13" color="warning">
              Chưa được cửa hàng xác nhận
            </Text>
          </View>
          <Text variant="bodyLg" color="textSecondary" style={styles.copy}>
            Chưa có danh sách thành phần, chất gây dị ứng hoặc thông tin tiếp xúc chéo cho món này.
            Không thể xác nhận món phù hợp với bạn.
          </Text>
          <View style={styles.card}>
            <SvgIcon name="warn" size={18} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant="semi14" color="warning">
                Nếu bạn có dị ứng nghiêm trọng
              </Text>
              <Text variant="detailBody" color="textSecondary">
                Không chọn món khi chưa xác nhận được thành phần với cửa hàng. Hỏi nhân viên trước
                khi nhận.
              </Text>
            </View>
          </View>
          <View style={[styles.cta, { bottom: bottomInset + 20 }]}>
            <Button label="Quay lại món" onPress={dismiss} />
          </View>
        </View>
      )}
    </SheetModal>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 34 },
  title: { marginTop: 0 },
  name: { marginTop: 14 },
  chip: {
    alignSelf: 'flex-start',
    height: 32,
    marginTop: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: radius.tag,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  copy: { marginTop: 14, lineHeight: 22 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    backgroundColor: colors.warningBg,
  },
  cta: { position: 'absolute', left: 20, right: 20 },
});
