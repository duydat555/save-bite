import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius } from '@/design-system/tokens';

// SB-018 · Chọn khu vực & campus. Opened from the area line under the Khám phá header. "Dùng vị trí hiện tại" → SB-011
// (location permission); "Xác nhận khu vực" → SB-032 (Quanh trường). ASSUMPTION for both targets (no links in Figma).
const AREAS = [
  { title: 'Khu học xá', sub: 'Quanh khu vực trường học' },
  { title: 'Ký túc xá', sub: 'Thuận tiện ghé nhận sau giờ học' },
  { title: 'Khu dân cư lân cận', sub: 'Khám phá quanh nơi bạn ở' },
];

export default function ChooseArea() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(0);

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Chọn khu vực" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="largeTitle" style={{ fontSize: 26, lineHeight: 34 }}>
          {'Bạn muốn tìm món\nở khu vực nào?'}
        </Text>
        <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 20 }}>
          Chọn nơi thuận tiện để ghé nhận. Bạn có thể đổi khu vực bất cứ lúc nào.
        </Text>
        <Text variant="eyebrowPill" color="textSecondary" style={{ marginTop: 4 }}>
          Đà Nẵng
        </Text>
        {AREAS.map((a, i) => {
          const on = i === selected;
          return (
            <PressableScale
              key={a.title}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              onPress={() => setSelected(i)}
              style={[styles.card, on ? styles.on : styles.off]}
            >
              <SvgIcon name="map-pin" size={22} tint={on ? colors.white : undefined} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text
                  variant="bold15"
                  color={on ? 'white' : 'textPrimary'}
                  style={{ fontSize: 16 }}
                >
                  {a.title}
                </Text>
                <Text variant="meta" style={{ color: on ? colors.brand100 : colors.textSecondary }}>
                  {a.sub}
                </Text>
              </View>
              {on ? (
                <SymbolView name="checkmark" size={18} weight="semibold" tintColor={colors.white} />
              ) : null}
            </PressableScale>
          );
        })}
        <PressableScale
          accessibilityRole="button"
          onPress={() => router.push('/(entry)/permission-location')}
          style={styles.current}
        >
          <SvgIcon name="map-pin" size={20} />
          <Text variant="bold14">Dùng vị trí hiện tại</Text>
        </PressableScale>
        <Text variant="meta" color="textSecondary">
          Bạn có thể chọn khu vực mà không bật vị trí.
        </Text>
      </ScrollView>
      <View style={[styles.dock, { bottom: insets.bottom + 20 }]}>
        <Button label="Xác nhận khu vực" onPress={() => router.replace('/discover/nearby')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 12, paddingHorizontal: layout.screenGutter, paddingTop: 8 },
  card: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    borderRadius: radius.md,
  },
  on: { backgroundColor: colors.brand900 },
  off: { borderWidth: 1, borderColor: colors.borderDefault, backgroundColor: colors.canvas },
  current: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  dock: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter },
});
