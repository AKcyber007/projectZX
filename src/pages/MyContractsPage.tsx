import React, { useState } from 'react';
import ContractCard from '../components/ContractCard';
import ContractProgressBar from '../components/ContractProgressBar';
import ParticipantList from '../components/ParticipantList';
import { Filter, Download, MoreHorizontal, Calendar, Crown, AlertCircle, Users, ChevronDown, ChevronUp, RefreshCw, CheckCircle, XCircle, Truck, Package } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useContracts } from '../contexts/ContractContext';

const MyContractsPage: React.FC = () => {
  const { isPremium } = useUser();
  const { contracts, syncToFrappeBooks, markContractReadyForDelivery, verifyContractExecution } = useContracts();
  const [activeTab, setActiveTab] = useState('all');
  const [expandedContracts, setExpandedContracts] = useState<Set<string>>(new Set());
  const [syncingContracts, setSyncingContracts] = useState<Set<string>>(new Set());

  const tabs = [
    { id: 'all', label: 'All Contracts', count: contracts.length },
    { id: 'posted', label: 'Posted', count: contracts.filter(c => c.posted_by === 'You' && !c.is_participant).length },
    { id: 'accepted', label: 'Accepted', count: contracts.filter(c => c.docstatus === 1).length },
    { id: 'reserved', label: 'Reserved', count: contracts.filter(c => c.reservation_status === 'reserved' || c.is_participant).length, premium: true },
    { id: 'split', label: 'Split Participation', count: contracts.filter(c => c.allow_partial_purchases).length },
    { id: 'draft', label: 'Draft', count: contracts.filter(c => c.docstatus === 0).length },
    { id: 'synced', label: 'Synced', count: contracts.filter(c => c.sync_status === 'Synced').length }
  ];

  const myContracts = contracts.map(contract => ({
    ...contract,
    // Convert to legacy format for compatibility
    title: contract.item_name,
    type: contract.contract_type.toLowerCase() as 'sell' | 'buy' | 'service' | 'future',
    hsnCode: contract.gst_hsn_code,
    quantity: contract.qty,
    price: contract.rate,
    postedBy: contract.posted_by,
    postedDate: contract.posted_date,
    status: contract.docstatus === 0 ? 'active' as const : 
            contract.docstatus === 1 ? 'pending' as const : 
            'completed' as const,
    allowPartialPurchases: contract.allow_partial_purchases,
    minSplitQuantity: contract.min_split_quantity,
    reservedQuantity: contract.reserved_quantity,
    participantCount: contract.participant_count,
    pricePerUnit: contract.rate_per_unit,
    availabilityDate: contract.availability_date,
    reservationAmount: contract.reservation_amount,
    reservationDate: contract.reservation_date,
    isParticipant: contract.is_participant,
    myQuantity: contract.my_quantity,
    totalQuantity: contract.total_quantity,
    totalReserved: contract.total_reserved,
    totalParticipants: contract.total_participants,
    participants: contract.participants || []
  }));

  const filteredContracts = myContracts.filter(contract => {
    if (activeTab === 'all') return true;
    if (activeTab === 'posted') return contract.postedBy === 'You' && !contract.isParticipant;
    if (activeTab === 'accepted') return contract.docstatus === 1;
    if (activeTab === 'reserved') return contract.reservation_status === 'reserved' || contract.isParticipant;
    if (activeTab === 'split') return contract.allowPartialPurchases;
    if (activeTab === 'draft') return contract.docstatus === 0;
    if (activeTab === 'synced') return contract.sync_status === 'Synced';
    return true;
  });

  const handleCancelReservation = (contractId: string) => {
    console.log('Cancelling reservation for contract:', contractId);
    // In a real app, this would handle the cancellation process
  };

  const toggleContractExpansion = (contractId: string) => {
    setExpandedContracts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contractId)) {
        newSet.delete(contractId);
      } else {
        newSet.add(contractId);
      }
      return newSet;
    });
  };

  const handleSyncToFrappe = async (contractId: string) => {
    setSyncingContracts(prev => new Set(prev).add(contractId));
    await syncToFrappeBooks(contractId);
    setSyncingContracts(prev => {
      const newSet = new Set(prev);
      newSet.delete(contractId);
      return newSet;
    });
  };

  const handleMarkReadyForDelivery = (contractId: string) => {
    markContractReadyForDelivery(contractId);
  };

  const handleVerifyExecution = (contractId: string, role: 'buyer' | 'seller') => {
    verifyContractExecution(contractId, role);
  };

  const getDocStatusColor = (docstatus: number) => {
    switch (docstatus) {
      case 0: return 'bg-yellow-100 text-yellow-800'; // Draft
      case 1: return 'bg-green-100 text-green-800';   // Submitted
      case 2: return 'bg-red-100 text-red-800';       // Cancelled
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocStatusText = (docstatus: number) => {
    switch (docstatus) {
      case 0: return 'Draft';
      case 1: return 'Submitted';
      case 2: return 'Cancelled';
      default: return 'Unknown';
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

  const getSyncStatusIcon = (syncStatus: string) => {
    switch (syncStatus) {
      case 'Synced': return CheckCircle;
      case 'Sync Failed': return XCircle;
      default: return RefreshCw;
    }
  };

  const getExecutionStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ready_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExecutionStatusText = (status?: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'ready_for_delivery': return 'Ready for Delivery';
      case 'delivered': return 'Delivered';
      default: return 'Pending';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Contracts</h1>
          <p className="text-gray-600 mt-2">Manage all your contracts with integrated accounting</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            New Contract
          </button>
        </div>
      </div>

      {/* Contract Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{contracts.length}</div>
          <div className="text-sm text-gray-600">Total Contracts</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">₹{contracts.reduce((sum, c) => sum + c.rate, 0).toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Value</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">{contracts.filter(c => c.invoice_generated).length}</div>
          <div className="text-sm text-gray-600">Invoices Generated</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{contracts.filter(c => c.buyer_verified && c.seller_verified).length}</div>
          <div className="text-sm text-gray-600">Verified Contracts</div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  disabled={tab.premium && !isPremium}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-primary-600 shadow-sm'
                      : tab.premium && !isPremium
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.premium && (
                    <Crown className="w-3 h-3 text-yellow-500" />
                  )}
                  {tab.id === 'split' && (
                    <Users className="w-3 h-3 text-blue-500" />
                  )}
                  <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                    {tab.premium && !isPremium ? 0 : tab.count}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                <option>Sort by: Latest</option>
                <option>Sort by: Value</option>
                <option>Sort by: Execution Status</option>
                <option>Sort by: Verification Status</option>
                <option>Sort by: Availability Date</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredContracts.length > 0 ? (
            <div className="space-y-6">
              {filteredContracts.map((contract) => (
                <div key={contract.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-white p-6">
                    {/* Contract Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{contract.item_name}</h3>
                          <div className="flex items-center space-x-1">
                            {contract.contract_type === 'Future' && (
                              <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                <Calendar className="w-3 h-3" />
                                <span>Future</span>
                              </div>
                            )}
                            {contract.allow_partial_purchases && (
                              <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                <Users className="w-3 h-3" />
                                <span>Split</span>
                              </div>
                            )}
                            {contract.isParticipant && (
                              <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                                Participant
                              </div>
                            )}
                            {contract.invoice_generated && (
                              <div className="flex items-center space-x-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                                <CheckCircle className="w-3 h-3" />
                                <span>Invoice Generated</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Type: {contract.contract_type}</span>
                          {contract.gst_hsn_code && <span>HSN: {contract.gst_hsn_code}</span>}
                          {contract.isParticipant ? (
                            <>
                              <span>My Qty: {contract.myQuantity?.toLocaleString()}</span>
                              <span>Total: {contract.totalQuantity?.toLocaleString()}</span>
                            </>
                          ) : (
                            contract.qty && <span>Qty: {contract.qty.toLocaleString()}</span>
                          )}
                          <span className="font-semibold text-gray-900">₹{contract.rate.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>Customer: {contract.customer}</span>
                          <span>Posted: {contract.posted_date}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {contract.allowPartialPurchases && (contract.participants || contract.isParticipant) && (
                          <button
                            onClick={() => toggleContractExpansion(contract.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          >
                            {expandedContracts.has(contract.id) ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Status Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {/* Doc Status */}
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDocStatusColor(contract.docstatus)}`}>
                          {getDocStatusText(contract.docstatus)}
                        </div>
                        
                        {/* Sync Status */}
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getSyncStatusColor(contract.sync_status)}`}>
                          {React.createElement(getSyncStatusIcon(contract.sync_status), { className: "w-3 h-3" })}
                          <span>{contract.sync_status}</span>
                        </div>

                        {/* Execution Status */}
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getExecutionStatusColor(contract.execution_status)}`}>
                          {getExecutionStatusText(contract.execution_status)}
                        </div>

                        {/* Verification Status */}
                        {contract.invoice_generated && (
                          <div className="flex items-center space-x-1">
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                              contract.buyer_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {contract.buyer_verified ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              <span>Buyer</span>
                            </div>
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                              contract.seller_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {contract.seller_verified ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              <span>Seller</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        {/* Seller Actions */}
                        {contract.posted_by === 'You' && contract.execution_status === 'pending' && (
                          <button
                            onClick={() => handleMarkReadyForDelivery(contract.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                          >
                            <Truck className="w-3 h-3" />
                            <span>Mark Ready</span>
                          </button>
                        )}

                        {/* Verification Actions */}
                        {contract.invoice_generated && contract.execution_status === 'ready_for_delivery' && (
                          <>
                            {!contract.buyer_verified && (
                              <button
                                onClick={() => handleVerifyExecution(contract.id, 'buyer')}
                                className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors"
                              >
                                <CheckCircle className="w-3 h-3" />
                                <span>Verify as Buyer</span>
                              </button>
                            )}
                            {!contract.seller_verified && (
                              <button
                                onClick={() => handleVerifyExecution(contract.id, 'seller')}
                                className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors"
                              >
                                <CheckCircle className="w-3 h-3" />
                                <span>Verify as Seller</span>
                              </button>
                            )}
                          </>
                        )}

                        {/* Sync to Frappe Button */}
                        {contract.sync_status !== 'Synced' && (
                          <button
                            onClick={() => handleSyncToFrappe(contract.id)}
                            disabled={syncingContracts.has(contract.id)}
                            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                              syncingContracts.has(contract.id)
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {syncingContracts.has(contract.id) ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                <span>Syncing...</span>
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-3 h-3" />
                                <span>Sync to Frappe</span>
                              </>
                            )}
                          </button>
                        )}

                        {/* View Invoice Button */}
                        {contract.invoice_generated && (
                          <button
                            onClick={() => window.open('/contract-accounting/invoices', '_blank')}
                            className="flex items-center space-x-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors"
                          >
                            <Package className="w-3 h-3" />
                            <span>View Invoice</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Split Contract Progress */}
                    {contract.allowPartialPurchases && !contract.isParticipant && (
                      <div className="mb-4">
                        <ContractProgressBar
                          totalQuantity={contract.qty || 0}
                          reservedQuantity={contract.reservedQuantity || 0}
                          participantCount={contract.participantCount || 0}
                        />
                      </div>
                    )}

                    {/* Participant Progress */}
                    {contract.isParticipant && contract.totalQuantity && (
                      <div className="mb-4">
                        <ContractProgressBar
                          totalQuantity={contract.totalQuantity}
                          reservedQuantity={contract.totalReserved || 0}
                          participantCount={contract.totalParticipants || 0}
                        />
                      </div>
                    )}

                    {/* Future Contract Details */}
                    {contract.contract_type === 'Future' && (
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Availability Date</div>
                            <div className="font-medium text-gray-900">{contract.availability_date}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Reservation Status</div>
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              contract.reservation_status === 'reserved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {contract.reservation_status === 'reserved' ? 'Reserved' : 'Available'}
                            </div>
                          </div>
                          {contract.reservationAmount && (
                            <div>
                              <div className="text-xs text-gray-600 mb-1">Reserved Amount (20%)</div>
                              <div className="font-medium text-gray-900">₹{contract.reservationAmount.toLocaleString()}</div>
                            </div>
                          )}
                        </div>
                        
                        {contract.reservation_status === 'reserved' && contract.reservationDate && (
                          <div className="mt-3 pt-3 border-t border-blue-200">
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-600">
                                Reserved on: {contract.reservationDate}
                              </div>
                              <button
                                onClick={() => handleCancelReservation(contract.id)}
                                className="text-xs text-red-600 hover:text-red-700 font-medium"
                              >
                                Cancel Reservation
                              </button>
                            </div>
                            <div className="mt-2 flex items-start space-x-2">
                              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                              <p className="text-xs text-amber-700">
                                Cancelling will forfeit the ₹{contract.reservationAmount?.toLocaleString()} reservation amount
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Participant Details for Split Contracts */}
                    {contract.isParticipant && contract.reservationAmount && (
                      <div className="bg-purple-50 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">My Quantity</div>
                            <div className="font-medium text-gray-900">{contract.myQuantity?.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">My Reservation</div>
                            <div className="font-medium text-purple-600">₹{contract.reservationAmount.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Reserved On</div>
                            <div className="font-medium text-gray-900">{contract.reservationDate}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Contract Accounting Integration Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Item Name</div>
                          <div className="font-medium text-gray-900">{contract.item_name}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">GST HSN Code</div>
                          <div className="font-medium text-gray-900">{contract.gst_hsn_code || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Customer</div>
                          <div className="font-medium text-gray-900">{contract.customer}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Rate</div>
                          <div className="font-medium text-gray-900">₹{contract.rate.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Participant List */}
                  {expandedContracts.has(contract.id) && contract.participants && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <ParticipantList
                        participants={contract.participants}
                        pricePerUnit={contract.pricePerUnit || 0}
                        isOwner={contract.postedBy === 'You'}
                        className="m-4"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Filter className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts found</h3>
              <p className="text-gray-600">No contracts match the selected criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyContractsPage;