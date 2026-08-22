import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, Plus, Users, Equal, Percent, Calculator, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import type { WalletExpense } from '@/types/travel';

const mockExpenses: WalletExpense[] = [
  { id: 'e1', description: 'Paradise Biryani Lunch', category: 'food', amount: 700, currency: '₹', paidBy: 'Alex', splitType: 'equal', splitAmong: ['Alex', 'Priya', 'Arjun'] },
  { id: 'e2', description: 'Uber to Charminar', category: 'transport', amount: 180, currency: '₹', paidBy: 'Priya', splitType: 'equal', splitAmong: ['Alex', 'Priya', 'Arjun'] },
  { id: 'e3', description: 'Charminar Entry', category: 'tickets', amount: 75, currency: '₹', paidBy: 'Alex', splitType: 'equal', splitAmong: ['Alex', 'Priya', 'Arjun'] },
  { id: 'e4', description: 'Bangles at Laad Bazaar', category: 'shopping', amount: 400, currency: '₹', paidBy: 'Priya', splitType: 'custom', splitAmong: ['Priya'] },
  { id: 'e5', description: 'Salar Jung Museum', category: 'activities', amount: 60, currency: '₹', paidBy: 'Arjun', splitType: 'equal', splitAmong: ['Alex', 'Priya', 'Arjun'] },
  { id: 'e6', description: 'Irani Chai', category: 'food', amount: 90, currency: '₹', paidBy: 'Alex', splitType: 'equal', splitAmong: ['Alex', 'Priya', 'Arjun'] },
];

const splitTypes = [
  { id: 'equal', label: 'Equal Split', icon: <Equal className="h-3 w-3" /> },
  { id: 'custom', label: 'Custom', icon: <Calculator className="h-3 w-3" /> },
  { id: 'percentage', label: 'Percentage', icon: <Percent className="h-3 w-3" /> },
];

export default function WalletPage() {
  const [expenses] = useState(mockExpenses);
  const [splitMode, setSplitMode] = useState('equal');

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perPerson = Math.round(totalSpent / 3);

  // Calculate who owes whom
  const paid = expenses.reduce((acc, e) => {
    acc[e.paidBy] = (acc[e.paidBy] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const balances = Object.entries(paid).map(([name, amount]) => ({
    name,
    paid: amount,
    owes: perPerson,
    balance: amount - perPerson,
  }));

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <WalletIcon className="h-3.5 w-3.5" />
            <span className="font-medium uppercase tracking-wider">Wallet</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Trip Wallet</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and split expenses with your travel group.</p>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">₹{totalSpent.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Spent</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">₹{perPerson.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Per Person</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{expenses.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Expenses</p>
          </div>
        </motion.div>

        {/* Split mode */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 mb-6"
        >
          {splitTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSplitMode(type.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all border',
                splitMode === type.id
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-card text-muted-foreground border-border hover:border-foreground/30'
              )}
            >
              {type.icon}
              {type.label}
            </button>
          ))}
        </motion.div>

        {/* Who owes whom */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-5 mb-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="h-4 w-4" /> Settlement
          </h3>
          <div className="space-y-2">
            {balances.map((b) => (
              <div key={b.name} className="flex items-center justify-between rounded-lg bg-foreground/5 px-3 py-2">
                <span className="text-xs font-medium text-foreground">{b.name}</span>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">Paid ₹{b.paid.toLocaleString()}</span>
                  <span className={cn(
                    'ml-2 text-xs font-bold',
                    b.balance > 0 ? 'text-emerald-600' : b.balance < 0 ? 'text-red-600' : 'text-muted-foreground'
                  )}>
                    {b.balance > 0 ? `+₹${b.balance}` : b.balance < 0 ? `-₹${Math.abs(b.balance)}` : 'Settled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Expenses list */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Expenses</p>
          {expenses.map((expense, i) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.04 }}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
            >
              <div>
                <h4 className="text-sm font-medium text-foreground">{expense.description}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {expense.category} • Paid by {expense.paidBy} • {expense.splitAmong.length} people
                </p>
              </div>
              <p className="text-sm font-bold text-foreground">₹{expense.amount}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
