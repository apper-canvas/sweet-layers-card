import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const FormField = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  error = null,
  options = [],
  className = ''
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      {type === 'select' ? (
        <Select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          options={options}
          error={!!error}
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          error={!!error}
        />
      )}
      {error && (
        <p className="text-error text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;