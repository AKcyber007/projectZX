import React, { useState } from 'react';
import { useContractAccounting } from '../../contexts/ContractAccountingContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  MoreHorizontal, 
  FileText,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertTriangle,
  Lock,
  Clock
} from 'lucide-react';

const ContractInvoices: React.FC = () => {
  const { contractInvoices, verifyExecution, syncToERP } = useContractAccounting();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [syncingInvoices, setSyncingInvoices] = useState<Set<string>>(new Set());

  const filteredInvoices = contractInvoices.filter(invoice => {
    const matchesSearch = invoice.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.contract_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.buyer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-800';
      case 'Final': return 'bg-blue-100 text-blue-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'Fully Paid': return 'bg-green-100 text-green-800';
      case 'Advance Paid': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSyncStatusColor = (syncStatus: string) => {
    switch (syncStatus) {
      case 'Synced': return 'bg-green-100 text-green-800';
      case 'Sync Failed': return 'bg-red-100 text-red-800';
      case 'Not Synced': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVerifyExecution = (invoiceId: string, role: 'buyer' | 'seller') => {
    verifyExecution(invoiceId, role);
  };

  const handleSyncToERP = async (invoiceId: string) => {
    const invoice = contractInvoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    // Check if invoice meets sync requirements
    if (!canSyncToFrappe(invoice)) {
      return;
    }

    setSyncingInvoices(prev => new Set(prev).add(invoiceId));
    await syncToERP(invoiceId);
    setSyncingInvoices(prev => {
      const newSet = new Set(prev);
      newSet.delete(invoiceId);
      return newSet;
    });
  };

  // Helper function to determine if invoice can sync to Frappe
  const canSyncToFrappe = (invoice: any): boolean => {
    return invoice.status === 'Verified' && 
           invoice.payment_status === 'Fully Paid' && 
           invoice.buyer_verified && 
           invoice.seller_verified;
  };

  const getSyncButtonState = (invoice: any) => {
    if (!canSyncToFrappe(invoice)) {
      return {
        disabled: true,
        text: 'Sync Locked',
        icon: Lock,
        tooltip: 'Invoice must be verified by both parties and fully paid before syncing to Frappe Books',
        className: 'bg-gray-300 text-gray-500 cursor-not-allowed'
      };
    }
    
    if (invoice.sync_status === 'Synced') {
      return {
        disabled: true,
        text: 'Synced',
        icon: CheckCircle,
        tooltip: 'Already synced to Frappe Books',
        className: 'bg-green-100 text-green-800 cursor-not-allowed'
      };
    }

    if (syncingInvoices.has(invoice.id)) {
      return {
        disabled: true,
        text: 'Syncing...',
        icon: RefreshCw,
        tooltip: 'Sync in progress',
        className: 'bg-blue-300 text-blue-700 cursor-not-allowed'
      };
    }

    if (invoice.sync_status === 'Sync Failed') {
      return {
        disabled: false,
        text: 'Retry Sync',
        icon: RefreshCw,
        tooltip: 'Previous sync failed. Click to retry syncing to Frappe Books',
        className: 'bg-red-600 hover:bg-red-700 text-white'
      };
    }

    return {
      disabled: false,
      text: 'Sync to Frappe',
      icon: RefreshCw,
      tooltip: 'Sync verified invoice to Frappe Books',
      className: 'bg-purple-600 hover:bg-purple-700 text-white'
    };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contract Invoices</h1>
          <p className="text-gray-600">Manage invoices generated from contract reservations</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Status Flow Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Invoice Status Flow & Frappe Sync Requirements</h3>
        <div className="flex items-center space-x-4 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-700">Draft</span>
            <span className="text-gray-500">(Reservation made)</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-gray-700">Final</span>
            <span className="text-gray-500">(Ready for delivery)</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-gray-700">Verified</span>
            <span className="text-gray-500">(Both parties verified)</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-3 h-3 text-purple-600" />
            <span className="text-gray-700">Frappe Sync</span>
            <span className="text-gray-500">(ERP integration)</span>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Lock className="w-4 h-4 text-purple-600 mt-0.5" />
            <div className="text-sm text-purple-700">
              <strong>Frappe Sync Requirements:</strong> Invoices can only be synced after they are <strong>Verified</strong> by both buyer and seller, 
              and payment is <strong>Fully Paid</strong>. This ensures data integrity and prevents premature ERP integration.
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Final">Final</option>
              <option value="Verified">Verified</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{contractInvoices.length}</div>
          <div className="text-sm text-gray-600">Total Invoices</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            ₹{contractInvoices.reduce((sum, inv) => sum + inv.total_amount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Value</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">
            {contractInvoices.filter(inv => inv.status === 'Verified').length}
          </div>
          <div className="text-sm text-gray-600">Verified</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">
            {contractInvoices.filter(inv => inv.sync_status === 'Synced').length}
          </div>
          <div className="text-sm text-gray-600">Synced to Frappe</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {contractInvoices.filter(inv => canSyncToFrappe(inv) && inv.sync_status !== 'Synced').length}
          </div>
          <div className="text-sm text-gray-600">Ready to Sync</div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parties
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => {
                const syncButton = getSyncButtonState(invoice);
                
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{invoice.invoice_no}</div>
                          <div className="text-xs text-gray-500">{invoice.created_date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{invoice.contract_title}</div>
                      <div className="text-xs text-gray-500">ID: {invoice.contract_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div>Buyer: {invoice.buyer}</div>
                        <div>Seller: {invoice.seller}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{invoice.total_amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        Advance: ₹{invoice.reservation_amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(invoice.payment_status)}`}>
                            {invoice.payment_status}
                          </span>
                        </div>
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSyncStatusColor(invoice.sync_status)}`}>
                            {invoice.sync_status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {invoice.buyer_verified ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-xs text-gray-600">Buyer</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {invoice.seller_verified ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-xs text-gray-600">Seller</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {/* Verification Buttons */}
                        {invoice.status === 'Final' && !invoice.buyer_verified && (
                          <button
                            onClick={() => handleVerifyExecution(invoice.id, 'buyer')}
                            className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded"
                          >
                            Verify as Buyer
                          </button>
                        )}
                        {invoice.status === 'Final' && !invoice.seller_verified && (
                          <button
                            onClick={() => handleVerifyExecution(invoice.id, 'seller')}
                            className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded"
                          >
                            Verify as Seller
                          </button>
                        )}

                        {/* Sync Button - Only show if requirements are met or already synced/failed */}
                        <div className="relative group">
                          <button
                            onClick={() => handleSyncToERP(invoice.id)}
                            disabled={syncButton.disabled}
                            className={`flex items-center space-x-1 text-xs px-2 py-1 rounded transition-colors ${syncButton.className}`}
                            title={syncButton.tooltip}
                          >
                            {syncButton.text === 'Syncing...' ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                            ) : (
                              <syncButton.icon className="w-3 h-3" />
                            )}
                            <span>{syncButton.text}</span>
                          </button>
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                            {syncButton.tooltip}
                          </div>
                        </div>

                        <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-600 mb-4">Contract invoices will appear here when contracts are reserved</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Create Invoice
            </button>
          </div>
        )}
      </div>

      {/* Sync Requirements Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Frappe Books Sync Requirements</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Invoices can only be synced to Frappe Books after they are <strong>Verified</strong> by both buyer and seller, 
              and payment is <strong>Fully Paid</strong>. This ensures data integrity and prevents premature ERP integration.
            </p>
            <div className="mt-2 text-xs text-yellow-600">
              <strong>Sync Status Legend:</strong>
              <span className="ml-2">🔒 Locked (Requirements not met)</span>
              <span className="ml-2">✅ Synced (Successfully synced)</span>
              <span className="ml-2">🔄 Ready (Can sync now)</span>
              <span className="ml-2">❌ Failed (Retry available)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractInvoices;