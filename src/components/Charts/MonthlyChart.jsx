import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MonthlyChart = ({ data }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Overview</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Bar dataKey="income" fill="#10b981" name="Income" />
          <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyChart;