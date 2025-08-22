import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { Download, Calendar, Filter } from 'lucide-react';

const Reports = () => {
  const { transactions, categories } = useFinance();
  const [reportType, setReportType] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const getDateRange = () => {
    const now = new Date();
    switch (reportType) {
      case 'weekly':
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case 'monthly':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'yearly':
        return { start: startOfYear(now), end: endOfYear(now) };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const { start, end } = getDateRange();

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const inDateRange = transactionDate >= start && transactionDate <= end;
    const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    
    return inDateRange && matchesCategory && matchesType;
  });

  const summary = {
    totalIncome: filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    transactionCount: filteredTransactions.length
  };

  const categoryBreakdown = categories.map(category => {
    const categoryTransactions = filteredTransactions.filter(
      t => t.category === category && t.type === 'expense'
    );
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    return { category, total, count: categoryTransactions.length };
  }).filter(item => item.total > 0);

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(transaction => [
        format(new Date(transaction.date), 'yyyy-MM-dd'),
        `"${transaction.description}"`,
        transaction.category,
        transaction.type,
        transaction.amount.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <button
          onClick={exportToCSV}
          className="btn-primary flex items-center space-x-2"
        >
          <Download className="h-5 w-5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Period
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="h-4 w-4 inline mr-1" />
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-500">
              <div>{format(start, 'MMM dd')} - {format(end, 'MMM dd, yyyy')}</div>
              <div>{filteredTransactions.length} transactions</div>
            </div>
          </div>
        </div>
      </div>

     {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">${summary.totalIncome.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">${summary.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Net Amount</h3>
          <p className={`text-3xl font-bold ${
            summary.totalIncome - summary.totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${(summary.totalIncome - summary.totalExpenses).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown by Category</h3>
        <div className="space-y-4">
          {categoryBreakdown.map(item => {
            const percentage = summary.totalExpenses > 0 ? (item.total / summary.totalExpenses) * 100 : 0;
            return (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{item.category}</span>
                    <span className="text-sm text-gray-500">{item.count} transactions</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-lg font-semibold text-gray-900">${item.total.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Transaction List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;