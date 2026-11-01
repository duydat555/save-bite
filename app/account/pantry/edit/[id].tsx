import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { Choice } from '@/components/ui/Choice';
import { InputField } from '@/components/ui/InputField';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { categoryMeta, dateKindLabel, storageLabel } from '@/constants/pantry';
import { colors, layout, radius } from '@/design-system/tokens';
import { StickyDock } from '@/features/pantry/PantryFlowParts';
import { usePantryStore } from '@/store/pantryStore';
import type { PantryStorage } from '@/types';
import { formatAmount, formatDate, parseDate, parseQuantity } from '@/utils/pantry';

// SB-082 · Sửa thực phẩm · Edit Item (node 117:3320). Same structure as SB-077 prefilled from the item: identity at y20
// (72 high), inputs 74, storage choices 112×52 (gap 8), "1/4 · 1/2 · Giữ nguyên" scale the current quantity.
// Category stays read-only (the "Loại: …" button has no sheet in this frame).
const STORAGES: PantryStorage[] = ['cold', 'dry', 'frozen'];

export default function PantryEdit() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = usePantryStore((s) => s.items.find((i) => i.id === id));
  const update = usePantryStore((s) => s.update);
  const log = usePantryStore((s) => s.log);

  const [name, setName] = useState(item?.name ?? '');
  const [storage, setStorage] = useState<PantryStorage>(item?.storage ?? 'cold');
  const [quantity, setQuantity] = useState(item?.quantity ?? '');
  const [date, setDate] = useState(item ? formatDate(item.expiry) : '');
  const [scale, setScale] = useState<number>(1);
  if (!item) return null;

  const pick = (factor: number) => {
    setScale(factor);
    const { amount, unit } = parseQuantity(item.quantity);
    setQuantity(factor === 1 ? item.quantity : `${formatAmount(amount * factor)} ${unit}`.trim());
  };

  const save = () => {
    const expiry = parseDate(date);
    if (!name.trim()) return Alert.alert('Thiếu tên', 'Hãy nhập tên thực phẩm.');
    if (!expiry) return Alert.alert('Ngày chưa đúng', 'Nhập ngày theo dạng dd/mm/yyyy.');
    update(item.id, {
      name: name.trim(),
      storage,
      quantity: quantity.trim() || item.quantity,
      expiry,
    });
    if (expiry !== item.expiry) log(item, 'Đã cập nhật ngày hạn', date.slice(0, 5));
    else if (storage !== item.storage) log(item, 'Đổi nơi cất', storageLabel[storage]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const fractions = [
    ['1/4', 0.25],
    ['1/2', 0.5],
    ['Giữ nguyên', 1],
  ] as const;

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Chỉnh sửa thực phẩm" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          <View style={styles.headIcon}>
            <SvgIcon name="pantry" size={28} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text variant="titleSemi20Tall">Cập nhật món trong tủ</Text>
            <Text
              variant="linkMedium14"
              color="textSecondary"
              style={{ lineHeight: 20, fontFamily: 'BeVietnamPro_400Regular' }}
            >
              Sửa lượng còn lại, nơi cất và ngày trên nhãn. Lịch sử vẫn được giữ.
            </Text>
          </View>
        </View>

        <InputField label="Tên thực phẩm" value={name} onChangeText={setName} />
        <Button
          label={`Loại: ${categoryMeta[item.category].label}`}
          variant="neutral"
          style={{ height: 52 }}
        />

        <Text variant="bodyMedium">Nơi bảo quản</Text>
        <View style={styles.row}>
          {STORAGES.map((s) => (
            <Choice
              key={s}
              label={storageLabel[s]}
              selected={storage === s}
              onPress={() => setStorage(s)}
              corner={radius.input}
              labelVariant="semi13"
            />
          ))}
        </View>

        <InputField label="Số lượng và đơn vị" value={quantity} onChangeText={setQuantity} />
        <View style={styles.row}>
          {fractions.map(([label, factor]) => (
            <Choice
              key={label}
              label={label}
              selected={scale === factor}
              onPress={() => pick(factor)}
              corner={radius.input}
              labelVariant="semi13"
            />
          ))}
        </View>

        <InputField
          label={dateKindLabel[item.dateKind]}
          value={date}
          onChangeText={setDate}
          keyboardType="numbers-and-punctuation"
          placeholder="dd/mm/yyyy"
        />
      </ScrollView>
      <StickyDock offset={36}>
        <Button label="Lưu thay đổi" onPress={save} />
      </StickyDock>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 12, paddingHorizontal: layout.screenGutter, paddingTop: 20 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.tile,
    backgroundColor: colors.brand100,
  },
  row: { flexDirection: 'row', gap: 8 },
});
