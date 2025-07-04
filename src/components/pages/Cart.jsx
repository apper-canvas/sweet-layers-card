import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { cakeService } from '@/services/api/cakeService';
import { useEffect, useState } from 'react';
import Button from '@/components/atoms/Button';
import QuantitySelector from '@/components/molecules/QuantitySelector';
import PriceDisplay from '@/components/molecules/PriceDisplay';
import CartSummary from '@/components/organisms/CartSummary';
import Empty from '@/components/ui/Empty';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [cakeDetails, setCakeDetails] = useState({});
  const navigate = useNavigate();
  
  useEffect(() => {
    loadCakeDetails();
  }, [cart]);
  
  const loadCakeDetails = async () => {
    const details = {};
    for (const item of cart) {
      if (!details[item.cakeId]) {
        try {
          const cake = await cakeService.getById(item.cakeId);
          details[item.cakeId] = cake;
        } catch (error) {
          console.error('Error loading cake details:', error);
        }
      }
    }
    setCakeDetails(details);
  };
  
  const handleQuantityChange = (cakeId, size, flavor, newQuantity) => {
    updateQuantity(cakeId, size, flavor, newQuantity);
  };
  
  const handleRemoveItem = (cakeId, size, flavor) => {
    removeFromCart(cakeId, size, flavor);
    toast.success('Item removed from cart');
  };
  
  const handleBrowseCakes = () => {
    navigate('/catalog');
  };
  
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-vanilla py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-display text-chocolate mb-8 gradient-text">
            Your Cart
          </h1>
          <Empty
            title="Your cart is empty"
            message="Looks like you haven't added any delicious cakes yet. Start browsing our amazing collection!"
            actionLabel="Browse Cakes"
            onAction={handleBrowseCakes}
            icon="ShoppingCart"
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-vanilla py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl lg:text-4xl font-display text-chocolate mb-8 gradient-text">
          Your Cart
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => {
              const cake = cakeDetails[item.cakeId];
              if (!cake) return null;
              
              return (
                <motion.div
                  key={`${item.cakeId}-${item.size}-${item.flavor}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-soft p-6"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={cake.images[0]}
                        alt={cake.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-chocolate">
                            {cake.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.size} • {item.flavor}
                          </p>
                          {item.customMessage && (
                            <p className="text-sm text-gray-600 italic">
                              Message: "{item.customMessage}"
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => handleRemoveItem(item.cakeId, item.size, item.flavor)}
                          className="text-error hover:bg-error hover:text-white"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <QuantitySelector
                          quantity={item.quantity}
                          onQuantityChange={(newQuantity) => 
                            handleQuantityChange(item.cakeId, item.size, item.flavor, newQuantity)
                          }
                        />
                        <PriceDisplay price={item.price * item.quantity} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;