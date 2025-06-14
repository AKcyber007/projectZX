import React from 'react';
import { FileText, Calendar, User, Package, DollarSign, CheckCircle } from 'lucide-react';

interface FrappeInvoicePreviewProps {
  contractData: {
    item_name?: string;
    title?: string; // Legacy support
    gst_hsn_code?: string;
    hsnCode?: string; // Legacy support
    qty?: number;
    quantity?: number; // Legacy support
    rate?: number;
    price?: number; // Legacy support
    reservation_amount?: number;
    reservationAmount?: number; // Legacy support
    customer?: string;
    customerName?: string; // Legacy support
    availability_date?: string;
    availabilityDate?: string; // Legacy support
  };
  invoiceNumber: string;
  isReserved: boolean;
}

const FrappeInvoicePreview: React.FC<FrappeInvoicePreviewProps> = ({
  contractData,
  invoiceNumber,
  isReserved
}) => {
  // Use Frappe fields with legacy fallbacks
  const itemName = contractData.item_name || contractData.title || '';
  const hsnCode = contractData.gst_hsn_code || contractData.hsnCode || '';
  const quantity = contractData.qty || contractData.quantity || 0;
  const rate = contractData.rate || contractData.price || 0;
  const reservationAmount = contractData.reservation_amount || contractData.reservationAmount || 0;
  const customer = contractData.customer || contractData.customerName || '';
  const availabilityDate = contractData.availability_date || contractData.availabilityDate || '';
  
  const currentDate = new Date().toLocaleDateString('en-IN');
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sales Invoice Preview</h3>
            <p className="text-sm text-gray-600">Generated from Frappe Books</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Invoice #</div>
          <div className="font-mono text-sm font-medium text-gray-900">{invoiceNumber}</div>
        </div>
      </div>

      {/* Invoice Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Bill To:</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-900">{customer}</span>
            </div>
            <div className="text-xs text-gray-600">Premium Member</div>
            <div className="text-xs text-gray-600">john.doe@company.com</div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Invoice Details:</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-900">Date: {currentDate}</span>
            </div>
            <div className="text-xs text-gray-600">Due Date: {availabilityDate}</div>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              isReserved 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              Status: {isReserved ? 'Draft (Reserved)' : 'Draft'}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700 uppercase tracking-wide">
            <div className="col-span-5">Item Description</div>
            <div className="col-span-2 text-center">HSN Code</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-3 text-right">Amount</div>
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-5">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{itemName}</div>
                  <div className="text-xs text-gray-600">Future Contract Reservation</div>
                </div>
              </div>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-sm font-mono text-gray-900">{hsnCode}</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-sm text-gray-900">{quantity.toLocaleString()}</span>
            </div>
            <div className="col-span-3 text-right">
              <span className="text-sm font-medium text-gray-900">
                ₹{rate.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Contract Value:</span>
            <span className="text-gray-900">₹{rate.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Advance Paid (20%):</span>
            <span className="font-medium text-blue-600">₹{reservationAmount.toLocaleString()}</span>
          </div>
          <div className="border-t border-blue-200 pt-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-900">Remaining Balance:</span>
              <span className="text-gray-900">₹{(rate - reservationAmount).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Frappe Integration Status */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">Synced with Frappe Books</span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Sync with Frappe</span>
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Last synced: {currentDate} • Invoice will be finalized upon contract execution
        </div>
      </div>
    </div>
  );
};

export default FrappeInvoicePreview;