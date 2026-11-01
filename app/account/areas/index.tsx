import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { PressableScale } from '@/components/ui/PressableScale';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius } from '@/design-system/tokens';
import { useAccountStore } from '@/store/accountStore';

// SB-093 · Khu vực thường dùng · Privacy note. "+ Thêm khu vực" → SB-094. Rows are not tappable in Figma.
export default function SavedAreas() {
  const insets = useSafeAreaInsets();
  const areas = useAccountStore((s) => s.areas);
  const radiusLabel = (m: number) => (m >= 1000 ? `${m / 1000} km` : `${m} m`);

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Khu vực thường dùng" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {areas.map((a) => (
          <View key={a.id} style={styles.card}>
            <View style={styles.pin}>
              <SvgIcon name="map-pin" size={20} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text variant="bold15" style={{ lineHeight: 22 }}>
                {a.name}
              </Text>
              <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 20 }}>
                {a.district}
              </Text>
              <Text variant="meta" color="textSecondary" style={{ lineHeight: 18 }}>
                {`Bán kính ưu tiên: ${radiusLabel(a.radiusM)}`}
              </Text>
            </View>
            {a.isDefault ? (
              <View style={styles.tag}>
                <Text variant="eyebrowPill" color="brand900">
                  Mặc định
                </Text>
              </View>
            ) : null}
          </View>
        ))}
        <View style={styles.note}>
          <Text variant="meta" color="textSecondary" style={{ lineHeight: 16 }}>
            Vị trí đã lưu chỉ dùng để lọc ưu đãi gần bạn. SaveBite không chia sẻ vị trí này cho cửa
            hàng hoặc công khai cho người khác.
          </Text>
        </View>
        <PressableScale
          accessibilityRole="button"
          onPress={() => router.push('/account/areas/add')}
          style={styles.add}
        >
          <Text variant="buttonLabel" color="brand900">
            + Thêm khu vực
          </Text>
        </PressableScale>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 12, paddingHorizontal: layout.screenGutter, paddingTop: 8 },
  card: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.white,
  },
  pin: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.brand100,
  },
  tag: {
    position: 'absolute',
    top: 8,
    right: 8,
    height: 24,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.brand100,
  },
  note: { padding: 14, borderRadius: radius.tile, backgroundColor: colors.surfaceSubtle },
  add: {
    height: 50,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.brand100,
  },
});
