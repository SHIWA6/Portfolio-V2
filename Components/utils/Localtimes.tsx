"use client";

import { useEffect, useState } from "react";
import { Space_Mono } from "next/font/google";

const space_mono = Space_Mono({ 
  subsets: ['latin'],
  display: 'swap',
  weight: '400'
});

const LocalTime = () => {
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    setCurrentTime(new Date());

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex gap-2 items-center text-white py-4 px-4 ${space_mono.className} font-semibold bg-black/30 rounded-md w-max`}>
      <a 
        href="https://www.google.com/search?q=time" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:text-[#00FFD1]/90 transition-all duration-100"
      >
        <span className="md:text-sm text-base">
          {currentTime ? currentTime.toLocaleTimeString() : "--:--:--"}
        </span>
      </a>
      <span className={`text-sm ${space_mono.className}`}> (GMT+5:30)</span>
      <span className={` text-sm ${space_mono.className}`}> Lucknow, India</span>
    </div>
  );
};

export default LocalTime;