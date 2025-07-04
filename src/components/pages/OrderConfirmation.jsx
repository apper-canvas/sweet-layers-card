import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderService } from '@/services/api/orderService';
import { cakeService } from '@/services/api/cakeService';
import Button from '@/components/atoms/Button';
import PriceDisplay from '@/components/molecules/PriceDisplay';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [cakeDetails, setCakeDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadOrder();
  }, [orderId]);
  
  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const orderData = await orderService.getById(parseInt(orderId));
      setOrder(orderData);
      
      // Load cake details for each item
      const details = {};
      for (const item of orderData.items) {
        if (!details[item.cakeId]) {
          const cake = await cakeService.getById(item.cakeId);
          details[item.cakeId] = cake;
        }
      }
      setCakeDetails(details);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadOrder} />;
  if (!order) return <Error message="Order not found" />;
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  return (
    <div className="min-h-screen bg-vanilla py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-success to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="CheckCircle" className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-display text-chocolate mb-2">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Thank you for your order. We'll have your delicious cakes ready for you!
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-soft p-6"
          >
            <h2 className="text-2xl font-display text-chocolate mb-6">Order Details</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-medium text-chocolate">Order Number:</span>
                <span className="text-caramel font-bold">#{order.Id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-chocolate">Status:</span>
                <span className="bg-success text-white px-2 py-1 rounded text-sm">
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-chocolate">
                  {order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'} Date:
                </span>
                <span>{formatDate(order.scheduledDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-chocolate">Time:</span>
                <span>{formatTime(order.scheduledTime)}</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold text-chocolate mb-3">Items Ordered:</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => {
                  const cake = cakeDetails[item.cakeId];
                  if (!cake) return null;
                  
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-cream rounded-lg">
                      <img
                        src={cake.images[0]}
                        alt={cake.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-chocolate">{cake.name}</h4>
                        <p className="text-sm text-gray-600">
                          {item.size} • {item.flavor} • Qty: {item.quantity}
                        </p>
                        {item.customMessage && (
                          <p className="text-sm text-gray-600 italic">
                            "{item.customMessage}"
                          </p>
                        )}
                      </div>
                      <PriceDisplay price={item.price * item.quantity} className="text-sm" />
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
          
          {/* Customer & Payment Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h3 className="text-xl font-display text-chocolate mb-4">Customer Information</h3>
              <div className="space-y-2">
                <p><strong>Name:</strong> {order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                <p><strong>Email:</strong> {order.customerInfo.email}</p>
                <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                {order.deliveryType === 'delivery' && order.customerInfo.address && (
                  <div>
                    <strong>Delivery Address:</strong>
                    <p>{order.customerInfo.address.street}</p>
                    <p>{order.customerInfo.address.city}, {order.customerInfo.address.state} {order.customerInfo.address.zipCode}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h3 className="text-xl font-display text-chocolate mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <PriceDisplay price={order.subtotal} className="text-sm" />
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <PriceDisplay price={order.tax} className="text-sm" />
                </div>
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <PriceDisplay price={order.deliveryFee} className="text-sm" />
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <PriceDisplay price={order.total} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Important Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-caramel to-chocolate text-white rounded-lg p-6 mt-8"
        >
          <h3 className="text-xl font-display mb-4">Important Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <ApperIcon name="Clock" className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Preparation Time</p>
                <p className="text-sm opacity-90">Your order will be ready at the scheduled time.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ApperIcon name="Phone" className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Questions?</p>
                <p className="text-sm opacity-90">Call us at (555) 123-4567</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 space-y-4"
        >
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate('/')}
            className="mr-4"
          >
            Back to Home
          </Button>
          <Button
            variant="outline"
            size="large"
            onClick={() => navigate('/catalog')}
          >
            Order More Cakes
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;