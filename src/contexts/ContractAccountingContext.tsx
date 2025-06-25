import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUser } from './UserContext';

export interface ContractInvoice {
  id: string;
  invoice_no: string;
  contract_id: string;
  contract_title: string;
  buyer: string;
  seller: string;
  item_name: string;
  quantity: number;
  rate: number;
  total_amount: number;
  reservation_amount: number;
  remaining_amount: number;
  status: 'Final' | 'Verified' | 'Cancelled';
  created_date: string;
  due_date: string;
  buyer_verified: boolean;
  seller_verified: boolean;
  sync_status: 'Not Synced' | 'Synced' | 'Sync Failed';
  payment_status: 'Pending' | 'Advance Paid' | 'Fully Paid';
  gst_hsn_code?: string;
  can_sync_to_frappe: boolean;
  is_future_contract?: boolean;
}

export interface ContractPayment {
  id: string;
  payment_no: string;
  invoice_id: string;
  contract_id: string;
  amount: number;
  payment_type: 'Advance' | 'Final' | 'Partial';
  payment_date: string;
  payment_method: 'Bank Transfer' | 'UPI' | 'Cash' | 'Cheque';
  status: 'Pending' | 'Completed' | 'Failed';
  verified_by_buyer: boolean;
  verified_by_seller: boolean;
}

export interface ContractParty {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company: string;
  role: 'Buyer' | 'Seller';
  total_contracts: number;
  total_value: number;
  verification_score: number;
  last_activity: string;
  is_verified: boolean;
}

interface ContractAccountingContextType {
  contractInvoices: ContractInvoice[];
  contractPayments: ContractPayment[];
  contractParties: ContractParty[];
  addContractInvoice: (invoice: Omit<ContractInvoice, 'id' | 'invoice_no'>) => string;
  updateInvoiceStatus: (id: string, status: string) => void;
  verifyExecution: (invoiceId: string, role: 'buyer' | 'seller') => void;
  syncToERP: (invoiceId: string) => Promise<void>;
  addPayment: (payment: Omit<ContractPayment, 'id' | 'payment_no'>) => void;
  getDashboardData: () => any;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  toast: { message: string; type: string; show: boolean } | null;
}

const ContractAccountingContext = createContext<ContractAccountingContextType | undefined>(undefined);

export const useContractAccounting = () => {
  const context = useContext(ContractAccountingContext);
  if (context === undefined) {
    throw new Error('useContractAccounting must be used within a ContractAccountingProvider');
  }
  return context;
};

interface ContractAccountingProviderProps {
  children: ReactNode;
}

