import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import type { SvgName } from '@/design-system/icons/svg-data';
import { colors, layout } from '@/design-system/tokens';
import { accountService } from '@/services/accountService';
import type { HelpTopic } from '@/types';

// SB-099 · Trợ giúp. Search filters the four FAQ rows locally. The FAQ answers have no frames in Figma → rows are inert.
// "Báo sự cố nhận món" → SB-069 (incident report; the screen does not read the order id).
export default function Help() {
  const insets = useSafeAreaInsets();
  const [topics, setTopics] = useState<HelpTopic[]>([]);
  const [q, setQ] = useState('');
  useEffect(() => {
    accountService.helpTopics().then(setTopics);
  }, []);
  const shown = topics.filter((t) =>
    `${t.title} ${t.subtitle}`.toLowerCase().includes(q.trim().toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Trợ giúp" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <InputField
          label="Tìm câu trả lời"
          value={q}
          onChangeText={setQ}
          placeholder="Tìm câu hỏi hoặc chủ đề"
          returnKeyType="search"
        />
        <Text variant="titleSemi20">Thanh toán lúc nào?</Text>
        <Text variant="bodyLg" style={{ lineHeight: 22 }}>
          Bạn đặt giữ chỗ trước, đến nhận trong khung giờ và thanh toán trực tiếp tại quầy.
        </Text>
        <View style={{ gap: 20 }}>
          {shown.map((t) => (
            <View key={t.id} style={styles.row}>
              <View style={{ width: 32 }}>
                <SvgIcon name={t.icon as SvgName} size={32} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="rowTitle" style={{ lineHeight: 22 }}>
                  {t.title}
                </Text>
                <Text variant="meta" color="textSecondary" style={{ lineHeight: 18 }}>
                  {t.subtitle}
                </Text>
              </View>
            </View>
          ))}
          {topics.length > 0 && shown.length === 0 ? (
            <Text variant="captionMeta" color="textSecondary">
              Không tìm thấy chủ đề phù hợp.
            </Text>
          ) : null}
        </View>
      </ScrollView>
      <View style={[styles.dock, { bottom: insets.bottom + 38 }]}>
        <Button
          label="Báo sự cố nhận món"
          onPress={() =>
            router.push({ pathname: '/reserve/order/[id]/incident', params: { id: 'help' } })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 20, paddingHorizontal: layout.screenGutter, paddingTop: 12 },
  row: { height: 72, flexDirection: 'row', alignItems: 'center', gap: 12 },
  dock: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter },
});
