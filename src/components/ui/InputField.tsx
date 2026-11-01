import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { colors, radius } from '@/design-system/tokens';
import type { TextInputHandle } from '@/hooks/useFocusAfterTransition';

import { Text } from './Text';

type Props = Omit<TextInputProps, 'style'> & {
  /** Ref to the underlying TextInput (pair with `useFocusAfterTransition` instead of `autoFocus`). */
  inputRef?: React.Ref<TextInputHandle>;
  label: string;
  error?: string;
};

/**
 * SDS Input Field (Figma 353×74): label + 48pt field. Field: white fill, 1px `border-control` (#7B8A80), value #1E1E1E.
 * Label/value sizes, field radius and the error look are estimated from screenshots (Code Connect hides them) —
 * the error copy ("Kiểm tra lại thông tin đã nhập.", "Mật khẩu chưa đúng, thử lại.") is from the component props.
 */
export function InputField({ label, error, inputRef, ...input }: Props) {
  return (
    <View style={styles.wrap}>
      <Text variant="fieldLabel" style={{ lineHeight: 18 }}>
        {label}
      </Text>
      <TextInput
        {...input}
        ref={inputRef}
        accessibilityLabel={label}
        placeholderTextColor={colors.textSecondary}
        selectionColor={colors.brand900}
        style={[styles.field, error ? styles.fieldError : null]}
      />
      {error ? (
        <Text variant="linkMedium13" color="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  field: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.borderControl,
    backgroundColor: colors.white,
    color: colors.inputText,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 16,
  },
  fieldError: { borderColor: colors.danger },
});
