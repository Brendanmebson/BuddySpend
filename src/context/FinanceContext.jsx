import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories] = useState([
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Healthcare', 'Travel', 'Education', 'Other'
  ]);

  useEffect(() => {
    // Load data from localStorage
    const savedTransactions = localStorage.getItem('transactions');
    const savedBudgets = localStorage.getItem('budgets');

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      // Initialize with sample data
      const sampleTransactions = [
        {
          id: '1',
          type: 'expense',
          amount: 45.99,
          category: 'Food & Dining',
          description: 'Lunch at restaurant',
          date: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'income',
          amount: 3000,
          category: 'Salary',
          description: 'Monthly salary',
          date: new Date().toISOString(),
        },
        {
          id: '3',
          type: 'expense',
          amount: 120,
          category: 'Bills & Utilities',
          description: 'Electricity bill',
          date: new Date().toISOString(),
        }
      ];
      setTransactions(sampleTransactions);
    }

    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    } else {
      // Initialize with sample budgets
      const sampleBudgets = [
        { id: '1', category: 'Food & Dining', limit: 500, spent: 245.99 },
        { id: '2', category: 'Transportation', limit: 200, spent: 89.50 },
        { id: '3', category: 'Entertainment', limit: 150, spent: 67.00 }
      ];
      setBudgets(sampleBudgets);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update budget if it's an expense
    if (transaction.type === 'expense') {
      setBudgets(prev => prev.map(budget => 
        budget.category === transaction.category
          ? { ...budget, spent: budget.spent + transaction.amount }
          : budget
      ));
    }
  };

  const deleteTransaction = (id) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction && transaction.type === 'expense') {
      setBudgets(prev => prev.map(budget => 
        budget.category === transaction.category
          ? { ...budget, spent: Math.max(0, budget.spent - transaction.amount) }
          : budget
      ));
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addBudget = (budget) => {
    const newBudget = {
      ...budget,
      id: Date.now().toString(),
      spent: 0
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const updateBudget = (id, updates) => {
    setBudgets(prev => prev.map(budget => 
      budget.id === id ? { ...budget, ...updates } : budget
    ));
  };

  const deleteBudget = (id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const getMonthlyData = (month = new Date()) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    
    const monthlyTransactions = transactions.filter(transaction => 
      isWithinInterval(new Date(transaction.date), { start, end })
    );

    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses, transactions: monthlyTransactions };
  };

  const getSpendingByCategory = () => {
    const categoryTotals = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        categoryTotals[transaction.category] = 
          (categoryTotals[transaction.category] || 0) + transaction.amount;
      });
    
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount
    }));
  };

  const value = {
    transactions,
    budgets,
    categories,
    addTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    getMonthlyData,
    getSpendingByCategory
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};