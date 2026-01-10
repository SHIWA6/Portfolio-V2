import React from "react";
import {useState} from "react"

interface DockProps {
  apps: AppConfig[];
  windows: WindowState[];
  onAppClick: (appId: string) => void;
}

const Dock: React.FC<DockProps> = ({ apps, windows, onAppClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getScale = (index: number): number => {
    if (hoveredIndex === null) return 1;
    if (hoveredIndex === index) return 1.4;
    if (Math.abs(hoveredIndex - index) === 1) return 1.2;
    return 1;
  };

  return (
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl px-3 py-2 border border-white/30 shadow-2xl">
        <div className="flex gap-2 items-end">
          {apps.map((app, index) => {
            const Icon = app.icon;
            const isOpen = windows.some(w => w.appId === app.id && !w.isMinimized);

            return (
              <div
                key={app.id}
                className="transition-all duration-200 cursor-pointer"
                style={{ transform: `scale(${getScale(index)})` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onAppClick(app.id)}
                role="button"
                tabIndex={0}
                aria-label={`Open ${app.name}`}
                onKeyDown={(e) => e.key === 'Enter' && onAppClick(app.id)}
              >
                <div className={`w-14 h-14 ${app.color} rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}>
                  <Icon className="w-8 h-8 text-white" />
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