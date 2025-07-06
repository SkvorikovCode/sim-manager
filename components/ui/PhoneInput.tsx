import React, { forwardRef, useState, useEffect } from 'react';

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  value: string;
  onChange: (value: string) => void;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>((
  { label, error, fullWidth = true, className = '', value, onChange, ...props },
  ref
) => {
  const [formattedValue, setFormattedValue] = useState('');
  
  // Format phone number as +7 XXX XXX-XX-XX
  useEffect(() => {
    if (!value) {
      setFormattedValue('');
      return;
    }
    
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format the phone number
    let formatted = '';
    if (digits.length > 0) {
      formatted = '+' + (digits[0] || '7');
    }
    if (digits.length > 1) {
      formatted += ' ' + digits.substring(1, 4);
    }
    if (digits.length > 4) {
      formatted += ' ' + digits.substring(4, 7);
    }
    if (digits.length > 7) {
      formatted += '-' + digits.substring(7, 9);
    }
    if (digits.length > 9) {
      formatted += '-' + digits.substring(9, 11);
    }
    
    setFormattedValue(formatted);
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digits = inputValue.replace(/\D/g, '');
    onChange(digits);
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const errorClass = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
  
  return (
    <div className={`${widthClass} mb-4`}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type="tel"
        className={`input-field ${errorClass} ${className}`}
        value={formattedValue}
        onChange={handleChange}
        placeholder="+7 XXX XXX-XX-XX"
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;