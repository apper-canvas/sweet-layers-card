import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "No items found", 
  message = "Start browsing our delicious collection", 
  actionLabel = "Browse Cakes",
  onAction,
  icon = "Cake",
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="bg-white rounded-lg shadow-soft p-8 max-w-md mx-auto">
        <div className="w-16 h-16 bg-gradient-to-r from-caramel to-pink rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-chocolate mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        {onAction && (
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;