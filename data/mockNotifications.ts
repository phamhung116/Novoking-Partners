import { Notification } from '../types';

export const PARTNER_NOTIFICATIONS: Notification[] = [
  // == System Notifications ==
  {
    id: 'sys-1',
    type: 'system',
    title: 'Cập nhật quy định đồng phục mới',
    message: `THÔNG BÁO VỀ VIỆC ÁP DỤNG ĐỒNG PHỤC MỚI

Kính gửi Quý Đối tác,

Nhằm nâng cao hình ảnh chuyên nghiệp và tăng cường nhận diện thương hiệu Novoking, chúng tôi xin trân trọng thông báo về việc áp dụng quy định đồng phục mới, có hiệu lực từ ngày 01/08/2024.

1. MỤC ĐÍCH:
- Xây dựng hình ảnh Đối tác Novoking đồng bộ, chuyên nghiệp, đáng tin cậy trong mắt khách hàng.
- Giúp khách hàng dễ dàng nhận diện Đối tác chính thức của Novoking.
- Mang lại sự thoải mái, tự tin cho Đối tác trong quá trình làm việc.

2. QUY TRÌNH NHẬN ĐỒNG PHỤC:
Quý Đối tác vui lòng đến văn phòng Novoking để nhận đồng phục mới. Vui lòng mang theo CMND/CCCD để xác minh.

3. LƯU Ý:
Việc mặc đồng phục đúng quy định là bắt buộc trong suốt quá trình thực hiện công việc.

Novoking tin rằng sự thay đổi này sẽ góp phần tạo nên một môi trường làm việc chuyên nghiệp hơn.
Trân trọng cảm ơn sự hợp tác của Quý Đối tác.`,
    timestamp: '2 ngày trước',
    isRead: false,
    icon: 'megaphone',
  },
  {
    id: 'sys-2',
    type: 'system',
    title: 'Chương trình thưởng cuối tháng 7',
    message: `CHƯƠNG TRÌNH "TĂNG TỐC VỀ ĐÍCH" - THƯỞNG NÓNG CUỐI THÁNG 7

Kính gửi Quý Đối tác,

Hòa cùng không khí làm việc sôi nổi, Novoking vui mừng phát động chương trình thưởng đặc biệt "Tăng Tốc Về Đích" dành riêng cho tháng 7.

1. NỘI DUNG CHƯƠNG TRÌNH:
- Đối tượng: Tất cả Đối tác đang hoạt động.
- Điều kiện: Hoàn thành từ 20 công việc trở lên trong tháng 7 (tính từ 01/07 đến hết 31/07/2024).
- Phần thưởng: Thưởng ngay 500.000đ tiền mặt, được cộng trực tiếp vào ví của Đối tác.

2. THỜI GIAN TRAO THƯỞNG:
Phần thưởng sẽ được tổng kết và trao trong kỳ thanh toán đầu tiên của tháng 8.

Đây là cơ hội tuyệt vời để gia tăng thu nhập và khẳng định năng lực của bản thân. Novoking chúc Quý Đối tác hoàn thành xuất sắc mục tiêu và nhận được phần thưởng giá trị.

Hãy cùng nhau tăng tốc!`,
    timestamp: '5 ngày trước',
    isRead: true,
    icon: 'gift',
  },
  {
    id: 'sys-3',
    type: 'system',
    title: 'Nhắc nhở: Bật định vị và 4G',
    message: `THÔNG BÁO QUAN TRỌNG: DUY TRÌ KẾT NỐI KHI LÀM VIỆC

Kính gửi Quý Đối tác,

Để đảm bảo quy trình chấm công (check-in/check-out) được ghi nhận chính xác, minh bạch và bảo vệ quyền lợi thanh toán của chính mình, Novoking xin nhắc nhở Quý Đối tác một quy định quan trọng:

**LUÔN BẬT DỊCH VỤ ĐỊNH VỊ (GPS) VÀ KẾT NỐI MẠNG (4G/WIFI) ỔN ĐỊNH** trong suốt thời gian thực hiện công việc.

- Tại sao điều này quan trọng?
Hệ thống của chúng tôi dựa vào định vị và kết nối mạng để xác thực thời gian bắt đầu và kết thúc công việc tại đúng địa điểm của khách hàng. Việc thiếu kết nối có thể dẫn đến việc chấm công không thành công, ảnh hưởng trực tiếp đến việc thanh toán.

- Cần làm gì?
Trước mỗi ca làm, vui lòng kiểm tra và đảm bảo rằng:
1. Dịch vụ định vị trên điện thoại của bạn đã được BẬT.
2. Điện thoại có kết nối 4G hoặc Wifi ổn định.

Cảm ơn Quý Đối tác đã tuân thủ để quy trình làm việc diễn ra suôn sẻ.`,
    timestamp: '1 tuần trước',
    isRead: true,
    icon: 'alert',
  },
  {
    id: 'sys-4',
    type: 'system',
    title: 'Khảo sát mức độ hài lòng',
    message: `THƯ MỜI THAM GIA KHẢO SÁT CHẤT LƯỢNG ỨNG DỤNG

Kính gửi Quý Đối tác,

Với mong muốn không ngừng cải tiến ứng dụng Novoking Partner để mang lại trải nghiệm tốt nhất, chúng tôi rất mong nhận được những ý kiến đóng góp quý báu từ bạn.

Bài khảo sát này chỉ mất khoảng 3-5 phút để hoàn thành, tập trung vào các khía cạnh:
- Giao diện và tính dễ sử dụng của ứng dụng.
- Hiệu quả của các tính năng hiện có.
- Những khó khăn bạn gặp phải khi sử dụng.
- Các tính năng bạn mong muốn có trong tương lai.

Mọi ý kiến của bạn đều được bảo mật và là nguồn thông tin quan trọng giúp chúng tôi phát triển sản phẩm tốt hơn.

Vui lòng nhấp vào đây để bắt đầu khảo sát.
Novoking trân trọng cảm ơn sự hợp tác của bạn!`,
    timestamp: '2 tuần trước',
    isRead: true,
    icon: 'megaphone',
  },
  {
    id: 'sys-5',
    type: 'system',
    title: 'Ra mắt tính năng Lịch sử công việc',
    message: `TÍNH NĂNG MỚI: "LỊCH SỬ CÔNG VIỆC" CHÍNH THỨC RA MẮT!

Xin chào Quý Đối tác,

Chúng tôi rất vui mừng thông báo tính năng "Lịch sử công việc" đã được triển khai thành công và hiện đã có sẵn trên ứng dụng của bạn!

1. TÍNH NĂNG NÀY MANG LẠI GÌ?
- Xem lại toàn bộ các công việc đã hoàn thành.
- Kiểm tra chi tiết thu nhập của từng công việc.
- Dễ dàng theo dõi và quản lý tổng thu nhập theo tháng.

2. CÁCH TRUY CẬP:
Bạn có thể tìm thấy tính năng mới này bằng cách nhấn vào mục "Lịch sử công việc" trên thanh điều hướng ở cuối màn hình.

Hãy cập nhật phiên bản mới nhất của ứng dụng để trải nghiệm ngay hôm nay! Chúng tôi tin rằng tính năng này sẽ là một công cụ hữu ích giúp bạn quản lý công việc hiệu quả hơn.

Trân trọng,
Đội ngũ Novoking.`,
    timestamp: '3 tuần trước',
    isRead: true,
    icon: 'gift',
  },
  
  // == Job Notifications ==
  {
    id: 'job-notify-1',
    type: 'job',
    jobId: 'job-1',
    title: 'Đã thanh toán 180.000đ',
    message: 'Khách hàng Nguyễn Thị Lan đã thanh toán cho công việc ngày 25/07/2024.',
    timestamp: '1 giờ trước',
    isRead: false,
    icon: 'money',
  },
  {
    id: 'job-notify-2',
    type: 'job',
    jobId: 'job-2',
    title: 'Công việc đã hoàn thành',
    message: 'Bạn đã chấm công kết thúc thành công cho công việc tại 456 Bạch Đằng.',
    timestamp: '3 giờ trước',
    isRead: true,
    icon: 'complete',
  },
  {
    id: 'job-notify-3',
    type: 'job',
    jobId: 'new-job-today-1',
    title: 'Khách hàng đã hủy việc',
    message: 'Công việc của khách hàng Lê Hoàng Yến vào lúc 09:00 hôm nay đã bị hủy.',
    timestamp: 'Hôm qua',
    isRead: true,
    icon: 'cancel',
  },
  {
    id: 'job-notify-4',
    type: 'job',
    jobId: 'job-4',
    title: 'Vi phạm quy trình làm việc',
    message: 'Bạn đã không tải lên ảnh minh chứng sau khi hoàn thành công việc của khách Phạm Minh Tuấn.',
    timestamp: 'Hôm qua',
    isRead: false,
    icon: 'alert',
  },
   {
    id: 'job-notify-5',
    type: 'job',
    jobId: 'job-4',
    title: 'Đã thanh toán 195.000đ',
    message: 'Khách hàng Phạm Minh Tuấn đã thanh toán cho công việc ngày 26/07/2024.',
    timestamp: '2 ngày trước',
    isRead: true,
    icon: 'money',
  },
  {
    id: 'job-notify-6',
    type: 'job',
    jobId: 'job-1',
    title: 'Công việc đã hoàn thành',
    message: 'Bạn đã chấm công kết thúc thành công cho công việc tại 123 Lê Duẩn.',
    timestamp: '2 ngày trước',
    isRead: true,
    icon: 'complete',
  },
  {
    id: 'job-notify-7',
    type: 'job',
    jobId: 'new-job-tomorrow-1',
    title: 'Lưu ý quan trọng từ khách hàng',
    message: 'Khách hàng Đặng Ngọc Mai đã cập nhật ghi chú cho công việc ngày mai: "Nhà có nuôi chó, vui lòng chú ý khi ra vào."',
    timestamp: '12 giờ trước',
    isRead: false,
    icon: 'alert',
  },
  {
    id: 'job-notify-8',
    type: 'job',
    jobId: 'new-job-2days-1',
    title: 'Khách hàng đã hủy việc',
    message: 'Công việc tại Biệt thự A1, khu Euro Village đã bị khách hàng hủy.',
    timestamp: '1 ngày trước',
    isRead: true,
    icon: 'cancel',
  },
  {
    id: 'job-notify-9',
    type: 'job',
    jobId: 'job-2',
    title: 'Thanh toán đã được xử lý',
    message: 'Khoản thanh toán 120.000đ từ công việc của khách Trần Văn An đã được chuyển vào tài khoản của bạn.',
    timestamp: '3 ngày trước',
    isRead: true,
    icon: 'money',
  },
  {
    id: 'job-notify-10',
    type: 'job',
    jobId: 'job-1',
    title: 'Ghi nhận phản hồi chưa tốt',
    message: 'Khách hàng Nguyễn Thị Lan đã phản hồi bạn đến muộn. Vui lòng đảm bảo đúng giờ ở các công việc tiếp theo.',
    timestamp: '2 ngày trước',
    isRead: false,
    icon: 'alert',
  },
];


