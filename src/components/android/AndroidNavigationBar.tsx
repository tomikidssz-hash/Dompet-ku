import React from 'react';
import { LayoutDashboard, ReceiptText, BarChart3 } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';

export type TabType = 'summary' | 'transactions' | 'reports';

interface AndroidNavigationBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const AndroidNavigationBar: React.FC<AndroidNavigationBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { transactions } = useTransactions();

  const handleTabClick = (tab: TabType) => {
    // Android haptic feedback if supported by browser/device
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(12);
      } catch {
        // ignore
      }
    }
    onTabChange(tab);
  };

  const navItems = [
    {
      id: 'summary' as TabType,
      label: 'Ringkasan',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'transactions' as TabType,
      label: 'Transaksi',
      icon: ReceiptText,
      badge: transactions.length > 0 ? transactions.length : undefined,
    },
    {
      id: 'reports' as TabType,
      label: 'Laporan',
      icon: BarChart3,
      badge: undefined,
    },
  ];

  return (
    <div className="bg-slate-50/95 dark:bg-slate-900/95 border-t border-slate-200/80 dark:border-slate-800 backdrop-blur-md pb-1 select-none z-20">
      <div className="flex items-center justify-around px-4 pt-2 pb-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="group flex flex-col items-center justify-center flex-1 py-1 relative focus:outline-none transition-transform active:scale-95"
            >
              {/* Material 3 active indicator pill */}
              <div
                className={`relative px-5 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                  isActive
                    ? 'bg-emerald-600/15 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors ${isActive ? 'scale-105' : 'scale-100'}`}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 px-1.5 min-w-[18px] h-[18px] rounded-full bg-emerald-600 text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] mt-1 tracking-tight transition-all ${
                  isActive
                    ? 'font-bold text-emerald-800 dark:text-emerald-300'
                    : 'font-medium text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Android System Gesture Bar (Home handle) */}
      <div className="w-full flex justify-center pt-2 pb-1">
        <div className="w-28 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
      </div>
    </div>
  );
};
