import React from 'react';
import { Users, Package } from 'lucide-react';

interface ContractProgressBarProps {
  totalQuantity: number;
  reservedQuantity: number;
  participantCount: number;
  className?: string;
}

const ContractProgressBar: React.FC<ContractProgressBarProps> = ({
  totalQuantity,
  reservedQuantity,
  participantCount,
  className = ''
}) => {
  const progressPercentage = (reservedQuantity / totalQuantity) * 100;
  const remainingQuantity = totalQuantity - reservedQuantity;
  
  return (
    <div className={`bg-blue-50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Split Contract Progress</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-blue-700">
          <Users className="w-3 h-3" />
          <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Reserved: {reservedQuantity.toLocaleString()}</span>
          <span>Total: {totalQuantity.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{progressPercentage.toFixed(1)}% reserved</span>
          <span>{remainingQuantity.toLocaleString()} remaining</span>
        </div>
      </div>
      
      {/* Status */}
      <div className="flex items-center justify-between">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          progressPercentage === 100 
            ? 'bg-green-100 text-green-800' 
            : progressPercentage > 0 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {progressPercentage === 100 ? 'Fully Reserved' : 
           progressPercentage > 0 ? 'Partially Reserved' : 'Available'}
        </div>
        {progressPercentage < 100 && (
          <span className="text-xs text-green-600 font-medium">
            {remainingQuantity.toLocaleString()} units available
          </span>
        )}
      </div>
    </div>
  );
};

export default ContractProgressBar;