import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import PriceDisplay from '@/components/molecules/PriceDisplay';
import QuantitySelector from '@/components/molecules/QuantitySelector';
import FormField from '@/components/molecules/FormField';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { cakeService } from '@/services/api/cakeService';
import { useCart } from '@/hooks/useCart';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [cake, setCake] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  
  const sizeMultipliers = {
    'Small (6")': 1,
    'Medium (8")': 1.5,
    'Large (10")': 2,
    'Extra Large (12")': 2.5
  };
  
  useEffect(() => {
    loadCake();
  }, [id]);
  
  useEffect(() => {
    if (cake && selectedSize) {
      const multiplier = sizeMultipliers[selectedSize] || 1;
      setCurrentPrice(cake.basePrice * multiplier);
    }
  }, [cake, selectedSize]);
  
  const loadCake = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cakeService.getById(parseInt(id));
      setCake(data);
      setSelectedSize(data.availableSizes[0]);
      setSelectedFlavor(data.availableFlavors[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToCart = () => {
    if (!selectedSize || !selectedFlavor) {
      toast.error('Please select size and flavor');
      return;
    }
    
    const cartItem = {
      cakeId: cake.Id,
      quantity,
      size: selectedSize,
      flavor: selectedFlavor,
      customMessage,
      price: currentPrice
    };
    
    addToCart(cartItem);
    toast.success(`${cake.name} added to cart!`);
  };
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCake} />;
  if (!cake) return <Error message="Cake not found" />;
  
  return (
    <div className="min-h-screen bg-vanilla py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/catalog')}
          className="mb-6 flex items-center gap-2"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4" />
          Back to Catalog
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square bg-white rounded-lg shadow-soft overflow-hidden"
            >
              <img
                src={cake.images[selectedImage]}
                alt={cake.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {cake.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {cake.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-caramel' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${cake.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="default">{cake.category}</Badge>
                {cake.customizable && (
                  <Badge variant="secondary">Customizable</Badge>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-display text-chocolate mb-4">
                {cake.name}
              </h1>
              <PriceDisplay price={currentPrice} className="mb-4" />
              <p className="text-gray-600 text-lg leading-relaxed">
                {cake.description}
              </p>
            </div>
            
            <div className="space-y-4">
              <FormField
                label="Size"
                type="select"
                value={selectedSize}
                onChange={setSelectedSize}
                options={cake.availableSizes.map(size => ({
                  value: size,
                  label: size
                }))}
                required
              />
              
              <FormField
                label="Flavor"
                type="select"
                value={selectedFlavor}
                onChange={setSelectedFlavor}
                options={cake.availableFlavors.map(flavor => ({
                  value: flavor,
                  label: flavor
                }))}
                required
              />
              
              {cake.customizable && (
                <FormField
                  label="Custom Message (Optional)"
                  type="text"
                  value={customMessage}
                  onChange={setCustomMessage}
                  placeholder="Enter your custom message..."
                />
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-chocolate mb-2">
                    Quantity
                  </label>
                  <QuantitySelector
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button
                variant="primary"
                size="large"
                onClick={handleAddToCart}
                className="flex-1"
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="large"
                onClick={() => navigate('/cart')}
                className="flex items-center gap-2"
              >
                <ApperIcon name="ShoppingCart" className="w-5 h-5" />
                View Cart
              </Button>
            </div>
            
            <div className="bg-cream rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-chocolate">
                <ApperIcon name="Clock" className="w-4 h-4" />
                <span>24-48 hours advance notice required</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-chocolate">
                <ApperIcon name="Truck" className="w-4 h-4" />
                <span>Free delivery on orders over $50</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-chocolate">
                <ApperIcon name="Phone" className="w-4 h-4" />
                <span>Call (555) 123-4567 for custom orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;