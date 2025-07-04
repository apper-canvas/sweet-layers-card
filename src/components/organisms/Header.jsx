import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import CartIcon from '@/components/molecules/CartIcon';
import ApperIcon from '@/components/ApperIcon';
import { AuthContext } from '../../App';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/catalog' },
    { name: 'Custom Cakes', path: '/catalog?category=custom' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];
  
  const handleCartClick = () => {
    navigate('/cart');
  };
  
  return (
    <header className="bg-white shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 5 }}
              className="w-10 h-10 bg-gradient-to-r from-caramel to-chocolate rounded-lg flex items-center justify-center"
            >
              <ApperIcon name="Cake" className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-display text-chocolate gradient-text">
              Sweet Layers
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-chocolate hover:text-caramel transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
{/* Cart, User Actions and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <CartIcon onClick={handleCartClick} />
            
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-chocolate">
                  Hi, {user?.firstName || user?.name || 'User'}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-chocolate hover:text-caramel transition-colors duration-200"
                >
                  <ApperIcon name="LogOut" className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-chocolate hover:text-caramel transition-colors duration-200"
            >
              <ApperIcon name={isMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
          >
<div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-chocolate hover:text-caramel hover:bg-cream rounded-lg transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-chocolate hover:text-caramel hover:bg-cream rounded-lg transition-colors duration-200"
                >
                  <ApperIcon name="LogOut" className="w-4 h-4" />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;