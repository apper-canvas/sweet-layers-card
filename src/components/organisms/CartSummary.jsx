import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import PriceDisplay from '@/components/molecules/PriceDisplay';
import Button from '@/components/atoms/Button';
import { useNavigate } from 'react-router-dom';

const CartSummary = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-soft p-6 sticky top-24"
    >
      <h3 className="text-xl font-semibold text-chocolate mb-4">Order Summary</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <PriceDisplay price={subtotal} className="text-base" />
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (8%)</span>
          <PriceDisplay price={tax} className="text-base" />
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-chocolate">Total</span>
            <PriceDisplay price={total} />
          </div>
        </div>
      </div>
      
      <Button
        variant="primary"
        size="large"
        onClick={handleCheckout}
        disabled={cart.length === 0}
        className="w-full mt-6"
      >
        Proceed to Checkout
      </Button>
    </motion.div>
  );
};

export default CartSummary;