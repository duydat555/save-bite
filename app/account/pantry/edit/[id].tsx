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

// SB-082 · Sửa thực phẩm · Edit Item. Same fields as SB-077 prefilled from the item; "1/4" · "1/2" · "Giữ nguyên"
// scale the current quantity. Category stays read-only here (the "Loại: …" pill has no sheet in this frame).
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
            <SvgIcon name="fridge" size={24} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="bold15" style={{ fontSize: 18, lineHeight: 24 }}>
              Cập nhật món trong tủ
            </Text>
            <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 18 }}>
              Sửa lượng còn lại, nơi cất và ngày trên nhãn. Lịch sử vẫn được giữ.
            </Text>
          </View>
        </View>

        <InputField label="Tên thực phẩm" value={name} onChangeText={setName} />
        <View style={styles.category}>
          <Text
            variant="buttonLabel"
            color="brand900"
          >{`Loại: ${categoryMeta[item.category].label}`}</Text>
        </View>

        <Text variant="formLabel">Nơi bảo quản</Text>
        <View style={styles.row}>
          {STORAGES.map((s) => (
            <Choice
              key={s}
              label={storageLabel[s]}
              selected={storage === s}
              onPress={() => setStorage(s)}
            />
          ))}
        </View>

        <InputField label="Số lượng và đơn vị" value={quantity} onChangeText={setQuantity} />
        <View style={styles.row}>
          <Choice label="1/4" selected={scale === 0.25} onPress={() => pick(0.25)} />
          <Choice label="1/2" selected={scale === 0.5} onPress={() => pick(0.5)} />
          <Choice label="Giữ nguyên" selected={scale === 1} onPress={() => pick(1)} />
        </View>

        <InputField
          label={dateKindLabel[item.dateKind]}
          value={date}
          onChangeText={setDate}
          keyboardType="numbers-and-punctuation"
          placeholder="dd/mm/yyyy"
        />
      </ScrollView>
      <StickyDock>
        <Button label="Lưu thay đổi" onPress={save} />
      </StickyDock>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 12, paddingHorizontal: layout.screenGutter, paddingTop: 6 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 2 },
  headIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.input,
    backgroundColor: colors.brand100,
  },
  category: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.brand100,
  },
  row: { flexDirection: 'row', gap: 12 },
});
