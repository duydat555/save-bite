import { InfoStateScreen } from '@/features/offer/InfoStateScreen';

// SB-043 · Chi tiết đánh giá & Báo cáo (empty state).
export default function ReviewReport() {
  return (
    <InfoStateScreen
      appBarTitle="Chi tiết đánh giá"
      title={'Chưa có đánh giá\nđể báo cáo.'}
      intro="Bạn chỉ có thể báo cáo một đánh giá cụ thể. Quay lại danh sách để chọn phản hồi khi có dữ liệu."
      sections={[
        {
          heading: 'Khi nào nên báo cáo?',
          text: 'Thông tin sai lệch, quấy rối hoặc nội dung quảng cáo.',
        },
        {
          heading: 'Điều gì xảy ra tiếp theo?',
          text: 'SaveBite cần xem nội dung và ngữ cảnh trước khi xử lý.',
        },
      ]}
      primary={{ label: 'Về danh sách đánh giá' }}
    />
  );
}
