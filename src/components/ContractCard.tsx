import React from 'react';
import { Calendar, Package, DollarSign, User } from 'lucide-react';

interface ContractCardProps {
  id: string;
  item_name?: string;
  title?: string; // Legacy support
  contract_type?: 'Sell' | 'Buy' | 'Service' | 'Future';
  type?: 'sell' | 'buy' | 'service' | 'future'; // Legacy support
  gst_hsn_code?: string;
  hsnCode?: string; // Legacy support
  qty?: number;
  quantity?: number; // Legacy support
  rate?: number;
  price?: number; // Legacy support
  customer?: string;
  posted_by?: string;
  postedBy?: string; // Legacy support
  posted_date?: string;
  postedDate?: string; // Legacy support
  docstatus?: 0 | 1 | 2;
  status?: 'active' | 'pending' | 'completed' | 'expired'; // Legacy support
  onClick?: () => void;
}

const ContractCard: React.FC<ContractCardProps> = ({
  item_name,
  title,
  contract_type,
  type,
  gst_hsn_code,
  hsnCode,
  qty,
  quantity,
  rate,
  price,
  customer,
  posted_by,
  postedBy,
  posted_date,
  postedDate,
  docstatus,
  status,
  onClick
}) => {
  // Use Frappe fields with legacy fallbacks
  const displayTitle = item_name || title || '';
  const displayType = contract_type || (type ? type.charAt(0).toUpperCase() + type.slice(1) as 'Sell' | 'Buy' | 'Service' | 'Future' : 'Sell');
  const displayHsn = gst_hsn_code || hsnCode;
  const displayQty = qty || quantity;
  const displayRate = rate || price || 0;
  const displayCustomer = customer || posted_by || postedBy || '';
  const displayDate = posted_date || postedDate || '';

  const typeColors = {
    Sell: 'bg-green-100 text-green-800',
    Buy: 'bg-blue-100 text-blue-800',
    Service: 'bg-purple-100 text-purple-800',
    Future: 'bg-orange-100 text-orange-800'
  };

  const getStatusFromDocStatus = (docstatus?: number) => {
    switch (docstatus) {
      case 0: return { color: 'bg-yellow-100 text-yellow-800', text: 'Draft' };
      case 1: return { color: 'bg-green-100 text-green-800', text: 'Submitted' };
      case 2: return { color: 'bg-red-100 text-red-800', text: 'Cancelled' };
      default: return { color: 'bg-gray-100 text-gray-800', text: 'Unknown' };
    }
  };

  const statusDisplay = docstatus !== undefined ? getStatusFromDocStatus(docstatus) : {
    color: status === 'active' ? 'bg-green-100 text-green-800' :
          status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          status === 'completed' ? 'bg-gray-100 text-gray-800' :
          'bg-red-100 text-red-800',
    text: status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Active'
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{displayTitle}</h3>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[displayType]}`}>
            {displayType}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusDisplay.color}`}>
            {statusDisplay.text}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        {displayHsn && (
          <div className="flex items-center text-sm text-gray-600">
            <Package className="w-4 h-4 mr-2" />
            <span>HSN: {displayHsn}</span>
            {displayQty && <span className="ml-2">• Qty: {displayQty}</span>}
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="w-4 h-4 mr-2" />
          <span className="font-semibold text-gray-900">₹{displayRate.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{displayCustomer}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{displayDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractCard;