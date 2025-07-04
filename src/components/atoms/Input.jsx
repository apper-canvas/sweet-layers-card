import { forwardRef } from 'react';

const Input = forwardRef(({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '', 
  error = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white";
  const normalStyles = "border-gray-300 focus:border-caramel focus:ring-caramel";
  const errorStyles = "border-error focus:border-error focus:ring-error";
  const disabledStyles = disabled ? "bg-gray-100 cursor-not-allowed" : "";
  
  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${baseStyles} ${error ? errorStyles : normalStyles} ${disabledStyles} ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;