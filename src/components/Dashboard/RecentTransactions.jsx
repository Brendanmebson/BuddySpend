import React from 'react';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const RecentTransactions = ({ transactions }) => {
  const recent = transactions.slice(0, 5);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
      
      <div className="space-y-3">
        {recent.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
              </div>
              
              <div>
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.category}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(transaction.date), 'MMM dd')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;