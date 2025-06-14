import React, { useState } from 'react';
import { useContractAccounting } from '../../contexts/ContractAccountingContext';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  CheckCircle,
  AlertCircle,
  DollarSign,
  Users,
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ContractAccountingDashboard: React.FC = () => {
  const { getDashboardData, contractInvoices } = useContractAccounting();
  const [dateFilter, setDateFilter] = useState('This Month');
  
  const dashboardData = getDashboardData();

  // Sample cashflow data for contracts
  const contractCashflow = [
    { month: 'Jan', sales: 150000, reservations: 30000 },
    { month: 'Feb', sales: 180000, reservations: 36000 },
    { month: 'Mar', sales: 220000, reservations: 44000 },
    { month: 'Apr', sales: 190000, reservations: 38000 },
    { month: 'May', sales: 250000, reservations: 50000 },
    { month: 'Jun', sales: 280000, reservations: 56000 }
  ];

  const verificationData = [
    { status: 'Verified', count: 8, color: '#10b981' },
    { status: 'Pending Buyer', count: 3, color: '#f59e0b' },
    { status: 'Pending Seller', count: 2, color: '#ef4444' },
    { status: 'Draft', count: 4, color: '#6b7280' }
  ];

  const statCards = [
    {
      title: 'Contract Sales',
      value: `₹${(dashboardData.totalSales / 100000).toFixed(1)}L`,
      change: '+15.2%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'bg-green-500',
      subtitle: `${contractInvoices.length} invoices`
    },
    {
      title: 'Reservations',
      value: `₹${(dashboardData.totalReservations / 100000).toFixed(1)}L`,
      change: '+22.8%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'bg-blue-500',
      subtitle: '20% upfront payments'
    },
    {
      title: 'Verified Contracts',
      value: dashboardData.verifiedContracts,
      change: `${dashboardData.pendingVerifications} pending`,
      changeType: 'neutral' as const,
      icon: CheckCircle,
      color: 'bg-purple-500',
      subtitle: 'Both parties verified'
    },
    {
      title: 'Contract Profit',
      value: `₹${(dashboardData.profit / 100000).toFixed(1)}L`,
      change: '+18.5%',
      changeType: 'positive' as const,
      icon: BarChart3,
      color: 'bg-orange-500',
      subtitle: '15% margin average'
    }
  ];

  const pendingVerifications = contractInvoices.filter(inv => 
    inv.status === 'Final' && (!inv.buyer_verified || !inv.seller_verified)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contract Accounting Dashboard</h1>
          <p className="text-gray-600">Financial overview for contract-based transactions</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
            <option>Last Month</option>
          </select>
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={stat.title} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              {stat.change && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' ? 'bg-green-100 text-green-800' :
                  stat.changeType === 'negative' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {stat.change}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Contract Cashflow Chart */}
        <div className="xl:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Contract Cashflow</h3>
              <p className="text-sm text-gray-600">Sales vs Reservations over time</p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Total Sales</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Reservations</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={contractCashflow}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="reservations" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Verification Status</h3>
            <button className="text-sm text-purple-600 hover:text-purple-700">View All</button>
          </div>
          <div className="space-y-4">
            {verificationData.map((item, index) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">{item.status}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{dashboardData.verifiedContracts}</div>
              <div className="text-sm text-gray-600">Fully Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Verifications */}
      {pendingVerifications.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pending Verifications</h3>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
              {pendingVerifications.length} pending
            </span>
          </div>
          <div className="space-y-3">
            {pendingVerifications.slice(0, 5).map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{invoice.invoice_no}</p>
                  <p className="text-sm text-gray-600">{invoice.contract_title}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span>Buyer: {invoice.buyer}</span>
                    <span>Seller: {invoice.seller}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    {!invoice.buyer_verified && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        Buyer Pending
                      </span>
                    )}
                    {!invoice.seller_verified && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        Seller Pending
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900">₹{invoice.total_amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Sync to ERP</h3>
              <p className="text-purple-100 text-sm">Push verified invoices to ERP system</p>
            </div>
            <RefreshCw className="w-8 h-8 text-purple-200" />
          </div>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Sync {dashboardData.verifiedContracts} Invoices
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Generate Reports</h3>
              <p className="text-green-100 text-sm">Contract performance analytics</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-200" />
          </div>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            View Reports
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Manage Parties</h3>
              <p className="text-blue-100 text-sm">Buyer and seller verification</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            View Parties
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractAccountingDashboard;