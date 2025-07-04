import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Select = forwardRef(({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select an option', 
  className = '', 
  error = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white appearance-none";
  const normalStyles = "border-gray-300 focus:border-caramel focus:ring-caramel";
  const errorStyles = "border-error focus:border-error focus:ring-error";
  const disabledStyles = disabled ? "bg-gray-100 cursor-not-allowed" : "";
  
  return (
    <div className="relative">
      <select
        ref={ref}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${baseStyles} ${error ? errorStyles : normalStyles} ${disabledStyles} ${className}`}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;