export const ContractAccountingProvider: React.FC<ContractAccountingProviderProps> = ({ children }) => {
  const { user } = useUser();
  const [toast, setToast] = useState<{ message: string; type: string; show: boolean } | null>(null);

  // Sample contract invoices data - removed Draft status, only Final, Verified, Cancelled
  const [contractInvoices, setContractInvoices] = useState<ContractInvoice[]>([
    {
      id: '1',
      invoice_no: 'CI-2025-001',
      contract_id: '1',
      contract_title: 'Premium Steel Sheets - Industrial Grade',
      buyer: user.company,
      seller: 'Steel Corp Ltd',
      item_name: 'Premium Steel Sheets',
      quantity: 2000,
      rate: 75,
      total_amount: 150000,
      reservation_amount: 0,
      remaining_amount: 150000,
      status: 'Verified',
      created_date: '2025-01-15',
      due_date: '2025-02-15',
      buyer_verified: true,
      seller_verified: true,
      sync_status: 'Synced',
      payment_status: 'Fully Paid',
      gst_hsn_code: '7208.51',
      can_sync_to_frappe: true,
      is_future_contract: false
    },
    {
      id: '2',
      invoice_no: 'CI-2025-002',
      contract_id: '2',
      contract_title: 'Bulk Aluminum Rods - Split Contract',
      buyer: 'Alpha Metals Corp',
      seller: 'Aluminum Solutions',
      item_name: 'Aluminum Rods',
      quantity: 1500,
      rate: 80,
      total_amount: 120000,
      reservation_amount: 0,
      remaining_amount: 120000,
      status: 'Final',
      created_date: '2025-01-14',
      due_date: '2025-02-14',
      buyer_verified: true,
      seller_verified: false,
      sync_status: 'Not Synced',
      payment_status: 'Fully Paid',
      gst_hsn_code: '7604.10',
      can_sync_to_frappe: false,
      is_future_contract: false
    },
    {
      id: '3',
      invoice_no: 'CI-2025-003',
      contract_id: '4',
      contract_title: 'Future Delivery: Premium Cotton',
      buyer: 'Textile Mills Ltd',
      seller: 'AgriCorp Industries',
      item_name: 'Premium Cotton',
      quantity: 3000,
      rate: 80,
      total_amount: 240000,
      reservation_amount: 48000,
      remaining_amount: 192000,
      status: 'Final',
      created_date: '2025-01-13',
      due_date: '2025-03-20',
      buyer_verified: false,
      seller_verified: false,
      sync_status: 'Not Synced',
      payment_status: 'Advance Paid',
      gst_hsn_code: '5201.00',
      can_sync_to_frappe: false,
      is_future_contract: true
    }
  ]);

  const [contractPayments, setContractPayments] = useState<ContractPayment[]>([
    {
      id: '1',
      payment_no: 'CP-2025-001',
      invoice_id: '1',
      contract_id: '1',
      amount: 150000,
      payment_type: 'Final',
      payment_date: '2025-01-15',
      payment_method: 'Bank Transfer',
      status: 'Completed',
      verified_by_buyer: true,
      verified_by_seller: true
    },
    {
      id: '3',
      payment_no: 'CP-2025-003',
      invoice_id: '3',
      contract_id: '4',
      amount: 48000,
      payment_type: 'Advance',
      payment_date: '2025-01-13',
      payment_method: 'Bank Transfer',
      status: 'Completed',
      verified_by_buyer: true,
      verified_by_seller: false
    }
  ]);

  const [contractParties, setContractParties] = useState<ContractParty[]>([
    {
      id: '1',
      name: user.company,
      email: user.email || 'contact@yourcompany.com',
      phone: '+91 98765 43210',
      company: user.company,
      role: 'Buyer',
      total_contracts: 5,
      total_value: 750000,
      verification_score: 98,
      last_activity: '2025-01-15',
      is_verified: true
    },
    {
      id: '2',
      name: 'Steel Corp Ltd',
      email: 'sales@steelcorp.com',
      phone: '+91 98765 43211',
      company: 'Steel Corp Ltd',
      role: 'Seller',
      total_contracts: 8,
      total_value: 1200000,
      verification_score: 95,
      last_activity: '2025-01-15',
      is_verified: true
    },
    {
      id: '3',
      name: 'Alpha Metals Corp',
      email: 'procurement@alphametals.com',
      phone: '+91 98765 43212',
      company: 'Alpha Metals Corp',
      role: 'Buyer',
      total_contracts: 3,
      total_value: 450000,
      verification_score: 92,
      last_activity: '2025-01-14',
      is_verified: true
    }
  ]);

  // Helper function to determine if invoice can sync to Frappe
  const canSyncToFrappe = (invoice: ContractInvoice): boolean => {
    return invoice.status === 'Verified' && 
           invoice.payment_status === 'Fully Paid' && 
           invoice.buyer_verified && 
           invoice.seller_verified;
  };

  // Helper function to auto-add parties if they don't exist
  const addPartyIfNotExists = (partyName: string, role: 'Buyer' | 'Seller') => {
    const existingParty = contractParties.find(p => p.company === partyName && p.role === role);
    if (!existingParty) {
      const newParty: ContractParty = {
        id: `party_${Date.now()}_${Math.random()}`,
        name: partyName,
        company: partyName,
        role: role,
        total_contracts: 1,
        total_value: 0,
        verification_score: 85,
        last_activity: new Date().toISOString().split('T')[0],
        is_verified: false
      };
      setContractParties(prev => [newParty, ...prev]);
    }
  };

  // Listen for contract events from Contract Module
  useEffect(() => {
    const handleContractReserved = (event: CustomEvent) => {
      const { contractId, invoiceId, contract, quantity, buyerInfo, isFutureContract, reservationAmount } = event.detail;
      
      // Calculate amounts based on contract type
      const unitRate = contract.rate_per_unit || (contract.rate / (contract.qty || 1));
      const totalAmount = quantity * unitRate;
      
      // Only use reservation amount for future contracts
      const actualReservationAmount = isFutureContract ? reservationAmount : 0;
      const remainingAmount = totalAmount - actualReservationAmount;
      
      // Determine payment status based on contract type
      const paymentStatus = isFutureContract && actualReservationAmount > 0 ? 'Advance Paid' : 'Pending';

      // Create new invoice with Final status (no more Draft status)
      const newInvoice: ContractInvoice = {
        id: invoiceId,
        invoice_no: `CI-2025-${String(contractInvoices.length + 1).padStart(3, '0')}`,
        contract_id: contractId,
        contract_title: contract.item_name,
        buyer: buyerInfo.company || buyerInfo.name,
        seller: contract.posted_by,
        item_name: contract.item_name,
        quantity: quantity,
        rate: unitRate,
        total_amount: totalAmount,
        reservation_amount: actualReservationAmount,
        remaining_amount: remainingAmount,
        status: 'Final',
        created_date: new Date().toISOString().split('T')[0],
        due_date: contract.availability_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        buyer_verified: false,
        seller_verified: false,
        sync_status: 'Not Synced',
        payment_status: paymentStatus as any,
        gst_hsn_code: contract.gst_hsn_code,
        can_sync_to_frappe: false,
        is_future_contract: isFutureContract
      };

      console.log('New Final Invoice:', newInvoice);

      setContractInvoices(prev => [newInvoice, ...prev]);

      // Create payment record only if there's an actual payment
      if (actualReservationAmount > 0) {
        const advancePayment: ContractPayment = {
          id: `payment_${Date.now()}`,
          payment_no: `CP-2025-${String(contractPayments.length + 1).padStart(3, '0')}`,
          invoice_id: invoiceId,
          contract_id: contractId,
          amount: actualReservationAmount,
          payment_type: 'Advance',
          payment_date: new Date().toISOString().split('T')[0],
          payment_method: 'Bank Transfer',
          status: 'Completed',
          verified_by_buyer: true,
          verified_by_seller: false
        };

        setContractPayments(prev => [advancePayment, ...prev]);
      }

      // Auto-add parties to the system
      addPartyIfNotExists(buyerInfo.company || buyerInfo.name, 'Buyer');
      addPartyIfNotExists(contract.posted_by, 'Seller');

      // Show appropriate success message
      if (isFutureContract && actualReservationAmount > 0) {
        showToast(`Future contract reserved! Final invoice generated with ₹${actualReservationAmount.toLocaleString()} advance payment.`, 'success');
      } else {
        showToast('Contract reserved! Final invoice generated.', 'success');
      }
    };

    const handleContractVerified = (event: CustomEvent) => {
      const { invoiceId, role, fullyVerified } = event.detail;
      setContractInvoices(prev => prev.map(invoice => {
        if (invoice.id === invoiceId) {
          const updated = {
            ...invoice,
            [role === 'buyer' ? 'buyer_verified' : 'seller_verified']: true
          };
          
          if (fullyVerified) {
            updated.status = 'Verified';
            updated.can_sync_to_frappe = canSyncToFrappe(updated);
          }
          
          return updated;
        }
        return invoice;
      }));

      if (fullyVerified) {
        showToast('Contract fully verified! Invoice can now be synced to Frappe Books.', 'success');
      } else {
        showToast(`Contract execution verified by ${role}. Waiting for other party verification.`, 'info');
      }
    };

    window.addEventListener('contractReserved', handleContractReserved as EventListener);
    window.addEventListener('contractVerified', handleContractVerified as EventListener);

    return () => {
      window.removeEventListener('contractReserved', handleContractReserved as EventListener);
      window.removeEventListener('contractVerified', handleContractVerified as EventListener);
    };
  }, [contractInvoices.length, contractPayments.length, contractParties]);

  const addContractInvoice = (invoiceData: Omit<ContractInvoice, 'id' | 'invoice_no'>): string => {
    const invoiceId = `ci_${Date.now()}`;
    const newInvoice: ContractInvoice = {
      ...invoiceData,
      id: invoiceId,
      invoice_no: `CI-2025-${String(contractInvoices.length + 1).padStart(3, '0')}`,
      can_sync_to_frappe: canSyncToFrappe(invoiceData as ContractInvoice)
    };

    setContractInvoices(prev => [newInvoice, ...prev]);
    showToast('Contract Invoice created successfully!', 'success');
    return invoiceId;
  };

  const updateInvoiceStatus = (id: string, status: string) => {
    setContractInvoices(prev => prev.map(invoice => {
      if (invoice.id === id) {
        const updated = { 
          ...invoice, 
          status: status as any,
          ...(status === 'Final' && { buyer_verified: true })
        };
        updated.can_sync_to_frappe = canSyncToFrappe(updated);
        return updated;
      }
      return invoice;
    }));
    showToast(`Invoice status updated to ${status}`, 'success');
  };

  const verifyExecution = (invoiceId: string, role: 'buyer' | 'seller') => {
    setContractInvoices(prev => prev.map(invoice => {
      if (invoice.id === invoiceId) {
        const updated = {
          ...invoice,
          [role === 'buyer' ? 'buyer_verified' : 'seller_verified']: true
        };
        
        // If both parties have verified, update status to Verified
        if (updated.buyer_verified && updated.seller_verified) {
          updated.status = 'Verified';
          updated.can_sync_to_frappe = canSyncToFrappe(updated);
        }
        
        return updated;
      }
      return invoice;
    }));
    
    const invoice = contractInvoices.find(inv => inv.id === invoiceId);
    const fullyVerified = invoice && 
      ((role === 'buyer' && invoice.seller_verified) || 
       (role === 'seller' && invoice.buyer_verified));
    
    if (fullyVerified) {
      showToast('Contract fully verified! Invoice can now be synced to Frappe Books.', 'success');
    } else {
      showToast(`Contract execution verified by ${role}. Waiting for other party verification.`, 'info');
    }
  };

  const syncToERP = async (invoiceId: string) => {
    const invoice = contractInvoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    // Check if invoice can be synced
    if (!invoice.can_sync_to_frappe) {
      showToast('Invoice cannot be synced. Ensure it is verified and fully paid.', 'error');
      return;
    }

    try {
      // Simulate API call to ERP system
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        setContractInvoices(prev => prev.map(inv => 
          inv.id === invoiceId ? { ...inv, sync_status: 'Synced' } : inv
        ));
        showToast(`Invoice ${invoice.invoice_no} synced to Frappe Books successfully!`, 'success');
      } else {
        setContractInvoices(prev => prev.map(inv => 
          inv.id === invoiceId ? { ...inv, sync_status: 'Sync Failed' } : inv
        ));
        showToast(`Failed to sync ${invoice.invoice_no} to Frappe Books. Please try again.`, 'error');
      }
    } catch (error) {
      setContractInvoices(prev => prev.map(inv => 
        inv.id === invoiceId ? { ...inv, sync_status: 'Sync Failed' } : inv
      ));
      showToast('Frappe Books sync failed due to network error. Please try again.', 'error');
    }
  };

  const addPayment = (paymentData: Omit<ContractPayment, 'id' | 'payment_no'>) => {
    const newPayment: ContractPayment = {
      ...paymentData,
      id: `payment_${Date.now()}`,
      payment_no: `CP-2025-${String(contractPayments.length + 1).padStart(3, '0')}`
    };

    setContractPayments(prev => [newPayment, ...prev]);
    
    // Update invoice payment status
    const invoice = contractInvoices.find(inv => inv.id === paymentData.invoice_id);
    if (invoice) {
      const totalPaid = contractPayments
        .filter(p => p.invoice_id === paymentData.invoice_id && p.status === 'Completed')
        .reduce((sum, p) => sum + p.amount, 0) + paymentData.amount;
      
      const paymentStatus = totalPaid >= invoice.total_amount ? 'Fully Paid' : 
                           totalPaid > 0 ? 'Advance Paid' : 'Pending';
      
      setContractInvoices(prev => prev.map(inv => {
        if (inv.id === paymentData.invoice_id) {
          const updated = { ...inv, payment_status: paymentStatus as any };
          updated.can_sync_to_frappe = canSyncToFrappe(updated);
          return updated;
        }
        return inv;
      }));
    }

    showToast('Payment recorded successfully!', 'success');
  };

  const getDashboardData = () => {
    const totalSales = contractInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    const totalReservations = contractInvoices.reduce((sum, inv) => sum + inv.reservation_amount, 0);
    const verifiedContracts = contractInvoices.filter(inv => inv.status === 'Verified').length;
    const pendingVerifications = contractInvoices.filter(inv => 
      inv.status === 'Final' && (!inv.buyer_verified || !inv.seller_verified)
    ).length;

    return {
      totalSales,
      totalReservations,
      profit: totalSales * 0.15,
      verifiedContracts,
      pendingVerifications,
      finalInvoices: contractInvoices.filter(inv => inv.status === 'Final').length,
      syncedInvoices: contractInvoices.filter(inv => inv.sync_status === 'Synced').length
    };
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <ContractAccountingContext.Provider value={{
      contractInvoices,
      contractPayments,
      contractParties,
      addContractInvoice,
      updateInvoiceStatus,
      verifyExecution,
      syncToERP,
      addPayment,
      getDashboardData,
      showToast,
      toast
    }}>
      {children}
    </ContractAccountingContext.Provider>
  );
};