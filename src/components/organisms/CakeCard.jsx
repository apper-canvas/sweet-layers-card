import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import PriceDisplay from '@/components/molecules/PriceDisplay';
import { useCart } from '@/hooks/useCart';
import { toast } from 'react-toastify';

const CakeCard = ({ cake }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const handleViewDetails = () => {
    navigate(`/product/${cake.Id}`);
  };
  
  const handleQuickAdd = (e) => {
    e.stopPropagation();
    const defaultItem = {
      cakeId: cake.Id,
      quantity: 1,
      size: cake.availableSizes[0],
      flavor: cake.availableFlavors[0],
      customMessage: '',
      price: cake.basePrice
    };
    addToCart(defaultItem);
    toast.success(`${cake.name} added to cart!`);
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white rounded-lg shadow-soft hover:shadow-lift transition-all duration-300 overflow-hidden cursor-pointer scalloped-border"
      onClick={handleViewDetails}
    >
      <div className="relative">
        <img
          src={cake.images[0]}
          alt={cake.name}
          className="w-full h-48 object-cover"
        />
        {cake.customizable && (
          <Badge className="absolute top-2 right-2" variant="secondary">
            Customizable
          </Badge>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-chocolate">{cake.name}</h3>
          <Badge variant="default">{cake.category}</Badge>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{cake.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex flex-wrap gap-1">
            {cake.availableFlavors.slice(0, 3).map((flavor) => (
              <span key={flavor} className="text-xs bg-cream text-chocolate px-2 py-1 rounded-full">
                {flavor}
              </span>
            ))}
            {cake.availableFlavors.length > 3 && (
              <span className="text-xs bg-cream text-chocolate px-2 py-1 rounded-full">
                +{cake.availableFlavors.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <PriceDisplay price={cake.basePrice} />
          <Button
            variant="secondary"
            size="small"
            onClick={handleQuickAdd}
            className="px-4 py-2"
          >
            Quick Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CakeCard;