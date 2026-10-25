import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  RotateCcw,
  Heart,
  ExternalLink,
  Code,
  Check,
  Copy,
  Tv,
  Gamepad2
} from 'lucide-react';

export const GamePlayerView = ({
  game,
  onBack,
  isFavorite,
  onToggleFavorite,
  onSelectGame,
  allGames
}) => {
  const [isTheatre, setIsTheatre] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showJsonSpec, setShowJsonSpec] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const playerContainerRef = useRef(null);

  // Keyboard shortcut: Escape exits fullscreen/theatre
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isTheatre) {
        setIsTheatre(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTheatre]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch((err) => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenAboutBlank = () => {
    try {
      const newWin = window.open('about:blank', '_blank');
      if (newWin) {
        newWin.document.title = 'Classes'; // Cloaked default
        const iframe = newWin.document.createElement('iframe');
        iframe.src = window.location.origin + game.iframeSrc;
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100vw';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
        iframe.allow = 'autoplay; fullscreen; keyboard; gamepad';
        newWin.document.body.style.margin = '0';
        newWin.document.body.style.overflow = 'hidden';
        newWin.document.body.style.backgroundColor = '#000';
        newWin.document.body.appendChild(iframe);
      }
    } catch (e) {
      // Fallback: normal new tab
      window.open(game.iframeSrc, '_blank');
    }
  };

  const handleCopyIframe = () => {
    navigator.clipboard.writeText(game.iframeCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const similarGames = allGames
    .filter((g) => g.id !== game.id && g.category === game.category)
    .slice(0, 4);

  return (
    <div className="min-h-screen pb-16">
      {/* Top action toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-slate-800/80"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Games</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isFavorite
                  ? 'bg-rose-950/40 border-rose-500/60 text-rose-400'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden sm:inline">{isFavorite ? 'Favorited' : 'Favorite'}</span>
            </button>

            <button
              onClick={handleReload}
              className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reload Game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsTheatre(!isTheatre)}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isTheatre
                  ? 'bg-indigo-950/40 border-indigo-500/60 text-indigo-400'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Toggle Theatre Mode"
            >
              <Tv className="w-4 h-4" />
              <span className="hidden sm:inline">Theatre</span>
            </button>

            <button
              onClick={handleToggleFullscreen}
              className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
            </button>

            <button
              onClick={handleOpenAboutBlank}
              className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Stealth launch in about:blank tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden md:inline">Stealth Tab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main player viewport container */}
      <div
        className={`mx-auto transition-all duration-300 px-4 ${
          isTheatre ? 'max-w-[96vw]' : 'max-w-5xl'
        }`}
      >
        <div
          ref={playerContainerRef}
          className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[82vh] bg-black rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Active Iframe container */}
          <iframe
            key={iframeKey}
            src={game.iframeSrc}
            title={game.title}
            className="w-full h-full border-0 block bg-black"
            allow="autoplay; fullscreen; keyboard; gamepad"
            sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
          />
        </div>

        {/* Game Info & Controls Section */}
        <div className="mt-6 bg-slate-900/80 border border-slate-800/80 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span>{game.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400 font-semibold">{game.rating} ★</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{game.plays} plays</span>
                {game.author && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>By {game.author}</span>
                  </>
                )}
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{game.title}</h1>
            </div>

            <button
              onClick={() => setShowJsonSpec(!showJsonSpec)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors w-fit"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showJsonSpec ? 'Hide Iframe Spec' : 'Inspect Iframe JSON'}</span>
            </button>
          </div>

          {/* Iframe JSON Inspector */}
          {showJsonSpec && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-lg animate-in fade-in duration-150">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-sky-400">
                  JSON Iframe Definition in games.json
                </span>
                <button
                  onClick={handleCopyIframe}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy HTML'}</span>
                </button>
              </div>
              <pre className="text-xs font-mono text-slate-300 bg-slate-900/60 p-3 rounded border border-slate-800/80 overflow-x-auto whitespace-pre-wrap">
                {game.iframeCode}
              </pre>
            </div>
          )}

          {/* Controls Guide */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <h2 className="text-sm font-semibold text-slate-200">About this game</h2>
              <p className="text-sm text-slate-400 leading-relaxed">{game.description}</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                <Gamepad2 className="w-4 h-4 text-sky-400" />
                <span>Controls</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                {game.controls}
              </p>
            </div>
          </div>
        </div>

        {/* Similar Games recommendations */}
        {similarGames.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-white mb-4">More {game.category} Games</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {similarGames.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectGame(item)}
                  className="group flex flex-col bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-slate-700 text-left transition-colors"
                >
                  <div className="w-full aspect-video bg-slate-950 relative overflow-hidden">
                    <img
                      src={item.bannerImage}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-slate-200 truncate group-hover:text-white">
                      {item.title}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">
                      {item.category} · {item.rating} ★
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
