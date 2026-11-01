import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/design-system/tokens';

type Props = {
  ticketNo: string; // "SB-001"
  range: string; // "17:00–18:00"
  image: ImageSource | number;
  itemLine: string; // "1× Bánh mì men tự nhiên · 25.000đ"
  merchantLine: string; // "Tiệm Bánh A · Thanh toán tại quầy"
  code: string; // "SB-A125"
};

/**
 * Figma PerforatedPickupPass (353×384): ticket header strip, item row, dashed perforation with two edge notches,
 * demo QR (148) and a code box. The QR is a static demo matrix from Figma, not a real code.
 */
export function PickupPass({ ticketNo, range, image, itemLine, merchantLine, code }: Props) {
  return (
    <View style={styles.pass}>
      <View style={styles.strip}>
        <Text variant="bold12" style={{ color: colors.brand100 }}>
          {`VÉ NHẬN MÓN · ${ticketNo}`}
        </Text>
        <Text variant="bold13" color="white">
          {range}
        </Text>
      </View>

      <View style={styles.item}>
        <Image source={image} contentFit="cover" style={styles.photo48} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="bold14" numberOfLines={1}>
            {itemLine}
          </Text>
          <Text variant="helper" color="textSecondary">
            {merchantLine}
          </Text>
        </View>
      </View>

      <View style={styles.rule} />
      <View style={[styles.notch, { left: -10 }]} />
      <View style={[styles.notch, { right: -10 }]} />

      <View style={styles.qr}>
        <View style={{ margin: 13 }}>
          <SvgIcon name="qr-matrix" size={120} />
        </View>
      </View>

      <View style={styles.codeBox}>
        <Text variant="passCode">{code}</Text>
        <Text variant="hint11" color="textSecondary">
          Đưa nhân viên quét hoặc nhập mã
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pass: {
    width: '100%',
    height: 384,
    paddingHorizontal: 21,
    paddingTop: 19,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.white,
  },
  strip: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderRadius: radius.input,
    backgroundColor: colors.brand900,
  },
  item: { marginTop: 14, height: 48, flexDirection: 'row', alignItems: 'center', gap: 12 },
  photo48: { width: 48, height: 48, borderRadius: 10 },
  rule: {
    marginTop: 14,
    height: 0,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.borderDefault,
  },
  // figma: TicketPerforationNotch 20×20 centred on the card edge at y=332 (card top 202 → 130)
  notch: {
    position: 'absolute',
    top: 130 - 1,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.canvas,
  },
  qr: {
    alignSelf: 'center',
    marginTop: 14,
    width: 148,
    height: 148,
    borderRadius: radius.tile,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.white,
  },
  codeBox: {
    alignSelf: 'center',
    marginTop: 14,
    width: 220,
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.surfaceSubtle,
  },
});
