import { router, useFocusEffect } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassMenu } from '@/components/ui/GlassMenu';
import { PressableScale } from '@/components/ui/PressableScale';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { categoryMeta, storageLabel } from '@/constants/pantry';
import { colors, layout, radius } from '@/design-system/tokens';
import { PantryItemRow, PantryOverviewHero, PopupButton } from '@/features/pantry/PantryParts';
import { useStaggerEntering } from '@/hooks/useEntering';
import { useAccountStore } from '@/store/accountStore';
import { usePantryDraft } from '@/store/pantryDraft';
import { usePantryStore } from '@/store/pantryStore';
import type { PantryCategory, PantryFreshness, PantryStorage } from '@/types';
import { freshnessOf } from '@/utils/pantry';

// SB-075 · Smart Pantry · Kitchen Inventory and SB-076 · Tủ trống · Quick Add. Geometry from Figma nodes 20:2 / 117:3058:
// header at y=63 (title 185 + "Thêm món" 108×44 r14 + glass "…" 44), scroll viewport at y=120, hero 88, filters at +96,
// section title at +148, rows every 120. Menus are the Apple27 native menus (expiry (20,268), storage (135,268),
// actions (135,115), 238 wide).
// "Dùng" → SB-086, "Bỏ" (overdue) → SB-087, "…" → SB-089 history / SB-090 device data.
const EXPIRY: Record<string, PantryFreshness | 'unknown' | null> = {
  'Tất cả': null,
  'Sắp hạn': 'soon',
  'Còn hạn': 'good',
  'Quá hạn': 'overdue',
  'Chưa rõ': 'unknown', // items without a date — the demo pantry always has one, so this shows the empty-filter message
};
const STORAGE: Record<string, PantryStorage | null> = {
  'Tất cả': null,
  [storageLabel.cold]: 'cold',
  [storageLabel.dry]: 'dry',
  [storageLabel.frozen]: 'frozen',
};
const ACTIONS = ['Lịch sử tủ thực phẩm', 'Dữ liệu trên máy'];

export default function PantryTab() {
  const insets = useSafeAreaInsets();
  const items = usePantryStore((s) => s.items);
  const setDraft = usePantryDraft((s) => s.set);
  const [expiry, setExpiry] = useState('Tất cả');
  const [storage, setStorage] = useState('Tất cả');
  const [menu, setMenu] = useState<null | 'expiry' | 'storage' | 'actions'>(null);
  const entering = useStaggerEntering();

  // SB-074: first visit to this tab shows the Pantry introduction once (ASSUMPTION — Figma draws no entry point).
  useFocusEffect(
    useCallback(() => {
      const s = useAccountStore.getState();
      if (s.pantryIntroSeen) return;
      s.setPantryIntroSeen(true);
      router.push('/account/pantry/intro');
    }, []),
  );

  const shown = useMemo(
    () =>
      items.filter((i) => {
        const e = EXPIRY[expiry];
        return (
          (e == null || (e !== 'unknown' && freshnessOf(i.expiry) === e)) &&
          (STORAGE[storage] == null || i.storage === STORAGE[storage])
        );
      }),
    [items, expiry, storage],
  );

  const add = (category?: PantryCategory) => {
    if (category) setDraft({ category });
    router.push('/account/pantry/add');
  };

  const empty = items.length === 0;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { marginTop: insets.top + 4 }]}>
        <Text
          variant={empty ? 'largeTitle' : 'pantryTitle'}
          numberOfLines={1}
          style={empty ? styles.titleEmpty : styles.title}
        >
          Tủ thực phẩm
        </Text>
        {!empty ? (
          <PressableScale accessibilityRole="button" onPress={() => add()} style={styles.addBtn}>
            <SymbolView name="plus" size={16} weight="medium" tintColor={colors.canvas} />
            <Text variant="semi13" color="canvas" style={{ width: 70 }}>
              Thêm món
            </Text>
          </PressableScale>
        ) : null}
        <GlassButton
          symbol="ellipsis"
          accessibilityLabel="Lịch sử và dữ liệu trên máy"
          size={44}
          onPress={() => setMenu('actions')}
          style={empty ? styles.ellipsisEmpty : undefined}
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          empty ? styles.contentEmpty : styles.content,
          { paddingBottom: layout.scrollBottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {empty ? (
          <Empty onAdd={add} />
        ) : (
          <>
            <Animated.View entering={entering(0)}>
              <PantryOverviewHero count={items.length} />
            </Animated.View>
            <Animated.View entering={entering(1)} style={styles.filters}>
              <PopupButton
                label="Hạn dùng"
                value={expiry}
                width={173}
                onPress={() => setMenu('expiry')}
              />
              <PopupButton
                label="Nơi cất"
                value={storage}
                width={172}
                onPress={() => setMenu('storage')}
              />
            </Animated.View>
            <Text variant="bold15" style={styles.section}>
              Thực phẩm của bạn
            </Text>
            {shown.length === 0 ? (
              <Text variant="captionMeta" color="textSecondary">
                Chưa có món trong ngăn này.
              </Text>
            ) : (
              shown.map((it, i) => (
                <Animated.View key={it.id} entering={entering(2 + i)}>
                  <PantryItemRow
                    item={it}
                    onPress={() =>
                      router.push({ pathname: '/account/pantry/[id]', params: { id: it.id } })
                    }
                    onPressTag={() =>
                      router.push(
                        freshnessOf(it.expiry) === 'overdue'
                          ? { pathname: '/account/pantry/overdue', params: { id: it.id } }
                          : '/account/pantry/soon',
                      )
                    }
                    onAction={() =>
                      router.push({
                        pathname:
                          freshnessOf(it.expiry) === 'overdue'
                            ? '/account/pantry/discard/[id]'
                            : '/account/pantry/usage/[id]',
                        params: { id: it.id },
                      })
                    }
                  />
                </Animated.View>
              ))
            )}
          </>
        )}
      </ScrollView>

      <GlassMenu
        visible={menu === 'expiry'}
        onClose={() => setMenu(null)}
        x={20}
        y={268}
        items={Object.keys(EXPIRY)}
        selected={expiry}
        system
        onSelect={(v) => {
          setExpiry(v);
          setMenu(null);
        }}
      />
      <GlassMenu
        visible={menu === 'storage'}
        onClose={() => setMenu(null)}
        x={135}
        y={268}
        items={Object.keys(STORAGE)}
        selected={storage}
        system
        onSelect={(v) => {
          setStorage(v);
          setMenu(null);
        }}
      />
      <GlassMenu
        visible={menu === 'actions'}
        onClose={() => setMenu(null)}
        x={135}
        y={115}
        items={ACTIONS}
        onSelect={(v) => {
          setMenu(null);
          router.push(v === ACTIONS[0] ? '/account/pantry/history' : '/account/pantry/data');
        }}
      />
    </View>
  );
}

