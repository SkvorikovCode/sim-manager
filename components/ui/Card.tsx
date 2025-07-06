import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`card dark:card-dark ${className}`}>
      {children}
    </div>
  );
};

export default Card;