import React from 'react';

interface MartyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

export default function MartyLogo({ 
  className = '', 
  size = 'md', 
  color = '#F43900' 
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
      <svg 
        className={dimensions}
        viewBox="0 0 280 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* m */}
        {/* Left leg */}
        <rect x="0" y="39" width="15" height="41" fill={color} />
        {/* Middle leg */}
        <rect x="31" y="39" width="15" height="41" fill={color} />
        {/* Right leg */}
        <rect x="62" y="39" width="15" height="41" fill={color} />
        {/* Arch 1 */}
        <path 
          d="M 0,39 C 0,26.3 10.3,16 23,16 C 35.7,16 46,26.3 46,39 L 46,45 L 31,45 L 31,39 C 31,34.6 27.4,31 23,31 C 18.6,31 15,34.6 15,39 L 15,45 L 0,45 Z" 
          fill={color} 
        />
        {/* Arch 2 */}
        <path 
          d="M 31,39 C 31,26.3 41.3,16 54,16 C 66.7,16 77,26.3 77,39 L 77,45 L 62,45 L 62,39 C 62,34.6 58.4,31 54,31 C 49.6,31 46,34.6 46,39 L 46,45 L 31,45 Z" 
          fill={color} 
        />

        {/* a */}
        {/* Circle with hole cut out */}
        <path 
          fillRule="evenodd" 
          clipRule="evenodd"
          d="M 109,34 C 121.7,34 132,44.3 132,57 C 132,69.7 121.7,80 109,80 C 96.3,80 86,69.7 86,57 C 86,44.3 96.3,34 109,34 Z M 109,49 C 113.4,49 117,52.6 117,57 C 117,61.4 113.4,65 109,65 C 104.6,65 101,61.4 101,57 C 101,52.6 104.6,49 109,49 Z" 
          fill={color} 
        />
        {/* Right stem */}
        <rect x="117" y="34" width="15" height="46" fill={color} />

        {/* r */}
        {/* Stem and hook */}
        <path 
          d="M 141,34 L 176,34 C 181.5,34 186,38.5 186,44 L 186,49 L 171,49 C 171,46.2 168.8,44 166,44 L 156,44 L 156,80 L 141,80 Z" 
          fill={color} 
        />

        {/* t */}
        {/* Vertical stem */}
        <rect x="195" y="10" width="15" height="70" fill={color} />
        {/* Crossbar */}
        <rect x="189" y="34" width="33" height="15" fill={color} />

        {/* y */}
        {/* Cup */}
        <path 
          d="M 231,34 L 231,57 C 231,69.7 241.3,80 254,80 C 266.7,80 277,69.7 277,57 L 277,34 L 262,34 L 262,57 C 262,61.4 258.4,65 254,65 C 249.6,65 246,61.4 246,57 L 246,34 Z" 
          fill={color} 
        />
        {/* Tail */}
        <path 
          d="M 262,57 L 277,57 L 277,90 C 277,102.7 266.7,113 254,113 L 246,113 C 237.7,113 231,106.3 231,98 L 246,98 C 246,100.8 248.2,103 251,103 L 254,103 C 258.4,103 262,99.4 262,95 Z" 
          fill={color} 
        />
      </svg>
    </div>
  );
}
