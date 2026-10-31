import { Category } from '../types/transaction';

export const CATEGORIES: Category[] = [
  // Pengeluaran (Expenses)
  {
    id: 'food',
    name: 'Makanan & Minuman',
    type: 'expense',
    icon: 'Utensils',
    color: '#F97316', // Orange
    bgLight: '#FFF7ED',
  },
  {
    id: 'transport',
    name: 'Transportasi & Bensin',
    type: 'expense',
    icon: 'Car',
    color: '#0EA5E9', // Sky blue
    bgLight: '#F0F9FF',
  },
  {
    id: 'shopping',
    name: 'Belanja Kebutuhan',
    type: 'expense',
    icon: 'ShoppingBag',
    color: '#EC4899', // Pink
    bgLight: '#FDF2F8',
  },
  {
    id: 'bills',
    name: 'Tagihan & Listrik',
    type: 'expense',
    icon: 'Zap',
    color: '#EAB308', // Amber
    bgLight: '#FEFCE8',
  },
  {
    id: 'entertainment',
    name: 'Hiburan & Langganan',
    type: 'expense',
    icon: 'Film',
    color: '#8B5CF6', // Purple
    bgLight: '#F5F3FF',
  },
  {
    id: 'health',
    name: 'Kesehatan & Obat',
    type: 'expense',
    icon: 'HeartPulse',
    color: '#EF4444', // Red
    bgLight: '#FEF2F2',
  },
  {
    id: 'education',
    name: 'Pendidikan & Buku',
    type: 'expense',
    icon: 'GraduationCap',
    color: '#14B8A6', // Teal
    bgLight: '#F0FDFA',
  },
  {
    id: 'other_expense',
    name: 'Pengeluaran Lain',
    type: 'expense',
    icon: 'MoreHorizontal',
    color: '#64748B', // Slate
    bgLight: '#F8FAFC',
  },

  // Pemasukan (Income)
  {
    id: 'salary',
    name: 'Gaji Bulanan',
    type: 'income',
    icon: 'Briefcase',
    color: '#10B981', // Emerald
    bgLight: '#ECFDF5',
  },
  {
    id: 'business',
    name: 'Usaha & Dagang',
    type: 'income',
    icon: 'Store',
    color: '#059669', // Dark Emerald
    bgLight: '#ECFDF5',
  },
  {
    id: 'freelance',
    name: 'Proyek Lepas (Freelance)',
    type: 'income',
    icon: 'Laptop',
    color: '#06B6D4', // Cyan
    bgLight: '#ECFEFF',
  },
  {
    id: 'investment',
    name: 'Investasi & Dividen',
    type: 'income',
    icon: 'TrendingUp',
    color: '#6366F1', // Indigo
    bgLight: '#EEF2FF',
  },
  {
    id: 'gift',
    name: 'Hadiah / THR',
    type: 'income',
    icon: 'Gift',
    color: '#D946EF', // Fuchsia
    bgLight: '#FDF4FF',
  },
  {
    id: 'other_income',
    name: 'Pemasukan Lain',
    type: 'income',
    icon: 'PlusCircle',
    color: '#3B82F6', // Blue
    bgLight: '#EFF6FF',
  },
];

export const getCategoryById = (id: string): Category => {
  const cat = CATEGORIES.find((c) => c.id === id);
  if (cat) return cat;
  return {
    id: 'unknown',
    name: 'Lainnya',
    type: 'expense',
    icon: 'Tag',
    color: '#6B7280',
    bgLight: '#F3F4F6',
  };
};
