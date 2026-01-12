import React from 'react';

export const VerveHubLogo = ({ size = 'md' }) => {
  const sizeMap = {
    sm: 60,
    md: 90,
    lg: 120,
    xl: 150,
  };
  const width = sizeMap[size];
  return (
    <div style={{ display: 'inline-block' }}>
      <svg
        width={width}
        height={width}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.4" floodColor="#000"/>
          </filter>
        </defs>
        {/* Combined V and H */}
        <g filter="url(#shadow)">
          {/* Left leg of V */}
          <path
            d="M 60 70 L 85 130 L 97 130 L 97 70 L 85 70 L 85 115 Z"
            fill="url(#mainGrad)"
          />
          
          {/* Center stroke (shared between V and H) */}
          <path
            d="M 97 70 L 97 130 L 109 130 L 109 70 Z"
            fill="url(#mainGrad)"
          />
          
          {/* H crossbar */}
          <rect
            x="97"
            y="95"
            width="35"
            height="10"
            fill="url(#mainGrad)"
          />
          
          {/* Right side of H */}
          <path
            d="M 120 70 L 120 130 L 132 130 L 132 70 Z"
            fill="url(#mainGrad)"
          />
        </g>
        {/* ACADEMY text */}
        <text
          x="100"
          y="155"
          fontFamily="Arial, sans-serif"
          fontSize="12"
          fontWeight="bold"
          fill="#059669"
          textAnchor="middle"
          letterSpacing="1.5"
        >
          ACADEMY
        </text>
      </svg>
    </div>
  );
};

export default VerveHubLogo;