import React from 'react';

interface BadgeProps {
  active: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ active, className = '' }) => {
  const statusColor = active 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
  
  const statusText = active ? 'Активен' : 'Приостановлен';
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor} ${className}`}
    >
      <span className={`w-2 h-2 mr-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-red-500'}`}></span>
      {statusText}
    </span>
  );
};

export default Badge;