import React from 'react';
import { Shield } from 'lucide-react';

export const Navbar = ({
  activeCategory,
  onSelectCategory,
  onOpenCloakModal,
  favoritesCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectCategory('all')}
          className="text-lg font-extrabold tracking-tight text-white hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="text-xl">🕹️</span>
          <span>Apex Unblocked</span>
        </button>

        {/* Zone 2: 4-5 clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onSelectCategory('all')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeCategory === 'all' ? 'text-white font-semibold' : 'hover:text-slate-200'
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => onSelectCategory('Arcade')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeCategory === 'Arcade' ? 'text-white font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Arcade
          </button>
          <button
            onClick={() => onSelectCategory('Puzzle')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeCategory === 'Puzzle' ? 'text-white font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Puzzle
          </button>
          <button
            onClick={() => onSelectCategory('Action')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeCategory === 'Action' ? 'text-white font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Action
          </button>
          <button
            onClick={() => onSelectCategory('favorites')}
            className={`whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
              activeCategory === 'favorites' ? 'text-rose-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="text-xs text-rose-400 font-mono">({favoritesCount})</span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCloakModal}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-sky-300 bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 hover:border-sky-500/50 transition-colors whitespace-nowrap shrink-0"
            title="Configure stealth cloaking for browser tab"
          >
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>Tab Cloaker</span>
          </button>
        </div>
      </div>
    </header>
  );
};
