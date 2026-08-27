import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import RepackCard from '../components/RepackCard';

const API_BASE = 'http://localhost:5000/api';
const GENRES = ['Action', 'RPG', 'Open World', 'Souls-like', 'Adventure', 'Roguelike', 'Sci-fi', 'First-Person', 'Cyberpunk', 'Western', 'Indie', 'Mythology'];

export default function Home() {
  const [repacks, setRepacks] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchRepacks = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/repacks?page=${page}&keyword=${keyword}`;
      if (selectedGenre) url += `&genre=${selectedGenre}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setRepacks(data.repacks || []);
        setTotalPages(data.pages || 1);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepacks();
  }, [page, keyword, selectedGenre]);

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(1);
  };

  const handleGenre = (g) => {
    setSelectedGenre(g === selectedGenre ? '' : g);
    setPage(1);
  };

  const handleDeleted = (id) => {
    setRepacks((prev) => prev.filter((r) => r._id !== id));
    setTotal((t) => t - 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-8">

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 mb-6 shadow-xl">
        <Search size={18} className="text-slate-500 shrink-0" />
        <input
          type="text"
          placeholder="Search games by title, developer, publisher..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none py-2"
        />
        <button type="submit" className="btn-cyber shrink-0 text-xs py-2 px-4">
          Search
        </button>
      </form>

      {/* Genre tags */}
      <div className="flex items-center gap-3 flex-wrap mb-8">
        <span className="font-mono-custom text-xs text-slate-500 flex items-center gap-1.5 shrink-0">
          <SlidersHorizontal size={13} /> FILTERS:
        </span>
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => handleGenre(g)}
            className={`text-xs font-mono-custom px-3 py-1 rounded-full border transition-all duration-200 ${
              selectedGenre === g
                ? 'bg-emerald-400 text-slate-950 border-emerald-400 font-bold'
                : 'border-slate-700 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400'
            }`}
          >
            {g}
          </button>
        ))}
        {selectedGenre && (
          <button
            onClick={() => { setSelectedGenre(''); setPage(1); }}
            className="text-xs text-pink-500 hover:text-pink-400 font-mono-custom transition-colors"
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Section header */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
        <span className="terminal-badge">SYS: ONLINE</span>
        <h2 className="font-mono-custom text-base text-slate-300">
          {selectedGenre ? `Genre: ${selectedGenre}` : keyword ? `Results for "${keyword}"` : 'LATEST REPACKS'}
          <span className="text-slate-600 ml-2">({total})</span>
        </h2>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="spinner" />
          <p className="font-mono-custom text-emerald-400 text-sm animate-pulse">INITIALIZING...</p>
        </div>
      )}

      {/* Grid */}
      {!loading && repacks.length === 0 && (
        <div className="text-center py-20 bg-slate-900 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-sm">No game repacks found. Try a different search or filter.</p>
        </div>
      )}

      {!loading && repacks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
          {repacks.map((repack) => (
            <RepackCard key={repack._id} repack={repack} onDeleted={handleDeleted} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="btn-cyber text-xs py-2 px-5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← PREV
          </button>
          <span className="font-mono-custom text-xs text-slate-500">
            PAGE {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="btn-cyber text-xs py-2 px-5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            NEXT →
          </button>
        </div>
      )}
    </div>
  );
}
