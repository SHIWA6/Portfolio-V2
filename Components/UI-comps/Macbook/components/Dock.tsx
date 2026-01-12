import React from "react";
import {useState, useEffect, useCallback} from "react"
import { AppConfig, WindowState } from "../types";

interface DockProps {
  apps: AppConfig[];
  windows: WindowState[];
  onAppClick: (appId: string) => void;
}

const Dock: React.FC<DockProps> = ({ apps, windows, onAppClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [bouncingApp, setBouncingApp] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // macOS-style bounce animation when app is clicked
  const handleAppClick = useCallback((appId: string) => {
    setBouncingApp(appId);
    
    // Trigger the actual app open after a slight delay for visual feedback
    setTimeout(() => {
      onAppClick(appId);
    }, 100);
    
    // Clear bounce state after animation completes
    setTimeout(() => {
      setBouncingApp(null);
    }, 600);
  }, [onAppClick]);

  const getScale = (index: number): number => {
    if (isMobile) return 1;
    if (hoveredIndex === null) return 1;
    if (hoveredIndex === index) return 1.5;
    if (Math.abs(hoveredIndex - index) === 1) return 1.25;
    if (Math.abs(hoveredIndex - index) === 2) return 1.1;
    return 1;
  };

  // Mobile: smaller icons, tighter spacing
  const iconSize = isMobile ? 'w-10 h-10' : 'w-11 h-11';
  const iconInnerSize = isMobile ? 'w-5 h-5' : 'w-6 h-6';

  return (
    <div className={`absolute left-1/2 transform -translate-x-1/2 z-40 ${isMobile ? 'bottom-10' : 'bottom-3'}`}>
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl px-2 py-1.5 border border-white/30 shadow-2xl">
        {/* Fixed height container to prevent layout shift */}
        <div 
          className="flex items-end justify-center"
          style={{ 
            height: isMobile ? '48px' : '58px',
            gap: isMobile ? '4px' : '5px',
          }}
        >
          {apps.map((app, index) => {
            const Icon = app.icon;
            const isOpen = windows.some(w => w.appId === app.id && !w.isMinimized);
            const isBouncing = bouncingApp === app.id;
            const scale = getScale(index);

            return (
              <div
                key={app.id}
                className="cursor-pointer flex flex-col items-center justify-end"
                style={{ 
                  height: '100%',
                }}
                onMouseEnter={() => !isMobile && setHoveredIndex(index)}
                onMouseLeave={() => !isMobile && setHoveredIndex(null)}
                onClick={() => handleAppClick(app.id)}
                role="button"
                tabIndex={0}
                aria-label={`Open ${app.name}`}
                onKeyDown={(e) => e.key === 'Enter' && handleAppClick(app.id)}
              >
                <div 
                  className={`${iconSize} ${app.color} rounded-xl flex items-center justify-center shadow-lg ${
                    isBouncing ? 'dock-bounce' : ''
                  }`}
                  style={{
                    transform: isMobile ? undefined : `scale(${scale})`,
                    transition: 'transform 0.15s ease-out',
                    transformOrigin: 'bottom center',
                  }}
                >
                  <Icon className={`${iconInnerSize} text-white`} />
                </div>
                {/* App indicator dot */}
                <div 
                  className="w-1 h-1 rounded-full mt-1"
                  style={{
                    backgroundColor: isOpen ? 'white' : 'transparent',
                    boxShadow: isOpen ? '0 0 4px rgba(255,255,255,0.8)' : 'none',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* CSS for bounce animation */}
      <style jsx>{`
        @keyframes dockBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          20% { transform: translateY(-16px) scale(1); }
          40% { transform: translateY(0) scale(1); }
          60% { transform: translateY(-8px) scale(1); }
          80% { transform: translateY(0) scale(1); }
        }
        .dock-bounce {
          animation: dockBounce 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};
export default Dock;