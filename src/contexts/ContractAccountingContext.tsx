import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  status: 'Draft' | 'Final' | 'Verified' | 'Cancelled';
  created_date: string;
  due_date: string;
  buyer_verified: boolean;
  seller_verified: boolean;
  sync_status: 'Not Synced' | 'Synced' | 'Sync Failed';
  payment_status: 'Pending' | 'Partial' | 'Paid';
  gst_hsn_code?: string;
}

export interface ContractPayment {
  id: string;
  payment_no: string;
  invoice_id: string;
  contract_id: string;
  amount: number;
  payment_type: 'Reservation' | 'Final' | 'Partial';
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
  const [toast, setToast] = useState<{ message: string; type: string; show: boolean } | null>(null);

  // Sample contract invoices data
  const [contractInvoices, setContractInvoices] = useState<ContractInvoice[]>([
    {
      id: '1',
      invoice_no: 'CI-2025-001',
      contract_id: '1',
      contract_title: 'Premium Steel Sheets - Industrial Grade',
      buyer: 'MetalWorks Industries',
      seller: 'Steel Corp Ltd',
      item_name: 'Premium Steel Sheets',
      quantity: 2000,
      rate: 75,
      total_amount: 150000,
      reservation_amount: 30000,
      remaining_amount: 120000,
      status: 'Verified',
      created_date: '2025-01-15',
      due_date: '2025-02-15',
      buyer_verified: true,
      seller_verified: true,
      sync_status: 'Synced',
      payment_status: 'Paid',
      gst_hsn_code: '7208.51'
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
      reservation_amount: 24000,
      remaining_amount: 96000,
      status: 'Final',
      created_date: '2025-01-14',
      due_date: '2025-02-14',
      buyer_verified: true,
      seller_verified: false,
      sync_status: 'Not Synced',
      payment_status: 'Partial',
      gst_hsn_code: '7604.10'
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
      status: 'Draft',
      created_date: '2025-01-13',
      due_date: '2025-03-20',
      buyer_verified: false,
      seller_verified: false,
      sync_status: 'Not Synced',
      payment_status: 'Pending',
      gst_hsn_code: '5201.00'
    }
  ]);

  const [contractPayments, setContractPayments] = useState<ContractPayment[]>([
    {
      id: '1',
      payment_no: 'CP-2025-001',
      invoice_id: '1',
      contract_id: '1',
      amount: 30000,
      payment_type: 'Reservation',
      payment_date: '2025-01-15',
      payment_method: 'Bank Transfer',
      status: 'Completed',
      verified_by_buyer: true,
      verified_by_seller: true
    },
    {
      id: '2',
      payment_no: 'CP-2025-002',
      invoice_id: '1',
      contract_id: '1',
      amount: 120000,
      payment_type: 'Final',
      payment_date: '2025-01-20',
      payment_method: 'Bank Transfer',
      status: 'Completed',
      verified_by_buyer: true,
      verified_by_seller: true
    },
    {
      id: '3',
      payment_no: 'CP-2025-003',
      invoice_id: '2',
      contract_id: '2',
      amount: 24000,
      payment_type: 'Reservation',
      payment_date: '2025-01-14',
      payment_method: 'UPI',
      status: 'Completed',
      verified_by_buyer: true,
      verified_by_seller: false
    }
  ]);

