import React from 'react';
import { User, Calendar, Package, DollarSign, Crown } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  company: string;
  quantity: number;
  reservationAmount: number;
  reservationDate: string;
  status: 'reserved' | 'confirmed' | 'cancelled';
  isPremium: boolean;
}

interface ParticipantListProps {
  participants: Participant[];
  pricePerUnit: number;
  isOwner?: boolean;
  className?: string;
}

const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  pricePerUnit,
  isOwner = false,
  className = ''
}) => {
  const totalReservedQuantity = participants.reduce((sum, p) => sum + p.quantity, 0);
  const totalReservationAmount = participants.reduce((sum, p) => sum + p.reservationAmount, 0);

  const statusColors = {
    reserved: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {isOwner ? 'Contract Participants' : 'Your Participation'}
          </h3>
          <div className="text-sm text-gray-600">
            {participants.length} participant{participants.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {isOwner && participants.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-600">Total Reserved</div>
              <div className="font-semibold text-gray-900">{totalReservedQuantity.toLocaleString()} units</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-600">Total Advance</div>
              <div className="font-semibold text-gray-900">₹{totalReservationAmount.toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        {participants.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No participants yet</p>
            <p className="text-sm text-gray-400">Be the first to reserve a portion of this contract</p>
          </div>
        ) : (
          <div className="space-y-3">
            {participants.map((participant) => (
              <div key={participant.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{participant.name}</h4>
                        {participant.isPremium && (
                          <Crown className="w-3 h-3 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{participant.company}</p>
                      
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Package className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">Qty:</span>
                          <span className="font-medium">{participant.quantity.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">Value:</span>
                          <span className="font-medium">₹{(participant.quantity * pricePerUnit).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">Reserved:</span>
                          <span className="font-medium">{participant.reservationDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-600">Advance:</span>
                          <span className="font-medium text-blue-600">₹{participant.reservationAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[participant.status]}`}>
                      {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                    </span>
                    
                    {isOwner && participant.status === 'reserved' && (
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Confirm
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantList;