import React, { useState } from 'react';
import { X, Plus, Play, Code2 } from 'lucide-react';

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [iframeInput, setIframeInput] = useState('');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [previewSrc, setPreviewSrc] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const extractIframeSrc = (input) => {
    const trimmed = input.trim();
    if (trimmed.startsWith('<iframe')) {
      const match = trimmed.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) {
        return match[1];
      }
    }
    return trimmed;
  };

  const handleTestPreview = () => {
    if (!iframeInput.trim()) {
      setError('Please provide an iframe embed tag or URL.');
      return;
    }
    const src = extractIframeSrc(iframeInput);
    if (!src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('/')) {
      setError('Please provide a valid web URL or relative path.');
      return;
    }
    setError(null);
    setPreviewSrc(src);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a game title.');
      return;
    }
    if (!iframeInput.trim()) {
      setError('Please enter an iframe embed or URL.');
      return;
    }

    const src = extractIframeSrc(iframeInput);
    const iframeCode = iframeInput.trim().startsWith('<iframe')
      ? iframeInput.trim()
      : `<iframe src="${src}" title="${title.trim()}" width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay; fullscreen; keyboard"></iframe>`;

    const newGame = {
      id: 'custom-' + Date.now(),
      title: title.trim(),
      category: category,
      tags: ['Custom', category],
      rating: 5.0,
      plays: '1',
      author: 'User Added',
      description: description.trim() || 'Custom iframe game added to library.',
      controls: controls.trim() || 'Standard keyboard/mouse controls.',
      iframeSrc: src,
      iframeCode: iframeCode,
      bannerImage: bannerUrl.trim() || '/src/assets/images/puzzle_tiles_banner_1792946468525.jpg',
      featured: false,
      addedAt: new Date().toISOString().split('T')[0],
      isCustom: true
    };

    onAddGame(newGame);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white tracking-tight">Add Game to JSON Catalog</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-950/60 border border-red-800 text-red-300 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Game Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Geometry Dash Lite"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Action">Action</option>
                <option value="Retro">Retro</option>
                <option value="Sports">Sports</option>
                <option value="Strategy">Strategy</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Iframe Embed Code or URL *
              </label>
              <button
                type="button"
                onClick={handleTestPreview}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <Play className="w-3 h-3" /> Test Embed
              </button>
            </div>
            <textarea
              required
              rows={3}
              placeholder={`Paste an <iframe src="..."></iframe> tag or direct URL like https://example.com/game`}
              value={iframeInput}
              onChange={(e) => setIframeInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Supports standard HTML5 iframe embeds and unblocked game links.
            </p>
          </div>

          {previewSrc && (
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-black p-2">
              <span className="text-[10px] text-slate-400 font-mono block mb-1">
                Preview: {previewSrc}
              </span>
              <div className="w-full h-44 bg-slate-950 rounded overflow-hidden">
                <iframe
                  src={previewSrc}
                  title="Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Controls Instruction
              </label>
              <input
                type="text"
                placeholder="e.g., WASD to move, Space to jump"
                value={controls}
                onChange={(e) => setControls(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Custom Banner Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Description
            </label>
            <input
              type="text"
              placeholder="Brief summary of gameplay"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> Automatically serialized to games.json
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Save to Catalog
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