  const [contractParties, setContractParties] = useState<ContractParty[]>([
    {
      id: '1',
      name: 'MetalWorks Industries',
      email: 'contact@metalworks.com',
      phone: '+91 98765 43210',
      company: 'MetalWorks Industries',
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

  // Listen for contract events from Contract Module
  useEffect(() => {
    const handleContractReserved = (event: CustomEvent) => {
      const { contractId, invoiceId, contract, quantity, buyerInfo } = event.detail;
      
      // Create new invoice
      const newInvoice: ContractInvoice = {
        id: invoiceId,
        invoice_no: `CI-2025-${String(contractInvoices.length + 1).padStart(3, '0')}`,
        contract_id: contractId,
        contract_title: contract.item_name,
        buyer: buyerInfo.company || buyerInfo.name,
        seller: contract.posted_by,
        item_name: contract.item_name,
        quantity: quantity,
        rate: contract.rate_per_unit || (contract.rate / (contract.qty || 1)),
        total_amount: quantity * (contract.rate_per_unit || (contract.rate / (contract.qty || 1))),
        reservation_amount: Math.round(quantity * (contract.rate_per_unit || (contract.rate / (contract.qty || 1))) * 0.2),
        remaining_amount: Math.round(quantity * (contract.rate_per_unit || (contract.rate / (contract.qty || 1))) * 0.8),
        status: 'Draft',
        created_date: new Date().toISOString().split('T')[0],
        due_date: contract.availability_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        buyer_verified: false,
        seller_verified: false,
        sync_status: 'Not Synced',
        payment_status: 'Pending',
        gst_hsn_code: contract.gst_hsn_code
      };

      setContractInvoices(prev => [newInvoice, ...prev]);

      // Create reservation payment
      const reservationPayment: ContractPayment = {
        id: `payment_${Date.now()}`,
        payment_no: `CP-2025-${String(contractPayments.length + 1).padStart(3, '0')}`,
        invoice_id: invoiceId,
        contract_id: contractId,
        amount: newInvoice.reservation_amount,
        payment_type: 'Reservation',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'Bank Transfer',
        status: 'Completed',
        verified_by_buyer: true,
        verified_by_seller: false
      };

      setContractPayments(prev => [reservationPayment, ...prev]);

      // Add parties if they don't exist
      const buyerExists = contractParties.find(p => p.company === buyerInfo.company);
      if (!buyerExists) {
        const newBuyer: ContractParty = {
          id: `buyer_${Date.now()}`,
          name: buyerInfo.name,
          company: buyerInfo.company,
          role: 'Buyer',
          total_contracts: 1,
          total_value: newInvoice.total_amount,
          verification_score: 85,
          last_activity: new Date().toISOString().split('T')[0],
          is_verified: false
        };
        setContractParties(prev => [newBuyer, ...prev]);
      }

      showToast('Contract invoice generated successfully!', 'success');
    };

    const handleContractReadyForDelivery = (event: CustomEvent) => {
      const { invoiceId } = event.detail;
      setContractInvoices(prev => prev.map(invoice => 
        invoice.id === invoiceId ? { ...invoice, status: 'Final' } : invoice
      ));
      showToast('Invoice status updated to Final - ready for delivery!', 'info');
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
          }
          
          return updated;
        }
        return invoice;
      }));
    };

    window.addEventListener('contractReserved', handleContractReserved as EventListener);
    window.addEventListener('contractReadyForDelivery', handleContractReadyForDelivery as EventListener);
    window.addEventListener('contractVerified', handleContractVerified as EventListener);

    return () => {
      window.removeEventListener('contractReserved', handleContractReserved as EventListener);
      window.removeEventListener('contractReadyForDelivery', handleContractReadyForDelivery as EventListener);
      window.removeEventListener('contractVerified', handleContractVerified as EventListener);
    };
  }, [contractInvoices.length, contractPayments.length, contractParties]);

  const addContractInvoice = (invoiceData: Omit<ContractInvoice, 'id' | 'invoice_no'>): string => {
    const invoiceId = `ci_${Date.now()}`;
    const newInvoice: ContractInvoice = {
      ...invoiceData,
      id: invoiceId,
      invoice_no: `CI-2025-${String(contractInvoices.length + 1).padStart(3, '0')}`
    };

    setContractInvoices(prev => [newInvoice, ...prev]);
    showToast('Contract Invoice created successfully!', 'success');
    return invoiceId;
  };

  const updateInvoiceStatus = (id: string, status: string) => {
    setContractInvoices(prev => prev.map(invoice => 
      invoice.id === id ? { ...invoice, status: status as any } : invoice
    ));
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
        }
        
        return updated;
      }
      return invoice;
    }));
    
    showToast(`Contract execution verified by ${role}`, 'success');
  };

  const syncToERP = async (invoiceId: string) => {
    const invoice = contractInvoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    try {
      // Simulate API call to ERP system
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        setContractInvoices(prev => prev.map(inv => 
          inv.id === invoiceId ? { ...inv, sync_status: 'Synced' } : inv
        ));
        showToast(`Invoice ${invoice.invoice_no} synced to ERP successfully!`, 'success');
      } else {
        setContractInvoices(prev => prev.map(inv => 
          inv.id === invoiceId ? { ...inv, sync_status: 'Sync Failed' } : inv
        ));
        showToast(`Failed to sync ${invoice.invoice_no} to ERP. Please try again.`, 'error');
      }
    } catch (error) {
      setContractInvoices(prev => prev.map(inv => 
        inv.id === invoiceId ? { ...inv, sync_status: 'Sync Failed' } : inv
      ));
      showToast('ERP sync failed due to network error. Please try again.', 'error');
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
      
      const paymentStatus = totalPaid >= invoice.total_amount ? 'Paid' : 
                           totalPaid > 0 ? 'Partial' : 'Pending';
      
      setContractInvoices(prev => prev.map(inv => 
        inv.id === paymentData.invoice_id ? { ...inv, payment_status: paymentStatus as any } : inv
      ));
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
      profit: totalSales * 0.15, // Assume 15% profit margin
      verifiedContracts,
      pendingVerifications,
      draftInvoices: contractInvoices.filter(inv => inv.status === 'Draft').length,
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