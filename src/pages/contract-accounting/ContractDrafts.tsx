import React, { useState } from 'react';
import { useContractAccounting } from '../../contexts/ContractAccountingContext';
import { useUser } from '../../contexts/UserContext';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MoreHorizontal, 
  FileText,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  Package,
  AlertTriangle,
  CreditCard,
  Truck
} from 'lucide-react';

const ContractDrafts: React.FC = () => {
  const { contractInvoices, updateInvoiceStatus, showToast } = useContractAccounting();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [processingPayments, setProcessingPayments] = useState<Set<string>>(new Set());
  const [completingContracts, setCompletingContracts] = useState<Set<string>>(new Set());

  // Use authenticated user's company name from UserContext
  const currentUser = user.company;

  // Filter draft invoices only
  const draftInvoices = contractInvoices.filter(invoice => 
    invoice.status === 'Draft'
  );

  const filteredInvoices = draftInvoices.filter(invoice => {
    const matchesSearch = invoice.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.contract_title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || 
                       (roleFilter === 'buyer' && (invoice.buyer === currentUser || invoice.buyer === 'You')) ||
                       (roleFilter === 'seller' && (invoice.seller === currentUser || invoice.seller === 'You'));
    
    return matchesSearch && matchesRole;
  });

  // Separate invoices by role
  const buyerInvoices = filteredInvoices.filter(invoice => 
    invoice.buyer === currentUser || invoice.buyer === 'You'
  );
  
  const sellerInvoices = filteredInvoices.filter(invoice => 
    invoice.seller === currentUser || invoice.seller === 'You'
  );

  const handleMakePayment = async (invoiceId: string) => {
    const invoice = contractInvoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    setProcessingPayments(prev => new Set(prev).add(invoiceId));
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment status to fully paid
      // In real app, this would update the payment records
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
      
      // Update invoice status to Final and set buyer_verified = true
      updateInvoiceStatus(invoiceId, 'Final');
      
      // Trigger notification for seller
      const invoice = contractInvoices.find(inv => inv.id === invoiceId);
      if (invoice) {
        showToast(`Contract "${invoice.contract_title}" marked as completed. Seller has been notified.`, 'success');
      }
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

  const getUserRole = (invoice: any) => {
    if (invoice.buyer === currentUser || invoice.buyer === 'You') return 'buyer';
    if (invoice.seller === currentUser || invoice.seller === 'You') return 'seller';
    return 'unknown';
  };

  const getActionableInvoices = () => {
    return filteredInvoices.filter(invoice => getUserRole(invoice) === 'buyer');
  };

  const getWaitingInvoices = () => {
    return filteredInvoices.filter(invoice => getUserRole(invoice) === 'seller');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Draft Contracts</h1>
          <p className="text-gray-600">Manage reserved contracts awaiting completion</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Draft Contract Flow Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Draft Contract Lifecycle</h3>
        <div className="flex items-center space-x-4 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-700">Draft</span>
            <span className="text-gray-500">(Reserved)</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-gray-700">Final</span>
            <span className="text-gray-500">(Buyer completes)</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-gray-700">Verified</span>
            <span className="text-gray-500">(Seller confirms)</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center space-x-2">
            <Package className="w-3 h-3 text-purple-600" />
            <span className="text-gray-700">Synced</span>
          </div>
        </div>
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <strong>Role-Based Flow:</strong> Buyers drive the contract lifecycle by making payments and marking completion. 
              Sellers can only verify after buyer completion. Both parties must verify before Frappe sync is available.
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
                placeholder="Search draft contracts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="buyer">As Buyer</option>
              <option value="seller">As Seller</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{draftInvoices.length}</div>
          <div className="text-sm text-gray-600">Total Drafts</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{buyerInvoices.length}</div>
          <div className="text-sm text-gray-600">As Buyer (Actionable)</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-orange-600">{sellerInvoices.length}</div>
          <div className="text-sm text-gray-600">As Seller (Waiting)</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            ₹{draftInvoices.reduce((sum, inv) => sum + inv.total_amount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Value</div>
        </div>
      </div>

      {/* Actionable Contracts (As Buyer) */}
      {getActionableInvoices().length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-green-50 border-b border-green-200 px-6 py-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-green-800">Action Required (You as Buyer)</h2>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                {getActionableInvoices().length} contracts
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">Complete payment and mark contracts as finished</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount & Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getActionableInvoices().map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{invoice.invoice_no}</div>
                          <div className="text-sm text-gray-600">{invoice.contract_title}</div>
                          <div className="text-xs text-gray-500">{invoice.created_date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-900">{invoice.seller}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{invoice.total_amount.toLocaleString()}</div>
                      {invoice.reservation_amount > 0 ? (
                        <div className="text-xs space-y-1">
                          <div className="text-green-600">Paid: ₹{invoice.reservation_amount.toLocaleString()}</div>
                          <div className="text-red-600">Due: ₹{invoice.remaining_amount.toLocaleString()}</div>
                        </div>
                      ) : (
                        <div className="text-xs text-red-600">
                          Due: ₹{invoice.total_amount.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {/* Make Payment Button */}
                        <button
                          onClick={() => handleMakePayment(invoice.id)}
                          disabled={processingPayments.has(invoice.id)}
                          className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
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

                        {/* Mark Completed Button */}
                        <button
                          onClick={() => handleMarkCompleted(invoice.id)}
                          disabled={completingContracts.has(invoice.id)}
                          className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
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

                        <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Waiting Contracts (As Seller) */}
      {getWaitingInvoices().length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-orange-50 border-b border-orange-200 px-6 py-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-orange-800">Awaiting Buyer Action (You as Seller)</h2>
              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                {getWaitingInvoices().length} contracts
              </span>
            </div>
            <p className="text-sm text-orange-700 mt-1">Waiting for buyers to complete their contracts</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getWaitingInvoices().map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{invoice.invoice_no}</div>
                          <div className="text-sm text-gray-600">{invoice.contract_title}</div>
                          <div className="text-xs text-gray-500">{invoice.created_date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-900">{invoice.buyer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{invoice.total_amount.toLocaleString()}</div>
                      {invoice.reservation_amount > 0 && (
                        <div className="text-xs text-green-600">
                          Advance: ₹{invoice.reservation_amount.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Awaiting Buyer Action
                        </span>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No draft contracts found</h3>
          <p className="text-gray-600 mb-4">Draft contracts will appear here when contracts are reserved</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Browse Marketplace
          </button>
        </div>
      )}

      {/* Role-Based Instructions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Role-Based Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h5 className="font-medium text-green-700 mb-1">As Buyer:</h5>
            <ul className="space-y-1 text-xs">
              <li>• Make payments for reserved contracts</li>
              <li>• Mark contracts as completed after delivery</li>
              <li>• Drive the contract lifecycle forward</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-orange-700 mb-1">As Seller:</h5>
            <ul className="space-y-1 text-xs">
              <li>• Wait for buyer to complete contract</li>
              <li>• Prepare goods/services for delivery</li>
              <li>• Verify completion after buyer marks done</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDrafts;