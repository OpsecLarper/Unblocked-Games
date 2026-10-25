import React, { useState } from 'react';
import { Play, Heart, Gamepad2 } from 'lucide-react';

export const GameCard = ({
  game,
  onSelect,
  isFavorite,
  onToggleFavorite
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col hover:border-slate-700 transition-all duration-200 hover:shadow-lg hover:shadow-black/40">
      {/* Banner / Poster Thumbnail */}
      <div className="relative w-full aspect-video bg-slate-950 overflow-hidden">
        {!imgError && game.bannerImage ? (
          <img
            src={game.bannerImage}
            alt={game.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 text-slate-500">
            <Gamepad2 className="w-10 h-10 mb-2 text-indigo-400/60" />
            <span className="text-xs font-semibold text-slate-400">{game.category}</span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(game.id);
          }}
          className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-slate-300 hover:text-rose-400 hover:bg-black/80 transition-colors z-10"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Play Overlay */}
        <div
          onClick={() => onSelect(game)}
          className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity flex items-center justify-center cursor-pointer"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg shadow-lg transform -translate-y-1 group-hover:translate-y-0 transition-transform">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Now</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Zero-Pill Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5 font-medium">
            <span>{game.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-amber-400 font-semibold">{game.rating} ★</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono tabular-nums text-slate-500">{game.plays}</span>
          </div>

          <h3
            onClick={() => onSelect(game)}
            className="text-base font-bold text-white group-hover:text-sky-300 transition-colors cursor-pointer truncate"
          >
            {game.title}
          </h3>

          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Controls indicator */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate max-w-[190px] font-mono text-[11px]">
            {game.controls.split('·')[0]}
          </span>
          <button
            onClick={() => onSelect(game)}
            className="text-sky-400 hover:text-sky-300 font-semibold text-xs whitespace-nowrap ml-2"
          >
            Launch →
          </button>
        </div>
      </div>
    </div>
  );
};
