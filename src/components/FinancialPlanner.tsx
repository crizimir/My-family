import React, { useState } from 'react';
import {
  DebtItem,
  IncomeItem,
  ExpenseBillItem,
  SavingsVaultGoal,
  FamilyFinancialState,
} from '../types/family';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Receipt,
  PiggyBank,
  Plus,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  DollarSign,
  ChevronRight,
  Trash2,
  Edit2,
  Check,
  X,
  Clock,
  User,
  Percent,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FinancialPlannerProps {
  financialState: FamilyFinancialState;
  onUpdateFinancialState: (updater: (prev: FamilyFinancialState) => FamilyFinancialState) => void;
}

export const FinancialPlanner: React.FC<FinancialPlannerProps> = ({
  financialState,
  onUpdateFinancialState,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'debts' | 'income' | 'expenses' | 'savings'>('overview');

  // Modals state
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddSavingsOpen, setIsAddSavingsOpen] = useState(false);

  // Quick Payment Logger Modal
  const [paymentModalDebt, setPaymentModalDebt] = useState<DebtItem | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState('');

  // Quick Deposit to Savings Modal
  const [depositModalGoal, setDepositModalGoal] = useState<SavingsVaultGoal | null>(null);
  const [depositAmountInput, setDepositAmountInput] = useState('');

  // Form states for adding items
  const [newDebt, setNewDebt] = useState<Omit<DebtItem, 'id' | 'status'>>({
    name: '',
    creditor: '',
    totalAmount: 50000,
    remainingAmount: 30000,
    minimumPayment: 3000,
    dueDate: 'Every 15th',
    category: 'Credit Card',
    interestRate: '',
    notes: '',
  });

  const [newIncome, setNewIncome] = useState<Omit<IncomeItem, 'id' | 'status'>>({
    source: '',
    earner: 'Mirwen',
    estimatedAmount: 25000,
    actualAmount: 0,
    expectedDate: 'Friday',
    frequency: 'Bi-weekly',
    notes: '',
  });

  const [newExpense, setNewExpense] = useState<Omit<ExpenseBillItem, 'id' | 'isPaid'>>({
    title: '',
    amount: 3500,
    category: 'Groceries & Food',
    dueDate: 'This Week',
    priority: 'Essential',
    notes: '',
  });

  const [newSavings, setNewSavings] = useState<Omit<SavingsVaultGoal, 'id'>>({
    name: '',
    targetAmount: 100000,
    currentAmount: 20000,
    category: 'Emergency Safety Net',
    targetDate: '2027',
  });

  const { currency, incomes, debts, expenses, savings, weekLabel } = financialState;

  // Key Calculations
  const totalEstimatedIncome = incomes.reduce((sum, item) => sum + item.estimatedAmount, 0);
  const totalActualIncome = incomes.reduce((sum, item) => sum + (item.status === 'received' ? item.actualAmount : 0), 0);
  const pendingIncome = totalEstimatedIncome - totalActualIncome;

  const totalDebtBalance = debts
    .filter((d) => d.status === 'active')
    .reduce((sum, item) => sum + item.remainingAmount, 0);

  const totalOriginalDebt = debts.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalDebtPaidSoFar = Math.max(0, totalOriginalDebt - totalDebtBalance);
  const debtPayoffPercent = totalOriginalDebt > 0 ? Math.round((totalDebtPaidSoFar / totalOriginalDebt) * 100) : 100;

  const totalWeeklyExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalPaidExpenses = expenses.filter((e) => e.isPaid).reduce((sum, item) => sum + item.amount, 0);
  const pendingExpenses = totalWeeklyExpenses - totalPaidExpenses;

  const totalSaved = savings.reduce((sum, item) => sum + item.currentAmount, 0);
  const totalSavingsTarget = savings.reduce((sum, item) => sum + item.targetAmount, 0);

  // Net Weekly Safety Buffer
  const netWeeklyCashflow = totalEstimatedIncome - totalWeeklyExpenses;

  // Currency Switcher
  const handleSwitchCurrency = (curr: string, code: string) => {
    onUpdateFinancialState((prev) => ({
      ...prev,
      currency: curr,
      currencyCode: code,
    }));
  };

  // Debt Handlers
  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDebt.name) return;

    const item: DebtItem = {
      ...newDebt,
      id: `debt-${Date.now()}`,
      status: 'active',
    };

    onUpdateFinancialState((prev) => ({
      ...prev,
      debts: [item, ...prev.debts],
    }));

    setIsAddDebtOpen(false);
    setNewDebt({
      name: '',
      creditor: '',
      totalAmount: 50000,
      remainingAmount: 30000,
      minimumPayment: 3000,
      dueDate: 'Every 15th',
      category: 'Credit Card',
      interestRate: '',
      notes: '',
    });
  };

  const handleLogDebtPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalDebt) return;
    const amount = parseFloat(paymentAmountInput);
    if (isNaN(amount) || amount <= 0) return;

    onUpdateFinancialState((prev) => ({
      ...prev,
      debts: prev.debts.map((d) => {
        if (d.id === paymentModalDebt.id) {
          const newRemaining = Math.max(0, d.remainingAmount - amount);
          const isNowPaidOff = newRemaining === 0;
          return {
            ...d,
            remainingAmount: newRemaining,
            status: isNowPaidOff ? 'paid_off' : d.status,
          };
        }
        return d;
      }),
    }));

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#34d399', '#fde047'],
    });

    setPaymentModalDebt(null);
    setPaymentAmountInput('');
  };

  const handleToggleDebtStatus = (id: string) => {
    onUpdateFinancialState((prev) => ({
      ...prev,
      debts: prev.debts.map((d) => {
        if (d.id === id) {
          const nextStatus = d.status === 'active' ? 'paid_off' : 'active';
          if (nextStatus === 'paid_off') {
            confetti({
              particleCount: 40,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#34d399', '#f472b6', '#38bdf8'],
            });
          }
          return {
            ...d,
            status: nextStatus,
            remainingAmount: nextStatus === 'paid_off' ? 0 : d.remainingAmount || d.totalAmount,
          };
        }
        return d;
      }),
    }));
  };

  const handleDeleteDebt = (id: string) => {
    onUpdateFinancialState((prev) => ({
      ...prev,
      debts: prev.debts.filter((d) => d.id !== id),
    }));
  };

  // Income Handlers
  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncome.source) return;

    const item: IncomeItem = {
      ...newIncome,
      id: `inc-${Date.now()}`,
      status: 'expected',
    };

    onUpdateFinancialState((prev) => ({
      ...prev,
      incomes: [item, ...prev.incomes],
    }));

    setIsAddIncomeOpen(false);
    setNewIncome({
      source: '',
      earner: 'Mirwen',
      estimatedAmount: 25000,
      actualAmount: 0,
      expectedDate: 'Friday',
      frequency: 'Bi-weekly',
      notes: '',
    });
  };

  const handleToggleIncomeReceived = (id: string) => {
    onUpdateFinancialState((prev) => ({
      ...prev,
      incomes: prev.incomes.map((inc) => {
        if (inc.id === id) {
          const isReceived = inc.status === 'received';
          const newStatus = isReceived ? 'expected' : 'received';
          return {
            ...inc,
            status: newStatus,
            actualAmount: !isReceived ? (inc.actualAmount > 0 ? inc.actualAmount : inc.estimatedAmount) : 0,
          };
        }
        return inc;
      }),
    }));
  };

  const handleDeleteIncome = (id: string) => {
    onUpdateFinancialState((prev) => ({
      ...prev,
      incomes: prev.incomes.filter((inc) => inc.id !== id),
    }));
  };

  // Expense Handlers
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.title) return;

    const item: ExpenseBillItem = {
      ...newExpense,
      id: `exp-${Date.now()}`,
      isPaid: false,
    };

    onUpdateFinancialState((prev) => ({
      ...prev,
      expenses: [item, ...prev.expenses],
    }));

    setIsAddExpenseOpen(false);
    setNewExpense({
      title: '',
      amount: 3500,
      category: 'Groceries & Food',
      dueDate: 'This Week',
      priority: 'Essential',
      notes: '',
    });
  };

  const handleToggleExpensePaid = (id: string) => {
    onUpdateFinancialState((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => (e.id === id ? { ...e, isPaid: !e.isPaid } : e)),
    }));
  };

  const handleDeleteExpense = (id: string) => {
    onUpdateFinancialState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
  };

  // Savings Handlers
  const handleAddSavings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSavings.name) return;

    const item: SavingsVaultGoal = {
      ...newSavings,
      id: `sav-${Date.now()}`,
    };

    onUpdateFinancialState((prev) => ({
      ...prev,
      savings: [...prev.savings, item],
    }));

    setIsAddSavingsOpen(false);
  };

  const handleDepositToSavings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositModalGoal) return;
    const amount = parseFloat(depositAmountInput);
    if (isNaN(amount) || amount <= 0) return;

    onUpdateFinancialState((prev) => ({
      ...prev,
      savings: prev.savings.map((s) =>
        s.id === depositModalGoal.id ? { ...s, currentAmount: s.currentAmount + amount } : s
      ),
    }));

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#34d399', '#f472b6', '#38bdf8'],
    });

    setDepositModalGoal(null);
    setDepositAmountInput('');
  };

  const handleDeleteSavings = (id: string) => {
    onUpdateFinancialState((prev) => ({
      ...prev,
      savings: prev.savings.filter((s) => s.id !== id),
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#121622] border border-[#232c42] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl shadow-black/60">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#38bdf8]/10 via-[#34d399]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7dd3fc] tracking-wider uppercase mb-2">
              <Wallet className="w-4 h-4 text-[#38bdf8]" />
              <span>Family Financial Sanctuary & Budget</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Cuares Financial Planner
            </h1>
            <p className="text-xs sm:text-sm text-[#94a3b8] max-w-xl mt-1.5 leading-relaxed">
              Track weekly estimated income, manage debt payoffs, prioritize necessary bills, and protect your family emergency buffer.
            </p>
          </div>

          {/* Currency Toggle & Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-[#182030] p-1 rounded-2xl border border-[#2b3752]">
              <button
                onClick={() => handleSwitchCurrency('₱', 'PHP')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  currency === '₱' ? 'bg-[#38bdf8] text-slate-900 shadow-md' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                ₱ PHP
              </button>
              <button
                onClick={() => handleSwitchCurrency('$', 'USD')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  currency === '$' ? 'bg-[#38bdf8] text-slate-900 shadow-md' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                $ USD
              </button>
            </div>

            <button
              onClick={() => setIsAddIncomeOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#10b981]/20 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Income</span>
            </button>

            <button
              onClick={() => setIsAddDebtOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#f43f5e] to-[#e11d48] hover:from-[#e11d48] hover:to-[#be123c] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#f43f5e]/20 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Debt</span>
            </button>
          </div>
        </div>

        {/* 4 Core Financial KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#1f283d]">
          {/* 1. ESTIMATED INCOME THIS WEEK */}
          <div
            onClick={() => setActiveTab('income')}
            className="cursor-pointer bg-[#161c2a] hover:bg-[#1a2236] border border-[#27344e] hover:border-[#38bdf8]/50 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#34d399] uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Estimated Income</span>
              </span>
              <span className="text-[10px] text-[#94a3b8] bg-[#1e273b] px-2 py-0.5 rounded-full">
                This Week
              </span>
            </div>
            <div className="text-2xl font-bold font-heading text-white tabular-nums">
              {currency}{totalEstimatedIncome.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#94a3b8] mt-1 flex items-center justify-between">
              <span className="text-[#34d399]">
                Received: {currency}{totalActualIncome.toLocaleString()}
              </span>
              {pendingIncome > 0 && (
                <span className="text-[#fde047]">
                  {currency}{pendingIncome.toLocaleString()} due
                </span>
              )}
            </div>
          </div>

          {/* 2. TOTAL DEBTS */}
          <div
            onClick={() => setActiveTab('debts')}
            className="cursor-pointer bg-[#161c2a] hover:bg-[#1a2236] border border-[#27344e] hover:border-[#f43f5e]/50 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#fda4af] uppercase tracking-wider flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-[#f43f5e]" />
                <span>Total Debts</span>
              </span>
              <span className="text-[10px] text-[#f43f5e] bg-[#f43f5e]/10 px-2 py-0.5 rounded-full font-bold">
                {debts.filter((d) => d.status === 'active').length} Active
              </span>
            </div>
            <div className="text-2xl font-bold font-heading text-white tabular-nums">
              {currency}{totalDebtBalance.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#94a3b8] mt-1 flex items-center justify-between">
              <span>{debtPayoffPercent}% Cleared</span>
              <span className="text-[#38bdf8]">
                {currency}{totalDebtPaidSoFar.toLocaleString()} paid off
              </span>
            </div>
          </div>

          {/* 3. WEEKLY BILLS & NECESSARY EXPENSES */}
          <div
            onClick={() => setActiveTab('expenses')}
            className="cursor-pointer bg-[#161c2a] hover:bg-[#1a2236] border border-[#27344e] hover:border-[#fbbf24]/50 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#fde047] uppercase tracking-wider flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5 text-[#fbbf24]" />
                <span>Weekly Bills</span>
              </span>
              <span className="text-[10px] text-[#94a3b8] bg-[#1e273b] px-2 py-0.5 rounded-full">
                {expenses.filter((e) => !e.isPaid).length} Pending
              </span>
            </div>
            <div className="text-2xl font-bold font-heading text-white tabular-nums">
              {currency}{totalWeeklyExpenses.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#94a3b8] mt-1 flex items-center justify-between">
              <span className="text-[#34d399]">
                Paid: {currency}{totalPaidExpenses.toLocaleString()}
              </span>
              <span className="text-[#cbd5e1]">
                Remaining: {currency}{pendingExpenses.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 4. NET WEEKLY BUFFER / SAVINGS */}
          <div
            onClick={() => setActiveTab('savings')}
            className="cursor-pointer bg-[#161c2a] hover:bg-[#1a2236] border border-[#27344e] hover:border-[#34d399]/50 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#7dd3fc] uppercase tracking-wider flex items-center gap-1">
                <PiggyBank className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Net Cashflow Buffer</span>
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  netWeeklyCashflow >= 0
                    ? 'text-[#34d399] bg-[#34d399]/15'
                    : 'text-[#f43f5e] bg-[#f43f5e]/15'
                }`}
              >
                {netWeeklyCashflow >= 0 ? '+ Surplus' : '- Deficit'}
              </span>
            </div>
            <div
              className={`text-2xl font-bold font-heading tabular-nums ${
                netWeeklyCashflow >= 0 ? 'text-[#34d399]' : 'text-[#f43f5e]'
              }`}
            >
              {netWeeklyCashflow >= 0 ? '+' : ''}{currency}{netWeeklyCashflow.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#94a3b8] mt-1 flex items-center justify-between">
              <span>Emergency Vault:</span>
              <span className="font-semibold text-white">
                {currency}{totalSaved.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#212738]">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-[#38bdf8] text-slate-900 shadow-md shadow-[#38bdf8]/20'
              : 'text-[#94a3b8] hover:text-white hover:bg-[#161b28]'
          }`}
        >
          All Finances Overview
        </button>

        <button
          onClick={() => setActiveTab('income')}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'income'
              ? 'bg-[#10b981] text-white shadow-md shadow-[#10b981]/20'
              : 'text-[#94a3b8] hover:text-white hover:bg-[#161b28]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Estimated Income This Week ({incomes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('debts')}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'debts'
              ? 'bg-[#f43f5e] text-white shadow-md shadow-[#f43f5e]/20'
              : 'text-[#94a3b8] hover:text-white hover:bg-[#161b28]'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Debts & Liabilities ({debts.filter((d) => d.status === 'active').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'expenses'
              ? 'bg-[#f59e0b] text-slate-900 shadow-md shadow-[#f59e0b]/20'
              : 'text-[#94a3b8] hover:text-white hover:bg-[#161b28]'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Weekly Bills & Essentials ({expenses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('savings')}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'savings'
              ? 'bg-[#8b5cf6] text-white shadow-md shadow-[#8b5cf6]/20'
              : 'text-[#94a3b8] hover:text-white hover:bg-[#161b28]'
          }`}
        >
          <PiggyBank className="w-3.5 h-3.5" />
          <span>Savings & Emergency Vault ({savings.length})</span>
        </button>
      </div>

      {/* SECTION 1: ESTIMATED INCOME THIS WEEK (Shown in overview or 'income' tab) */}
      {(activeTab === 'overview' || activeTab === 'income') && (
        <section className="bg-[#121622] border border-[#232c42] rounded-3xl p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1f283d]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#34d399] uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Estimated Income This Week</span>
              </div>
              <h2 className="text-xl font-heading font-bold text-white">
                Weekly Cash Inflows & Paychecks
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#94a3b8]">
                Total: <span className="font-bold text-[#34d399]">{currency}{totalEstimatedIncome.toLocaleString()}</span>
              </span>
              <button
                onClick={() => setIsAddIncomeOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#10b981]/20 hover:bg-[#10b981]/30 text-[#34d399] border border-[#10b981]/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Inflow</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomes.map((item) => {
              const isReceived = item.status === 'received';
              return (
                <div
                  key={item.id}
                  className={`relative p-5 rounded-2xl border transition-all ${
                    isReceived
                      ? 'bg-[#111c1d] border-[#10b981]/40 shadow-md shadow-[#10b981]/5'
                      : 'bg-[#151a28] border-[#253046] hover:border-[#38bdf8]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        item.earner === 'Mirwen'
                          ? 'bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30'
                          : item.earner === 'Janine'
                          ? 'bg-[#f472b6]/15 text-[#f8b4d9] border-[#f472b6]/30'
                          : 'bg-[#38bdf8]/15 text-[#7dd3fc] border-[#38bdf8]/30'
                      }`}
                    >
                      {item.earner} · {item.frequency}
                    </span>

                    <button
                      onClick={() => handleDeleteIncome(item.id)}
                      className="text-[#64748b] hover:text-[#f43f5e] p-1 transition-colors"
                      title="Delete income item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm font-semibold text-white mb-2 leading-snug">
                    {item.source}
                  </h3>

                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-xs text-[#94a3b8]">Estimated:</span>
                      <p className="text-lg font-bold font-heading text-white">
                        {currency}{item.estimatedAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-[#94a3b8]">Actual:</span>
                      <p className={`text-lg font-bold font-heading ${isReceived ? 'text-[#34d399]' : 'text-[#64748b]'}`}>
                        {isReceived ? `${currency}${item.actualAmount.toLocaleString()}` : '—'}
                      </p>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-[11px] text-[#94a3b8] italic mb-3">
                      "{item.notes}"
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-[#1f283c]">
                    <div className="flex items-center gap-1.5 text-xs text-[#cbd5e1]">
                      <Calendar className="w-3 h-3 text-[#38bdf8]" />
                      <span>{item.expectedDate}</span>
                    </div>

                    <button
                      onClick={() => handleToggleIncomeReceived(item.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isReceived
                          ? 'bg-[#10b981] text-white shadow-md shadow-[#10b981]/20'
                          : 'bg-[#1f293d] hover:bg-[#28354f] text-[#94a3b8] hover:text-white'
                      }`}
                    >
                      {isReceived ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Received</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>Mark Received</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 2: DEBTS & LIABILITIES (Shown in overview or 'debts' tab) */}
      {(activeTab === 'overview' || activeTab === 'debts') && (
        <section className="bg-[#121622] border border-[#232c42] rounded-3xl p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1f283d]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#fda4af] uppercase tracking-wider mb-1">
                <CreditCard className="w-4 h-4 text-[#f43f5e]" />
                <span>Debts & Liabilities Tracker</span>
              </div>
              <h2 className="text-xl font-heading font-bold text-white">
                Family Debt Payoff & Freedom Road
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[#94a3b8]">
                Total Remaining: <span className="font-bold text-[#f43f5e]">{currency}{totalDebtBalance.toLocaleString()}</span>
              </span>
              <button
                onClick={() => setIsAddDebtOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#f43f5e]/20 hover:bg-[#f43f5e]/30 text-[#fda4af] border border-[#f43f5e]/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Debt</span>
              </button>
            </div>
          </div>

          {/* Master Debt Payoff Progress Meter */}
          <div className="p-4 rounded-2xl bg-[#171d2b] border border-[#253248] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#cbd5e1] font-medium">Family Debt-Free Journey Progress:</span>
              <span className="text-[#38bdf8] font-bold">{debtPayoffPercent}% Cleared</span>
            </div>
            <div className="w-full h-2.5 bg-[#1f283c] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#38bdf8] via-[#34d399] to-[#10b981] rounded-full transition-all duration-500"
                style={{ width: `${debtPayoffPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
              <span>Original: {currency}{totalOriginalDebt.toLocaleString()}</span>
              <span>Paid So Far: {currency}{totalDebtPaidSoFar.toLocaleString()}</span>
              <span className="text-[#fda4af]">Remaining: {currency}{totalDebtBalance.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {debts.map((debt) => {
              const isPaidOff = debt.status === 'paid_off' || debt.remainingAmount === 0;
              const paidAmount = Math.max(0, debt.totalAmount - debt.remainingAmount);
              const progressPct = debt.totalAmount > 0 ? Math.min(100, Math.round((paidAmount / debt.totalAmount) * 100)) : 100;

              return (
                <div
                  key={debt.id}
                  className={`relative p-5 rounded-2xl border transition-all ${
                    isPaidOff
                      ? 'bg-[#101b1b] border-[#10b981]/30 opacity-80'
                      : 'bg-[#151a28] border-[#28324a] hover:border-[#f43f5e]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1e2538] text-[#94a3b8] border border-[#2c3750]">
                      {debt.category} {debt.interestRate ? `· ${debt.interestRate} APR` : ''}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleDebtStatus(debt.id)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                          isPaidOff
                            ? 'bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30'
                            : 'bg-[#f43f5e]/15 text-[#fda4af] border border-[#f43f5e]/30 hover:bg-[#f43f5e]/25'
                        }`}
                        title="Click to toggle paid off status"
                      >
                        {isPaidOff ? '✓ Paid Off' : 'Active'}
                      </button>

                      <button
                        onClick={() => handleDeleteDebt(debt.id)}
                        className="text-[#64748b] hover:text-[#f43f5e] p-1 transition-colors"
                        title="Delete debt"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-white">
                    {debt.name}
                  </h3>
                  <p className="text-xs text-[#94a3b8] mb-3">
                    Creditor: <span className="text-[#cbd5e1]">{debt.creditor || 'Direct'}</span>
                  </p>

                  {/* Amounts */}
                  <div className="flex items-baseline justify-between mb-2">
                    <div>
                      <span className="text-[11px] text-[#94a3b8]">Balance Remaining:</span>
                      <p className={`text-xl font-bold font-heading ${isPaidOff ? 'text-[#34d399]' : 'text-[#f43f5e]'}`}>
                        {currency}{debt.remainingAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[#94a3b8]">Min Payment:</span>
                      <p className="text-sm font-semibold text-white">
                        {currency}{debt.minimumPayment.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 mb-3">
                    <div className="w-full h-1.5 bg-[#1f283c] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#f43f5e] to-[#38bdf8] rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#64748b]">
                      <span>{currency}{paidAmount.toLocaleString()} paid</span>
                      <span>{progressPct}%</span>
                    </div>
                  </div>

                  {debt.notes && (
                    <p className="text-[11px] text-[#94a3b8] italic mb-3">
                      "{debt.notes}"
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-[#1f283c]">
                    <span className="text-[11px] text-[#94a3b8]">
                      Due: <span className="text-white font-medium">{debt.dueDate}</span>
                    </span>

                    {!isPaidOff && (
                      <button
                        onClick={() => {
                          setPaymentModalDebt(debt);
                          setPaymentAmountInput(debt.minimumPayment.toString());
                        }}
                        className="px-3 py-1 rounded-xl bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 text-[#38bdf8] border border-[#38bdf8]/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>Log Payment</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 3: WEEKLY BILLS & EXPENSES (Shown in overview or 'expenses' tab) */}
      {(activeTab === 'overview' || activeTab === 'expenses') && (
        <section className="bg-[#121622] border border-[#232c42] rounded-3xl p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1f283d]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#fde047] uppercase tracking-wider mb-1">
                <Receipt className="w-4 h-4 text-[#fbbf24]" />
                <span>Weekly Bills & Necessary Expenses</span>
              </div>
              <h2 className="text-xl font-heading font-bold text-white">
                Family Living Essentials & Utilities
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[#94a3b8]">
                Weekly Total: <span className="font-bold text-[#fde047]">{currency}{totalWeeklyExpenses.toLocaleString()}</span>
              </span>
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#f59e0b]/20 hover:bg-[#f59e0b]/30 text-[#fde047] border border-[#f59e0b]/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bill</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {expenses.map((expense) => {
              return (
                <div
                  key={expense.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    expense.isPaid
                      ? 'bg-[#101b1a] border-[#10b981]/30 opacity-75'
                      : 'bg-[#151a28] border-[#253046] hover:border-[#fbbf24]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1e2538] text-[#94a3b8]">
                      {expense.category}
                    </span>

                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-[#64748b] hover:text-[#f43f5e] p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-xs font-semibold text-white mb-1.5">
                    {expense.title}
                  </h3>

                  <div className="text-lg font-bold font-heading text-white mb-2">
                    {currency}{expense.amount.toLocaleString()}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1f283c] text-xs">
                    <span className="text-[11px] text-[#94a3b8]">{expense.dueDate}</span>
                    <button
                      onClick={() => handleToggleExpensePaid(expense.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        expense.isPaid
                          ? 'bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40'
                          : 'bg-[#1e273b] hover:bg-[#28354f] text-[#cbd5e1]'
                      }`}
                    >
                      {expense.isPaid ? '✓ Paid' : 'Mark Paid'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 4: EMERGENCY SAVINGS VAULT (Shown in overview or 'savings' tab) */}
      {(activeTab === 'overview' || activeTab === 'savings') && (
        <section className="bg-[#121622] border border-[#232c42] rounded-3xl p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1f283d]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#c084fc] uppercase tracking-wider mb-1">
                <PiggyBank className="w-4 h-4 text-[#c084fc]" />
                <span>Family Savings & Emergency Vault</span>
              </div>
              <h2 className="text-xl font-heading font-bold text-white">
                Family Security & Long-Term Cushions
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[#94a3b8]">
                Vault Total: <span className="font-bold text-[#c084fc]">{currency}{totalSaved.toLocaleString()}</span>
              </span>
              <button
                onClick={() => setIsAddSavingsOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#8b5cf6]/20 hover:bg-[#8b5cf6]/30 text-[#c084fc] border border-[#8b5cf6]/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Goal</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {savings.map((fund) => {
              const pct = fund.targetAmount > 0 ? Math.min(100, Math.round((fund.currentAmount / fund.targetAmount) * 100)) : 100;
              return (
                <div
                  key={fund.id}
                  className="bg-[#151a28] border border-[#28324a] rounded-2xl p-5 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#8b5cf6]/15 text-[#c084fc] border border-[#8b5cf6]/30">
                        {fund.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {fund.targetDate && (
                          <span className="text-[10px] text-[#94a3b8]">Target: {fund.targetDate}</span>
                        )}
                        <button
                          onClick={() => handleDeleteSavings(fund.id)}
                          className="text-[#64748b] hover:text-[#f43f5e] p-1 transition-colors"
                          title="Delete savings goal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-white">{fund.name}</h3>

                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="text-2xl font-bold font-heading text-white">
                        {currency}{fund.currentAmount.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#94a3b8]">
                        Goal: {currency}{fund.targetAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#1f283c] rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#38bdf8] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-right text-[#94a3b8] mt-1">{pct}% funded</p>
                  </div>

                  <button
                    onClick={() => {
                      setDepositModalGoal(fund);
                      setDepositAmountInput('5000');
                    }}
                    className="w-full py-2 rounded-xl bg-[#8b5cf6]/15 hover:bg-[#8b5cf6]/25 text-[#c084fc] border border-[#8b5cf6]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Deposit into Vault</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* MODAL: ADD DEBT */}
      {isAddDebtOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#131622] border border-[#2b354d] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222a3d]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#f43f5e]" />
                <h3 className="text-base font-bold text-white font-heading">Add New Debt / Liability</h3>
              </div>
              <button
                onClick={() => setIsAddDebtOpen(false)}
                className="p-1 rounded-xl text-[#94a3b8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDebt} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Debt / Account Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Car Loan, Credit Card Statement"
                  value={newDebt.name}
                  onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Creditor / Bank</label>
                  <input
                    type="text"
                    placeholder="e.g. Metrobank, BPI"
                    value={newDebt.creditor}
                    onChange={(e) => setNewDebt({ ...newDebt, creditor: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Category</label>
                  <select
                    value={newDebt.category}
                    onChange={(e) => setNewDebt({ ...newDebt, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Car / Vehicle">Car / Vehicle</option>
                    <option value="Housing / Mortgage">Housing / Mortgage</option>
                    <option value="Gadget / Appliance">Gadget / Appliance</option>
                    <option value="Family & Friends">Family & Friends</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Total Loan Amount ({currency})</label>
                  <input
                    type="number"
                    required
                    value={newDebt.totalAmount}
                    onChange={(e) => setNewDebt({ ...newDebt, totalAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Remaining Balance ({currency})</label>
                  <input
                    type="number"
                    required
                    value={newDebt.remainingAmount}
                    onChange={(e) => setNewDebt({ ...newDebt, remainingAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Monthly/Target Payment ({currency})</label>
                  <input
                    type="number"
                    required
                    value={newDebt.minimumPayment}
                    onChange={(e) => setNewDebt({ ...newDebt, minimumPayment: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Due Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Every 20th"
                    value={newDebt.dueDate}
                    onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Notes / Plan</label>
                <input
                  type="text"
                  placeholder="e.g. Target payoff date or 0% interest promo"
                  value={newDebt.notes}
                  onChange={(e) => setNewDebt({ ...newDebt, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#222a3d]">
                <button
                  type="button"
                  onClick={() => setIsAddDebtOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1c2233] text-xs text-[#94a3b8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#f43f5e] hover:bg-[#e11d48] text-white text-xs font-bold transition-all shadow-md shadow-[#f43f5e]/20"
                >
                  Save Debt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD INCOME */}
      {isAddIncomeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#131622] border border-[#2b354d] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222a3d]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#34d399]" />
                <h3 className="text-base font-bold text-white font-heading">Add Weekly Income Stream</h3>
              </div>
              <button
                onClick={() => setIsAddIncomeOpen(false)}
                className="p-1 rounded-xl text-[#94a3b8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddIncome} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Income Source</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Papa Mirwen Dev Salary, Janine Baking"
                  value={newIncome.source}
                  onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Earner</label>
                  <select
                    value={newIncome.earner}
                    onChange={(e) => setNewIncome({ ...newIncome, earner: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  >
                    <option value="Mirwen">Mirwen</option>
                    <option value="Janine">Janine</option>
                    <option value="Shared">Shared / Family</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Frequency</label>
                  <select
                    value={newIncome.frequency}
                    onChange={(e) => setNewIncome({ ...newIncome, frequency: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-weekly">Bi-weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="One-time">One-time / Side Gig</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Estimated Amount ({currency})</label>
                  <input
                    type="number"
                    required
                    value={newIncome.estimatedAmount}
                    onChange={(e) => setNewIncome({ ...newIncome, estimatedAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Expected Day / Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Friday, Sep 25"
                    value={newIncome.expectedDate}
                    onChange={(e) => setNewIncome({ ...newIncome, expectedDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Direct bank deposit, pending invoice"
                  value={newIncome.notes}
                  onChange={(e) => setNewIncome({ ...newIncome, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#222a3d]">
                <button
                  type="button"
                  onClick={() => setIsAddIncomeOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1c2233] text-xs text-[#94a3b8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold transition-all shadow-md shadow-[#10b981]/20"
                >
                  Save Inflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD EXPENSE */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#131622] border border-[#2b354d] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222a3d]">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#f59e0b]" />
                <h3 className="text-base font-bold text-white font-heading">Add Weekly Bill / Expense</h3>
              </div>
              <button
                onClick={() => setIsAddExpenseOpen(false)}
                className="p-1 rounded-xl text-[#94a3b8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Expense Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meralco Electricity, Baby Diapers"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Amount ({currency})</label>
                  <input
                    type="number"
                    required
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  >
                    <option value="Groceries & Food">Groceries & Food</option>
                    <option value="Utilities & Electricity">Utilities & Electricity</option>
                    <option value="Baby & Daughter Needs">Baby & Daughter Needs</option>
                    <option value="Rent & Housing">Rent & Housing</option>
                    <option value="Internet & Tech">Internet & Tech</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Due Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Thursday, Sep 24"
                    value={newExpense.dueDate}
                    onChange={(e) => setNewExpense({ ...newExpense, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Priority</label>
                  <select
                    value={newExpense.priority}
                    onChange={(e) => setNewExpense({ ...newExpense, priority: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  >
                    <option value="Essential">Essential (Cannot Skip)</option>
                    <option value="Necessary">Necessary</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#222a3d]">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1c2233] text-xs text-[#94a3b8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-slate-900 text-xs font-bold transition-all"
                >
                  Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SAVINGS GOAL */}
      {isAddSavingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#131622] border border-[#2b354d] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222a3d]">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-[#8b5cf6]" />
                <h3 className="text-base font-bold text-white font-heading">Add Savings Vault Goal</h3>
              </div>
              <button
                onClick={() => setIsAddSavingsOpen(false)}
                className="p-1 rounded-xl text-[#94a3b8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSavings} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Fund Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6-Month Emergency Fund, House Downpayment"
                  value={newSavings.name}
                  onChange={(e) => setNewSavings({ ...newSavings, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Target Amount ({currency})</label>
                  <input
                    type="number"
                    required
                    value={newSavings.targetAmount}
                    onChange={(e) => setNewSavings({ ...newSavings, targetAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Current Saved ({currency})</label>
                  <input
                    type="number"
                    required
                    value={newSavings.currentAmount}
                    onChange={(e) => setNewSavings({ ...newSavings, currentAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Category</label>
                  <select
                    value={newSavings.category}
                    onChange={(e) => setNewSavings({ ...newSavings, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  >
                    <option value="Emergency Safety Net">Emergency Safety Net</option>
                    <option value="Daughter Education">Daughter Education</option>
                    <option value="Home Sanctuary">Home Sanctuary</option>
                    <option value="Family Vacation">Family Vacation</option>
                    <option value="Investment">Investment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Target Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2027"
                    value={newSavings.targetDate}
                    onChange={(e) => setNewSavings({ ...newSavings, targetDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#222a3d]">
                <button
                  type="button"
                  onClick={() => setIsAddSavingsOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1c2233] text-xs text-[#94a3b8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-bold transition-all shadow-md shadow-[#8b5cf6]/20"
                >
                  Save Fund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK MODAL: LOG DEBT PAYMENT */}
      {paymentModalDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#131622] border border-[#2b354d] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222a3d]">
              <div>
                <h3 className="text-base font-bold text-white font-heading">Log Debt Payment</h3>
                <p className="text-xs text-[#94a3b8]">{paymentModalDebt.name}</p>
              </div>
              <button
                onClick={() => setPaymentModalDebt(null)}
                className="p-1 rounded-xl text-[#94a3b8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLogDebtPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                  Payment Amount ({currency})
                </label>
                <input
                  type="number"
                  required
                  step="any"
                  value={paymentAmountInput}
                  onChange={(e) => setPaymentAmountInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-base font-bold focus:outline-none focus:border-[#38bdf8]"
                />
                <p className="text-[11px] text-[#94a3b8] mt-1.5">
                  Current Balance: {currency}{paymentModalDebt.remainingAmount.toLocaleString()}
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#222a3d]">
                <button
                  type="button"
                  onClick={() => setPaymentModalDebt(null)}
                  className="px-4 py-2 rounded-xl bg-[#1c2233] text-xs text-[#94a3b8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#38bdf8] hover:bg-[#0284c7] text-slate-900 text-xs font-bold transition-all shadow-md shadow-[#38bdf8]/20"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK MODAL: DEPOSIT TO SAVINGS */}
      {depositModalGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#131622] border border-[#2b354d] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222a3d]">
              <div>
                <h3 className="text-base font-bold text-white font-heading">Deposit to Vault</h3>
                <p className="text-xs text-[#94a3b8]">{depositModalGoal.name}</p>
              </div>
              <button
                onClick={() => setDepositModalGoal(null)}
                className="p-1 rounded-xl text-[#94a3b8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDepositToSavings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                  Deposit Amount ({currency})
                </label>
                <input
                  type="number"
                  required
                  step="any"
                  value={depositAmountInput}
                  onChange={(e) => setDepositAmountInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1a2030] border border-[#2e374f] text-white text-base font-bold focus:outline-none focus:border-[#34d399]"
                />
                <p className="text-[11px] text-[#94a3b8] mt-1.5">
                  Current Balance: {currency}{depositModalGoal.currentAmount.toLocaleString()}
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#222a3d]">
                <button
                  type="button"
                  onClick={() => setDepositModalGoal(null)}
                  className="px-4 py-2 rounded-xl bg-[#1c2233] text-xs text-[#94a3b8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#34d399] hover:bg-[#10b981] text-slate-900 text-xs font-bold transition-all shadow-md shadow-[#34d399]/20"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
