import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassButton } from '@/components/ui/GlassButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { categoryMeta, categoryOrder, storageLabel } from '@/constants/pantry';
import { colors, layout, radius } from '@/design-system/tokens';
import { FilterPopup, PantryItemRow, PantryOverviewHero } from '@/features/pantry/PantryParts';
import { useStaggerEntering } from '@/hooks/useEntering';
import { usePantryDraft } from '@/store/pantryDraft';
import { usePantryStore } from '@/store/pantryStore';
import type { PantryFreshness, PantryStorage } from '@/types';
import { freshnessOf } from '@/utils/pantry';

// SB-075 · Smart Pantry · Kitchen Inventory and SB-076 · Tủ trống (empty state with quick-add by category).
// "Dùng" / "Bỏ" remove the item for now — the usage (SB-086) and discard (SB-087) sheets are not built yet.
const EXPIRY: Record<string, PantryFreshness | null> = {
  'Tất cả': null,
  'Còn hạn': 'good',
  'Sắp hạn': 'soon',
  'Quá hạn': 'overdue',
};
const STORAGE: Record<string, PantryStorage | null> = {
  'Tất cả': null,
  [storageLabel.cold]: 'cold',
  [storageLabel.dry]: 'dry',
  [storageLabel.frozen]: 'frozen',
};

export default function PantryTab() {
  const insets = useSafeAreaInsets();
  const items = usePantryStore((s) => s.items);
  const remove = usePantryStore((s) => s.remove);
  const setDraft = usePantryDraft((s) => s.set);
  const [expiry, setExpiry] = useState('Tất cả');
  const [storage, setStorage] = useState('Tất cả');
  const entering = useStaggerEntering();

  const shown = useMemo(
    () =>
      items.filter(
        (i) =>
          (EXPIRY[expiry] == null || freshnessOf(i.expiry) === EXPIRY[expiry]) &&
          (STORAGE[storage] == null || i.storage === STORAGE[storage]),
      ),
    [items, expiry, storage],
  );

  const add = (category?: (typeof categoryOrder)[number]) => {
    if (category) setDraft({ category });
    router.push('/account/pantry/add');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { marginTop: insets.top + 4 }]}>
        <Text
          variant="pantryTitle"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
          style={{ flex: 1 }}
        >
          Tủ thực phẩm
        </Text>
        {items.length > 0 ? (
          <PressableScale accessibilityRole="button" onPress={() => add()} style={styles.addBtn}>
            <SymbolView name="plus" size={14} weight="bold" tintColor={colors.white} />
            <Text variant="semi14" color="white">
              Thêm món
            </Text>
          </PressableScale>
        ) : null}
        {/* History & device-data menu (SB-089 / SB-090) is outside this batch — inert */}
        <GlassButton symbol="ellipsis" accessibilityLabel="Tùy chọn tủ thực phẩm" size={44} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: layout.scrollBottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <Empty onAdd={add} />
        ) : (
          <>
            <Animated.View entering={entering(0)}>
              <PantryOverviewHero count={items.length} />
            </Animated.View>
            <Animated.View entering={entering(1)} style={styles.filters}>
              <FilterPopup
                label="Hạn dùng"
                value={expiry}
                options={Object.keys(EXPIRY)}
                onChange={setExpiry}
                width={173}
              />
              <FilterPopup
                label="Nơi cất"
                value={storage}
                options={Object.keys(STORAGE)}
                onChange={setStorage}
                width={172}
              />
            </Animated.View>
            <Text variant="bold15" style={{ fontSize: 17, lineHeight: 22 }}>
              Thực phẩm của bạn
            </Text>
            {shown.length === 0 ? (
              <Text variant="captionMeta" color="textSecondary">
                Chưa có món trong ngăn này.
              </Text>
            ) : (
              <View style={{ gap: 8 }}>
                {shown.map((it, i) => (
                  <Animated.View key={it.id} entering={entering(2 + i)}>
                    <PantryItemRow
                      item={it}
                      onPress={() =>
                        router.push({ pathname: '/account/pantry/[id]', params: { id: it.id } })
                      }
                      onAction={() => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        remove(it.id);
                      }}
                    />
                  </Animated.View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

/* SB-076: Mầm card, editorial title, CTA and a grid of quick-add categories. */
function Empty({ onAdd }: { onAdd: (c?: (typeof categoryOrder)[number]) => void }) {
  return (
    <>
      <View style={styles.emptyCard}>
        <SvgIcon name="mam-kitchen" size={150} />
      </View>
      <Text variant="displayEditorial" style={{ marginTop: 4 }}>
        {'Tủ đang trống.\nBắt đầu từ món bạn có.'}
      </Text>
      <Text variant="bodyLg" color="textSecondary" style={{ lineHeight: 22 }}>
        Ghi lại món trong ngăn mát, kệ khô hoặc ngăn đông. Thêm ngày trên nhãn để biết món nào cần
        dùng trước.
      </Text>
      <Button label="Thêm thực phẩm đầu tiên" onPress={() => onAdd()} />
      <Text variant="bold15" style={{ fontSize: 17, lineHeight: 22, marginTop: 4 }}>
        Thêm nhanh theo nhóm
      </Text>
      <View style={styles.grid}>
        {categoryOrder.slice(1, 5).map((c) => (
          <PressableScale
            key={c}
            accessibilityRole="button"
            onPress={() => onAdd(c)}
            style={styles.quick}
          >
            <SvgIcon name={categoryMeta[c].icon} size={32} />
            <Text variant="semi14">{categoryMeta[c].label}</Text>
          </PressableScale>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: layout.screenGutter,
  },
  // figma: "Add food" 108×44 — plus icon at x=8, label at x=30
  addBtn: {
    width: 108,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.brand900,
  },
  content: { gap: 8, paddingHorizontal: layout.screenGutter, paddingTop: 13 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  emptyCard: {
    height: 196,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    backgroundColor: colors.brand100,
    marginBottom: 8,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 13 },
  quick: {
    width: 170,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: radius.tile,
    backgroundColor: colors.surfaceSubtle,
  },
});
