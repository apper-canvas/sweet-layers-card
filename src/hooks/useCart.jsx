import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('sweetlayers_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sweetlayers_cart', JSON.stringify(cart));
  }, [cart]);
  
  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => 
        cartItem.cakeId === item.cakeId && 
        cartItem.size === item.size && 
        cartItem.flavor === item.flavor
      );
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        return updatedCart;
      } else {
        return [...prevCart, item];
      }
    });
  };
  
  const removeFromCart = (cakeId, size, flavor) => {
    setCart(prevCart => 
      prevCart.filter(item => 
        !(item.cakeId === cakeId && item.size === size && item.flavor === flavor)
      )
    );
  };
  
  const updateQuantity = (cakeId, size, flavor, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cakeId, size, flavor);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.cakeId === cakeId && item.size === size && item.flavor === flavor
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
  
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};