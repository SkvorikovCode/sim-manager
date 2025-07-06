import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  height = 'h-4',
  width = 'w-full',
  rounded = true,
}) => {
  return (
    <div 
      className={`animate-pulse bg-secondary-200 dark:bg-secondary-700 ${height} ${width} ${rounded ? 'rounded' : ''} ${className}`}
    />
  );
};

export default Skeleton;