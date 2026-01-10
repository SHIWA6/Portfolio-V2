import React from 'react';



const MacBookFrame: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    // Changed: p-0 and h-screen to ensure it takes up the full desktop viewport
    <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full flex flex-col">
        {/* Screen Container: Removed the 'MacBook Bezel' padding to make it full-screen UI */}
        <div className="relative flex-1 bg-black overflow-hidden">
          {/* Reflection overlay (subtle) */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-50" />
          {children}
        </div>
      </div>
    </div>
  );
};

export default MacBookFrame;