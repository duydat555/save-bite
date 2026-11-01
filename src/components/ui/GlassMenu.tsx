import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { duration } from '@/design-system/motion';
import { colors } from '@/design-system/tokens';

import { GlassSurface } from './GlassSurface';
import { Text } from './Text';

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Frame coordinates (393×852) of the menu's top-left corner, from Figma. */
  x: number;
  y: number;
  items: string[];
  /** Selected item (shows a checkmark column like Apple27 pop-up menus); omit for a plain action menu. */
  selected?: string;
  onSelect: (item: string) => void;
  /** Items use SF Pro 17 (pop-up menus) or Be Vietnam Pro 14 (action menu). */
  system?: boolean;
};

/**
 * Apple27 native menu (Figma "Apple27 · Expiry menu" / "Pantry actions · native menu"): 238 wide, padding 8, corner 34,
 * 44pt rows (222 wide), glass fill with a 0 8 48 rgba(0,0,0,.25) shadow, hairline #DBDBDB rim.
 */
export function GlassMenu({ visible, onClose, x, y, items, selected, onSelect, system }: Props) {
  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Đóng menu">
        <Animated.View
          entering={FadeIn.duration(duration.fast)}
          exiting={FadeOut.duration(duration.fast)}
          style={[styles.menu, { left: x, top: y }]}
        >
          <GlassSurface variant="bar" radius={34} overlay={0.5} style={{ width: 238 }}>
            <View style={styles.items}>
              {items.map((it) => (
                <Pressable
                  key={it}
                  accessibilityRole="menuitem"
                  onPress={() => {
                    Haptics.selectionAsync();
                    onSelect(it);
                  }}
                  style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                >
                  {selected !== undefined ? (
                    <View style={styles.check}>
                      {it === selected ? (
                        <SymbolView
                          name="checkmark"
                          size={15}
                          weight="semibold"
                          tintColor={colors.textPrimary}
                        />
                      ) : null}
                    </View>
                  ) : null}
                  <Text
                    variant={system ? 'menuSystem' : 'linkMedium14'}
                    style={system ? styles.system : styles.label}
                  >
                    {it}
                  </Text>
                </Pressable>
              ))}
            </View>
          </GlassSurface>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    width: 238,
    borderRadius: 34,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
  },
  items: { width: 236, padding: 8 },
  row: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 6,
    paddingRight: 8,
    borderRadius: 22,
  },
  pressed: { backgroundColor: 'rgba(9,47,41,0.07)' },
  check: { width: 24, alignItems: 'center', marginRight: 6 },
  system: { fontWeight: '400', fontFamily: undefined },
  label: { letterSpacing: -0.43 },
});
