import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Transaction } from '../../types/transaction';
import { getCategoryById } from '../../data/categories';
import { formatRupiah } from '../../utils/currency';
import { formatTanggalIndo } from '../../utils/date';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: Transaction | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  transaction,
}) => {
  if (!isOpen || !transaction) return null;

  const category = getCategoryById(transaction.categoryId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-5 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-900">
          <Trash2 size={24} />
        </div>

        <h3 className="text-base font-bold text-center text-slate-900 dark:text-white mb-1">
          Hapus Transaksi?
        </h3>
        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-4">
          Tindakan ini tidak dapat dibatalkan. Saldo otomatis akan dihitung ulang.
        </p>

        {/* Transaction preview box */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 mb-5 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {category.name}
            </span>
            <span
              className={`font-bold ${
                transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {transaction.type === 'income' ? '+' : '-'}
              {formatRupiah(transaction.amount)}
            </span>
          </div>
          {transaction.note && (
            <p className="text-xs text-slate-500 truncate">{transaction.note}</p>
          )}
          <p className="text-[10px] text-slate-400">{formatTanggalIndo(transaction.date)}</p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-md shadow-rose-600/20 transition-all"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
