import React from 'react';

const DoctorLogo = ({ size = 40 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.2))' }}
    >
      {/* Outer Glow/Shadow Circle */}
      <circle cx="50" cy="50" r="48" fill="#064E3B" fillOpacity="0.2" />
      
      {/* Outer Emerald Border */}
      <circle cx="50" cy="50" r="45" stroke="#10B981" strokeWidth="4" />
      
      {/* Silver Inner Ring */}
      <circle cx="50" cy="50" r="40" stroke="#E2E8F0" strokeWidth="2" />
      
      {/* Clock Background */}
      <circle cx="50" cy="50" r="38" fill="#064E3B" />
      
      {/* Center Dial (Silver) */}
      <circle cx="50" cy="50" r="28" fill="#F1F5F9" />
      
      {/* Green Emerald Markers (12, 3, 6, 9) */}
      <rect x="48" y="26" width="4" height="6" rx="1" fill="#10B981" />
      <rect x="68" y="48" width="6" height="4" rx="1" fill="#10B981" />
      <rect x="48" y="68" width="4" height="6" rx="1" fill="#10B981" />
      <rect x="26" y="48" width="6" height="4" rx="1" fill="#10B981" />
      
      {/* Smaller Dots for other hours */}
      <circle cx="61" cy="31" r="2" fill="#10B981" />
      <circle cx="69" cy="39" r="2" fill="#10B981" />
      <circle cx="69" cy="61" r="2" fill="#10B981" />
      <circle cx="61" cy="69" r="2" fill="#10B981" />
      <circle cx="39" cy="69" r="2" fill="#10B981" />
      <circle cx="31" cy="61" r="2" fill="#10B981" />
      <circle cx="31" cy="39" r="2" fill="#10B981" />
      <circle cx="39" cy="31" r="2" fill="#10B981" />
      
      {/* Clock Hands (Emerald/Silver) */}
      <line x1="50" y1="50" x2="50" y2="35" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="50" x2="65" y2="50" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
      
      {/* Central Pin */}
      <circle cx="50" cy="50" r="2" fill="#E2E8F0" />
      
      {/* Cross on top (inspired by the image) */}
      <path d="M45 10 H55 V20 H45 Z" fill="#10B981" />
      <path d="M40 15 H60 V22 H40 Z" fill="#10B981" opacity="0" /> {/* just placeholder */}
    </svg>
  );
};

export default DoctorLogo;
