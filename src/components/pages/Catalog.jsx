import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CakeGrid from '@/components/organisms/CakeGrid';
import CategoryFilter from '@/components/organisms/CategoryFilter';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
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
  
  const categories = ['birthday', 'wedding', 'custom', 'cupcakes'];
  
  useEffect(() => {
    loadCakes();
  }, []);
  
  useEffect(() => {
    filterCakes();
  }, [cakes, activeCategory, searchTerm]);
  
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
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(cake => 
        cake.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(cake =>
        cake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cake.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cake.availableFlavors.some(flavor => 
          flavor.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    setFilteredCakes(filtered);
  };
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  const handleBrowseAll = () => {
    setActiveCategory('all');
    setSearchTerm('');
    setSearchParams({});
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
          </div>
          
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        
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
  );
};

export default Catalog;