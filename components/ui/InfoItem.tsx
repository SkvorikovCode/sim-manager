import React from 'react';

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, className = '' }) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:justify-between items-start sm:items-center py-2 ${className}`}>
      <span className="text-secondary-500 text-sm mb-1 sm:mb-0">{label}</span>
      <div className="font-medium text-right w-full sm:w-auto">{value}</div>
    </div>
  );
};

export default InfoItem;