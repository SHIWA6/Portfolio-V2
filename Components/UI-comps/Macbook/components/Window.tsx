import React, { ReactNode, useCallback, useState, useEffect, useRef } from "react"
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
  window: windowState,
  onClose,
  onMinimize,
  onFocus,
  onDrag,
  children,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpening, setIsOpening] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const windowIdRef = useRef(windowState.id);

  // Track if this is a new window
  useEffect(() => {
    if (windowIdRef.current !== windowState.id) {
      windowIdRef.current = windowState.id;
      setIsOpening(true);
    }
  }, [windowState.id]);

  // Opening animation
  useEffect(() => {
    if (isOpening) {
      const timer = setTimeout(() => setIsOpening(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpening]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(globalThis.window.innerWidth < 768);
    checkMobile();
    globalThis.window.addEventListener('resize', checkMobile);
    return () => globalThis.window.removeEventListener('resize', checkMobile);
  }, []);

  const { handlePointerDown, handlePointerMove, handlePointerUp } = useDraggable(
    windowState.id,
    windowState.x,
    windowState.y,
    onDrag,
    onFocus
  );

  // Prevent wheel events from bubbling to desktop
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
  }, []);

  // Handle close with animation
  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  }, [onClose]);

  if (windowState.isMinimized) return null;

  // Mobile: simplified title bar
  const titleBarHeight = isMobile ? 'h-8' : 'h-10';
  const titleBarPadding = isMobile ? 'px-2' : 'px-3';
  const titleTextSize = isMobile ? 'text-xs' : 'text-sm';

  // Animation states
  const getTransform = () => {
    if (isClosing) return 'scale(0.8)';
    if (isOpening) return 'scale(0.9) translateY(20px)';
    if (isMobile) return undefined;
    return windowState.isFocused ? 'scale(1)' : 'scale(0.98)';
  };

  const getOpacity = () => {
    if (isClosing) return 0;
    if (isOpening) return 0.8;
    return windowState.isFocused ? 1 : 0.95;
  };

  return (
    <div
      className="absolute bg-white rounded-lg flex flex-col"
      style={{
        left: windowState.x,
        top: windowState.y,
        width: windowState.width,
        height: windowState.height,
        zIndex: windowState.zIndex,
        transform: getTransform(),
        opacity: getOpacity(),
        overflow: 'hidden',
        // Smooth macOS-like transitions
        transition: isOpening || isClosing 
          ? 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease-out, box-shadow 0.2s ease'
          : 'transform 0.15s ease-out, opacity 0.15s ease-out, box-shadow 0.15s ease',
        // Dynamic shadow based on focus
        boxShadow: windowState.isFocused 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.1)'
          : '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        // Mobile: max dimensions to prevent overflow
        maxWidth: isMobile ? 'calc(100vw - 8px)' : undefined,
        maxHeight: isMobile ? 'calc(100vh - 80px)' : undefined,
      }}
      role="dialog"
      aria-label={windowState.title}
      onWheel={handleWheel}
      onClick={onFocus}
    >
      {/* Title bar - responsive height */}
      <div
        className={`${titleBarHeight} shrink-0 bg-gradient-to-b from-gray-100 to-gray-200 border-b border-gray-300 flex items-center ${titleBarPadding} cursor-move select-none`}
        onPointerDown={!isMobile ? handlePointerDown : undefined}
        onPointerMove={!isMobile ? handlePointerMove : undefined}
        onPointerUp={!isMobile ? handlePointerUp : undefined}
        role="button"
        tabIndex={0}
        aria-label="Drag window"
      >
        <div className="flex gap-1.5 md:gap-2 window-controls">
          <button
            onClick={handleClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 flex items-center justify-center group transition-colors"
            aria-label="Close window"
          >
            <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 flex items-center justify-center group transition-colors"
            aria-label="Minimize window"
          >
            <Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600" aria-label="Maximize window" />
        </div>
        <div className={`flex-1 text-center ${titleTextSize} font-medium text-gray-700 truncate`}>
          {windowState.title}
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