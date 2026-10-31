import React from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  Sparkles,
  TrendingUp,
  CreditCard,
  ChevronRight,
  FileCode2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import { formatRupiah, formatCompactRupiah } from '../../utils/currency';
import { formatTanggalRelatif } from '../../utils/date';
import { getCategoryById } from '../../data/categories';
import { CategoryIcon } from '../common/CategoryIcon';
import { TransactionType } from '../../types/transaction';

interface DashboardScreenProps {
  onOpenAddModal: (type: TransactionType) => void;
  onNavigateToTransactions: () => void;
  onNavigateToReports: () => void;
  onOpenKotlinProjectModal: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onOpenAddModal,
  onNavigateToTransactions,
  onNavigateToReports,
  onOpenKotlinProjectModal,
}) => {
  const {
    transactions,
    totalBalance,
    totalIncome,
    totalExpense,
    currentMonthSummary,
    resetToSampleData,
  } = useTransactions();

  // Top 5 recent transactions
  const recentTransactions = transactions.slice(0, 5);

  const isSurplus = totalBalance >= 0;

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Top Welcome & Mode Indicator */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              DompetKu Android
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard Saldo
          </h1>
        </div>

        <button
          onClick={onOpenKotlinProjectModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold shadow-xs hover:opacity-90 active:scale-95 transition-all"
        >
          <FileCode2 size={14} />
          <span>Proyek Kotlin</span>
        </button>
      </div>

      {/* Main Automatic Balance Card (Material You / Dynamic Card) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-5 text-white shadow-xl shadow-emerald-950/20">
        {/* Subtle decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-emerald-400/20 blur-xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between text-xs text-emerald-100/90 font-medium">
            <div className="flex items-center gap-1.5">
              <Wallet size={15} />
              <span>Total Saldo Aktif</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isSurplus
                  ? 'bg-emerald-500/30 text-emerald-100 border border-emerald-400/30'
                  : 'bg-rose-500/40 text-rose-100 border border-rose-400/40'
              }`}
            >
              {isSurplus ? 'Surplus Keuangan' : 'Defisit Saldo'}
            </span>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono">
              {formatRupiah(totalBalance)}
            </div>
            <p className="text-[11px] text-emerald-100/80 mt-1 flex items-center gap-1">
              <span>Penyimpanan lokal aktif</span>
              <span>·</span>
              <span>{transactions.length} transaksi tercatat</span>
            </p>
          </div>

          {/* Quick Income & Expense Totals */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/15">
            <div className="bg-black/15 backdrop-blur-xs rounded-2xl p-2.5">
              <div className="flex items-center gap-1 text-[11px] text-emerald-200">
                <ArrowUpRight size={13} className="text-emerald-300" />
                <span>Total Pemasukan</span>
              </div>
              <div className="text-sm font-bold font-mono text-emerald-100 mt-0.5 truncate">
                {formatCompactRupiah(totalIncome)}
              </div>
            </div>

            <div className="bg-black/15 backdrop-blur-xs rounded-2xl p-2.5">
              <div className="flex items-center gap-1 text-[11px] text-rose-200">
                <ArrowDownRight size={13} className="text-rose-300" />
                <span>Total Pengeluaran</span>
              </div>
              <div className="text-sm font-bold font-mono text-rose-100 mt-0.5 truncate">
                {formatCompactRupiah(totalExpense)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual Quick Action Buttons: Tambah Pemasukan & Tambah Pengeluaran */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onOpenAddModal('income')}
          className="group flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
        >
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus size={16} strokeWidth={3} />
          </div>
          <span>+ Pemasukan</span>
        </button>

        <button
          onClick={() => onOpenAddModal('expense')}
          className="group flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/20 active:scale-95 transition-all"
        >
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Minus size={16} strokeWidth={3} />
          </div>
          <span>+ Pengeluaran</span>
        </button>
      </div>

      {/* Current Month Highlight & Savings Rate */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ringkasan Bulan Ini
            </h2>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {currentMonthSummary.monthLabel}
            </div>
          </div>

          <button
            onClick={onNavigateToReports}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 hover:underline"
          >
            <span>Detail Grafik</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-500">Masuk</span>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 truncate">
              {formatCompactRupiah(currentMonthSummary.totalIncome)}
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-500">Keluar</span>
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono mt-0.5 truncate">
              {formatCompactRupiah(currentMonthSummary.totalExpense)}
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-500">Tabungan %</span>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
              {currentMonthSummary.savingsRate}%
            </div>
          </div>
        </div>

        {/* Progress Bar of Spending vs Income this month */}
        {currentMonthSummary.totalIncome > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Pengeluaran terhadap Pemasukan</span>
              <span className="font-semibold font-mono">
                {Math.min(
                  100,
                  Math.round(
                    (currentMonthSummary.totalExpense / currentMonthSummary.totalIncome) * 100
                  )
                )}
                %
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  currentMonthSummary.totalExpense > currentMonthSummary.totalIncome
                    ? 'bg-rose-500'
                    : 'bg-emerald-500'
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    (currentMonthSummary.totalExpense / currentMonthSummary.totalIncome) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-slate-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Transaksi Terkini
            </h2>
          </div>
          <button
            onClick={onNavigateToTransactions}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 hover:underline"
          >
            <span>Semua ({transactions.length})</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-6 text-slate-400 space-y-2">
            <Info size={28} className="mx-auto text-slate-300" />
            <p className="text-xs">Belum ada transaksi yang dicatat.</p>
            <button
              onClick={resetToSampleData}
              className="text-xs text-emerald-600 font-semibold underline"
            >
              Muat data sampel awal
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentTransactions.map((tx) => {
              const category = getCategoryById(tx.categoryId);
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  onClick={onNavigateToTransactions}
                  className="py-2.5 flex items-center justify-between gap-3 group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-xl px-1 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${category.color}15`,
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
                        {tx.note || formatTanggalRelatif(tx.date)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
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
                    <div className="text-[10px] text-slate-400">
                      {formatTanggalRelatif(tx.date)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick helper for reset data or Android Studio note */}
      <div className="flex items-center justify-between px-2 text-[11px] text-slate-400">
        <button
          onClick={resetToSampleData}
          className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <RefreshCw size={11} />
          <span>Reset Data Sampel</span>
        </button>

        <span className="truncate">Tersimpan di Room/LocalStorage</span>
      </div>
    </div>
  );
};
