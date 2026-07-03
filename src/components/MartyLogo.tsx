import React from 'react';
// @ts-expect-error - PNG file import
import logoUrl from '../../assets/Images/Logo.png';

interface MartyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function MartyLogo({ 
  className = '', 
  size = 'md' 
}: MartyLogoProps) {
  
  // Size mapping
  const sizeClasses = {
    sm: 'w-16 h-7',
    md: 'w-28 h-12',
    lg: 'w-40 h-17',
    xl: 'w-56 h-24'
  };

  const dimensions = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <img 
        src={logoUrl} 
        alt="Marty Logo" 
        className={`${dimensions} object-contain`} 
      />
    </div>
  );
}
