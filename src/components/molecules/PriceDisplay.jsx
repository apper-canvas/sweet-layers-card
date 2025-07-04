const PriceDisplay = ({ price, originalPrice, className = '' }) => {
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-2xl font-bold text-chocolate gradient-text">
        {formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <span className="text-gray-500 line-through">
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;