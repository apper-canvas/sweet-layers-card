import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';

const FilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onToggle,
  className = '' 
}) => {
  const [priceRange, setPriceRange] = useState(filters.priceRange || [0, 200]);
  const [selectedSizes, setSelectedSizes] = useState(filters.sizes || []);
  const [dietaryRestrictions, setDietaryRestrictions] = useState(filters.dietary || []);
  
  const availableSizes = [
    'Small (6")',
    'Medium (8")',
    'Large (10")',
    'Extra Large (12")',
    'Three-Tier',
    'Custom Size'
  ];
  
  const dietaryOptions = [
    { id: 'vegan', label: 'Vegan', icon: 'Leaf' },
    { id: 'gluten-free', label: 'Gluten-Free', icon: 'ShieldCheck' },
    { id: 'sugar-free', label: 'Sugar-Free', icon: 'Heart' },
    { id: 'dairy-free', label: 'Dairy-Free', icon: 'Milk' }
  ];
  
  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    const newRange = e.target.name === 'min' ? [value, priceRange[1]] : [priceRange[0], value];
    setPriceRange(newRange);
    onFiltersChange({
      ...filters,
      priceRange: newRange
    });
  };
  
  const handleSizeToggle = (size) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    
    setSelectedSizes(newSizes);
    onFiltersChange({
      ...filters,
      sizes: newSizes
    });
  };
  
  const handleDietaryToggle = (restriction) => {
    const newRestrictions = dietaryRestrictions.includes(restriction)
      ? dietaryRestrictions.filter(r => r !== restriction)
      : [...dietaryRestrictions, restriction];
    
    setDietaryRestrictions(newRestrictions);
    onFiltersChange({
      ...filters,
      dietary: newRestrictions
    });
  };
  
  const handleClearFilters = () => {
    setPriceRange([0, 200]);
    setSelectedSizes([]);
    setDietaryRestrictions([]);
    onFiltersChange({
      priceRange: [0, 200],
      sizes: [],
      dietary: []
    });
  };
  
  const hasActiveFilters = priceRange[0] > 0 || priceRange[1] < 200 || 
                          selectedSizes.length > 0 || dietaryRestrictions.length > 0;
  
  const sidebarContent = (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-chocolate">Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-chocolate">Price Range</Label>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">$</span>
            <input
              type="range"
              name="min"
              min="0"
              max="200"
              value={priceRange[0]}
              onChange={handlePriceChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #D4A574 0%, #D4A574 ${priceRange[0]/2}%, #e5e7eb ${priceRange[0]/2}%, #e5e7eb 100%)`
              }}
            />
            <span className="text-sm text-gray-600">$</span>
            <input
              type="range"
              name="max"
              min="0"
              max="200"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${priceRange[1]/2}%, #D4A574 ${priceRange[1]/2}%, #D4A574 100%)`
              }}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
      
      {/* Size Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-chocolate">Size</Label>
        <div className="grid grid-cols-2 gap-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={`p-2 rounded-lg text-sm transition-all ${
                selectedSizes.includes(size)
                  ? 'bg-caramel text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      {/* Dietary Restrictions */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-chocolate">Dietary Options</Label>
        <div className="space-y-2">
          {dietaryOptions.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={dietaryRestrictions.includes(option.id)}
                onChange={() => handleDietaryToggle(option.id)}
                className="w-4 h-4 text-caramel bg-gray-100 border-gray-300 rounded focus:ring-caramel focus:ring-2"
              />
              <ApperIcon 
                name={option.icon} 
                className="w-4 h-4 text-gray-600 group-hover:text-caramel transition-colors" 
              />
              <span className="text-sm text-gray-700 group-hover:text-chocolate transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>
      
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block ${className}`}>
        {sidebarContent}
      </div>
      
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-80 bg-white z-50 lg:hidden overflow-y-auto"
            style={{ paddingTop: '1rem' }}
          >
            <div className="p-4">
              {sidebarContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterSidebar;