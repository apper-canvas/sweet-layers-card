import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import ApperIcon from '@/components/ApperIcon';

const CartIcon = ({ onClick }) => {
  const { cart } = useCart();
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative p-2 text-chocolate hover:text-caramel transition-colors duration-200"
    >
      <ApperIcon name="ShoppingCart" className="w-6 h-6" />
      {totalItems > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
        >
          {totalItems}
        </motion.span>
      )}
    </motion.button>
  );
};

export default CartIcon;