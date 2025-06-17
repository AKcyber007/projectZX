import React, { useState } from 'react';
import { useContracts } from '../contexts/ContractContext';
import ContractCard from '../components/ContractCard';
import ContractProgressBar from '../components/ContractProgressBar';
import SplitReserveModal from '../components/SplitReserveModal';
import { Search, Filter, SlidersHorizontal, Crown, Calendar, Users, Plus, CheckCircle, XCircle, Clock, Package, ShoppingBag, ShoppingCart, AlertCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const ContractMarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const { isPremium, user } = useUser();
  const { contracts, updateContract, reserveContract, hasUserReserved, getUserReservation, cancelReservation } = useContracts();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [reservingContract, setReservingContract] = useState<string | null>(null);

  // Current user identifier - in a real app, this would come from authentication
  const currentUserId = 'current_user';
  const currentUserName = user.name || 'You';

  const filters = [
    { id: 'all', label: 'All Contracts', count: contracts.length },
    { id: 'Sell', label: 'Selling', count: contracts.filter(c => c.contract_type === 'Sell').length },
    { id: 'Buy', label: 'Buying', count: contracts.filter(c => c.contract_type === 'Buy').length },
    { id: 'Service', label: 'Services', count: contracts.filter(c => c.contract_type === 'Service').length },
    { id: 'Future', label: 'Future', count: contracts.filter(c => c.contract_type === 'Future').length, premium: true },
    { id: 'split', label: 'Split Contracts', count: contracts.filter(c => c.allow_partial_purchases).length }
  ];

  const filteredContracts = contracts.filter(contract => {
    const matchesFilter = activeFilter === 'all' || 
                         contract.contract_type === activeFilter ||
                         (activeFilter === 'split' && contract.allow_partial_purchases);
    const matchesSearch = contract.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (contract.gst_hsn_code && contract.gst_hsn_code.includes(searchTerm));
    
    // Hide future contracts for non-premium users
    if (contract.contract_type === 'Future' && !isPremium) {
      return false;
    }
    
    return matchesFilter && matchesSearch;
  });

  // Helper function to check if current user is the contract owner
  const isOwnContract = (contract: any) => {
    return contract.posted_by === currentUserName || contract.posted_by === 'You';
  };

  // Helper function to get the appropriate action button text
  const getActionButtonText = (contract: any) => {
    if (contract.contract_type === 'Future' || contract.allow_partial_purchases) {
      return 'Reserve Contract';
    }
    if (contract.contract_type === 'Sell') {
      return 'Buy Now';
    }
    if (contract.contract_type === 'Buy') {
      return 'Sell to Buyer';
    }
    if (contract.contract_type === 'Service') {
      return 'Apply for Service';
    }
    return 'Reserve Contract';
  };

  // Helper function to get contract type tag
  const getContractTypeTag = (contract: any) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    switch (contract.contract_type) {
      case 'Sell':
        return {
          text: 'Selling',
          className: `${baseClasses} bg-green-100 text-green-800`,
          icon: ShoppingBag
        };
      case 'Buy':
        return {
          text: 'Buying',
          className: `${baseClasses} bg-blue-100 text-blue-800`,
          icon: ShoppingCart
        };
      case 'Service':
        return {
          text: 'Service',
          className: `${baseClasses} bg-purple-100 text-purple-800`,
          icon: Package
        };
      case 'Future':
        return {
          text: 'Future',
          className: `${baseClasses} bg-orange-100 text-orange-800`,
          icon: Calendar
        };
      default:
        return {
          text: contract.contract_type,
          className: `${baseClasses} bg-gray-100 text-gray-800`,
          icon: Package
        };
    }
  };

  const handleReserveContract = async (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return;

    // Prevent self-reservation
    if (isOwnContract(contract)) {
      return;
    }

    // Check premium requirement for future contracts
    if (contract.contract_type === 'Future' && !isPremium) {
      navigate('/subscription');
      return;
    }

    setReservingContract(contractId);
    
    try {
      await reserveContract(contractId, contract.qty, {
        name: currentUserName,
        company: user.company
      }, isPremium); // Pass isPremium to determine payment logic

      // Navigate to contract accounting to see the generated invoice
      setTimeout(() => {
        navigate('/contract-accounting/invoices');
      }, 2000);
    } catch (error) {
      console.error('Failed to reserve contract:', error);
    } finally {
      setReservingContract(null);
    }
  };

  const handleSplitReserve = (contract: any) => {
    // Prevent self-reservation
    if (isOwnContract(contract)) {
      return;
    }

    if (!isPremium) {
      navigate('/subscription');
      return;
    }

    // Convert contract to expected format for modal
    const modalContract = {
      id: contract.id,
      title: contract.item_name,
      price: contract.rate,
      quantity: contract.qty || 0,
      reservedQuantity: contract.reserved_quantity || 0,
      minSplitQuantity: contract.min_split_quantity || 100,
      pricePerUnit: contract.rate_per_unit || (contract.qty ? contract.rate / contract.qty : 0)
    };
    
    setSelectedContract(modalContract);
    setShowSplitModal(true);
  };

  const handleSplitReservation = async (quantity: number) => {
    if (!selectedContract) return;
    
    setReservingContract(selectedContract.id);
    
    try {
      await reserveContract(selectedContract.id, quantity, {
        name: currentUserName,
        company: user.company
      }, isPremium); // Pass isPremium to determine payment logic

      // Update the contract with new reservation
      updateContract(selectedContract.id, {
        reserved_quantity: (selectedContract.reservedQuantity || 0) + quantity,
        participant_count: (selectedContract.participantCount || 0) + 1
      });

      // Navigate to contract accounting to see the generated invoice
      setTimeout(() => {
        navigate('/contract-accounting/invoices');
      }, 2000);
    } catch (error) {
      console.error('Failed to reserve contract:', error);
    } finally {
      setReservingContract(null);
    }
  };

  const handleCancelReservation = (contractId: string) => {
    cancelReservation(contractId);
  };

  // Helper function to show reservation amount only for future contracts
  const getReservationDisplay = (contract: any, userReservation: any) => {
    if (!userReservation) return null;
    
    // Only show reservation amount for future contracts
    if (contract.contract_type === 'Future' && userReservation.reservation_amount > 0) {
      return (
        <div>
          <span className="text-purple-600">Advance Paid:</span>
          <div className="font-medium">₹{userReservation.reservation_amount.toLocaleString()}</div>
        </div>
      );
    }
    
    // For regular contracts, show full amount or payment status
    return (
      <div>
        <span className="text-purple-600">Payment:</span>
        <div className="font-medium">Pay on Completion</div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contract Marketplace</h1>
          <p className="text-gray-600 mt-2">Discover and engage with contract opportunities</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={() => navigate('/post-contract')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post Contract</span>
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Advanced Filters</span>
          </button>
        </div>
      </div>

      {/* Premium Notice for Future Contracts */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Crown className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Unlock Future Contracts & Split Reservations
              </h3>
              <p className="text-yellow-700 mb-3">
                Premium members can access future contracts and participate in split contract reservations with 20% upfront payment. 
                Secure your supply chain months in advance and share large contracts with other buyers!
              </p>
              <button 
                onClick={() => navigate('/subscription')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Logic Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Payment Logic Update
            </h3>
            <div className="text-blue-700 space-y-2">
              <p><strong>✅ 20% Advance Payment:</strong> Only for Premium users reserving Future contracts</p>
              <p><strong>💰 Regular Contracts:</strong> Full payment on completion (no upfront charges)</p>
              <p><strong>🔄 Split Contracts:</strong> Premium feature with flexible payment terms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search contracts, HSN codes, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                disabled={filter.premium && !isPremium}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 whitespace-nowrap ${
                  activeFilter === filter.id
                    ? 'bg-white text-primary-600 shadow-sm'
                    : filter.premium && !isPremium
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{filter.label}</span>
                {filter.premium && (
                  <Crown className="w-3 h-3 text-yellow-500" />
                )}
                {filter.id === 'split' && (
                  <Users className="w-3 h-3 text-blue-500" />
                )}
                <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                  {filter.premium && !isPremium ? 0 : filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredContracts.length} Contracts Available
            </h2>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                <option>Sort by: Latest</option>
                <option>Sort by: Rate (High to Low)</option>
                <option>Sort by: Rate (Low to High)</option>
                <option>Sort by: Quantity</option>
                <option>Sort by: Availability Date</option>
                <option>Sort by: Participation Level</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredContracts.length > 0 ? (
            <div className="space-y-6">
              {filteredContracts.map((contract) => {
                const userReservation = getUserReservation(contract.id);
                const hasReserved = hasUserReserved(contract.id);
                const canViewInvoice = hasReserved && contract.invoice_generated && userReservation?.invoice_id;
                const isOwn = isOwnContract(contract);
                const contractTypeTag = getContractTypeTag(contract);
                const actionButtonText = getActionButtonText(contract);

                return (
                  <div key={contract.id} className="relative">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      {/* Contract Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{contract.item_name}</h3>
                            <div className="flex items-center space-x-1">
                              {/* Contract Type Tag */}
                              <div className={`flex items-center space-x-1 ${contractTypeTag.className}`}>
                                <contractTypeTag.icon className="w-3 h-3" />
                                <span>{contractTypeTag.text}</span>
                              </div>

                              {contract.allow_partial_purchases && (
                                <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                  <Users className="w-3 h-3" />
                                  <span>Split</span>
                                </div>
                              )}
                              {contract.posted_date === 'Just now' && (
                                <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Posted Just Now
                                </div>
                              )}
                              {hasReserved && (
                                <div className="flex items-center space-x-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>You Reserved</span>
                                </div>
                              )}
                              {isOwn && (
                                <div className="flex items-center space-x-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                  <Package className="w-3 h-3" />
                                  <span>Your Contract</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Type: {contract.contract_type}</span>
                            {contract.gst_hsn_code && <span>HSN: {contract.gst_hsn_code}</span>}
                            {contract.qty && <span>Qty: {contract.qty.toLocaleString()}</span>}
                            <span className="font-semibold text-gray-900">₹{contract.rate.toLocaleString()}</span>
                            {contract.rate_per_unit && (
                              <span className="text-xs text-gray-500">(₹{contract.rate_per_unit}/unit)</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>Customer: {contract.customer}</span>
                            <span>Posted: {contract.posted_date}</span>
                          </div>
                        </div>
                      </div>

                      {/* User Reservation Details */}
                      {hasReserved && userReservation && (
                        <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-purple-800 mb-1">Your Reservation</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-purple-700">
                                <div>
                                  <span className="text-purple-600">Quantity:</span>
                                  <div className="font-medium">{userReservation.quantity.toLocaleString()}</div>
                                </div>
                                {getReservationDisplay(contract, userReservation)}
                                <div>
                                  <span className="text-purple-600">Reserved On:</span>
                                  <div className="font-medium">{userReservation.reservation_date}</div>
                                </div>
                                <div>
                                  <span className="text-purple-600">Status:</span>
                                  <div className={`font-medium ${userReservation.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                    {userReservation.status === 'active' ? 'Active' : 'Cancelled'}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {userReservation.status === 'active' && (
                              <button
                                onClick={() => handleCancelReservation(contract.id)}
                                className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 border border-red-200 rounded"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Split Contract Progress */}
                      {contract.allow_partial_purchases && (
                        <div className="mb-4">
                          <ContractProgressBar
                            totalQuantity={contract.qty || 0}
                            reservedQuantity={contract.reserved_quantity || 0}
                            participantCount={contract.participant_count || 0}
                          />
                        </div>
                      )}

                      {/* Contract Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {/* Basic availability info only - no internal status tags */}
                          {contract.contract_type === 'Future' && contract.availability_date && (
                            <div className="flex items-center space-x-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                              <Calendar className="w-3 h-3" />
                              <span>Available: {contract.availability_date}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {/* Self-Contract Warning */}
                          {isOwn && !hasReserved && (
                            <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                              <AlertCircle className="w-4 h-4" />
                              <span>You can't buy your own contract</span>
                            </div>
                          )}

                          {/* Action Buttons - Only show if not own contract */}
                          {!isOwn && !hasReserved && (
                            contract.allow_partial_purchases ? (
                              <button
                                onClick={() => handleSplitReserve(contract)}
                                disabled={!isPremium || (contract.reserved_quantity || 0) >= (contract.qty || 0) || reservingContract === contract.id}
                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                  reservingContract === contract.id
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : isPremium && (contract.reserved_quantity || 0) < (contract.qty || 0)
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                {reservingContract === contract.id ? 'Reserving...' : actionButtonText}
                              </button>
                            ) : contract.contract_type === 'Future' ? (
                              <button
                                onClick={() => handleReserveContract(contract.id)}
                                disabled={!isPremium || reservingContract === contract.id}
                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                  reservingContract === contract.id
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : isPremium
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                {reservingContract === contract.id ? 'Processing...' : actionButtonText}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReserveContract(contract.id)}
                                disabled={reservingContract === contract.id}
                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                  reservingContract === contract.id
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : contract.contract_type === 'Sell'
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : contract.contract_type === 'Buy'
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                                }`}
                              >
                                {reservingContract === contract.id ? 'Processing...' : actionButtonText}
                              </button>
                            )
                          )}

                          {/* Show status for reserved contracts */}
                          {!isOwn && hasReserved && (
                            <div className="flex items-center space-x-1 text-xs text-green-600">
                              <CheckCircle className="w-3 h-3" />
                              <span>Reserved</span>
                            </div>
                          )}

                          {/* View Invoice Button - Only show if user has reserved and invoice exists */}
                          {canViewInvoice && (
                            <button
                              onClick={() => navigate('/contract-accounting/invoices')}
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium transition-colors"
                            >
                              View Invoice
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Future Contract Details */}
                      {contract.contract_type === 'Future' && contract.availability_date && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="text-xs text-gray-600">
                            Available: {contract.availability_date}
                            {hasReserved && userReservation && userReservation.reservation_amount > 0 && (
                              <span> • Reserved for: ₹{userReservation.reservation_amount.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
              <button
                onClick={() => navigate('/post-contract')}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Post Your First Contract</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Split Reserve Modal - Only render when both conditions are met */}
      {showSplitModal && selectedContract && (
        <SplitReserveModal
          isOpen={showSplitModal}
          onClose={() => setShowSplitModal(false)}
          contract={selectedContract}
          onReserve={handleSplitReservation}
        />
      )}
    </div>
  );
};

export default ContractMarketplacePage;