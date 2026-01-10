import React from 'react';
import { useState, useCallback} from "react";


interface DraggableState {
  isDragging: boolean;
  offset: { x: number; y: number };
}

const useDraggable = (
  windowId: string,
  initialX: number,
  initialY: number,
  onDrag: (x: number, y: number) => void,
  onFocus: () => void
) => {
  const [state, setState] = useState<DraggableState>({
    isDragging: false,
    offset: { x: 0, y: 0 },
  });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    
    e.currentTarget.setPointerCapture(e.pointerId);
    setState({
      isDragging: true,
      offset: { x: e.clientX - initialX, y: e.clientY - initialY },
    });
    onFocus();
  }, [initialX, initialY, onFocus]);

 const handlePointerMove = useCallback((e: React.PointerEvent) => {
  if (!state.isDragging) return;

  // Use requestAnimationFrame for smoother movement
  requestAnimationFrame(() => {
    const newX = Math.max(0, Math.min(e.clientX - state.offset.x, window.innerWidth - 300));
    const newY = Math.max(28, Math.min(e.clientY - state.offset.y, window.innerHeight - 150));
    onDrag(newX, newY);
  });
}, [state.isDragging, state.offset, onDrag]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setState(prev => ({ ...prev, isDragging: false }));
  }, []);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
};
export default useDraggable;