import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  FileText, 
  CreditCard,
  Users,
  CheckCircle,
  Settings,
  RefreshCw,
  TrendingUp,
  ShoppingBag,
  ShoppingCart
} from 'lucide-react';

const ContractAccountingSidebar: React.FC = () => {
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/contract-accounting/dashboard',
      icon: BarChart3,
      current: location.pathname === '/contract-accounting/dashboard'
    },
    {
      name: 'Purchase Invoices',
      href: '/contract-accounting/purchase-invoices',
      icon: ShoppingCart,
      current: location.pathname === '/contract-accounting/purchase-invoices',
      description: 'You as buyer'
    },
    {
      name: 'Sales Invoices',
      href: '/contract-accounting/sales-invoices',
      icon: ShoppingBag,
      current: location.pathname === '/contract-accounting/sales-invoices',
      description: 'You as seller'
    },
    {
      name: 'Payments',
      href: '/contract-accounting/payments',
      icon: CreditCard,
      current: location.pathname === '/contract-accounting/payments'
    },
    {
      name: 'Parties',
      href: '/contract-accounting/parties',
      icon: Users,
      current: location.pathname === '/contract-accounting/parties'
    },
    {
      name: 'Verification',
      href: '/contract-accounting/verification',
      icon: CheckCircle,
      current: location.pathname === '/contract-accounting/verification'
    },
    {
      name: 'ERP Sync',
      href: '/contract-accounting/sync',
      icon: RefreshCw,
      current: location.pathname === '/contract-accounting/sync'
    },
    {
      name: 'Reports',
      href: '/contract-accounting/reports',
      icon: TrendingUp,
      current: location.pathname === '/contract-accounting/reports'
    },
    {
      name: 'Settings',
      href: '/contract-accounting/settings',
      icon: Settings,
      current: location.pathname === '/contract-accounting/settings'
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Contract Accounting</h2>
        <p className="text-sm text-gray-600">Financial Management for Contracts</p>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex flex-col px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <div className="flex items-center">
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </div>
            {item.description && (
              <span className="text-xs text-gray-500 ml-8 mt-1">{item.description}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default ContractAccountingSidebar;