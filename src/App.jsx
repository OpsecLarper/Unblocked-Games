import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  FileCode,
  Gamepad2,
  Heart,
  Flame,
  ArrowRight
} from 'lucide-react';
import { INITIAL_GAMES, resolveAssetUrl } from './data/defaultGames.js';
import { Navbar } from './components/Navbar.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayerView } from './components/GamePlayerView.jsx';
import { CloakModal, CLOAK_PRESETS } from './components/CloakModal.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { JsonCatalogModal } from './components/JsonCatalogModal.jsx';

export default function App() {
  const [games, setGames] = useState(INITIAL_GAMES);
  const [activeGame, setActiveGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('apex_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cloak state
  const [activeCloak, setActiveCloak] = useState(() => {
    return localStorage.getItem('apex_active_cloak') || 'default';
  });
  const [panicKey, setPanicKey] = useState(() => {
    return localStorage.getItem('apex_panic_key') || '`';
  });

  // Modals
  const [isCloakOpen, setIsCloakOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isJsonOpen, setIsJsonOpen] = useState(false);

  // Load games from games.json and merge custom games
  useEffect(() => {
    const targetUrl = resolveAssetUrl('./games.json');
    fetch(targetUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch games.json');
        return res.json();
      })
      .then((fetched) => {
        try {
          const custom = localStorage.getItem('apex_custom_games');
          const customList = custom ? JSON.parse(custom) : [];
          setGames([...fetched, ...customList]);
        } catch {
          setGames(fetched);
        }
      })
      .catch((err) => {
        console.warn('Using local fallback games:', err);
        try {
          const custom = localStorage.getItem('apex_custom_games');
          const customList = custom ? JSON.parse(custom) : [];
          setGames([...INITIAL_GAMES, ...customList]);
        } catch {
          setGames(INITIAL_GAMES);
        }
      });
  }, []);

  // Save favorites
  useEffect(() => {
    try {
      localStorage.setItem('apex_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Apply tab cloak
  useEffect(() => {
    const preset = CLOAK_PRESETS.find((p) => p.id === activeCloak) || CLOAK_PRESETS[0];
    document.title = preset.title;
    const favicon = document.getElementById('app-favicon');
    if (favicon) {
      favicon.href = preset.favicon;
    }
    localStorage.setItem('apex_active_cloak', activeCloak);
  }, [activeCloak]);

  // Listen for panic hotkey
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === panicKey) {
        e.preventDefault();
        window.location.href = 'https://classroom.google.com';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panicKey]);

  const handleToggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddGame = (newGame) => {
    try {
      const custom = localStorage.getItem('apex_custom_games');
      const customList = custom ? JSON.parse(custom) : [];
      const updated = [newGame, ...customList];
      localStorage.setItem('apex_custom_games', JSON.stringify(updated));
      setGames((prev) => [newGame, ...prev]);
    } catch (e) {
      console.error(e);
      setGames((prev) => [newGame, ...prev]);
    }
  };

  const handleSelectCloak = (preset) => {
    setActiveCloak(preset.id);
  };

  const handleSetPanicKey = (key) => {
    setPanicKey(key);
    localStorage.setItem('apex_panic_key', key);
  };

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      // Category filter
      if (activeCategory === 'favorites') {
        if (!favorites.includes(game.id)) return false;
      } else if (activeCategory !== 'all' && game.category.toLowerCase() !== activeCategory.toLowerCase()) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = game.title.toLowerCase().includes(query);
        const matchesCategory = game.category.toLowerCase().includes(query);
        const matchesDesc = game.description.toLowerCase().includes(query);
        const matchesTags = game.tags.some((t) => t.toLowerCase().includes(query));
        return matchesTitle || matchesCategory || matchesDesc || matchesTags;
      }

      return true;
    });
  }, [games, activeCategory, searchQuery, favorites]);

  // Featured game for spotlight
  const featuredGame = useMemo(() => {
    return games.find((g) => g.featured) || games[0];
  }, [games]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Strict Top Bar Contract Header */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (activeGame) setActiveGame(null);
        }}
        onOpenCloakModal={() => setIsCloakOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      {activeGame ? (
        <GamePlayerView
          game={activeGame}
          onBack={() => setActiveGame(null)}
          isFavorite={favorites.includes(activeGame.id)}
          onToggleFavorite={handleToggleFavorite}
          onSelectGame={(g) => setActiveGame(g)}
          allGames={games}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          {/* Spotlight Hero Section */}
          {featuredGame && activeCategory === 'all' && !searchQuery && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                {/* Text Content */}
                <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Flame className="w-3.5 h-3.5 fill-current" /> Featured Spotlight
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span>{featuredGame.category}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="font-mono tabular-nums">{featuredGame.plays} plays</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {featuredGame.title}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
                    {featuredGame.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setActiveGame(featuredGame)}
                      className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2"
                    >
                      <span>Play Featured Game</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleFavorite(featuredGame.id)}
                      className={`p-3 rounded-xl border transition-colors ${
                        favorites.includes(featuredGame.id)
                          ? 'bg-rose-950/40 border-rose-500/60 text-rose-400'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Favorite"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.includes(featuredGame.id) ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                    <span className="text-xs text-slate-500 font-mono">
                      Controls: {featuredGame.controls.split('·')[0]}
                    </span>
                  </div>
                </div>

                {/* Banner Media */}
                <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden bg-slate-950">
                  <img
                    src={featuredGame.bannerImage}
                    alt={featuredGame.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent opacity-80" />
                </div>
              </div>
            </div>
          )}

          {/* Catalog Toolbar & Secondary Filter Row */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search games by name, category, or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>

              {/* Action utilities */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => setIsJsonOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-lg text-xs font-semibold transition-colors"
                  title="View active games.json"
                >
                  <FileCode className="w-3.5 h-3.5 text-sky-400" />
                  <span>games.json</span>
                </button>

                <button
                  onClick={() => setIsAddOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Game Iframe</span>
                </button>
              </div>
            </div>

            {/* Interactive Category Segmented Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
              {[
                { id: 'all', label: 'All Games' },
                { id: 'Arcade', label: 'Arcade' },
                { id: 'Puzzle', label: 'Puzzle' },
                { id: 'Action', label: 'Action' },
                { id: 'Retro', label: 'Retro' },
                { id: 'favorites', label: `Favorites (${favorites.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    activeCategory === tab.id
                      ? 'bg-sky-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Games Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-sky-400" />
                <span>
                  {activeCategory === 'favorites'
                    ? 'Your Favorited Games'
                    : activeCategory === 'all'
                    ? 'All Unblocked Games'
                    : `${activeCategory} Games`}
                </span>
                <span className="text-xs text-slate-500 font-normal font-mono">
                  ({filteredGames.length})
                </span>
              </h2>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-sky-400 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>

            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onSelect={(g) => setActiveGame(g)}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-slate-900/40 rounded-xl border border-dashed border-slate-800 space-y-3">
                <Gamepad2 className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-sm font-semibold text-slate-300">No games found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {activeCategory === 'favorites'
                    ? 'You have not favorited any games yet. Click the heart icon on any game to save it here.'
                    : 'No games match your current filter or search criteria.'}
                </p>
                {activeCategory !== 'all' && (
                  <button
                    onClick={() => {
                      setActiveCategory('all');
                      setSearchQuery('');
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors inline-block mt-2"
                  >
                    View All Games
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      )}

      {/* Quiet Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>Apex Unblocked Games</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>All games stored as iframes in JSON</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>Press <code className="text-sky-400 font-mono">{panicKey}</code> for panic redirect</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsJsonOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              Inspect JSON
            </button>
            <button
              onClick={() => setIsCloakOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              Tab Cloaker
            </button>
            <button
              onClick={() => setIsAddOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              Add Custom Game
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CloakModal
        isOpen={isCloakOpen}
        onClose={() => setIsCloakOpen(false)}
        activeCloak={activeCloak}
        onSelectCloak={handleSelectCloak}
        panicKey={panicKey}
        onSetPanicKey={handleSetPanicKey}
      />

      <AddGameModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddGame={handleAddGame}
      />

      <JsonCatalogModal
        isOpen={isJsonOpen}
        onClose={() => setIsJsonOpen(false)}
        games={games}
      />
    </div>
  );
}
