const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-cream text-chocolate',
    primary: 'bg-caramel text-white',
    secondary: 'bg-pink text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-chocolate',
    error: 'bg-error text-white',
    info: 'bg-info text-white'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;