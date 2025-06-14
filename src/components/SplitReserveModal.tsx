import React, { useState } from 'react';
import { X, Calculator, Users, AlertCircle, CheckCircle } from 'lucide-react';

interface SplitReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    reservedQuantity: number;
    minSplitQuantity: number;
    pricePerUnit: number;
  };
  onReserve: (quantity: number) => void;
}

const SplitReserveModal: React.FC<SplitReserveModalProps> = ({
  isOpen,
  onClose,
  contract,
  onReserve
}) => {
  const [quantity, setQuantity] = useState(contract.minSplitQuantity);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const availableQuantity = contract.quantity - contract.reservedQuantity;
  const totalPrice = quantity * contract.pricePerUnit;
  const reservationAmount = Math.round(totalPrice * 0.2);
  const remainingBalance = totalPrice - reservationAmount;

  const isValidQuantity = quantity >= contract.minSplitQuantity && 
                         quantity <= availableQuantity && 
                         quantity > 0;

  const handleReserve = async () => {
    if (!isValidQuantity) return;
    
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onReserve(quantity);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Reserve Partial Quantity</h3>
              <p className="text-sm text-gray-600">Split contract participation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contract Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">{contract.title}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Quantity:</span>
                <div className="font-medium">{contract.quantity.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Available:</span>
                <div className="font-medium text-green-600">{availableQuantity.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Price per Unit:</span>
                <div className="font-medium">₹{contract.pricePerUnit.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Min. Split:</span>
                <div className="font-medium">{contract.minSplitQuantity.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity to Reserve
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={contract.minSplitQuantity}
              max={availableQuantity}
              step={contract.minSplitQuantity}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
              <span>Min: {contract.minSplitQuantity.toLocaleString()}</span>
              <span>Max: {availableQuantity.toLocaleString()}</span>
            </div>
          </div>

          {/* Validation Messages */}
          {!isValidQuantity && quantity > 0 && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
              <div className="text-sm text-red-700">
                {quantity < contract.minSplitQuantity && (
                  <p>Minimum quantity is {contract.minSplitQuantity.toLocaleString()}</p>
                )}
                {quantity > availableQuantity && (
                  <p>Only {availableQuantity.toLocaleString()} units available</p>
                )}
              </div>
            </div>
          )}

          {/* Price Calculation */}
          {isValidQuantity && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Calculator className="w-4 h-4 text-blue-600" />
                <h4 className="font-medium text-blue-900">Price Calculation</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Value:</span>
                  <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reservation (20%):</span>
                  <span className="font-medium text-blue-600">₹{reservationAmount.toLocaleString()}</span>
                </div>
                <div className="border-t border-blue-200 pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining Balance:</span>
                    <span className="font-medium">₹{remainingBalance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Terms Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-xs text-yellow-700">
                <p className="font-medium mb-1">Split Contract Terms:</p>
                <ul className="space-y-1">
                  <li>• 20% upfront payment required for reservation</li>
                  <li>• Cancellation forfeits the reservation amount</li>
                  <li>• Delivery coordinated with other participants</li>
                  <li>• Final payment due on contract execution date</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleReserve}
            disabled={!isValidQuantity || isProcessing}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
              isValidQuantity && !isProcessing
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Reserve ₹{reservationAmount.toLocaleString()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplitReserveModal;