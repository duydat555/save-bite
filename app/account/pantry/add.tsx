import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { Choice } from '@/components/ui/Choice';
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
            <SvgIcon name="pantry" size={28} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="titleSemi20Tall">Thêm món vào tủ</Text>
            <Text variant="linkMedium14" color="textSecondary" style={styles.identitySub}>
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
          onPress={() => router.push('/account/pantry/add/category')}
        />

        <Text variant="bodyMedium">Nơi bảo quản</Text>
        <View style={styles.row}>
          {STORAGES.map((s) => (
            <Choice
              key={s}
              label={storageLabel[s]}
              selected={draft.storage === s}
              onPress={() => set({ storage: s })}
              height={52}
              corner={radius.input}
              labelVariant="semi13"
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
              corner={radius.input}
              labelVariant="semi13"
            />
          ))}
        </View>

        <View style={{ gap: 8 }}>
          <Text variant="fieldLabel">{dateKindLabel[draft.dateKind]}</Text>
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

      <View style={[styles.footer, { bottom: insets.bottom + 36 }]}>
        <Button
          label="Tiếp tục kiểm tra"
          onPress={() => router.push('/account/pantry/add/review')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 12, paddingHorizontal: layout.screenGutter, paddingTop: 20 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  identitySub: { lineHeight: 20, fontFamily: 'BeVietnamPro_400Regular' },
  headIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.tile,
    backgroundColor: colors.brand100,
  },
  row: { flexDirection: 'row', gap: 8 },
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