/* SB-076 · Tủ trống (node 117:3058): 196 r28 brand100 card with two shelf lines and Mầm "Hello" 128, Fraunces 28/34 title,
 * 15/22 body, primary CTA, "Thêm nhanh theo nhóm" and two 170×112 category tiles, then a 13/18 note. */
function Empty({ onAdd }: { onAdd: (c?: PantryCategory) => void }) {
  return (
    <>
      <View style={styles.emptyCard}>
        <View style={[styles.shelf, { left: 50, top: 136, width: 253 }]} />
        <View style={[styles.shelf, { left: 72, top: 157, width: 209 }]} />
        <View style={styles.hello}>
          <SvgIcon name="mam-hello" size={128} />
        </View>
      </View>
      <Text variant="displayEditorial">{'Tủ đang trống.\nBắt đầu từ món bạn có.'}</Text>
      <Text variant="bodyLg" color="textSecondary" style={{ lineHeight: 22 }}>
        Ghi lại món trong ngăn mát, kệ khô hoặc ngăn đông. Thêm ngày trên nhãn để biết món nào cần
        dùng trước.
      </Text>
      <Button label="Thêm thực phẩm đầu tiên" onPress={() => onAdd()} />
      <Text variant="titleSemi20">Thêm nhanh theo nhóm</Text>
      <View style={styles.grid}>
        {(['milkEggs', 'produce'] as const).map((c) => (
          <PressableScale
            key={c}
            accessibilityRole="button"
            onPress={() => onAdd(c)}
            style={styles.quick}
          >
            <SvgIcon name={categoryMeta[c].icon} size={32} />
            <Text variant="rowName" color="brand900" style={{ textAlign: 'center', width: 144 }}>
              {categoryMeta[c].label}
            </Text>
          </PressableScale>
        ))}
      </View>
      <Text variant="captionMeta" color="textSecondary">
        Bạn chủ động nhập món và hạn dùng. Đơn nhận món không tự chuyển vào tủ.
      </Text>
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
  title: { width: 185 },
  titleEmpty: { flex: 1 },
  // figma "Add food ·44pt": 108×44, r14, plus icon at x=8, label at x=30
  addBtn: {
    width: 108,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
    borderRadius: radius.input,
    backgroundColor: colors.brand900,
  },
  ellipsisEmpty: { marginLeft: 0 },
  content: { gap: 8, paddingHorizontal: layout.screenGutter, paddingTop: 13 },
  contentEmpty: { gap: 22, paddingHorizontal: layout.screenGutter, paddingTop: 28 }, // viewport starts y=115, content pt20 → y=135
  filters: { flexDirection: 'row', gap: 8 },
  section: { fontSize: 17, lineHeight: 22 },
  emptyCard: {
    height: 196,
    overflow: 'hidden',
    borderRadius: 28,
    backgroundColor: colors.brand100,
  },
  shelf: { position: 'absolute', height: 2, backgroundColor: colors.brand700, opacity: 0.2 },
  hello: { position: 'absolute', left: 112.5, top: 8 },
  grid: { flexDirection: 'row', gap: 13 },
  quick: {
    width: 170,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
  },
});
