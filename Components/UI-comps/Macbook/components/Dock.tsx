import React from "react";
import {useState, useEffect} from "react"
import { AppConfig, WindowState } from "../types";

interface DockProps {
  apps: AppConfig[];
  windows: WindowState[];
  onAppClick: (appId: string) => void;
}

const Dock: React.FC<DockProps> = ({ apps, windows, onAppClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getScale = (index: number): number => {
    if (isMobile) return 1; // No scale animation on mobile for performance
    if (hoveredIndex === null) return 1;
    if (hoveredIndex === index) return 1.4;
    if (Math.abs(hoveredIndex - index) === 1) return 1.2;
    return 1;
  };

  // Mobile: smaller icons, tighter spacing
  const iconSize = isMobile ? 'w-10 h-10' : 'w-14 h-14';
  const iconInnerSize = isMobile ? 'w-5 h-5' : 'w-8 h-8';
  const gapSize = isMobile ? 'gap-1' : 'gap-2';
  const padding = isMobile ? 'px-2 py-1.5' : 'px-3 py-2';

  return (
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-40 max-w-[95vw]">
      <div className={`bg-white/20 backdrop-blur-xl rounded-2xl ${padding} border border-white/30 shadow-2xl`}>
        <div className={`flex ${gapSize} items-end overflow-x-auto scrollbar-hide`}>
          {apps.map((app, index) => {
            const Icon = app.icon;
            const isOpen = windows.some(w => w.appId === app.id && !w.isMinimized);

            return (
              <div
                key={app.id}
                className="transition-transform duration-200 cursor-pointer flex-shrink-0"
                style={{ transform: isMobile ? undefined : `scale(${getScale(index)})` }}
                onMouseEnter={() => !isMobile && setHoveredIndex(index)}
                onMouseLeave={() => !isMobile && setHoveredIndex(null)}
                onClick={() => onAppClick(app.id)}
                role="button"
                tabIndex={0}
                aria-label={`Open ${app.name}`}
                onKeyDown={(e) => e.key === 'Enter' && onAppClick(app.id)}
              >
                <div className={`${iconSize} ${app.color} rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform`}>
                  <Icon className={`${iconInnerSize} text-white`} />
                </div>
                {isOpen && (
                  <div className="w-1 h-1 bg-white rounded-full mx-auto mt-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Dock;