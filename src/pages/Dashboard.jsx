import React from 'react';
import { useFinance } from '../context/FinanceContext';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import SpendingChart from '../components/Charts/SpendingChart';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const Dashboard = () => {
  const { transactions, getMonthlyData, getSpendingByCategory } = useFinance();
  const monthlyData = getMonthlyData();
  const spendingData = getSpendingByCategory();

  const totalBalance = monthlyData.income - monthlyData.expenses;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Balance"
          value={`$${totalBalance.toFixed(2)}`}
          icon={Wallet}
          color={totalBalance >= 0 ? 'green' : 'red'}
        />
        <StatsCard
          title="Monthly Income"
          value={`$${monthlyData.income.toFixed(2)}`}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Monthly Expenses"
          value={`$${monthlyData.expenses.toFixed(2)}`}
          icon={TrendingDown}
          color="red"
        />
        <StatsCard
          title="Transactions"
          value={monthlyData.transactions.length}
          icon={DollarSign}
          color="primary"
        />
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart data={spendingData} />
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  );
};

export default Dashboard;