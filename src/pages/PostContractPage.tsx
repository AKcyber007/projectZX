import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContracts } from '../contexts/ContractContext';
import { Plus, Upload, X, Crown, AlertCircle, Users, ArrowLeft } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const PostContractPage: React.FC = () => {
  const navigate = useNavigate();
  const { addContract } = useContracts();
  const { isPremium } = useUser();
  
  const [formData, setFormData] = useState({
    item_name: '',
    contract_type: 'Sell',
    gst_hsn_code: '',
    qty: '',
    rate: '',
    customer: '',
    description: '',
    location: '',
    delivery_date: '',
    availability_date: '',
    terms: '',
    allow_partial_purchases: false,
    min_split_quantity: ''
  });

  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample customers for dropdown
  const sampleCustomers = [
    'MetalWorks Industries',
    'TechSource Ltd',
    'AgriCorp Industries',
    'BuildCorp Materials',
    'Alpha Metals Corp',
    'Industrial Solutions',
    'Global Trading Co',
    'LogiCorp Solutions'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Prepare contract data with Frappe Books field structure
    const contractData = {
      item_name: formData.item_name,
      contract_type: formData.contract_type as 'Sell' | 'Buy' | 'Service' | 'Future',
      gst_hsn_code: formData.gst_hsn_code || undefined,
      qty: formData.qty ? Number(formData.qty) : undefined,
      rate: Number(formData.rate),
      customer: formData.customer,
      description: formData.description,
      location: formData.location,
      delivery_date: formData.delivery_date || undefined,
      availability_date: formData.availability_date || undefined,
      terms: formData.terms || undefined,
      allow_partial_purchases: formData.allow_partial_purchases,
      min_split_quantity: formData.min_split_quantity ? Number(formData.min_split_quantity) : undefined
    };

    // Add contract to global state
    addContract(contractData);

    setIsSubmitting(false);

    // Redirect to marketplace
    navigate('/marketplace');
  };

  const addAttachment = () => {
    setAttachments(prev => [...prev, `Document_${prev.length + 1}.pdf`]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const isFutureContract = formData.contract_type === 'Future';
  const canPostFutureContract = isPremium || formData.contract_type !== 'Future';
  const ratePerUnit = formData.qty && formData.rate ? 
    Number(formData.rate) / Number(formData.qty) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Post New Contract</h1>
          <p className="text-gray-600 mt-2">Create a new contract opportunity for Frappe Books integration</p>
        </div>
      </div>

      {/* Frappe Books Integration Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Frappe Books Integration Ready
            </h3>
            <p className="text-blue-700 mb-3">
              This form uses Frappe Books field structure (item_name, gst_hsn_code, qty, rate, customer). 
              Contracts will be created as Draft documents and can be synced to Frappe Books from My Contracts page.
            </p>
            <div className="text-sm text-blue-600">
              <strong>Field Mapping:</strong> item_name, gst_hsn_code, qty, rate, contract_type, customer, availability_date
            </div>
          </div>
        </div>
      </div>

      {/* Premium Notice for Future Contracts */}
      {isFutureContract && !isPremium && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Crown className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Premium Feature Required
              </h3>
              <p className="text-yellow-700 mb-4">
                Future contracts are available exclusively to Premium subscribers. Upgrade your account to post contracts with future availability dates and enable reservation functionality.
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="item_name" className="block text-sm font-medium text-gray-700 mb-2">
                Item Name * <span className="text-xs text-gray-500">(Frappe: item_name)</span>
              </label>
              <input
                type="text"
                id="item_name"
                name="item_name"
                value={formData.item_name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Premium Steel Rods - Industrial Grade"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="contract_type" className="block text-sm font-medium text-gray-700 mb-2">
                Contract Type * <span className="text-xs text-gray-500">(Frappe: contract_type)</span>
              </label>
              <select
                id="contract_type"
                name="contract_type"
                value={formData.contract_type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Sell">Sell</option>
                <option value="Buy">Buy</option>
                <option value="Service">Service</option>
                <option value="Future">Future {!isPremium ? '(Premium Only)' : ''}</option>
              </select>
              {isFutureContract && (
                <div className="mt-2 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                  <p className="text-xs text-blue-600">
                    Future contracts allow buyers to reserve with 20% upfront payment
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-2">
                Customer * <span className="text-xs text-gray-500">(Frappe: customer)</span>
              </label>
              <select
                id="customer"
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={!canPostFutureContract}
              >
                <option value="">Select Customer</option>
                {sampleCustomers.map((customer) => (
                  <option key={customer} value={customer}>{customer}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="gst_hsn_code" className="block text-sm font-medium text-gray-700 mb-2">
                GST HSN Code <span className="text-xs text-gray-500">(Frappe: gst_hsn_code)</span> {formData.contract_type !== 'Service' && '*'}
              </label>
              <input
                type="text"
                id="gst_hsn_code"
                name="gst_hsn_code"
                value={formData.gst_hsn_code}
                onChange={handleInputChange}
                required={formData.contract_type !== 'Service'}
                placeholder="e.g., 7213.10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={!canPostFutureContract}
              />
            </div>

            <div>
              <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity <span className="text-xs text-gray-500">(Frappe: qty)</span> {formData.contract_type !== 'Service' && '*'}
              </label>
              <input
                type="number"
                id="qty"
                name="qty"
                value={formData.qty}
                onChange={handleInputChange}
                required={formData.contract_type !== 'Service'}
                placeholder="e.g., 1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={!canPostFutureContract}
              />
            </div>

            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-2">
                Total Rate (₹) * <span className="text-xs text-gray-500">(Frappe: rate)</span>
              </label>
              <input
                type="number"
                id="rate"
                name="rate"
                value={formData.rate}
                onChange={handleInputChange}
                required
                placeholder="e.g., 85000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={!canPostFutureContract}
              />
              {ratePerUnit > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Rate per unit: ₹{ratePerUnit.toFixed(2)}
                </p>
              )}
              {isFutureContract && formData.rate && (
                <p className="text-xs text-gray-500 mt-1">
                  Reservation amount: ₹{Math.round(Number(formData.rate) * 0.2).toLocaleString()} (20%)
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Split Contract Options */}
        {formData.contract_type !== 'Service' && canPostFutureContract && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Split Contract Options</h2>
                <p className="text-sm text-gray-600">Allow multiple buyers to participate in this contract</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="allow_partial_purchases"
                  name="allow_partial_purchases"
                  checked={formData.allow_partial_purchases}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="allow_partial_purchases" className="text-sm font-medium text-gray-700">
                  Allow partial purchases (Split Contract)
                </label>
              </div>

              {formData.allow_partial_purchases && (
                <div className="ml-7 space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">Split Contract Benefits:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Multiple buyers can reserve portions of your contract</li>
                          <li>• Each buyer pays 20% upfront for their reserved quantity</li>
                          <li>• Reduces risk and increases contract completion chances</li>
                          <li>• Automatic coordination of delivery and payments</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="min_split_quantity" className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Split Quantity *
                      </label>
                      <input
                        type="number"
                        id="min_split_quantity"
                        name="min_split_quantity"
                        value={formData.min_split_quantity}
                        onChange={handleInputChange}
                        required={formData.allow_partial_purchases}
                        placeholder="e.g., 100"
                        min="1"
                        max={formData.qty}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum quantity each buyer must reserve
                      </p>
                    </div>

                    {formData.min_split_quantity && formData.qty && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-700">
                          <div className="font-medium mb-2">Split Analysis:</div>
                          <div className="space-y-1 text-xs">
                            <div>Max participants: {Math.floor(Number(formData.qty) / Number(formData.min_split_quantity))}</div>
                            <div>Min reservation: ₹{Math.round((Number(formData.min_split_quantity) * ratePerUnit) * 0.2).toLocaleString()}</div>
                            <div>Max reservation: ₹{Math.round(Number(formData.rate) * 0.2).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Contract Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Provide detailed description of the contract, specifications, quality requirements, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={!canPostFutureContract}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="e.g., Mumbai, Maharashtra"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={!canPostFutureContract}
              />
            </div>

            {isFutureContract ? (
              <div>
                <label htmlFor="availability_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Availability Date * <span className="text-xs text-gray-500">(Frappe: availability_date)</span>
                </label>
                <input
                  type="date"
                  id="availability_date"
                  name="availability_date"
                  value={formData.availability_date}
                  onChange={handleInputChange}
                  required
                  min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={!canPostFutureContract}
                />
                <p className="text-xs text-gray-500 mt-1">
                  When the goods/services will be available for delivery
                </p>
              </div>
            ) : (
              <div>
                <label htmlFor="delivery_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Delivery Date *
                </label>
                <input
                  type="date"
                  id="delivery_date"
                  name="delivery_date"
                  value={formData.delivery_date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={!canPostFutureContract}
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-2">
                Terms & Conditions
              </label>
              <textarea
                id="terms"
                name="terms"
                value={formData.terms}
                onChange={handleInputChange}
                rows={3}
                placeholder={
                  formData.allow_partial_purchases
                    ? "Additional terms, payment conditions, delivery coordination for split contracts..."
                    : isFutureContract 
                    ? "Additional terms, payment conditions, cancellation policy for future contracts..."
                    : "Additional terms, payment conditions, special requirements..."
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={!canPostFutureContract}
              />
              {(isFutureContract || formData.allow_partial_purchases) && (
                <p className="text-xs text-gray-500 mt-1">
                  Note: 20% upfront payment required for reservations. Cancellations forfeit the reservation amount.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Attachments</h2>
          
          <div className="space-y-4">
            <button
              type="button"
              onClick={addAttachment}
              disabled={!canPostFutureContract}
              className={`flex items-center space-x-2 px-4 py-2 border-2 border-dashed rounded-lg transition-colors ${
                canPostFutureContract
                  ? 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
                  : 'border-gray-200 bg-gray-50 cursor-not-allowed'
              }`}
            >
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Upload Documents</span>
            </button>

            {attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Attached Files:</p>
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-sm text-gray-700">{file}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={!canPostFutureContract}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canPostFutureContract || isSubmitting}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              canPostFutureContract && !isSubmitting
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Post Contract</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostContractPage;