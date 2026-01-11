import React, { ReactNode } from 'react';

const MacBookFrame: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    // Fixed viewport container - never scrolls
    <div 
      className="fixed inset-0 w-screen h-screen bg-black flex items-center justify-center"
      style={{ 
        overflow: 'hidden',
        // Prevent any touch/wheel events from causing scroll
        touchAction: 'none',
      }}
    >
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        {/* Screen Container */}
        <div className="relative flex-1 min-h-0 bg-black overflow-hidden">
          {/* Reflection overlay (subtle) */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-50" />
          {children}
        </div>
      </div>
    </div>
  );
};

export default MacBookFrame;