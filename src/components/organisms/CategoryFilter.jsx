import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={activeCategory === 'all' ? 'primary' : 'ghost'}
        onClick={() => onCategoryChange('all')}
        className="mb-2"
      >
        All Cakes
      </Button>
      {categories.map((category) => (
        <motion.div key={category} whileHover={{ scale: 1.05 }}>
          <Button
            variant={activeCategory === category ? 'primary' : 'ghost'}
            onClick={() => onCategoryChange(category)}
            className="mb-2"
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryFilter;