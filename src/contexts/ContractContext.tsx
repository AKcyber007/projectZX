import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Contract {
  id: string;
  item_name: string;
  contract_type: 'Sell' | 'Buy' | 'Service' | 'Future';
  gst_hsn_code?: string;
  qty?: number;
  rate: number;
  customer: string;
  posted_date: string;
  docstatus: 0 | 1 | 2; // 0: Draft, 1: Submitted, 2: Cancelled
  sync_status: 'Not Synced' | 'Synced' | 'Sync Failed';
  description?: string;
  location?: string;
  delivery_date?: string;
  availability_date?: string;
  terms?: string;
  allow_partial_purchases?: boolean;
  min_split_quantity?: number;
  reserved_quantity?: number;
  participant_count?: number;
  rate_per_unit?: number;
  participants?: any[];
  reservation_status?: string;
  reservation_amount?: number;
  is_participant?: boolean;
  my_quantity?: number;
  total_quantity?: number;
  total_reserved?: number;
  total_participants?: number;
  reservation_date?: string;
  posted_by: string;
  // New fields for accounting integration
  invoice_generated?: boolean;
  invoice_id?: string;
  execution_status?: 'pending' | 'ready_for_delivery' | 'delivered' | 'completed';
  buyer_verified?: boolean;
  seller_verified?: boolean;
  // User-specific reservation tracking
  user_reservations?: {
    [userId: string]: {
      quantity: number;
      reservation_date: string;
      invoice_id: string;
      status: 'active' | 'cancelled';
      reservation_amount: number;
    };
  };
}

interface ContractContextType {
  contracts: Contract[];
  addContract: (contract: Omit<Contract, 'id' | 'posted_by' | 'posted_date' | 'docstatus' | 'sync_status'>) => void;
  updateContract: (id: string, updates: Partial<Contract>) => void;
  getContractById: (id: string) => Contract | undefined;
  syncToFrappeBooks: (id: string) => Promise<void>;
  reserveContract: (contractId: string, quantity?: number, buyerInfo?: any) => Promise<string>; // Returns invoice ID
  markContractReadyForDelivery: (contractId: string) => void;
  verifyContractExecution: (contractId: string, role: 'buyer' | 'seller') => void;
  cancelReservation: (contractId: string, userId?: string) => void;
  getUserReservation: (contractId: string, userId?: string) => any;
  hasUserReserved: (contractId: string, userId?: string) => boolean;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  toast: { message: string; type: string; show: boolean } | null;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const useContracts = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContracts must be used within a ContractProvider');
  }
  return context;
};

interface ContractProviderProps {
  children: ReactNode;
}

export const ContractProvider: React.FC<ContractProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: string; show: boolean } | null>(null);

  // Initialize with sample contracts using Frappe Books field structure
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: '1',
      item_name: 'Premium Steel Sheets - Industrial Grade',
      contract_type: 'Sell',
      gst_hsn_code: '7208.51',
      qty: 2000,
      rate: 150000,
      customer: 'MetalWorks Industries',
      posted_by: 'Steel Corp Ltd',
      posted_date: '2 hours ago',
      docstatus: 1,
      sync_status: 'Synced',
      allow_partial_purchases: false,
      description: 'High-grade steel sheets suitable for industrial applications',
      location: 'Mumbai, Maharashtra',
      execution_status: 'completed',
      buyer_verified: true,
      seller_verified: true,
      invoice_generated: true,
      invoice_id: '1',
      user_reservations: {
        'current_user': {
          quantity: 2000,
          reservation_date: '2025-01-15',
          invoice_id: '1',
          status: 'active',
          reservation_amount: 30000
        }
      }
    },
    {
      id: '2',
      item_name: 'Bulk Aluminum Rods - Split Contract',
      contract_type: 'Sell',
      gst_hsn_code: '7604.10',
      qty: 5000,
      rate: 400000,
      customer: 'Alpha Metals Corp',
      posted_by: 'Aluminum Solutions',
      posted_date: '4 hours ago',
      docstatus: 1,
      sync_status: 'Synced',
      allow_partial_purchases: true,
      min_split_quantity: 500,
      reserved_quantity: 1500,
      participant_count: 3,
      rate_per_unit: 80,
      description: 'Premium aluminum rods for construction and manufacturing',
      location: 'Delhi, NCR',
      execution_status: 'ready_for_delivery',
      buyer_verified: true,
      seller_verified: false,
      invoice_generated: true,
      invoice_id: '2',
      user_reservations: {
        'current_user': {
          quantity: 1500,
          reservation_date: '2025-01-14',
          invoice_id: '2',
          status: 'active',
          reservation_amount: 24000
        }
      }
    },
    {
      id: '3',
      item_name: 'Electronic Circuit Boards - Bulk Purchase',
      contract_type: 'Buy',
      gst_hsn_code: '8534.00',
      qty: 1500,
      rate: 120000,
      customer: 'TechnoElectronics Ltd',
      posted_by: 'TechnoElectronics Ltd',
      posted_date: '6 hours ago',
      docstatus: 0,
      sync_status: 'Sync Failed',
      allow_partial_purchases: false,
      description: 'Looking for high-quality electronic circuit boards',
      location: 'Bangalore, Karnataka',
      execution_status: 'pending'
    },
    {
      id: '4',
      item_name: 'Future Delivery: Premium Cotton - Split Available',
      contract_type: 'Future',
      gst_hsn_code: '5201.00',
      qty: 8000,
      rate: 640000,
      customer: 'Textile Mills Ltd',
      posted_by: 'AgriCorp Industries',
      posted_date: '1 day ago',
      docstatus: 1,
      sync_status: 'Synced',
      availability_date: '2025-03-20',
      reservation_amount: 128000,
      allow_partial_purchases: true,
      min_split_quantity: 1000,
      reserved_quantity: 3000,
      participant_count: 2,
      rate_per_unit: 80,
      description: 'Premium quality cotton for textile manufacturing',
      location: 'Gujarat, India',
      execution_status: 'pending',
      buyer_verified: false,
      seller_verified: false,
      invoice_generated: true,
      invoice_id: '3'
    },
    {
      id: '5',
      item_name: 'Warehouse Storage Solutions - Delhi NCR',
      contract_type: 'Service',
      rate: 28000,
      customer: 'StorageMax Solutions',
      posted_by: 'StorageMax Solutions',
      posted_date: '8 hours ago',
      docstatus: 0,
      sync_status: 'Not Synced',
      allow_partial_purchases: false,
      description: 'Professional warehouse storage and logistics services',
      location: 'Delhi, NCR',
      execution_status: 'pending'
    }
  ]);

  const addContract = (contractData: Omit<Contract, 'id' | 'posted_by' | 'posted_date' | 'docstatus' | 'sync_status'>) => {
    const newContract: Contract = {
      ...contractData,
      id: `contract_${Date.now()}`,
      posted_by: 'You',
      posted_date: 'Just now',
      docstatus: 0, // Draft by default
      sync_status: 'Not Synced',
      rate_per_unit: contractData.qty ? contractData.rate / contractData.qty : undefined,
      reserved_quantity: 0,
      participant_count: 0,
      execution_status: 'pending',
      buyer_verified: false,
      seller_verified: false,
      invoice_generated: false,
      user_reservations: {}
    };

    setContracts(prev => [newContract, ...prev]);
    showToast('Contract posted successfully! Ready for reservations.', 'success');
  };

  const updateContract = (id: string, updates: Partial<Contract>) => {
    setContracts(prev => prev.map(contract => 
      contract.id === id ? { ...contract, ...updates } : contract
    ));
  };

  const getContractById = (id: string) => {
    return contracts.find(contract => contract.id === id);
  };

  const getUserReservation = (contractId: string, userId: string = 'current_user') => {
    const contract = getContractById(contractId);
    return contract?.user_reservations?.[userId];
  };

  const hasUserReserved = (contractId: string, userId: string = 'current_user') => {
    const reservation = getUserReservation(contractId, userId);
    return reservation && reservation.status === 'active';
  };

  const reserveContract = async (contractId: string, quantity?: number, buyerInfo?: any): Promise<string> => {
    const contract = getContractById(contractId);
    if (!contract) throw new Error('Contract not found');

    const userId = 'current_user'; // In real app, get from auth context
    const reservationQuantity = quantity || contract.qty || 0;
    const ratePerUnit = contract.rate_per_unit || (contract.qty ? contract.rate / contract.qty : contract.rate);
    const totalValue = reservationQuantity * ratePerUnit;
    const reservationAmount = Math.round(totalValue * 0.2);

    // Generate invoice ID
    const invoiceId = `ci_${Date.now()}`;
    
    // Update contract with reservation info
    const existingReservations = contract.user_reservations || {};
    const newReservation = {
      quantity: reservationQuantity,
      reservation_date: new Date().toISOString().split('T')[0],
      invoice_id: invoiceId,
      status: 'active' as const,
      reservation_amount: reservationAmount
    };

    updateContract(contractId, {
      reserved_quantity: (contract.reserved_quantity || 0) + reservationQuantity,
      participant_count: (contract.participant_count || 0) + 1,
      invoice_generated: true,
      invoice_id: invoiceId,
      execution_status: 'pending',
      user_reservations: {
        ...existingReservations,
        [userId]: newReservation
      }
    });

    // Trigger invoice creation in Contract Accounting
    const event = new CustomEvent('contractReserved', {
      detail: {
        contractId,
        invoiceId,
        contract,
        quantity: reservationQuantity,
        buyerInfo: buyerInfo || { name: 'John Doe', company: 'Your Company Ltd' }
      }
    });
    window.dispatchEvent(event);

    showToast('Contract reserved successfully! Invoice generated.', 'success');
    return invoiceId;
  };

  const cancelReservation = (contractId: string, userId: string = 'current_user') => {
    const contract = getContractById(contractId);
    if (!contract || !contract.user_reservations?.[userId]) return;

    const reservation = contract.user_reservations[userId];
    const updatedReservations = {
      ...contract.user_reservations,
      [userId]: {
        ...reservation,
        status: 'cancelled' as const
      }
    };

    updateContract(contractId, {
      reserved_quantity: Math.max(0, (contract.reserved_quantity || 0) - reservation.quantity),
      participant_count: Math.max(0, (contract.participant_count || 0) - 1),
      user_reservations: updatedReservations
    });

    showToast('Reservation cancelled. Advance payment forfeited.', 'info');
  };

  const markContractReadyForDelivery = (contractId: string) => {
    const contract = getContractById(contractId);
    if (!contract) return;

    updateContract(contractId, {
      execution_status: 'ready_for_delivery'
    });

    // Trigger invoice status update in Contract Accounting
    const event = new CustomEvent('contractReadyForDelivery', {
      detail: { contractId, invoiceId: contract.invoice_id }
    });
    window.dispatchEvent(event);

    showToast('Contract marked as ready for delivery. Invoice status updated.', 'success');
  };

  const verifyContractExecution = (contractId: string, role: 'buyer' | 'seller') => {
    const contract = getContractById(contractId);
    if (!contract) return;

    const updates: Partial<Contract> = {
      [role === 'buyer' ? 'buyer_verified' : 'seller_verified']: true
    };

    // Check if both parties will be verified after this update
    const willBeFullyVerified = role === 'buyer' 
      ? contract.seller_verified && true
      : contract.buyer_verified && true;

    if (willBeFullyVerified) {
      updates.execution_status = 'completed';
    }

    updateContract(contractId, updates);

    // Trigger verification update in Contract Accounting
    const event = new CustomEvent('contractVerified', {
      detail: { 
        contractId, 
        invoiceId: contract.invoice_id, 
        role, 
        fullyVerified: willBeFullyVerified 
      }
    });
    window.dispatchEvent(event);

    showToast(`Contract execution verified by ${role}. ${willBeFullyVerified ? 'Contract completed!' : ''}`, 'success');
  };

  const syncToFrappeBooks = async (id: string) => {
    const contract = getContractById(id);
    if (!contract) return;

    // Update sync status to indicate syncing
    updateContract(id, { sync_status: 'Not Synced' });
    
    try {
      // Simulate API call to Frappe Books
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        updateContract(id, { 
          sync_status: 'Synced',
          docstatus: 1 // Mark as submitted in Frappe
        });
        showToast(`Contract "${contract.item_name}" synced successfully with Frappe Books!`, 'success');
      } else {
        updateContract(id, { sync_status: 'Sync Failed' });
        showToast(`Failed to sync "${contract.item_name}" with Frappe Books. Please try again.`, 'error');
      }
    } catch (error) {
      updateContract(id, { sync_status: 'Sync Failed' });
      showToast('Sync failed due to network error. Please try again.', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <ContractContext.Provider value={{
      contracts,
      addContract,
      updateContract,
      getContractById,
      syncToFrappeBooks,
      reserveContract,
      markContractReadyForDelivery,
      verifyContractExecution,
      cancelReservation,
      getUserReservation,
      hasUserReserved,
      showToast,
      toast
    }}>
      {children}
    </ContractContext.Provider>
  );
};