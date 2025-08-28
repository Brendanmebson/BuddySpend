import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  PieChart, 
  CreditCard, 
  Target,
  BarChart3 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home, color: 'blue' },
  { name: 'Transactions', href: '/transactions', icon: CreditCard, color: 'green' },
  { name: 'Budgets', href: '/budgets', icon: Target, color: 'purple' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, color: 'yellow' },
  { name: 'Reports', href: '/reports', icon: TrendingUp, color: 'pink' },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-sm h-full">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? `bg-${item.color}-50 text-${item.color}-600 border-r-2 border-${item.color}-600`
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
