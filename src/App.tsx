/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  FileCode2,
  RefreshCw,
} from 'lucide-react';
import { TransactionProvider, useTransactions } from './context/TransactionContext';
import { AndroidStatusBar } from './components/android/AndroidStatusBar';
import { AndroidNavigationBar, TabType } from './components/android/AndroidNavigationBar';
import { AndroidSnackbar } from './components/android/AndroidSnackbar';
import { DashboardScreen } from './components/dashboard/DashboardScreen';
import { TransactionListScreen } from './components/transactions/TransactionListScreen';
import { ReportScreen } from './components/reports/ReportScreen';
import { TransactionModal } from './components/modals/TransactionModal';
import { DeleteConfirmModal } from './components/modals/DeleteConfirmModal';
import { KotlinProjectModal } from './components/modals/KotlinProjectModal';
import { Transaction, TransactionType } from './types/transaction';

function DompetKuContent() {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [modalInitialType, setModalInitialType] = useState<TransactionType>('expense');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [isKotlinModalOpen, setIsKotlinModalOpen] = useState<boolean>(false);

  const { addTransaction, updateTransaction, deleteTransaction, resetToSampleData } =
    useTransactions();

  const handleOpenAddModal = (type: TransactionType = 'expense') => {
    setEditingTransaction(null);
    setModalInitialType(type);
    setIsAddModalOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setModalInitialType(tx.type);
    setIsAddModalOpen(true);
  };

  const handleDeleteTransaction = (tx: Transaction) => {
    setDeletingTransaction(tx);
  };

  const handleSaveTransaction = (data: {
    type: TransactionType;
    amount: number;
    date: string;
    time?: string;
    categoryId: string;
    note: string;
  }) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
    } else {
      addTransaction(data);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-200/70 text-slate-900'
      } flex flex-col items-center justify-center p-0 sm:p-4`}
    >
      {/* Top Floating Control Bar for Device Mode / Theme / Kotlin Source */}
      <header className="w-full max-w-md sm:max-w-xl mx-auto px-4 py-2.5 mb-2 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Smartphone size={16} />
          </div>
          <div>
            <div className="text-xs font-extrabold tracking-tight">DompetKu Android</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Jetpack Compose UI</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Kotlin Native Source Code Button */}
          <button
            onClick={() => setIsKotlinModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors"
            title="Lihat Kode Kotlin Native"
          >
            <FileCode2 size={13} />
            <span className="hidden sm:inline">Kode Kotlin</span>
          </button>

          {/* Toggle Phone Frame vs Full View */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
            title={isPhoneFrame ? 'Ubah ke Tampilan Penuh' : 'Ubah ke Bingkai Ponsel'}
          >
            {isPhoneFrame ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
          </button>

          {/* Toggle Dark/Light Mode */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
            title="Ganti Mode Gelap/Terang"
          >
            {isDarkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      {/* Main Application Container (Phone Frame or Fluid Container) */}
      <main
        className={`w-full transition-all duration-300 relative flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden ${
          isPhoneFrame
            ? 'max-w-[420px] h-[92vh] max-h-[880px] rounded-[42px] border-[10px] border-slate-900 dark:border-slate-800 shadow-2xl ring-1 ring-slate-950/20'
            : 'max-w-2xl min-h-[95vh] rounded-3xl border border-slate-300 dark:border-slate-800 shadow-xl'
        }`}
      >
        {/* Android Status Bar */}
        <AndroidStatusBar />

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto px-4 pt-2 pb-6 relative scrollbar-none">
          {activeTab === 'summary' && (
            <DashboardScreen
              onOpenAddModal={handleOpenAddModal}
              onNavigateToTransactions={() => setActiveTab('transactions')}
              onNavigateToReports={() => setActiveTab('reports')}
              onOpenKotlinProjectModal={() => setIsKotlinModalOpen(true)}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionListScreen
              onOpenAddModal={handleOpenAddModal}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {activeTab === 'reports' && <ReportScreen />}
        </div>

        {/* Material 3 Bottom Navigation Bar with Gesture Bar */}
        <AndroidNavigationBar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* In-App Android Snackbar notifications */}
        <AndroidSnackbar />
      </main>

      {/* Modals & Dialogs */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
        initialType={modalInitialType}
        editingTransaction={editingTransaction}
        onSave={handleSaveTransaction}
      />

      <DeleteConfirmModal
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        transaction={deletingTransaction}
        onConfirm={() => {
          if (deletingTransaction) {
            deleteTransaction(deletingTransaction.id);
            setDeletingTransaction(null);
          }
        }}
      />

      <KotlinProjectModal
        isOpen={isKotlinModalOpen}
        onClose={() => setIsKotlinModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <TransactionProvider>
      <DompetKuContent />
    </TransactionProvider>
  );
}
