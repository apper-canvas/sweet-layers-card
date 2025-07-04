import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const Footer = () => {
  return (
    <footer className="bg-chocolate text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-caramel to-pink rounded-lg flex items-center justify-center">
                <ApperIcon name="Cake" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display">Sweet Layers</span>
            </div>
            <p className="text-gray-300">
              Creating memorable moments with our artisanal cakes and custom creations.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-caramel transition-colors">Home</Link></li>
              <li><Link to="/catalog" className="text-gray-300 hover:text-caramel transition-colors">Shop</Link></li>
              <li><Link to="/catalog?category=custom" className="text-gray-300 hover:text-caramel transition-colors">Custom Cakes</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-caramel transition-colors">About</Link></li>
            </ul>
          </div>
          
          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hours</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Monday - Friday: 7am - 7pm</li>
              <li>Saturday: 8am - 8pm</li>
              <li>Sunday: 9am - 6pm</li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Phone" className="w-4 h-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Mail" className="w-4 h-4" />
                <span>hello@sweetlayers.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="MapPin" className="w-4 h-4" />
                <span>123 Baker Street, Sweet City</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Sweet Layers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;