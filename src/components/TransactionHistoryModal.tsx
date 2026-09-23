import React, { useState } from 'react';
import { FinancialTransaction } from '../types/family';
import { X, Trash2, Plus, Receipt, Calendar, FileText, ArrowDownRight, ShieldCheck } from 'lucide-react';

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemTitle: string;
  itemType: 'debt' | 'expense' | 'savings' | 'goal' | 'income';
  currency: string;
  transactions: FinancialTransaction[];
  onRemoveTransaction: (txId: string) => void;
  onAddTransaction: (amount: number, note: string, date: string) => void;
}

export const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({
  isOpen,
  onClose,
  itemId,
  itemTitle,
  itemType,
  currency,
  transactions,
  onRemoveTransaction,
  onAddTransaction,
}) => {
  const [newAmount, setNewAmount] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newDate, setNewDate] = useState(
    () => new Date().toISOString().split('T')[0]
  );
  const [isAddingOpen, setIsAddingOpen] = useState(false);

  if (!isOpen) return null;

  // Filter transactions for this specific item
  const itemTransactions = transactions
    .filter((tx) => tx.itemId === itemId)
    .sort((a, b) => b.createdAt - a.createdAt);

  const totalRecorded = itemTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const formattedDate = new Date(newDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    onAddTransaction(amountNum, newNote.trim() || `Payment/Allocation`, formattedDate);
    setNewAmount('');
    setNewNote('');
    setIsAddingOpen(false);
  };

  const getTypeBadge = () => {
    switch (itemType) {
      case 'debt':
        return { label: 'Debt Payment History', bg: 'bg-[#f43f5e]/15 text-[#fda4af] border-[#f43f5e]/30' };
      case 'savings':
        return { label: 'Savings Deposit History', bg: 'bg-[#8b5cf6]/15 text-[#c084fc] border-[#8b5cf6]/30' };
      case 'goal':
        return { label: 'Goal Allocation History', bg: 'bg-[#38bdf8]/15 text-[#7dd3fc] border-[#38bdf8]/30' };
      case 'expense':
        return { label: 'Bill Payment History', bg: 'bg-[#fbbf24]/15 text-[#fde047] border-[#fbbf24]/30' };
      default:
        return { label: 'Transaction History', bg: 'bg-[#10b981]/15 text-[#6ee7b7] border-[#10b981]/30' };
    }
  };

  const badge = getTypeBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#111522] border border-[#263148] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#1f283d] gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                {badge.label}
              </span>
              <span className="text-[11px] text-[#64748b]">ID: {itemId}</span>
            </div>
            <h3 className="text-lg font-bold text-white font-heading leading-snug">
              {itemTitle}
            </h3>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Total Recorded History: <span className="text-white font-bold">{currency}{totalRecorded.toLocaleString()}</span> ({itemTransactions.length} {itemTransactions.length === 1 ? 'transaction' : 'transactions'})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#171d2b] text-[#94a3b8] hover:text-white hover:bg-[#20293d] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action button to expand manual logging */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#cbd5e1] flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Transaction Ledger</span>
          </span>

          <button
            type="button"
            onClick={() => setIsAddingOpen(!isAddingOpen)}
            className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 text-[#38bdf8] border border-[#38bdf8]/30 flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>{isAddingOpen ? 'Close Form' : 'Log New Transaction'}</span>
          </button>
        </div>

        {/* Add Transaction Form */}
        {isAddingOpen && (
          <form onSubmit={handleCreateTx} className="p-4 rounded-2xl bg-[#171d2c] border border-[#29354d] space-y-3 animate-fade-in">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Add Record for {itemTitle}
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-[#94a3b8] mb-1">Amount ({currency})</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#111522] border border-[#2c3750] text-white text-xs font-bold focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#94a3b8] mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#111522] border border-[#2c3750] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-[#94a3b8] mb-1">Description / Note</label>
              <input
                type="text"
                placeholder="e.g. Bank transfer, bonus deposit, cash payment"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#111522] border border-[#2c3750] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-[#94a3b8] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-[#38bdf8] hover:bg-[#0284c7] text-slate-900 text-xs font-bold transition-all shadow-md shadow-[#38bdf8]/20"
              >
                Save Record
              </button>
            </div>
          </form>
        )}

        {/* Transactions Scroll Area */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-2.5 min-h-[160px] max-h-[360px]">
          {itemTransactions.length === 0 ? (
            <div className="py-10 text-center text-[#64748b] space-y-2">
              <Receipt className="w-8 h-8 mx-auto opacity-40 text-[#94a3b8]" />
              <p className="text-xs">No transactions recorded yet for this item.</p>
              <p className="text-[11px] text-[#475569]">
                Click "Log New Transaction" above or add funds from the financial card.
              </p>
            </div>
          ) : (
            itemTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#151a28] border border-[#232d42] hover:border-[#334260] transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#1e2539] text-[#38bdf8] mt-0.5">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white font-mono">
                        +{currency}{tx.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#94a3b8] bg-[#1d2436] px-2 py-0.5 rounded-full border border-[#29354d]">
                        {tx.date}
                      </span>
                    </div>
                    {tx.note && (
                      <p className="text-xs text-[#94a3b8] mt-0.5">
                        {tx.note}
                      </p>
                    )}
                  </div>
                </div>

                {/* Only remove that specific transaction */}
                <button
                  onClick={() => onRemoveTransaction(tx.id)}
                  className="p-1.5 rounded-lg text-[#64748b] hover:text-[#f43f5e] hover:bg-[#f43f5e]/10 transition-colors opacity-80 group-hover:opacity-100"
                  title="Remove this transaction"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-[#1f283d] flex items-center justify-between text-xs text-[#64748b]">
          <span>Single-transaction removal enabled</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1b2234] hover:bg-[#252f47] text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
