import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '@/components/atoms/Button';
import CakeGrid from '@/components/organisms/CakeGrid';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { cakeService } from '@/services/api/cakeService';
import ApperIcon from '@/components/ApperIcon';

const Home = () => {
  const navigate = useNavigate();
  const [featuredCakes, setFeaturedCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadFeaturedCakes();
  }, []);
  
  const loadFeaturedCakes = async () => {
    try {
      setLoading(true);
      setError(null);
      const cakes = await cakeService.getAll();
      setFeaturedCakes(cakes.slice(0, 6));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const categories = [
    { name: 'Birthday', icon: 'Gift', color: 'from-pink to-caramel' },
    { name: 'Wedding', icon: 'Heart', color: 'from-caramel to-chocolate' },
    { name: 'Custom', icon: 'Palette', color: 'from-chocolate to-pink' },
    { name: 'Cupcakes', icon: 'Cake', color: 'from-pink to-chocolate' }
  ];
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadFeaturedCakes} />;
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-vanilla to-cream py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-6xl font-display text-chocolate mb-6">
                Sweet Moments
                <span className="block gradient-text">Made Perfect</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Handcrafted cakes that make every celebration unforgettable. From custom designs to classic favorites, we create sweet memories one layer at a time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="large"
                  onClick={() => navigate('/catalog')}
                  className="text-lg px-8 py-4"
                >
                  Browse Our Cakes
                </Button>
                <Button
                  variant="outline"
                  size="large"
                  onClick={() => navigate('/catalog?category=custom')}
                  className="text-lg px-8 py-4"
                >
                  Custom Orders
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Beautiful layered cake"
                  className="w-full h-96 object-cover rounded-2xl shadow-lift"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-r from-caramel to-pink rounded-2xl opacity-20"></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-display text-chocolate mb-4">
              What's Your Occasion?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every celebration deserves the perfect cake. Explore our categories and find your sweet match.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(`/catalog?category=${category.name.toLowerCase()}`)}
                className="bg-white rounded-lg shadow-soft hover:shadow-lift transition-all duration-300 p-6 cursor-pointer scalloped-border"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <ApperIcon name={category.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-chocolate text-center mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-center">
                  Perfect for {category.name.toLowerCase()} celebrations
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Cakes Section */}
      <section className="py-16 bg-vanilla">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-display text-chocolate mb-4">
              Featured Creations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most loved cakes, handcrafted with premium ingredients and endless love.
            </p>
          </motion.div>
          
          <CakeGrid cakes={featuredCakes} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate('/catalog')}
              className="text-lg px-8 py-4"
            >
              View All Cakes
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-chocolate to-caramel text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-display mb-4">
              Sweet Updates
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Get the latest news about new flavors, seasonal specials, and exclusive offers delivered to your inbox.
            </p>
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg text-chocolate focus:outline-none focus:ring-2 focus:ring-pink"
              />
              <Button variant="secondary" size="large" className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;