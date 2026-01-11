import React, { ReactNode, useCallback } from "react"
import { X, Minus } from "lucide-react"
import useDraggable from '../hooks/useDraggable'
import { WindowState } from "../types";

interface WindowProps {
  window: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onDrag: (x: number, y: number) => void;
  children: ReactNode;
}

const Window: React.FC<WindowProps> = ({
  window,
  onClose,
  onMinimize,
  onFocus,
  onDrag,
  children,
}) => {
  const { handlePointerDown, handlePointerMove, handlePointerUp } = useDraggable(
    window.id,
    window.x,
    window.y,
    onDrag,
    onFocus
  );

  // Prevent wheel events from bubbling to desktop
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
  }, []);

  if (window.isMinimized) return null;

  return (
    <div
      className="absolute bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-200"
      style={{
        left: window.x,
        top: window.y,
        width: window.width,
        height: window.height,
        zIndex: window.zIndex,
        transform: window.isFocused ? 'scale(1)' : 'scale(0.98)',
        opacity: window.isFocused ? 1 : 0.95,
        overflow: 'hidden',
      }}
      role="dialog"
      aria-label={window.title}
      onWheel={handleWheel}
      onClick={onFocus}
    >
      {/* Title bar - fixed height, not scrollable */}
      <div
        className="h-10 shrink-0 bg-gradient-to-b from-gray-100 to-gray-200 border-b border-gray-300 flex items-center px-3 cursor-move select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        role="button"
        tabIndex={0}
        aria-label="Drag window"
      >
        <div className="flex gap-2 window-controls">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group transition-colors"
            aria-label="Close window"
          >
            <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center group transition-colors"
            aria-label="Minimize window"
          >
            <Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600" aria-label="Maximize window" />
        </div>
        <div className="flex-1 text-center text-sm font-medium text-gray-700">
          {window.title}
        </div>
      </div>
      
      {/* Content area - scrollable with isolation */}
      <div 
        className="flex-1 min-h-0 overflow-hidden"
        style={{
          // Scroll isolation - prevents scroll from bubbling to parent
          overscrollBehavior: 'contain',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Window;