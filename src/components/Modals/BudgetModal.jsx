import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const BudgetModal = ({ isOpen, onClose }) => {
  const { addBudget, categories } = useFinance();
  const [formData, setFormData] = useState({
    category: '',
    limit: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addBudget({
      ...formData,
      limit: parseFloat(formData.limit)
    });
    setFormData({ category: '', limit: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Budget</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget Limit</label>
            <input
              type="number"
              step="0.01"
              value={formData.limit}
              onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              Add Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;