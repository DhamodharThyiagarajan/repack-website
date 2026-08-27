import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ChevronRight, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const API_BASE = 'http://localhost:5000/api';

export default function RepackCard({ repack, onDeleted }) {
  const user = useSelector((state) => state.user);

  const reduction = Math.round(
    (1 - parseFloat(repack.repackSize) / parseFloat(repack.originalSize)) * 100
  );

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Delete "${repack.title}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/repacks/${repack._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok && onDeleted) onDeleted(repack._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Link
      to={`/repack/${repack._id}`}
      className="repack-card flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all duration-300 group"
    >
      {/* Cover image */}
      <div className="relative overflow-hidden" style={{ paddingTop: '56.25%' }}>
        <img
          src={repack.coverImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80'}
          alt={repack.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
        />
        {reduction > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-pink-600 text-white text-xs font-bold font-mono-custom px-2 py-0.5 rounded">
            -{reduction}% SIZE
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold leading-snug mb-3 text-slate-100 line-clamp-2 group-hover:text-emerald-400 transition-colors">
          {repack.title}
        </h3>

        {/* Sizes */}
        <div className="flex items-center gap-1.5 font-mono-custom text-xs mb-3">
          <span className="text-slate-500">{repack.originalSize}</span>
          <ChevronRight size={12} className="text-primary" />
          <span className="text-primary font-bold">{repack.repackSize}</span>
        </div>

        {/* Meta */}
        <div className="flex justify-between text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {new Date(repack.releaseDate).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={11} />
            {repack.views?.toLocaleString() || 0}
          </span>
        </div>

        {/* Genres */}
        <div className="flex gap-1.5 flex-wrap mt-auto">
          {repack.genres.slice(0, 3).map((g, i) => (
            <span key={i} className="text-xs bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
              {g}
            </span>
          ))}
        </div>

        {/* Admin delete */}
        {user?.isAdmin && (
          <button
            onClick={handleDelete}
            className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs text-pink-500 border border-pink-500/30 rounded py-1.5 hover:bg-pink-500/10 transition-colors"
          >
            <Trash2 size={13} /> Delete
          </button>
        )}
      </div>
    </Link>
  );
}
