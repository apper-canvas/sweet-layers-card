import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const QuantitySelector = ({ quantity, onQuantityChange, min = 1, max = 10 }) => {
  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };
  
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="small"
        onClick={handleDecrease}
        disabled={quantity <= min}
        className="p-2 w-8 h-8 flex items-center justify-center"
      >
        <ApperIcon name="Minus" className="w-4 h-4" />
      </Button>
      <motion.span
        key={quantity}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="w-12 text-center font-medium text-chocolate"
      >
        {quantity}
      </motion.span>
      <Button
        variant="outline"
        size="small"
        onClick={handleIncrease}
        disabled={quantity >= max}
        className="p-2 w-8 h-8 flex items-center justify-center"
      >
        <ApperIcon name="Plus" className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default QuantitySelector;