import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useContracts } from '../contexts/ContractContext';
import { useContractAccounting } from '../contexts/ContractAccountingContext';

const Toast: React.FC = () => {
  const { toast: contractToast } = useContracts();
  const { toast: accountingToast } = useContractAccounting();

  // Show the most recent toast
  const toast = accountingToast?.show ? accountingToast : contractToast?.show ? contractToast : null;

  if (!toast || !toast.show) return null;

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const Icon = icons[toast.type as keyof typeof icons] || Info;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-lg ${colors[toast.type as keyof typeof colors]}`}>
        <Icon className="w-5 h-5" />
        <span className="font-medium">{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;