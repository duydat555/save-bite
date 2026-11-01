import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius } from '@/design-system/tokens';
import { useOffer } from '@/features/offer/useOffer';

// SB-049 · Offer Detail · Allergen Conflict. Shown by openOffer() when a dietary filter is active (SB-026) because no
// merchant declares allergens. "Xem thông tin dị ứng" → SB-036 sheet; "Quay lại danh sách món" → previous list.
export default function AllergenConflict() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const offer = useOffer(id);

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Kiểm tra dị ứng" />
      <View style={styles.content}>
        <View style={styles.badge}>
          <SvgIcon name="warning-circle" size={32} />
        </View>
        <Text variant="largeTitle" style={{ fontSize: 28, lineHeight: 32 }}>
          {'Chưa đủ thông tin\ndị ứng cho món này.'}
        </Text>
        <Text variant="bodyLg" color="textSecondary" style={{ lineHeight: 22 }}>
          Bạn đang dùng bộ lọc dị ứng. Cửa hàng chưa khai báo thành phần, nên SaveBite chưa thể xác
          nhận món phù hợp.
        </Text>
        <View style={styles.card}>
          <Text variant="bold15" style={{ fontSize: 16 }}>
            {offer?.title ?? ' '}
          </Text>
          <Text variant="meta" color="textSecondary">
            {offer?.merchant.name ?? ' '}
          </Text>
        </View>
        <Text variant="bodyMedium" style={{ lineHeight: 22 }}>
          Nếu dị ứng nghiêm trọng, đừng chọn khi chưa xác nhận được thành phần với cửa hàng.
        </Text>
      </View>
      <View style={[styles.dock, { paddingBottom: insets.bottom + 28 }]}>
        <Button label="Quay lại danh sách món" onPress={() => router.back()} />
        <Button
          label="Xem thông tin dị ứng"
          variant="neutral"
          style={{ height: 52 }}
          onPress={() => router.push({ pathname: '/offer/[id]/allergens', params: { id } })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  // figma 299:4816: emblem y12 (64), title y92 (64), body y172 (66), card y254 (76), note y346 (44) — uniform 16 gaps
  content: { gap: 16, paddingHorizontal: layout.screenGutter, paddingTop: 12 },
  badge: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
  },
  card: { gap: 4, padding: 16, borderRadius: radius.md, backgroundColor: colors.brand100 },
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: 8,
    paddingHorizontal: layout.screenGutter,
  },
});
