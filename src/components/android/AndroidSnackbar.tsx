import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';

export const AndroidSnackbar: React.FC = () => {
  const { toastMessage, hideToast } = useTransactions();

  if (!toastMessage) return null;

  return (
    <div className="absolute bottom-20 left-4 right-4 z-50 flex justify-center pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between gap-3 text-sm font-medium pointer-events-auto max-w-sm w-full">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 size={18} className="text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span className="text-xs sm:text-sm">{toastMessage}</span>
        </div>
        <button
          onClick={hideToast}
          className="text-slate-400 hover:text-white dark:hover:text-slate-950 p-1"
          aria-label="Tutup"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
