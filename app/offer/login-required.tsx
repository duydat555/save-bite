import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { SheetModal } from '@/components/ui/SheetModal';
import { Text } from '@/components/ui/Text';
import { DEMO_PASSWORD, demoUser } from '@/data/mock/users';
import { colors, radius } from '@/design-system/tokens';
import { ERROR_GENERIC, ERROR_WRONG_PASSWORD, isValidEmail } from '@/features/auth/validation';
import { authService } from '@/services/authService';
import { offerService } from '@/services/offerService';
import { useSessionStore } from '@/store/sessionStore';
import type { OfferWithMerchant } from '@/types';
import { formatPrice } from '@/utils/format';

// SB-059 · Login Required Sheet · Return To Offer (sheet over SB-034; top ≈ y352 → 500 high). Shown when a guest taps
// "Chọn số lượng" / "Giữ phần này". After signing in it continues to the quantity sheet (SB-050) for the same offer.
export default function LoginRequired() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const signIn = useSessionStore((s) => s.signIn);
  const [offer, setOffer] = useState<OfferWithMerchant | null>(null);
  const [email, setEmail] = useState(demoUser.email);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState<{ email?: string; password?: string }>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    offerService.getOffer(id).then((o) => setOffer(o ?? null));
  }, [id]);

  const submit = async () => {
    if (!isValidEmail(email)) return setError({ email: ERROR_GENERIC });
    setBusy(true);
    const user = await authService.signIn(email.trim(), password);
    setBusy(false);
    if (!user) return setError({ password: ERROR_WRONG_PASSWORD });
    signIn(user);
    router.replace({ pathname: '/offer/[id]/quantity', params: { id } });
  };

  return (
    <SheetModal height={500}>
      {({ bottomInset }) => (
        <View style={[styles.body, { paddingBottom: bottomInset + 14 }]}>
          <Text variant="title20">Đăng nhập để giữ chỗ</Text>
          <Text variant="rowSub" color="textSecondary" style={{ marginTop: 4 }}>
            Bạn sẽ quay lại đúng món này sau khi đăng nhập.
          </Text>
          {offer ? (
            <View style={styles.summary}>
              <Image source={offer.image} contentFit="cover" style={styles.thumb} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="bold14" numberOfLines={1}>
                  {offer.title}
                </Text>
                <Text variant="meta" color="textSecondary">
                  {offer.merchant.name}
                </Text>
                <Text variant="bold12" color="price">
                  {`1 phần · ${formatPrice(offer.priceVnd)} (Trả tại quầy)`}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.summary} />
          )}
          <View style={{ gap: 4 }}>
            <InputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              error={error.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <InputField
              label="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              error={error.password}
              secureTextEntry
              autoCapitalize="none"
              onSubmitEditing={submit}
            />
          </View>
          <View style={{ gap: 8, marginTop: 'auto' }}>
            <Button
              label={busy ? 'Đang đăng nhập…' : 'Đăng nhập và tiếp tục'}
              disabled={busy}
              onPress={submit}
            />
            <Button
              label="Tạo tài khoản mới"
              variant="neutral"
              style={{ height: 52 }}
              onPress={() => router.replace('/(entry)/register')}
            />
          </View>
        </View>
      )}
    </SheetModal>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, gap: 10, paddingHorizontal: 20, paddingTop: 34 },
  summary: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
    borderRadius: radius.tile,
    backgroundColor: colors.surfaceSubtle,
  },
  thumb: { width: 56, height: 56, borderRadius: radius.input },
});
