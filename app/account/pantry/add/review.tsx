import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { categoryMeta, dateKindLabel, storageLabel } from '@/constants/pantry';
import type { SvgName } from '@/design-system/icons/svg-data';
import { colors, layout } from '@/design-system/tokens';
import { usePantryDraft } from '@/store/pantryDraft';
import { usePantryStore } from '@/store/pantryStore';
import { parseDate } from '@/utils/pantry';

// SB-080 · Xác nhận thêm · Review. Saving stores the item and returns to the pantry list.
export default function PantryReview() {
  const insets = useSafeAreaInsets();
  const { draft, reset } = usePantryDraft();
  const add = usePantryStore((s) => s.add);

  const save = () => {
    const expiry = parseDate(draft.date);
    if (!draft.name.trim()) return Alert.alert('Thiếu tên', 'Hãy nhập tên thực phẩm.');
    if (!expiry)
      return Alert.alert('Thiếu ngày hạn', 'Hãy chọn ngày trên nhãn hoặc sửa lại thông tin.');
    add({
      name: draft.name.trim(),
      category: draft.category,
      icon: categoryMeta[draft.category].icon,
      quantity: draft.quantity.trim() || '1',
      storage: draft.storage,
      dateKind: draft.dateKind,
      expiry,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    reset();
    router.dismissTo('/(tabs)/pantry');
  };

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Kiểm tra thông tin" />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 20 + 52 + 8 + 50 + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="displayEditorial">Mọi thứ đã đúng chưa?</Text>
        <View style={styles.card}>
          <Text variant="title20" style={{ marginBottom: 6 }}>
            {draft.name}
          </Text>
          <Line
            icon="tag-24"
            label="Nhóm thực phẩm"
            value={`Loại: ${categoryMeta[draft.category].label}`}
          />
          <Line icon="shopping-bag" label="Số lượng" value={draft.quantity} />
          <Line icon="fridge" label="Nơi bảo quản" value={storageLabel[draft.storage]} />
          <Line icon="info" label="Loại ngày" value={dateKindLabel[draft.dateKind]} />
          <Line icon="calendar-24" label="Ngày trên nhãn" value={draft.date || 'Chưa rõ'} />
        </View>
        <Text variant="bodyLg" color="textSecondary" style={{ lineHeight: 22 }}>
          Hạn sử dụng và nên dùng trước có ý nghĩa khác nhau. Luôn xem nhãn và tình trạng bảo quản
          thực tế.
        </Text>
      </ScrollView>
      <View style={[styles.footer, { bottom: insets.bottom + 20 }]}>
        <Button label="Lưu vào tủ thực phẩm" onPress={save} />
        <Button
          label="Sửa lại thông tin"
          variant="neutral"
          style={{ height: 50 }}
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}

function Line({ icon, label, value }: { icon: SvgName; label: string; value: string }) {
  return (
    <View style={styles.line}>
      <SvgIcon name={icon} size={24} />
      <View>
        <Text variant="helper" color="textSecondary">
          {label}
        </Text>
        <Text variant="semi16">{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 16, paddingHorizontal: layout.screenGutter, paddingTop: 8 },
  card: { gap: 14, padding: 20, borderRadius: 24, backgroundColor: colors.white },
  line: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  footer: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter, gap: 8 },
});
