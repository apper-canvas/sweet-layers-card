const Label = ({ children, htmlFor, className = '', required = false }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-chocolate mb-2 ${className}`}
    >
      {children}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  );
};

export default Label;