export const MANAGER_NOTIFICATIONS: Notification[] = [
  // == System Notifications for Manager ==
  {
    id: 'mgr-sys-1',
    type: 'system',
    title: 'Báo cáo hiệu suất CTV tuần',
    message: `Báo cáo tổng kết hiệu suất làm việc của đội ngũ cộng tác viên tuần qua đã được cập nhật.
- Tỷ lệ hoàn thành công việc: 95%
- Tỷ lệ hủy việc: 3%
- Đánh giá trung bình: 4.8/5 sao
Vui lòng xem chi tiết trong mục Báo cáo để có kế hoạch điều chỉnh phù hợp.`,
    timestamp: '1 ngày trước',
    isRead: false,
    icon: 'megaphone',
  },
  {
    id: 'mgr-sys-2',
    type: 'system',
    title: 'Chính sách thưởng mới được áp dụng',
    message: `THÔNG BÁO CHÍNH SÁCH THƯỞNG MỚI

Kính gửi Quản lý,
Kể từ ngày 01/08/2024, chính sách thưởng mới dành cho CTV sẽ được áp dụng, dựa trên các tiêu chí:
1.  Đánh giá của khách hàng.
2.  Số lượng công việc hoàn thành.
3.  Tỷ lệ vi phạm quy trình.

Quản lý vui lòng phổ biến chính sách này đến đội ngũ CTV của mình để đảm bảo tất cả các thành viên đều nắm rõ và có động lực làm việc tốt hơn.`,
    timestamp: '3 ngày trước',
    isRead: true,
    icon: 'gift',
  },
  {
    id: 'mgr-sys-3',
    type: 'system',
    title: 'Lịch bảo trì hệ thống',
    message: `THÔNG BÁO BẢO TRÌ HỆ THỐNG

Hệ thống sẽ được bảo trì để nâng cấp vào lúc 02:00 sáng ngày 30/07/2024.
- Thời gian dự kiến: 15 phút.
- Ảnh hưởng: Ứng dụng có thể bị gián đoạn.

Vui lòng thông báo cho các CTV để tránh nhận việc hoặc thực hiện các tác vụ quan trọng trong khoảng thời gian này.`,
    timestamp: '1 tuần trước',
    isRead: true,
    icon: 'alert',
  },
  {
    id: 'mgr-sys-4',
    type: 'system',
    title: 'Yêu cầu duyệt CTV mới',
    message: 'Có 3 hồ sơ cộng tác viên mới đang chờ được duyệt. Vui lòng truy cập mục "Cộng tác viên" để xem và xử lý.',
    timestamp: '2 tuần trước',
    isRead: true,
    icon: 'megaphone',
  },

  // == Job Notifications for Manager (Complaints) ==
  {
    id: 'complaint-1',
    type: 'job',
    jobId: 'DDN-41047488', // hist-oct-1
    title: 'Khiếu nại mới từ khách hàng',
    message: 'Khách hàng Phan Anh Dũng khiếu nại về chất lượng công việc ngày 27/10/2025.',
    timestamp: '2 giờ trước',
    isRead: false,
    icon: 'alert',
  },
  {
    id: 'complaint-2',
    type: 'job',
    jobId: 'DDN-41047497', // hist-oct-10
    title: 'Khiếu nại mới từ khách hàng',
    message: 'Khách hàng Phạm Quỳnh Anh khiếu nại về thái độ của cộng tác viên.',
    timestamp: '1 ngày trước',
    isRead: true,
    icon: 'alert',
  },
  {
    id: 'complaint-3',
    type: 'job',
    jobId: 'VSCN-71054327', // hist-oct-4
    title: 'Khiếu nại mới từ khách hàng',
    message: 'Khách hàng Nguyễn Quang Hải khiếu nại vì CTV quên đổ rác.',
    timestamp: '2 ngày trước',
    isRead: true,
    icon: 'alert',
  },
  {
    id: 'complaint-4',
    type: 'job',
    jobId: 'VSS-61012351', // hist-oct-7
    title: 'Khiếu nại mới từ khách hàng',
    message: 'Khách hàng Trịnh Thăng Bình khiếu nại về việc CTV thiếu dụng cụ.',
    timestamp: '4 ngày trước',
    isRead: true,
    icon: 'alert',
  },
];
