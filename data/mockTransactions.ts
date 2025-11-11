import { Transaction } from '../types';

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-1',
    type: 'income',
    title: 'Tiền công việc',
    timestamp: '16:17, 27/10/2025',
    amount: 228000,
    relatedJobId: 'DDN-41047488',
  },
  {
    id: 'txn-2',
    type: 'expense',
    title: 'Phí thu hộ công ty',
    timestamp: '16:17, 27/10/2025',
    amount: 45600,
    relatedJobId: 'DDN-41047488',
  },
  {
    id: 'txn-3',
    type: 'expense',
    title: 'Phí thu hộ công ty',
    timestamp: '09:07, 27/10/2025',
    amount: 38200,
  },
  {
    id: 'txn-4',
    type: 'expense',
    title: 'Phí thu hộ công ty',
    timestamp: '10:30, 26/10/2025',
    amount: 54800,
    relatedJobId: 'VSCN-71054327',
  },
  {
    id: 'txn-5',
    type: 'expense',
    title: 'Phí phạt không bấm bắt đầu/kết thúc',
    timestamp: '', // No timestamp in screenshot
    amount: 20000,
  },
];