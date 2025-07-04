import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  disabled = false, 
  className = '', 
  type = 'button',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-caramel to-chocolate text-white hover:from-chocolate hover:to-caramel shadow-soft hover:shadow-lift focus:ring-caramel",
    secondary: "bg-gradient-to-r from-pink to-caramel text-white hover:from-caramel hover:to-pink shadow-soft hover:shadow-lift focus:ring-pink",
    outline: "border-2 border-caramel text-caramel hover:bg-caramel hover:text-white focus:ring-caramel",
    ghost: "text-chocolate hover:bg-cream hover:text-caramel focus:ring-caramel",
    danger: "bg-gradient-to-r from-error to-red-500 text-white hover:from-red-500 hover:to-error shadow-soft hover:shadow-lift focus:ring-error"
  };
  
  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg"
  };
  
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;