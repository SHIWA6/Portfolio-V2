/**
 * CategorySidebar Component
 * 
 * Renders category tabs/sidebar for filtering games.
 * macOS Finder-style sidebar appearance.
 */

import React from 'react';
import { CategoryConfig, GameCategory } from '../types';

interface CategorySidebarProps {
  categories: CategoryConfig[];
  activeCategory: GameCategory;
  onCategoryChange: (category: GameCategory) => void;
  gameCounts: Record<GameCategory, number>;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  gameCounts,
}) => {
  return (
    <div 
      className="w-44 shrink-0 border-r border-white/10 bg-black/20 flex flex-col"
      style={{ overscrollBehavior: 'contain' }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Categories
        </h3>
      </div>

      {/* Category list */}
      <nav 
        className="flex-1 py-2 min-h-0"
        style={{
          overflowY: 'auto',
          overflowX: 'hidden',
          overscrollBehavior: 'contain',
        }}
        role="tablist"
        aria-label="Game categories"
      >
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          const count = gameCounts[category.id] || 0;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-2 text-sm text-left
                transition-colors duration-150 outline-none
                ${isActive 
                  ? 'bg-blue-500/30 text-white' 
                  : 'text-gray-300 hover:bg-white/5'}
              `}
              role="tab"
              aria-selected={isActive}
              aria-controls={`games-panel-${category.id}`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="flex-1 truncate">{category.label}</span>
              <span className={`
                text-xs px-1.5 py-0.5 rounded-full
                ${isActive ? 'bg-white/20' : 'bg-white/10'}
              `}>
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t border-white/10">
        <p className="text-[10px] text-gray-500 leading-tight">
          Double-click or press Enter to play
        </p>
      </div>
    </div>
  );
};
