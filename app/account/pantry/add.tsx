import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { PressableScale } from '@/components/ui/PressableScale';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { categoryMeta, dateKindLabel, storageLabel } from '@/constants/pantry';
import { colors, layout, radius } from '@/design-system/tokens';
import { usePantryDraft } from '@/store/pantryDraft';
import type { PantryStorage } from '@/types';

const STORAGES: PantryStorage[] = ['cold', 'dry', 'frozen'];
const QUANTITY_STEPS = ['1/2', '1', '2'];

// SB-077 · Thêm thủ công · Form (prefilled like the Figma frame). Category → SB-078 sheet, date → SB-079, CTA → SB-080.
export default function PantryAdd() {
  const insets = useSafeAreaInsets();
  const { draft, set } = usePantryDraft();
  const unit = draft.quantity.replace(/^[\d/.,\s]+/, '').trim();
  const amount = draft.quantity.match(/^[\d/.,]+/)?.[0] ?? '';

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Thêm thực phẩm" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 + 52 + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          <View style={styles.headIcon}>
            <SvgIcon name="fridge" size={24} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="bold15" style={{ fontSize: 18, lineHeight: 24 }}>
              Thêm món vào tủ
            </Text>
            <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 18 }}>
              Chọn nhóm có sẵn, không cần chụp ảnh. Ngày hạn lấy trên nhãn.
            </Text>
          </View>
        </View>

        <InputField
          label="Tên thực phẩm"
          value={draft.name}
          onChangeText={(v) => set({ name: v })}
        />

        <Button
          label={`Loại: ${categoryMeta[draft.category].label}`}
          variant="neutral"
          style={{ height: 56 }}
          onPress={() => router.push('/account/pantry/add/category')}
        />

        <Text variant="formLabel">Nơi bảo quản</Text>
        <View style={styles.row}>
          {STORAGES.map((s) => (
            <Choice
              key={s}
              label={storageLabel[s]}
              selected={draft.storage === s}
              onPress={() => set({ storage: s })}
              height={52}
            />
          ))}
        </View>

        <InputField
          label="Số lượng và đơn vị"
          value={draft.quantity}
          onChangeText={(v) => set({ quantity: v })}
        />
        <View style={styles.row}>
          {QUANTITY_STEPS.map((q) => (
            <Choice
              key={q}
              label={q}
              selected={amount === q}
              onPress={() => set({ quantity: `${q} ${unit || 'phần'}`.trim() })}
              height={52}
            />
          ))}
        </View>

        <View style={{ gap: 8 }}>
          <Text variant="formLabel">
            {dateKindLabel[draft.dateKind].replace('Hạn sử dụng (Use by)', 'Hạn sử dụng (Use by)')}
          </Text>
          <PressableScale
            accessibilityRole="button"
            onPress={() => router.push('/account/pantry/add/date')}
            style={styles.dateField}
          >
            <Text variant="fieldValue" style={{ color: colors.inputText }}>
              {draft.date || 'Chưa rõ'}
            </Text>
          </PressableScale>
        </View>
      </ScrollView>

      <View style={[styles.footer, { bottom: insets.bottom + 20 }]}>
        <Button
          label="Tiếp tục kiểm tra"
          onPress={() => router.push('/account/pantry/add/review')}
        />
      </View>
    </View>
  );
}

function Choice({
  label,
  selected,
  onPress,
  height,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  height: number;
}) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.choice, { height }, selected ? styles.choiceOn : styles.choiceOff]}
    >
      <Text variant="semi14" color={selected ? 'white' : 'textPrimary'}>
        {label}
      </Text>
    </PressableScale>
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
  row: { flexDirection: 'row', gap: 12 },
  choice: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
  choiceOn: { backgroundColor: colors.brand900 },
  choiceOff: { borderWidth: 1, borderColor: colors.borderDefault, backgroundColor: colors.canvas },
  dateField: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.borderControl,
    backgroundColor: colors.white,
  },
  footer: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter },
});
