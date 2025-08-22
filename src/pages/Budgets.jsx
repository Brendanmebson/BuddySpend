import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import BudgetModal from '../components/Modals/BudgetModal';
import { Plus, Target, AlertTriangle, CheckCircle } from 'lucide-react';

const Budgets = () => {
  const { budgets, deleteBudget } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getBudgetStatus = (budget) => {
    const percentage = (budget.spent / budget.limit) * 100;
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'warning';
    return 'good';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'exceeded': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'exceeded': return AlertTriangle;
      case 'warning': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Budget</span>
        </button>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const status = getBudgetStatus(budget);
          const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
          const StatusIcon = getStatusIcon(status);

          return (
            <div key={budget.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Target className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{budget.category}</h3>
                </div>
                <div className={`p-2 rounded-full ${getStatusColor(status)}`}>
                  <StatusIcon className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Spent</span>
                  <span className="font-medium">${budget.spent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Budget</span>
                  <span className="font-medium">${budget.limit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Remaining</span>
                  <span className={`font-medium ${
                    budget.limit - budget.spent < 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    ${Math.max(0, budget.limit - budget.spent).toFixed(2)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      status === 'exceeded' 
                        ? 'bg-red-500' 
                        : status === 'warning' 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-center text-sm text-gray-500">
                  {percentage.toFixed(1)}% used
                </div>

                <button
                  onClick={() => deleteBudget(budget.id)}
                  className="w-full mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Delete Budget
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets yet</h3>
          <p className="text-gray-500 mb-4">Create your first budget to start tracking your spending limits.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            Add Your First Budget
          </button>
        </div>
      )}

      <BudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Budgets;