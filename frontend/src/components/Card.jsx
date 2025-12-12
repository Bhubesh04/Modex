import React from 'react';

const Card = ({ children, className = '', hover = false, onClick, variant = 'default' }) => {
  const baseClasses = 'bg-white rounded-xl shadow-md p-6 transition-all duration-300';
  
  const variantClasses = {
    default: 'border border-gray-100',
    elevated: 'shadow-lg',
    outlined: 'border-2 border-gray-200',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100'
  };
  
  const hoverClasses = hover || onClick 
    ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' 
    : '';
  
  const clickClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;


