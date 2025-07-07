import React from 'react';
import { MapPin, Truck, Package, CheckCircle, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useOrderTracking } from '@/hooks/useOrderTracking';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
}

const OrderTrackingModal = ({ isOpen, onClose, orderId, orderNumber }: OrderTrackingModalProps) => {
  const { trackingData, loading } = useOrderTracking(orderId);

  const getStatusIcon = (status: string) => {
    const iconClass = "h-4 w-4";
    switch (status.toLowerCase()) {
      case 'ordered':
      case 'pending':
        return <Clock className={iconClass} />;
      case 'processing':
        return <Package className={iconClass} />;
      case 'shipped':
        return <Truck className={iconClass} />;
      case 'delivered':
        return <CheckCircle className={iconClass} />;
      default:
        return <MapPin className={iconClass} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600';
      case 'shipped':
        return 'text-blue-600';
      case 'processing':
        return 'text-yellow-600';
      case 'pending':
      case 'ordered':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading tracking information...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Track Order #{orderNumber}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {trackingData.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-6">
                {trackingData.map((entry, index) => {
                  const { date, time } = formatDateTime(entry.timestamp);
                  const isLatest = index === trackingData.length - 1;
                  
                  return (
                    <div key={entry.id} className="relative flex items-start space-x-4">
                      {/* Timeline dot */}
                      <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        isLatest 
                          ? 'bg-gradient-to-r from-blue-500 to-violet-500 border-transparent text-white' 
                          : 'bg-white border-gray-300'
                      } shadow-sm`}>
                        <div className={isLatest ? 'text-white' : getStatusColor(entry.status)}>
                          {getStatusIcon(entry.status)}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0 pb-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-semibold text-lg capitalize ${getStatusColor(entry.status)}`}>
                              {entry.status}
                            </h4>
                            <div className="text-right text-sm text-gray-500">
                              <div className="font-medium">{date}</div>
                              <div>{time}</div>
                            </div>
                          </div>
                          
                          {entry.location && (
                            <div className="flex items-center space-x-2 text-gray-600 mb-2">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm">{entry.location}</span>
                            </div>
                          )}
                          
                          {entry.description && (
                            <p className="text-gray-700 text-sm">{entry.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No tracking information available
              </h3>
              <p className="text-gray-500">
                Tracking details will appear here once your order is processed.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderTrackingModal;