import { Message } from '../types';

export const PARTNER_MESSAGES: Record<string, Message[]> = {
     'job-1': [
        { id: 'msg-1-1', text: 'Chào bạn, bạn có thể đến sớm hơn 15 phút được không?', sender: 'customer', timestamp: '10:30' },
        { id: 'msg-1-2', text: 'Chào bạn, tôi đã nhận được thông tin. Tôi sẽ cố gắng đến sớm nhất có thể. Cảm ơn bạn!', sender: 'user', timestamp: '10:32' },
    ],
    'job-2': [
        { id: 'msg-2-1', text: 'Tôi đã đến địa chỉ 456 Bạch Đằng rồi ạ.', sender: 'user', timestamp: '13:58' },
    ],
     'job-4': [
        { id: 'msg-4-1', text: 'Chào bạn, tôi là Tuấn. Lát bạn đến cứ gọi số này nhé.', sender: 'customer', timestamp: '11:05' },
        { id: 'msg-4-2', text: 'Vâng ạ, tôi đã lưu thông tin. Cảm ơn bạn.', sender: 'user', timestamp: '11:06' },
        { id: 'msg-4-3', text: 'Ok bạn.', sender: 'customer', timestamp: '11:07' },
    ],
};

export const MANAGER_MESSAGES: Record<string, Message[]> = {
    'DDN-41047488': [ // hist-oct-1
        { id: 'mgr-msg-1-1', text: 'Chào bạn, Novoking đã nhận được phản hồi của bạn và đang xem xét vấn đề.', sender: 'user', timestamp: '14:30' },
        { id: 'mgr-msg-1-2', text: 'Vâng, tôi mong công ty sớm xử lý giúp.', sender: 'customer', timestamp: '14:32' },
    ],
    'DDN-41047497': [ // hist-oct-10
        { id: 'mgr-msg-2-1', text: 'Chào bạn, chúng tôi rất tiếc về trải nghiệm của bạn. Chúng tôi sẽ làm việc lại với cộng tác viên.', sender: 'user', timestamp: 'Hôm qua' },
        { id: 'mgr-msg-2-2', text: 'Cảm ơn công ty.', sender: 'customer', timestamp: 'Hôm qua' },
    ],
    'VSCN-71054327': [ // hist-oct-4
        { id: 'mgr-msg-3-1', text: 'Chào bạn Hải, chúng tôi đã ghi nhận phản hồi. Thành thật xin lỗi bạn vì sự thiếu sót này.', sender: 'user', timestamp: '09:15' },
    ],
    'VSS-61012351': [ // hist-oct-7
        { id: 'mgr-msg-4-1', text: 'Cảm ơn bạn đã phản hồi. Chúng tôi sẽ đảm bảo CTV mang đủ dụng cụ trong những lần sau ạ.', sender: 'user', timestamp: '15:00' },
        { id: 'mgr-msg-4-2', text: 'Ok.', sender: 'customer', timestamp: '15:01' },
    ],
};
