import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import SpendingChart from '../components/Charts/SpendingChart';
import MonthlyChart from '../components/Charts/MonthlyChart';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const Analytics = () => {
  const { transactions, getMonthlyData, getSpendingByCategory } = useFinance();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  // Generate monthly data for chart
  const generateMonthlyData = () => {
    const months = selectedPeriod === '6months' ? 6 : 12;
    const data = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthData = getMonthlyData(date);
      data.push({
        month: format(date, 'MMM'),
        income: monthData.income,
        expenses: monthData.expenses,
        net: monthData.income - monthData.expenses
      });
    }

    return data;
  };

  const monthlyChartData = generateMonthlyData();
  const spendingData = getSpendingByCategory();
  const currentMonthData = getMonthlyData();

  // Calculate insights
  const totalIncome = monthlyChartData.reduce((sum, month) => sum + month.income, 0);
  const totalExpenses = monthlyChartData.reduce((sum, month) => sum + month.expenses, 0);
  const avgMonthlyIncome = totalIncome / monthlyChartData.length;
  const avgMonthlyExpenses = totalExpenses / monthlyChartData.length;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const topSpendingCategory = spendingData.reduce((max, category) => 
    category.amount > (max?.amount || 0) ? category : max, null
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="6months">Last 6 Months</option>
          <option value="12months">Last 12 Months</option>
        </select>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Monthly Income</p>
              <p className="mt-1 text-2xl font-semibold text-green-600">
                ${avgMonthlyIncome.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Monthly Expenses</p>
              <p className="mt-1 text-2xl font-semibold text-red-600">
                ${avgMonthlyExpenses.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Savings Rate</p>
              <p className="mt-1 text-2xl font-semibold text-primary-600">
                {savingsRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Top Spending</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {topSpendingCategory?.category || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                ${topSpendingCategory?.amount.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyChart data={monthlyChartData} />
        <SpendingChart data={spendingData} />
      </div>

      {/* Detailed Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Spending Patterns</h4>
            <div className="space-y-2">
              {spendingData.slice(0, 5).map((category, index) => (
                <div key={category.category} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{category.category}</span>
                  <span className="text-sm font-medium">${category.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Monthly Trends</h4>
            <div className="space-y-2">
              {monthlyChartData.slice(-3).map((month) => (
                <div key={month.month} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{month.month}</span>
                  <span className={`text-sm font-medium ${
                    month.net >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {month.net >= 0 ? '+' : ''}${month.net.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;