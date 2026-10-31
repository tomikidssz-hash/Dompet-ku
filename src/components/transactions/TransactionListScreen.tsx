import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  X,
  FileSpreadsheet,
  Download,
  Receipt,
} from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import { Transaction, TransactionType } from '../../types/transaction';
import { CATEGORIES, getCategoryById } from '../../data/categories';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatRupiah } from '../../utils/currency';
import { formatTanggalIndo, formatTanggalRelatif } from '../../utils/date';

interface TransactionListScreenProps {
  onOpenAddModal: (type?: TransactionType) => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (tx: Transaction) => void;
}

export const TransactionListScreen: React.FC<TransactionListScreenProps> = ({
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const { transactions } = useTransactions();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (filterType !== 'all' && tx.type !== filterType) {
        return false;
      }

      // Category filter
      if (filterCategory !== 'all' && tx.categoryId !== filterCategory) {
        return false;
      }

      // Search query (matches note or category name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const cat = getCategoryById(tx.categoryId);
        const matchNote = tx.note.toLowerCase().includes(query);
        const matchCategory = cat.name.toLowerCase().includes(query);
        const matchAmount = tx.amount.toString().includes(query);
        if (!matchNote && !matchCategory && !matchAmount) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, filterType, filterCategory, searchQuery]);

  // Group transactions by date
  const groupedByDate = useMemo(() => {
    const map = new Map<string, Transaction[]>();

    // Sort descending by date, then createdAt
    const sorted = [...filteredTransactions].sort((a, b) => {
      if (a.date !== b.date) {
        return b.date.localeCompare(a.date);
      }
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

    for (const tx of sorted) {
      const list = map.get(tx.date) || [];
      list.push(tx);
      map.set(tx.date, list);
    }

    return Array.from(map.entries());
  }, [filteredTransactions]);

  // Quick total calculations for filtered results
  const filteredStats = useMemo(() => {
    let inc = 0;
    let exp = 0;
    for (const tx of filteredTransactions) {
      if (tx.type === 'income') inc += tx.amount;
      else exp += tx.amount;
    }
    return { inc, exp, net: inc - exp };
  }, [filteredTransactions]);

  // Export transactions to CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['ID', 'Tipe', 'Kategori', 'Nominal', 'Tanggal', 'Waktu', 'Catatan'];
    const rows = transactions.map((t) => [
      t.id,
      t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      getCategoryById(t.categoryId).name,
      t.amount,
      t.date,
      t.time || '',
      `"${(t.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DompetKu_Transaksi_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 pb-24 select-none relative min-h-screen">
      {/* Title & Stats Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Riwayat Transaksi
          </h1>
          <p className="text-xs text-slate-500">
            {filteredTransactions.length} dari {transactions.length} transaksi
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          title="Ekspor CSV"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 transition-colors"
        >
          <Download size={14} />
          <span>CSV</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari catatan, kategori, nominal..."
          className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Tabs (Semua, Pemasukan, Pengeluaran) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            filterType === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setFilterType('income')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1 ${
            filterType === 'income'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <span>Pemasukan</span>
        </button>
        <button
          onClick={() => setFilterType('expense')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1 ${
            filterType === 'expense'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <span>Pengeluaran</span>
        </button>

        {/* Category selector dropdown */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="ml-auto text-xs px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="all">Semua Kategori</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Stats Sub-bar */}
      {(filterType !== 'all' || filterCategory !== 'all' || searchQuery) && (
        <div className="bg-slate-100/80 dark:bg-slate-800/80 px-3.5 py-2 rounded-2xl flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium">Hasil Filter:</span>
          <div className="flex items-center gap-3 font-mono font-bold">
            {filterType !== 'expense' && (
              <span className="text-emerald-600">+{formatRupiah(filteredStats.inc)}</span>
            )}
            {filterType !== 'income' && (
              <span className="text-rose-600">-{formatRupiah(filteredStats.exp)}</span>
            )}
          </div>
        </div>
      )}

      {/* Transaction List Grouped by Date */}
      {groupedByDate.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Receipt size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Tidak Ada Transaksi Ditemukan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Coba sesuaikan kata kunci pencarian atau ubah filter kategori.
            </p>
          </div>
          <button
            onClick={() => onOpenAddModal('expense')}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
          >
            + Tambah Transaksi
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {groupedByDate.map(([dateStr, items]) => {
            // Calculate net for this single day
            let dayIncome = 0;
            let dayExpense = 0;
            items.forEach((item) => {
              if (item.type === 'income') dayIncome += item.amount;
              else dayExpense += item.amount;
            });
            const dayNet = dayIncome - dayExpense;

            return (
              <div
                key={dateStr}
                className="bg-white dark:bg-slate-900 rounded-3xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-xs"
              >
                {/* Date header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {formatTanggalRelatif(dateStr)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({formatTanggalIndo(dateStr)})
                    </span>
                  </div>

                  {/* Day total balance tag */}
                  <span
                    className={`text-[11px] font-mono font-bold ${
                      dayNet >= 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {dayNet >= 0 ? '+' : '-'}
                    {formatRupiah(Math.abs(dayNet))}
                  </span>
                </div>

                {/* Items in this date */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {items.map((tx) => {
                    const category = getCategoryById(tx.categoryId);
                    const isIncome = tx.type === 'income';

                    return (
                      <div
                        key={tx.id}
                        className="py-2.5 flex items-center justify-between gap-3 group"
                      >
                        {/* Left: Category Icon & Details */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: `${category.color}18`,
                              color: category.color,
                            }}
                          >
                            <CategoryIcon name={category.icon} size={18} />
                          </div>

                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {category.name}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {tx.note || '(Tanpa Catatan)'}
                            </div>
                            {tx.time && (
                              <div className="text-[10px] text-slate-400 font-mono">
                                {tx.time}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Amount & Actions (Edit & Delete) */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right">
                            <div
                              className={`text-xs sm:text-sm font-bold font-mono ${
                                isIncome
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {isIncome ? '+' : '-'}
                              {formatRupiah(tx.amount)}
                            </div>
                          </div>

                          {/* Action Buttons: Edit and Delete */}
                          <div className="flex items-center gap-1 pl-1">
                            <button
                              onClick={() => onEditTransaction(tx)}
                              title="Edit Transaksi"
                              className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => onDeleteTransaction(tx)}
                              title="Hapus Transaksi"
                              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Android Material 3 Floating Action Button (FAB) */}
      <div className="fixed bottom-20 right-6 sm:right-8 z-30">
        <button
          onClick={() => onOpenAddModal('expense')}
          className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-700/30 active:scale-95 transition-all"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span>Tambah</span>
        </button>
      </div>
    </div>
  );
};
