import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { PressableScale } from '@/components/ui/PressableScale';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { freshnessLabel, storageLabel } from '@/constants/pantry';
import type { SvgName } from '@/design-system/icons/svg-data';
import { duration } from '@/design-system/motion';
import { colors, radius } from '@/design-system/tokens';
import type { PantryFreshness, PantryItem } from '@/types';
import { expiryCaption, freshnessOf } from '@/utils/pantry';

const tone: Record<PantryFreshness, { bg: string; fg: 'success' | 'warning' | 'danger' }> = {
  good: { bg: colors.successBg, fg: 'success' },
  soon: { bg: colors.warningBg, fg: 'warning' },
  overdue: { bg: colors.dangerBg, fg: 'danger' },
};

/** PantryOverviewHero (353×88, node 625:8263): brand100, r20, p12, Fraunces 20/26 title + 13/20 SemiBold count in the
 * accent-orange text colour, Mầm Kitchen 64. */
export function PantryOverviewHero({ count }: { count: number }) {
  return (
    <View style={styles.hero}>
      <View style={styles.heroCopy}>
        <Text variant="heroPantry">Góc bếp của bạn</Text>
        <Text variant="semi13" color="price" style={{ lineHeight: 20 }}>{`${count} món`}</Text>
      </View>
      <SvgIcon name="mam-kitchen" size={64} />
    </View>
  );
}

/** PantryItemRow (353×112, node 20:45): 64pt r16 icon tile, name + quantity·storage (Medium 14/21), 62×44 outline action
 * (r14), status tag 72×22 r8 at (0,44), date caption Medium 12/18. */
export function PantryItemRow({
  item,
  onPress,
  onAction,
  onPressTag,
}: {
  item: PantryItem;
  onPress?: () => void;
  onAction: () => void;
  /** Status tag → SB-083 (Sắp hạn) / SB-084 (Quá hạn). ASSUMPTION: Figma draws no entry to those screens. */
  onPressTag?: () => void;
}) {
  const fresh = freshnessOf(item.expiry);
  const t = tone[fresh];
  return (
    <PressableScale accessibilityRole="button" onPress={onPress} style={styles.row}>
      <View style={styles.iconTile}>
        <SvgIcon name={item.icon as SvgName} size={32} />
      </View>
      <View style={styles.main}>
        <View style={{ flex: 1 }}>
          <Text variant="rowName">{item.name}</Text>
          <Text variant="rowName">{`${item.quantity} · ${storageLabel[item.storage]}`}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={fresh === 'overdue' ? 'Bỏ' : 'Dùng'}
          onPress={onAction}
          style={styles.action}
        >
          <Text variant="rowAction" color="brand900">
            {fresh === 'overdue' ? 'Bỏ' : 'Dùng'}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole={fresh === 'good' ? undefined : 'button'}
          onPress={fresh === 'good' ? onPress : onPressTag}
          style={[styles.tag, { backgroundColor: t.bg }]}
        >
          <Text variant="statusTag" color={t.fg}>
            {freshnessLabel[fresh]}
          </Text>
        </Pressable>
      </View>
      <Text variant="dateCaption" color="textSecondary">
        {expiryCaption(item)}
      </Text>
    </PressableScale>
  );
}

/* "Hạn dùng: Tất cả ⌃⌄" popup button (173×44) with a small floating option menu. */
export function FilterPopup({
  label,
  value,
  options,
  onChange,
  width,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  width: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ width }}>
      <PressableScale accessibilityRole="button" onPress={() => setOpen(true)} style={styles.popup}>
        <Text variant="linkMedium14">{`${label}: ${value}`}</Text>
        <SymbolView name="chevron.up.chevron.down" size={13} tintColor={colors.textPrimary} />
      </PressableScale>
      <Modal transparent visible={open} animationType="none" onRequestClose={() => setOpen(false)}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)}>
          <Animated.View
            entering={FadeIn.duration(duration.fast)}
            exiting={FadeOut.duration(duration.fast)}
            style={styles.menu}
          >
            {options.map((o) => (
              <Pressable
                key={o}
                accessibilityRole="menuitem"
                onPress={() => {
                  onChange(o);
                  setOpen(false);
                }}
                style={styles.menuItem}
              >
                <Text variant="linkMedium14" color={o === value ? 'brand900' : 'textPrimary'}>
                  {o}
                </Text>
                {o === value ? (
                  <SymbolView name="checkmark" size={14} tintColor={colors.brand900} />
                ) : null}
              </Pressable>
            ))}
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 88,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.brand100,
  },
  heroCopy: { width: 253, height: 50, gap: 4 },
  row: { minHeight: 112, paddingLeft: 76, paddingVertical: 12, gap: 6, borderRadius: radius.tile },
  iconTile: {
    position: 'absolute',
    left: 0,
    top: 12,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.tile,
    backgroundColor: colors.brand100,
  },
  main: { height: 66, flexDirection: 'row', justifyContent: 'space-between' },
  action: {
    width: 62,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  tag: {
    position: 'absolute',
    left: 0,
    top: 44,
    width: 72,
    height: 22,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.tag,
  },
  popup: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.white,
  },
  menu: {
    position: 'absolute',
    left: 20,
    top: 268,
    width: 238,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.white,
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  menuItem: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});
