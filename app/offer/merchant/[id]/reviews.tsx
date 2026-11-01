import { router, useLocalSearchParams } from 'expo-router';

import { InfoStateScreen } from '@/features/offer/InfoStateScreen';

// SB-042 · Đánh giá cửa hàng (empty state: no reviews yet).
export default function MerchantReviews() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <InfoStateScreen
      appBarTitle="Đánh giá cửa hàng"
      title={'Những lần nhận món,\nnhững lời chia sẻ.'}
      intro="Chưa có đánh giá từ người đã nhận món."
      sections={[
        { heading: 'Từ người đã nhận món', text: 'Đánh giá gắn với trải nghiệm nhận thực tế.' },
        { heading: 'Nội dung hữu ích', text: 'Chất lượng món, đóng gói và lúc đến nhận.' },
      ]}
      secondary={{
        label: 'Cách báo cáo phản hồi',
        onPress: () =>
          router.push({ pathname: '/offer/merchant/[id]/review-report', params: { id } }),
      }}
      primary={{ label: 'Về cửa hàng' }}
    />
  );
}
