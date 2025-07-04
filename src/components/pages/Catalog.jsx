import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CakeGrid from '@/components/organisms/CakeGrid';
import CategoryFilter from '@/components/organisms/CategoryFilter';
import SearchBar from '@/components/molecules/SearchBar';
import FilterSidebar from '@/components/organisms/FilterSidebar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { cakeService } from '@/services/api/cakeService';
import { useNavigate } from 'react-router-dom';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [cakes, setCakes] = useState([]);
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 200],
    sizes: [],
    dietary: []
  });
  
  const categories = ['birthday', 'wedding', 'custom', 'cupcakes'];
  
  useEffect(() => {
    loadCakes();
  }, []);
  
useEffect(() => {
    filterCakes();
  }, [cakes, activeCategory, searchTerm, filters]);
  
  const loadCakes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cakeService.getAll();
      setCakes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
const filterCakes = () => {
    let filtered = cakes;
    
    // Category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(cake => 
        cake.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    
    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(cake =>
        cake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cake.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cake.availableFlavors.some(flavor => 
          flavor.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Price range filter
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200) {
      filtered = filtered.filter(cake => 
        cake.basePrice >= filters.priceRange[0] && 
        cake.basePrice <= filters.priceRange[1]
      );
    }
    
    // Size filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(cake =>
        cake.availableSizes.some(size => filters.sizes.includes(size))
      );
    }
    
    // Dietary restrictions filter
    if (filters.dietary.length > 0) {
      filtered = filtered.filter(cake => {
        // For demo purposes, we'll check if description mentions dietary options
        const description = cake.description.toLowerCase();
        return filters.dietary.some(dietary => {
          switch (dietary) {
            case 'vegan':
              return description.includes('vegan') || cake.name.toLowerCase().includes('vegan');
            case 'gluten-free':
              return description.includes('gluten-free') || description.includes('gluten free');
            case 'sugar-free':
              return description.includes('sugar-free') || description.includes('sugar free');
            case 'dairy-free':
              return description.includes('dairy-free') || description.includes('dairy free');
            default:
              return false;
          }
        });
      });
    }
    
    setFilteredCakes(filtered);
  };
  
const handleCategoryChange = (category) => {
    setActiveCategory(category);
    updateSearchParams({ category: category === 'all' ? undefined : category });
  };
  
  const handleSearch = (term) => {
    setSearchTerm(term);
    updateSearchParams({ search: term || undefined });
  };
  
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    updateSearchParams({
      priceMin: newFilters.priceRange[0] > 0 ? newFilters.priceRange[0] : undefined,
      priceMax: newFilters.priceRange[1] < 200 ? newFilters.priceRange[1] : undefined,
      sizes: newFilters.sizes.length > 0 ? newFilters.sizes.join(',') : undefined,
      dietary: newFilters.dietary.length > 0 ? newFilters.dietary.join(',') : undefined
    });
  };
  
  const updateSearchParams = (newParams) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const updatedParams = { ...currentParams, ...newParams };
    
    // Remove undefined values
    Object.keys(updatedParams).forEach(key => {
      if (updatedParams[key] === undefined) {
        delete updatedParams[key];
      }
    });
    
    setSearchParams(updatedParams);
  };
  
  const handleBrowseAll = () => {
    setActiveCategory('all');
    setSearchTerm('');
    setFilters({
      priceRange: [0, 200],
      sizes: [],
      dietary: []
    });
    setSearchParams({});
  };
  
  const toggleFilterSidebar = () => {
    setIsFilterSidebarOpen(!isFilterSidebarOpen);
  };
  
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200) count++;
    if (filters.sizes.length > 0) count++;
    if (filters.dietary.length > 0) count++;
    return count;
  };
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCakes} />;
  
return (
    <div className="min-h-screen bg-vanilla py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-display text-chocolate mb-4 gradient-text">
            Our Cake Collection
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover our full range of handcrafted cakes, perfect for any occasion
          </p>
          
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-1">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search cakes, flavors, or descriptions..."
                className="max-w-md"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={toggleFilterSidebar}
                className="lg:hidden relative"
              >
                <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-caramel text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </Button>
            </div>
          </div>
          
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        
        <div className="flex gap-8">
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isOpen={isFilterSidebarOpen}
            onToggle={toggleFilterSidebar}
            className="w-80 flex-shrink-0"
          />
          
          <div className="flex-1">
            {filteredCakes.length === 0 ? (
              <Empty
                title="No cakes found"
                message="Try adjusting your search or browse all our delicious options"
                actionLabel="Browse All Cakes"
                onAction={handleBrowseAll}
                icon="Search"
              />
            ) : (
              <CakeGrid cakes={filteredCakes} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;