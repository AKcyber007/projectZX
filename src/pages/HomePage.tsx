import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContracts } from '../contexts/ContractContext';
import StatCard from '../components/StatCard';
import ContractCard from '../components/ContractCard';
import { 
  FileText, 
  DollarSign, 
  Award, 
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  ShoppingCart,
  ArrowRight,
  Receipt
} from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { contracts } = useContracts();

  // Calculate stats from actual contracts using Frappe fields
  const activeContracts = contracts.filter(c => c.docstatus === 0).length;
  const totalValue = contracts.reduce((sum, c) => sum + c.rate, 0);
  const syncedContracts = contracts.filter(c => c.sync_status === 'Synced').length;
  const recentContracts = contracts.slice(0, 3);

  const stats = [
    {
      title: 'Active Contracts',
      value: activeContracts,
      icon: <FileText className="w-6 h-6 text-primary-600" />,
      change: '+12% from last month',
      changeType: 'positive' as const
    },
    {
      title: 'Total Value',
      value: `₹${(totalValue / 100000).toFixed(1)}L`,
      icon: <DollarSign className="w-6 h-6 text-primary-600" />,
      change: '+18% from last month',
      changeType: 'positive' as const
    },
    {
      title: 'Contract Accounting',
      value: syncedContracts,
      icon: <CheckCircle className="w-6 h-6 text-primary-600" />,
      change: `${syncedContracts}/${contracts.length} processed`,
      changeType: 'positive' as const
    },
    {
      title: 'Success Rate',
      value: '94%',
      icon: <TrendingUp className="w-6 h-6 text-primary-600" />,
      change: '+2% improvement',
      changeType: 'positive' as const
    }
  ];

  const pendingActions = [
    { title: 'Contracts pending verification', count: contracts.filter(c => c.sync_status === 'Not Synced').length, icon: Clock },
    { title: 'Draft contracts to submit', count: contracts.filter(c => c.docstatus === 0).length, icon: DollarSign },
    { title: 'Future contracts to review', count: contracts.filter(c => c.contract_type === 'Future').length, icon: FileText },
    { title: 'Contract invoices ready', count: contracts.filter(c => c.sync_status === 'Synced').length, icon: CheckCircle }
  ];

  const handlePostContract = () => {
    navigate('/post-contract');
  };

  const handleBrowseMarketplace = () => {
    navigate('/marketplace');
  };

  const handleOpenContractAccounting = () => {
    navigate('/contract-accounting/dashboard');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your contract management overview.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={handlePostContract}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post Contract</span>
          </button>
          <button
            onClick={handleBrowseMarketplace}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Browse Marketplace</span>
          </button>
        </div>
      </div>

      {/* Contract Accounting Integration Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-800 mb-2">
              Contract Accounting Module Active
            </h3>
            <p className="text-purple-700 mb-3">
              Your platform now features a specialized <strong>Contract Accounting</strong> module for contract-specific financial flows with verification and ERP sync capabilities.
            </p>
            <div className="flex items-center space-x-6 text-sm text-purple-600">
              <span>✓ Contract invoice generation</span>
              <span>✓ Buyer/Seller verification flow</span>
              <span>✓ ERP sync capabilities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` } as any}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div 
          onClick={handlePostContract}
          className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-sm text-white p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Post New Contract</h3>
              <p className="text-primary-100">Create contract opportunities</p>
            </div>
            <Plus className="w-8 h-8 text-primary-200" />
          </div>
          <div className="flex items-center text-primary-100">
            <span className="text-sm">Ready for accounting integration</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </div>

        <div 
          onClick={handleBrowseMarketplace}
          className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-sm text-white p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Browse Marketplace</h3>
              <p className="text-secondary-100">Find and reserve contracts</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-secondary-200" />
          </div>
          <div className="flex items-center text-secondary-100">
            <span className="text-sm">{contracts.length} contracts available</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </div>

        <div 
          onClick={handleOpenContractAccounting}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm text-white p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Contract Accounting</h3>
              <p className="text-purple-100">Financial flows & verification</p>
            </div>
            <Receipt className="w-8 h-8 text-purple-200" />
          </div>
          <div className="flex items-center text-purple-100">
            <span className="text-sm">Verification & ERP sync</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Contracts */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Recent Contracts</h2>
                  <p className="text-sm text-gray-600 mt-1">Latest contract opportunities</p>
                </div>
                <button
                  onClick={handleBrowseMarketplace}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {recentContracts.length > 0 ? (
                recentContracts.map((contract) => (
                  <ContractCard 
                    key={contract.id} 
                    {...contract}
                    onClick={() => navigate('/marketplace')}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No contracts yet</p>
                  <button
                    onClick={handlePostContract}
                    className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Post your first contract
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pending Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Pending Actions</h2>
              <p className="text-sm text-gray-600 mt-1">Contract accounting tasks</p>
            </div>
            <div className="p-6 space-y-4">
              {pendingActions.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <action.icon className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium text-gray-900">{action.title}</span>
                  </div>
                  <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {action.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contract Accounting Module Status */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm text-white p-6">
            <h3 className="text-lg font-semibold mb-4">Contract Accounting</h3>
            <div className="space-y-3">
              <button
                onClick={handleOpenContractAccounting}
                className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 text-left transition-colors"
              >
                <div className="font-medium">Financial Management</div>
                <div className="text-sm opacity-90">Contract verification & ERP sync →</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;