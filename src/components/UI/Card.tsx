import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div className={`
      bg-gray-800 border border-gray-700 rounded-lg p-6 
      ${hover ? 'hover:border-yellow-400 transition-colors duration-200' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;