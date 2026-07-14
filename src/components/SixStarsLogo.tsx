import React from 'react';

interface SixStarsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function SixStarsLogo({ className = '', size = 'md' }: SixStarsLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-32 h-32',
  };

  const selectedSize = sizeClasses[size];

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${selectedSize} ${className}`}>
      <svg
        className="w-full h-full drop-shadow-[0_2px_10px_rgba(245,158,11,0.4)] hover:scale-105 transition-transform duration-300"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Star 1 (Top Left) */}
        <path
          d="M 25,18 L 27.5,23.5 L 33.5,24 L 29,28 L 30.5,34 L 25,31 L 19.5,34 L 21,28 L 16.5,24 L 22.5,23.5 Z"
          fill="url(#goldGradient)"
        />
        {/* Star 2 (Top Middle) */}
        <path
          d="M 50,18 L 52.5,23.5 L 58.5,24 L 54,28 L 55.5,34 L 50,31 L 44.5,34 L 46,28 L 41.5,24 L 47.5,23.5 Z"
          fill="url(#goldGradient)"
        />
        {/* Star 3 (Top Right) */}
        <path
          d="M 75,18 L 77.5,23.5 L 83.5,24 L 79,28 L 80.5,34 L 75,31 L 69.5,34 L 71,28 L 66.5,24 L 72.5,23.5 Z"
          fill="url(#goldGradient)"
        />
        {/* Star 4 (Bottom Left) */}
        <path
          d="M 25,52 L 27.5,57.5 L 33.5,58 L 29,62 L 30.5,68 L 25,65 L 19.5,68 L 21,62 L 16.5,58 L 22.5,57.5 Z"
          fill="url(#goldGradient)"
        />
        {/* Star 5 (Bottom Middle) */}
        <path
          d="M 50,52 L 52.5,57.5 L 58.5,58 L 54,62 L 55.5,68 L 50,65 L 44.5,68 L 46,62 L 41.5,58 L 47.5,57.5 Z"
          fill="url(#goldGradient)"
        />
        {/* Star 6 (Bottom Right) */}
        <path
          d="M 75,52 L 77.5,57.5 L 83.5,58 L 79,62 L 80.5,68 L 75,65 L 69.5,68 L 71,62 L 66.5,58 L 72.5,57.5 Z"
          fill="url(#goldGradient)"
        />

        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" /> {/* Amber 200 */}
            <stop offset="30%" stopColor="#facc15" /> {/* Yellow 400 */}
            <stop offset="70%" stopColor="#eab308" /> {/* Yellow 500 */}
            <stop offset="100%" stopColor="#a16207" /> {/* Yellow 700 */}
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
