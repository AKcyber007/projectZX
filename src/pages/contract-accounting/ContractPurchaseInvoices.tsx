import React, { useState } from 'react';
import { useContractAccounting } from '../../contexts/ContractAccountingContext';
import { useUser } from '../../contexts/UserContext';
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
  AlertTriangle,
  Clock,
  DollarSign,
  User,
  Truck,
  Package,
  CreditCard
} from 'lucide-react';

const ContractPurchaseInvoices: React.FC = () => {
  const { contractInvoices, verifyExecution, showToast } = useContractAccounting();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [processingPayments, setProcessingPayments] = useState<Set<string>>(new Set());
  const [completingContracts, setCompletingContracts] = useState<Set<string>>(new Set());

  // Use authenticated user's company name from UserContext
  const currentUser = user.company;

  // Filter invoices where current user is the buyer
  const purchaseInvoices = contractInvoices.filter(invoice => 
    invoice.buyer === currentUser || invoice.buyer === 'You'
  );

  const filteredInvoices = purchaseInvoices.filter(invoice => {
    const matchesSearch = invoice.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.contract_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.seller.toLowerCase().includes(searchTerm.toLowerCase());
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

  const getDeliveryStatusColor = (status: string, buyerVerified: boolean, sellerVerified: boolean) => {
    if (buyerVerified && sellerVerified) {
      return 'bg-green-100 text-green-800';
    }
    if (status === 'Final') {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getDeliveryStatusText = (status: string, buyerVerified: boolean, sellerVerified: boolean) => {
    if (buyerVerified && sellerVerified) {
      return 'Completed';
    }
    if (status === 'Final') {
      return 'Ready for Delivery';
    }
    if (status === 'Draft') {
      return 'Preparing';
    }
    return 'Pending';
  };

  const handleMakePayment = async (invoiceId: string) => {
    const invoice = contractInvoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    setProcessingPayments(prev => new Set(prev).add(invoiceId));
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast(`Payment of ₹${invoice.remaining_amount.toLocaleString()} processed successfully!`, 'success');
    } catch (error) {
      showToast('Payment processing failed. Please try again.', 'error');
    } finally {
      setProcessingPayments(prev => {
        const newSet = new Set(prev);
        newSet.delete(invoiceId);
        return newSet;
      });
    }
  };

  const handleMarkCompleted = async (invoiceId: string) => {
    setCompletingContracts(prev => new Set(prev).add(invoiceId));
    
    try {
      // Simulate completion processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mark buyer as verified and update status to Final
      verifyExecution(invoiceId, 'buyer');
      
      showToast('Contract marked as completed. Seller has been notified for verification.', 'success');
    } catch (error) {
      showToast('Failed to mark contract as completed. Please try again.', 'error');
    } finally {
      setCompletingContracts(prev => {
        const newSet = new Set(prev);
        newSet.delete(invoiceId);
        return newSet;
      });
    }
  };

  const getRemainingPayment = (invoice: any) => {
    return invoice.total_amount - invoice.reservation_amount;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Invoices</h1>
          <p className="text-gray-600">Manage invoices where you are the buyer</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Reserve Contract</span>
        </button>
      </div>

      {/* Purchase Invoice Flow Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Purchase Invoice Flow (You as Buyer)</h3>
        <div className="flex items-center space-x-4 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-700">Draft</span>
            <span className="text-gray-500">(You reserved)</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-gray-700">Final</span>
            <span className="text-gray-500">(You complete)</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-gray-700">Verified</span>
            <span className="text-gray-500">(Seller confirms)</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-3 h-3 text-green-600" />
            <span className="text-gray-700">Payment Complete</span>
          </div>
        </div>
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Package className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <strong>As a Buyer:</strong> You drive the contract lifecycle. Make payments, confirm delivery receipt, and mark contracts as completed. 
              Future contracts require 20% upfront payment, while regular contracts are paid on completion.
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
                placeholder="Search purchase invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{filteredInvoices.length}</div>
          <div className="text-sm text-gray-600">Purchase Invoices</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">
            ₹{filteredInvoices.reduce((sum, inv) => sum + inv.total_amount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Purchase Value</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {filteredInvoices.filter(inv => inv.buyer_verified && inv.seller_verified).length}
          </div>
          <div className="text-sm text-gray-600">Completed Purchases</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">
            ₹{filteredInvoices.reduce((sum, inv) => sum + getRemainingPayment(inv), 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Payment Due</div>
        </div>
      </div>

      {/* Purchase Invoices Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract & Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount & Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => {
                const remainingPayment = getRemainingPayment(invoice);
                
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{invoice.invoice_no}</div>
                          <div className="text-xs text-gray-500">{invoice.created_date}</div>
                          {invoice.is_future_contract && (
                            <div className="text-xs text-orange-600 font-medium">Future Contract</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{invoice.contract_title}</div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span>Seller: {invoice.seller}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{invoice.total_amount.toLocaleString()}</div>
                      {invoice.reservation_amount > 0 ? (
                        <div className="text-xs space-y-1">
                          <div className="text-green-600">Paid: ₹{invoice.reservation_amount.toLocaleString()}</div>
                          <div className="text-red-600">Due: ₹{remainingPayment.toLocaleString()}</div>
                        </div>
                      ) : (
                        <div className="text-xs text-red-600">
                          Due: ₹{invoice.total_amount.toLocaleString()}
                        </div>
                      )}
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
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {invoice.buyer_verified ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <XCircle className="w-3 h-3 text-red-500" />
                            )}
                            <span className="text-xs text-gray-600">You</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {invoice.seller_verified ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <XCircle className="w-3 h-3 text-red-500" />
                            )}
                            <span className="text-xs text-gray-600">Seller</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {/* Draft Status Actions */}
                        {invoice.status === 'Draft' && (
                          <>
                            <button
                              onClick={() => handleMakePayment(invoice.id)}
                              disabled={processingPayments.has(invoice.id)}
                              className={`flex items-center space-x-1 text-xs px-2 py-1 rounded transition-colors ${
                                processingPayments.has(invoice.id)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              }`}
                            >
                              {processingPayments.has(invoice.id) ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                  <span>Processing...</span>
                                </>
                              ) : (
                                <>
                                  <CreditCard className="w-3 h-3" />
                                  <span>Make Payment</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleMarkCompleted(invoice.id)}
                              disabled={completingContracts.has(invoice.id)}
                              className={`flex items-center space-x-1 text-xs px-2 py-1 rounded transition-colors ${
                                completingContracts.has(invoice.id)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              {completingContracts.has(invoice.id) ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                  <span>Completing...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Mark Completed</span>
                                </>
                              )}
                            </button>
                          </>
                        )}

                        {/* Final Status - Waiting for Seller */}
                        {invoice.status === 'Final' && !invoice.seller_verified && (
                          <div className="flex items-center space-x-1 text-orange-600 text-xs bg-orange-50 px-2 py-1 rounded">
                            <Clock className="w-3 h-3" />
                            <span>Awaiting Seller Verification</span>
                          </div>
                        )}

                        {/* Verified Status */}
                        {invoice.status === 'Verified' && (
                          <div className="flex items-center space-x-1 text-green-600 text-xs bg-green-50 px-2 py-1 rounded">
                            <CheckCircle className="w-3 h-3" />
                            <span>Contract Completed</span>
                          </div>
                        )}

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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No purchase invoices found</h3>
            <p className="text-gray-600 mb-4">Purchase invoices will appear here when you reserve contracts</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Browse Marketplace
            </button>
          </div>
        )}
      </div>

      {/* Buyer Actions Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Buyer Action Required</h4>
            <p className="text-sm text-yellow-700 mt-1">
              As a buyer, you drive the contract lifecycle. Make payments and mark contracts as completed after delivery. 
              For future contracts, you've already paid 20% upfront. Remaining payment is due upon completion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractPurchaseInvoices;