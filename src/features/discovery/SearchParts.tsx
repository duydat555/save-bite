import { Image, type ImageSource } from 'expo-image';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/design-system/tokens';

/* AppleKit Search Input · adapted (353×48 row, field 36 high, subtle fill, r14). Editable or a tappable summary. */
export function SearchInputBar({
  value,
  onChangeText,
  onSubmit,
  onCancel,
  onPressField,
  autoFocus,
  placeholder = 'Tìm món hoặc cửa hàng',
}: {
  value: string;
  onChangeText?: (v: string) => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  /** When set, the field is a button (results screen: tap to edit the query). */
  onPressField?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
}) {
  const field = (
    <View style={styles.field}>
      <SymbolView name="magnifyingglass" size={16} tintColor={colors.textSecondary} />
      {onPressField ? (
        <Text variant="searchPlaceholder" color="textPrimary" numberOfLines={1} style={{ flex: 1 }}>
          {value}
        </Text>
      ) : (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          autoFocus={autoFocus}
          returnKeyType="search"
          autoCorrect={false}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.brand900}
          style={styles.input}
        />
      )}
    </View>
  );
  return (
    <View style={styles.row}>
      {onPressField ? (
        <Pressable accessibilityRole="search" onPress={onPressField} style={{ flex: 1 }}>
          {field}
        </Pressable>
      ) : (
        <View style={{ flex: 1 }}>{field}</View>
      )}
      {onCancel ? (
        <Pressable accessibilityRole="button" onPress={onCancel} style={styles.cancel}>
          <Text variant="action17" color="brand900">
            Hủy
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/* Recent search row (52 high): history glyph, query, "fill" arrow. */
export function RecentRow({
  label,
  onPress,
  onFill,
}: {
  label: string;
  onPress: () => void;
  onFill: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.recent}>
      <SymbolView name="clock.arrow.circlepath" size={14} tintColor={colors.textSecondary} />
      <Text variant="suggestRow" style={{ flex: 1 }} numberOfLines={1}>
        {label}
      </Text>
      <Pressable accessibilityLabel="Điền vào ô tìm kiếm" onPress={onFill} hitSlop={12}>
        <SymbolView name="arrow.up.left" size={14} tintColor={colors.textSecondary} />
      </Pressable>
    </Pressable>
  );
}

/* Quick shortcut chip (32 high, brand100 pill, 44 touch target). */
export function QuickChip({
  symbol,
  label,
  onPress,
}: {
  symbol: SFSymbol;
  label: string;
  onPress: () => void;
}) {
  return (
    <PressableScale accessibilityRole="button" onPress={onPress} style={styles.chipTarget}>
      <View style={styles.chip}>
        <SymbolView name={symbol} size={14} tintColor={colors.brand900} />
        <Text variant="link" color="brand900">
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}

/* Suggestion row (thumb 48, two lines, caret, bottom rule) used for offers and merchants. */
export function SuggestionRow({
  image,
  title,
  subtitle,
  onPress,
  rule = true,
}: {
  image?: ImageSource | number;
  title: string;
  subtitle: string;
  onPress: () => void;
  rule?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.suggest}>
      {image != null ? <Image source={image} contentFit="cover" style={styles.thumb} /> : null}
      <View style={[styles.suggestBody, rule && styles.rule]}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text variant="semi16" numberOfLines={1}>
            {title}
          </Text>
          <Text variant="rowSub" color="textSecondary" numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        <SvgIcon name="caret-right-24" size={24} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { height: 48, flexDirection: 'row', alignItems: 'center' },
  field: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: radius.input,
    backgroundColor: colors.surfaceSubtle,
  },
  input: {
    flex: 1,
    height: 36,
    padding: 0,
    color: colors.textPrimary,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
  },
  cancel: {
    width: 48,
    height: 48,
    marginLeft: 12,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  recent: { height: 52, flexDirection: 'row', alignItems: 'center', gap: 12 },
  chipTarget: { height: 44, justifyContent: 'center' },
  chip: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.brand100,
  },
  suggest: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 80 },
  thumb: { width: 48, height: 48, borderRadius: 10 },
  suggestBody: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 80 },
  rule: { borderBottomWidth: 1, borderBottomColor: colors.borderDefault },
});
