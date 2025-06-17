import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Package, 
  DollarSign, 
  User, 
  CheckCircle, 
  Clock,
  Crown,
  PlayCircle,
  Zap,
  Shield
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import FrappeInvoicePreview from '../components/FrappeInvoicePreview';

const ContractReservationDemoPage: React.FC = () => {
  const { isPremium, togglePremium } = useUser();
  const [isReserved, setIsReserved] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const sampleContract = {
    id: 'DEMO-001',
    title: 'Premium Aluminum Sheets - Q2 2025 Delivery',
    type: 'future' as const,
    hsnCode: '7606.11',
    quantity: 1500,
    price: 225000,
    postedBy: 'MetalWorks Industries',
    postedDate: '2 hours ago',
    status: 'active' as const,
    availabilityDate: '2025-04-15',
    reservationAmount: 45000, // 20% of total for future contracts
    customerName: 'John Doe (Your Company Ltd)',
    description: 'High-grade aluminum sheets suitable for aerospace and automotive applications. Premium quality with certified specifications and guaranteed delivery.'
  };

  const handleReserveContract = async () => {
    if (!isPremium) {
      togglePremium();
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsReserved(true);
    setShowInvoice(true);
    setIsProcessing(false);
  };

  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <PlayCircle className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Contract Reservation Demo
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience the future contract reservation flow with integrated Frappe Books invoice generation
        </p>
      </div>

      {/* Demo Status */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <PlayCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Demo Environment</h3>
            <p className="text-blue-700">
              This is a demonstration of the contract reservation system. No real payments will be processed.
            </p>
          </div>
        </div>
      </div>

      {/* Premium Status Check */}
      {!isPremium && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Crown className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Premium Required for Future Contract Reservations
              </h3>
              <p className="text-yellow-700 mb-4">
                Future contract reservations with 20% advance payment are available exclusively to Premium members. 
                Click "Reserve Now" to automatically upgrade and proceed with the demo.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Contract Card */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Sample Future Contract</h2>
          
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Contract Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{sampleContract.title}</h3>
                    <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      <Calendar className="w-3 h-3" />
                      <span>Future</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{sampleContract.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span>HSN: {sampleContract.hsnCode}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>Qty: {sampleContract.quantity.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">₹{sampleContract.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{sampleContract.postedBy}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Future Contract Details */}
            <div className="p-6 bg-blue-50">
              <h4 className="font-semibold text-gray-900 mb-3">Future Contract Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Availability Date</div>
                  <div className="font-medium text-gray-900">{sampleContract.availabilityDate}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Reservation Amount (20%)</div>
                  <div className="font-medium text-blue-600">₹{sampleContract.reservationAmount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Remaining Balance</div>
                  <div className="font-medium text-gray-900">₹{(sampleContract.price - sampleContract.reservationAmount).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Status</div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    isReserved 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isReserved ? 'Reserved' : 'Available'}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-6">
              <button
                onClick={handleReserveContract}
                disabled={isReserved || isProcessing}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                  isReserved
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : isProcessing
                    ? 'bg-blue-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg transform hover:scale-105'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing Reservation...</span>
                  </>
                ) : isReserved ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Successfully Reserved</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Reserve Now - ₹{sampleContract.reservationAmount.toLocaleString()}</span>
                  </>
                )}
              </button>
              
              {!isPremium && !isReserved && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Will automatically upgrade to Premium and process reservation
                </p>
              )}
            </div>
          </motion.div>

          {/* Success Message */}
          {isReserved && (
            <motion.div
              className="bg-green-50 border border-green-200 rounded-xl p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Future Contract Successfully Reserved!
                  </h3>
                  <div className="space-y-2 text-green-700">
                    <p>✓ Advance payment of ₹{sampleContract.reservationAmount.toLocaleString()} processed</p>
                    <p>✓ Draft invoice created in Frappe Books</p>
                    <p>✓ Contract reserved until {sampleContract.availabilityDate}</p>
                    <p>✓ Seller notified of reservation</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Frappe Books Integration */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Frappe Books Integration</h2>
            {showInvoice && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Invoice Generated</span>
              </div>
            )}
          </div>

          {showInvoice ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FrappeInvoicePreview
                contractData={sampleContract}
                invoiceNumber={invoiceNumber}
                isReserved={isReserved}
                isFutureContract={true}
              />
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Waiting for Reservation
              </h3>
              <p className="text-gray-600 mb-4">
                Once you reserve the future contract, a draft invoice will be automatically generated in Frappe Books with 20% advance payment
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Integration Features:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-3 h-3" />
                    <span>Automatic invoice generation with 20% advance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-3 h-3" />
                    <span>Real-time sync with accounting</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-3 h-3" />
                    <span>Payment tracking and reconciliation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-3 h-3" />
                    <span>Automated tax calculations</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Technical Notes */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Updated Payment Logic</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Future Contracts (Premium Only)</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 20% advance payment required for reservation</li>
              <li>• Premium subscription required to access</li>
              <li>• Remaining 80% due on availability date</li>
              <li>• Cancellation forfeits advance payment</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Regular Contracts</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• No upfront payment required</li>
              <li>• Full payment on completion/delivery</li>
              <li>• Available to all users</li>
              <li>• Immediate execution after agreement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractReservationDemoPage;