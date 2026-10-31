import React, { useState } from 'react';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Share2,
  Download,
  Copy,
  Check,
  Award,
} from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import { formatRupiah, formatCompactRupiah } from '../../utils/currency';
import { getFullMonthName } from '../../utils/date';
import { CategoryIcon } from '../common/CategoryIcon';
import { CategorySpending } from '../../types/transaction';

export const ReportScreen: React.FC = () => {
  const {
    transactions,
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,
    currentMonthSummary,
    getCategoryBreakdown,
    getMonthlyTrends,
    showToast,
  } = useTransactions();

  const [activeReportTab, setActiveReportTab] = useState<'categories' | 'trends'>('categories');
  const [selectedCategoryDetail, setSelectedCategoryDetail] = useState<CategorySpending | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const categoryBreakdown = getCategoryBreakdown(selectedYear, selectedMonth, 'expense');
  const incomeBreakdown = getCategoryBreakdown(selectedYear, selectedMonth, 'income');
  const monthlyTrends = getMonthlyTrends(6);

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
    setSelectedCategoryDetail(null);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
    setSelectedCategoryDetail(null);
  };

  // Daily average expenditure calculation
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const dailyAverageExpense =
    currentMonthSummary.totalExpense > 0
      ? Math.round(currentMonthSummary.totalExpense / daysInMonth)
      : 0;

  // Share text report
  const handleShareSummary = () => {
    const summaryText = `📊 *Laporan Keuangan DompetKu*
Periode: ${currentMonthSummary.monthLabel}
━━━━━━━━━━━━━━━━━━
💰 *Pemasukan:* ${formatRupiah(currentMonthSummary.totalIncome)}
💸 *Pengeluaran:* ${formatRupiah(currentMonthSummary.totalExpense)}
⚖️ *Saldo Bersih:* ${formatRupiah(currentMonthSummary.netSavings)}
📈 *Rasio Menabung:* ${currentMonthSummary.savingsRate}%

Kategori Pengeluaran Teratas:
${categoryBreakdown
  .slice(0, 3)
  .map((c, i) => `${i + 1}. ${c.categoryName}: ${formatRupiah(c.totalAmount)} (${c.percentage}%)`)
  .join('\n')}

_Dibuat dengan aplikasi DompetKu Android_`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopiedShare(true);
      showToast('Laporan disalin ke clipboard');
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  // SVG Pie chart calculation
  let cumulativeAngle = 0;
  const pieSlices = categoryBreakdown.map((item) => {
    const sliceAngle = (item.percentage / 100) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + sliceAngle;
    cumulativeAngle += sliceAngle;

    // Convert angles to SVG coordinates on 100x100 circle centered at (50,50)
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;
    const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    return {
      ...item,
      pathData,
      sliceAngle,
    };
  });

  // Trend chart max value for scale
  const maxTrendVal = Math.max(
    ...monthlyTrends.map((t) => Math.max(t.totalIncome, t.totalExpense)),
    1000000
  );

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Title & Month Selector */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Laporan Keuangan
          </h1>
          <p className="text-xs text-slate-500">Analisis pengeluaran & grafik bulanan</p>
        </div>

        <button
          onClick={handleShareSummary}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-all shadow-xs"
        >
          {copiedShare ? <Check size={14} /> : <Share2 size={14} />}
          <span>{copiedShare ? 'Tersalin' : 'Bagikan'}</span>
        </button>
      </div>

      {/* Month Picker Carousel */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          aria-label="Bulan sebelumnya"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-2 text-center">
          <Calendar size={16} className="text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
            {getFullMonthName(selectedMonth)} {selectedYear}
          </span>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          aria-label="Bulan berikutnya"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Monthly Financial Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <ArrowUpRight size={13} />
            <span>Pemasukan</span>
          </div>
          <div className="text-sm sm:text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1 truncate">
            {formatRupiah(currentMonthSummary.totalIncome)}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1 text-[11px] text-rose-600 font-semibold">
            <ArrowDownRight size={13} />
            <span>Pengeluaran</span>
          </div>
          <div className="text-sm sm:text-base font-extrabold font-mono text-rose-600 dark:text-rose-400 mt-1 truncate">
            {formatRupiah(currentMonthSummary.totalExpense)}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
            <TrendingUp size={13} />
            <span>Saldo Bersih</span>
          </div>
          <div
            className={`text-sm sm:text-base font-extrabold font-mono mt-1 truncate ${
              currentMonthSummary.netSavings >= 0
                ? 'text-emerald-700 dark:text-emerald-300'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatRupiah(currentMonthSummary.netSavings)}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
            <Award size={13} />
            <span>Rerata Harian</span>
          </div>
          <div className="text-sm sm:text-base font-extrabold font-mono text-slate-800 dark:text-slate-200 mt-1 truncate">
            {formatCompactRupiah(dailyAverageExpense)}/hari
          </div>
        </div>
      </div>

      {/* Tabs: Kategori vs Tren Bulanan */}
      <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl gap-1">
        <button
          onClick={() => setActiveReportTab('categories')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeReportTab === 'categories'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <PieChart size={14} />
          <span>Grafik Kategori</span>
        </button>
        <button
          onClick={() => setActiveReportTab('trends')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeReportTab === 'trends'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <BarChart3 size={14} />
          <span>Tren 6 Bulan</span>
        </button>
      </div>

      {/* TAB 1: Kategori Breakdown (Donut Chart & List) */}
      {activeReportTab === 'categories' && (
        <div className="space-y-4">
          {categoryBreakdown.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
              <PieChart size={32} className="mx-auto text-slate-300" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Belum Ada Pengeluaran
              </h3>
              <p className="text-xs text-slate-500">
                Tidak ada data pengeluaran yang tercatat pada bulan{' '}
                {getFullMonthName(selectedMonth)} {selectedYear}.
              </p>
            </div>
          ) : (
            <>
              {/* Donut Chart Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="text-center mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Distribusi Pengeluaran
                  </h3>
                  <div className="text-lg font-mono font-extrabold text-slate-900 dark:text-white">
                    {formatRupiah(currentMonthSummary.totalExpense)}
                  </div>
                </div>

                {/* SVG Donut Visualizer */}
                <div className="relative w-48 h-48 mx-auto my-3">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {pieSlices.map((slice) => (
                      <path
                        key={slice.categoryId}
                        d={slice.pathData}
                        fill={slice.categoryColor}
                        className="transition-all hover:opacity-80 cursor-pointer"
                        onClick={() => setSelectedCategoryDetail(slice)}
                      />
                    ))}
                    {/* Inner hole for Donut effect */}
                    <circle cx="50" cy="50" r="26" className="fill-white dark:fill-slate-900" />
                  </svg>

                  {/* Center Donut Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-[10px] text-slate-400 font-medium">Kategori</span>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      {categoryBreakdown.length} Jenis
                    </span>
                  </div>
                </div>

                {/* Selected Category Highlight Banner */}
                {selectedCategoryDetail && (
                  <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: selectedCategoryDetail.categoryColor }}
                      ></div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {selectedCategoryDetail.categoryName}
                      </span>
                    </div>
                    <div className="font-mono font-bold">
                      {formatRupiah(selectedCategoryDetail.totalAmount)} (
                      {selectedCategoryDetail.percentage}%)
                    </div>
                  </div>
                )}
              </div>

              {/* Top Expenses List with Progress Bars */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Rincian Pengeluaran per Kategori
                </h3>

                <div className="space-y-3">
                  {categoryBreakdown.map((item) => (
                    <div
                      key={item.categoryId}
                      onClick={() => setSelectedCategoryDetail(item)}
                      className="group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-2xl transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: `${item.categoryColor}18`,
                              color: item.categoryColor,
                            }}
                          >
                            <CategoryIcon name={item.categoryIcon} size={15} />
                          </div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                            {item.categoryName}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {formatRupiah(item.totalAmount)}
                          </span>
                          <span className="text-[11px] text-slate-500 ml-1.5">
                            ({item.percentage}%)
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.categoryColor,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: Tren 6 Bulan (Comparison Bar Chart) */}
      {activeReportTab === 'trends' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Perbandingan Masuk vs Keluar
            </h3>
            <p className="text-xs text-slate-500">Histori pergerakan kas 6 bulan terakhir</p>
          </div>

          {/* Bar Chart Canvas Simulation */}
          <div className="pt-6 pb-2">
            <div className="h-44 flex items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              {monthlyTrends.map((trend, i) => {
                const incHeight = maxTrendVal > 0 ? (trend.totalIncome / maxTrendVal) * 100 : 0;
                const expHeight = maxTrendVal > 0 ? (trend.totalExpense / maxTrendVal) * 100 : 0;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-md">
                      Masuk: {formatCompactRupiah(trend.totalIncome)} | Keluar:{' '}
                      {formatCompactRupiah(trend.totalExpense)}
                    </div>

                    <div className="w-full flex items-end justify-center gap-1 h-36">
                      {/* Income Bar (Green) */}
                      <div
                        className="w-1/2 max-w-[14px] bg-emerald-500 rounded-t-md transition-all group-hover:bg-emerald-400"
                        style={{ height: `${Math.max(4, incHeight)}%` }}
                        title={`Masuk: ${formatRupiah(trend.totalIncome)}`}
                      ></div>
                      {/* Expense Bar (Rose) */}
                      <div
                        className="w-1/2 max-w-[14px] bg-rose-500 rounded-t-md transition-all group-hover:bg-rose-400"
                        style={{ height: `${Math.max(4, expHeight)}%` }}
                        title={`Keluar: ${formatRupiah(trend.totalExpense)}`}
                      ></div>
                    </div>

                    {/* Month Label */}
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-2 truncate max-w-[45px]">
                      {trend.monthLabel}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-5 pt-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                <span className="text-slate-600 dark:text-slate-400 font-medium">Pemasukan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-rose-500"></div>
                <span className="text-slate-600 dark:text-slate-400 font-medium">Pengeluaran</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
