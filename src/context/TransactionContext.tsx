import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, CategorySpending, MonthSummary } from '../types/transaction';
import { INITIAL_TRANSACTIONS } from '../data/sampleTransactions';
import { CATEGORIES, getCategoryById } from '../data/categories';
import { getFullMonthName } from '../utils/date';

interface TransactionContextType {
  transactions: Transaction[];
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  selectedYear: number;
  selectedMonth: number; // 1-12
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
  currentMonthSummary: MonthSummary;
  addTransaction: (data: {
    type: TransactionType;
    amount: number;
    date: string;
    time?: string;
    categoryId: string;
    note: string;
  }) => Transaction;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  resetToSampleData: () => void;
  clearAllTransactions: () => void;
  importTransactions: (txs: Transaction[]) => void;
  getCategoryBreakdown: (year: number, month: number, type?: TransactionType) => CategorySpending[];
  getMonthlyTrends: (count?: number) => MonthSummary[];
  toastMessage: string | null;
  showToast: (msg: string) => void;
  hideToast: () => void;
}

const STORAGE_KEY = 'dompetku_transactions_v2';

const TransactionContext = createContext<TransactionContextType | null>(null);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Gagal membaca data dari penyimpanan lokal:', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Gagal menyimpan transaksi ke localStorage:', e);
    }
  }, [transactions]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const hideToast = () => {
    setToastMessage(null);
  };

  // Toast auto-hide
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Overall totals
  const { totalIncome, totalExpense, totalBalance } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    for (const tx of transactions) {
      if (tx.type === 'income') {
        inc += tx.amount;
      } else {
        exp += tx.amount;
      }
    }
    return {
      totalIncome: inc,
      totalExpense: exp,
      totalBalance: inc - exp,
    };
  }, [transactions]);

  // Current Month Summary
  const currentMonthSummary = useMemo<MonthSummary>(() => {
    const monthStr = String(selectedMonth).padStart(2, '0');
    const prefix = `${selectedYear}-${monthStr}`;

    const monthTxs = transactions.filter((tx) => tx.date.startsWith(prefix));
    let inc = 0;
    let exp = 0;
    for (const tx of monthTxs) {
      if (tx.type === 'income') {
        inc += tx.amount;
      } else {
        exp += tx.amount;
      }
    }

    const netSavings = inc - exp;
    const savingsRate = inc > 0 ? Math.max(0, Math.round((netSavings / inc) * 100)) : 0;

    return {
      year: selectedYear,
      month: selectedMonth,
      monthLabel: `${getFullMonthName(selectedMonth)} ${selectedYear}`,
      totalIncome: inc,
      totalExpense: exp,
      netSavings,
      savingsRate,
      transactionCount: monthTxs.length,
    };
  }, [transactions, selectedYear, selectedMonth]);

  // Add transaction
  const addTransaction = (data: {
    type: TransactionType;
    amount: number;
    date: string;
    time?: string;
    categoryId: string;
    note: string;
  }): Transaction => {
    const newTx: Transaction = {
      ...data,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: Date.now(),
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(data.type === 'income' ? 'Pemasukan berhasil dicatat!' : 'Pengeluaran berhasil dicatat!');
    return newTx;
  };

  // Update transaction
  const updateTransaction = (id: string, data: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...data } : tx))
    );
    showToast('Transaksi berhasil diperbarui');
  };

  // Delete transaction
  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    showToast('Transaksi telah dihapus');
  };

  // Reset to sample
  const resetToSampleData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    showToast('Data dikembalikan ke data sampel awal');
  };

  // Clear all
  const clearAllTransactions = () => {
    setTransactions([]);
    showToast('Semua transaksi telah dihapus');
  };

  // Import
  const importTransactions = (imported: Transaction[]) => {
    if (Array.isArray(imported)) {
      setTransactions(imported);
      showToast(`Berhasil mengimpor ${imported.length} transaksi`);
    }
  };

  // Category breakdown for selected month
  const getCategoryBreakdown = (
    year: number,
    month: number,
    type: TransactionType = 'expense'
  ): CategorySpending[] => {
    const monthStr = String(month).padStart(2, '0');
    const prefix = `${year}-${monthStr}`;

    const filtered = transactions.filter(
      (tx) => tx.date.startsWith(prefix) && tx.type === type
    );

    const totalTypeAmount = filtered.reduce((acc, curr) => acc + curr.amount, 0);

    const map = new Map<string, { total: number; count: number }>();
    for (const tx of filtered) {
      const current = map.get(tx.categoryId) || { total: 0, count: 0 };
      map.set(tx.categoryId, {
        total: current.total + tx.amount,
        count: current.count + 1,
      });
    }

    const result: CategorySpending[] = [];
    map.forEach((value, catId) => {
      const cat = getCategoryById(catId);
      result.push({
        categoryId: catId,
        categoryName: cat.name,
        categoryIcon: cat.icon,
        categoryColor: cat.color,
        totalAmount: value.total,
        count: value.count,
        percentage: totalTypeAmount > 0 ? Math.round((value.total / totalTypeAmount) * 100) : 0,
      });
    });

    return result.sort((a, b) => b.totalAmount - a.totalAmount);
  };

  // Monthly trends for recent months
  const getMonthlyTrends = (count = 6): MonthSummary[] => {
    const list: MonthSummary[] = [];
    const baseDate = new Date();

    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const mStr = String(m).padStart(2, '0');
      const prefix = `${y}-${mStr}`;

      const monthTxs = transactions.filter((tx) => tx.date.startsWith(prefix));
      let inc = 0;
      let exp = 0;
      for (const tx of monthTxs) {
        if (tx.type === 'income') inc += tx.amount;
        else exp += tx.amount;
      }
      const net = inc - exp;
      const rate = inc > 0 ? Math.max(0, Math.round((net / inc) * 100)) : 0;

      list.push({
        year: y,
        month: m,
        monthLabel: `${getFullMonthName(m).substring(0, 3)} ${y}`,
        totalIncome: inc,
        totalExpense: exp,
        netSavings: net,
        savingsRate: rate,
        transactionCount: monthTxs.length,
      });
    }

    return list;
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        totalBalance,
        totalIncome,
        totalExpense,
        selectedYear,
        selectedMonth,
        setSelectedYear,
        setSelectedMonth,
        currentMonthSummary,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        resetToSampleData,
        clearAllTransactions,
        importTransactions,
        getCategoryBreakdown,
        getMonthlyTrends,
        toastMessage,
        showToast,
        hideToast,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
