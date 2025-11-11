import { CompanyTransaction } from '../types';

export const MOCK_COMPANY_TRANSACTIONS: CompanyTransaction[] = [
  // --- Chi phí Rút tiền ---
  {
    id: 'ctx-1',
    type: 'expense',
    category: 'Chi phí Rút tiền',
    title: 'Nguyễn Minh Trang rút tiền',
    amount: 800000,
    date: '15/10/2025',
    relatedCollaboratorId: '040011000400',
  },
  {
    id: 'ctx-2',
    type: 'expense',
    category: 'Chi phí Rút tiền',
    title: 'Võ Tấn Phát rút tiền',
    amount: 500000,
    date: '16/10/2025',
    relatedCollaboratorId: '040097004455',
  },
  {
    id: 'ctx-4',
    type: 'expense',
    category: 'Chi phí Rút tiền',
    title: 'Lý Bảo Châu rút tiền',
    amount: 1200000,
    date: '02/11/2025',
    relatedCollaboratorId: '040097002222',
  },
  {
    id: 'ctx-10',
    type: 'expense',
    category: 'Chi phí Rút tiền',
    title: 'Nguyễn Minh Trang rút tiền',
    amount: 900000,
    date: '15/06/2025',
    relatedCollaboratorId: '040011000400',
  },
  {
    id: 'ctx-13',
    type: 'expense',
    category: 'Chi phí Rút tiền',
    title: 'Nguyễn Minh Trang rút tiền',
    amount: 600000,
    date: '10/12/2024',
    relatedCollaboratorId: '040011000400',
  },
  {
    id: 'ctx-16',
    type: 'expense',
    category: 'Chi phí Rút tiền',
    title: 'Võ Tấn Phát rút tiền',
    amount: 1000000,
    date: '01/09/2024',
    relatedCollaboratorId: '040097004455',
  },

  // --- Chi phí Đền bù ---
  {
    id: 'ctx-19',
    type: 'expense',
    category: 'Chi phí Đền bù',
    title: 'Đền bù vỡ bình hoa',
    amount: 150000,
    date: '01/11/2025',
    relatedJobId: 'VSCN-71054324', // hist-nov-4
    relatedCollaboratorId: '040011000400',
  },
  {
    id: 'ctx-20',
    type: 'expense',
    category: 'Chi phí Đền bù',
    title: 'Đền bù trầy xước sàn gỗ',
    amount: 250000,
    date: '15/08/2025',
    relatedJobId: 'DDN-41047500', // hist-25-q3-2
    relatedCollaboratorId: '040093008899',
  },
];