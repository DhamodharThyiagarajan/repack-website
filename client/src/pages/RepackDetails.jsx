import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Tag, Sparkles, CheckCircle, FileText, Cpu,
  Download, MessageSquare, Lock, Eye, Calendar, ChevronRight
} from 'lucide-react';
import { useSelector } from 'react-redux';

const API_BASE = 'http://localhost:5000/api';

export default function RepackDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [repack, setRepack] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepack = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/repacks/${id}`);
        const data = await res.json();
        if (res.ok) setRepack(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepack();
    fetchComments();
  }, [id]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_BASE}/comments/repack/${id}`);
      const data = await res.json();
      if (res.ok) setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ repackId: id, content: commentText }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments([data, ...comments]);
        setCommentText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="spinner" />
        <p className="font-mono-custom text-emerald-400 text-sm animate-pulse">LOADING REPACK DATA...</p>
      </div>
    );
  }

  if (!repack) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-16 text-center">
        <p className="text-slate-400">Repack not found.</p>
        <button onClick={() => navigate('/')} className="btn-cyber mt-6">← Back to Home</button>
      </div>
    );
  }

  const reduction = Math.round(
    (1 - parseFloat(repack.repackSize) / parseFloat(repack.originalSize)) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-5 py-8">
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-emerald-400 font-mono-custom text-sm mb-6 hover:text-emerald-300 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-7">
        {/* Sidebar */}
        <aside className="flex flex-col gap-5">
          {/* Cover */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
            <img src={repack.coverImage} alt={repack.title} className="w-full object-cover" />
            {reduction > 0 && (
              <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-bold font-mono-custom px-2 py-1 rounded">
                -{reduction}% SIZE
              </span>
            )}
          </div>

          {/* Info box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-0">
            {[
              { label: 'Developer', val: repack.developer },
              { label: 'Publisher', val: repack.publisher },
              { label: 'Release', val: new Date(repack.releaseDate).toLocaleDateString() },
              { label: 'Repack Size', val: repack.repackSize, green: true },
              { label: 'Original Size', val: repack.originalSize },
              { label: 'Views', val: repack.views?.toLocaleString() || 0 },
            ].map(({ label, val, green }) => (
              <div key={label} className="flex justify-between items-center py-2.5 border-b border-slate-800 last:border-0 text-sm">
                <span className="text-slate-500">{label}</span>
                <span className={green ? 'text-emerald-400 font-bold font-mono-custom' : 'text-slate-300 text-right max-w-[55%] truncate'}>
                  {val}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-7 shadow-xl">
          <h1 className="text-2xl font-bold text-slate-100 leading-tight mb-4">{repack.title}</h1>

          {/* Genre tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {repack.genres.map((g, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs font-mono-custom bg-slate-950 border border-slate-700 text-emerald-400 px-3 py-1 rounded">
                <Tag size={11} /> {g}
              </span>
            ))}
          </div>

          <hr className="border-slate-800 mb-6" />

          {/* Features */}
          <Section icon={<Sparkles size={15} className="text-emerald-400" />} title="Repack Features">
            <ul className="space-y-2">
              {repack.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
          </Section>

          {/* Description */}
          {repack.description && (
            <Section icon={<FileText size={15} className="text-emerald-400" />} title="Game Description">
              <p className="text-sm text-slate-400 leading-relaxed">{repack.description}</p>
            </Section>
          )}

          {/* System Requirements */}
          <Section icon={<Cpu size={15} className="text-emerald-400" />} title="System Requirements">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-mono-custom text-xs text-slate-500 mb-2 tracking-widest">MINIMUM</p>
                <pre className="text-xs">{repack.requirements?.minimum || 'N/A'}</pre>
              </div>
              <div>
                <p className="font-mono-custom text-xs text-slate-500 mb-2 tracking-widest">RECOMMENDED</p>
                <pre className="text-xs">{repack.requirements?.recommended || 'N/A'}</pre>
              </div>
            </div>
          </Section>

          {/* Download Mirrors */}
          <Section icon={<Download size={15} className="text-emerald-400" />} title="Download Mirrors">
            <div className="space-y-3">
              {repack.downloadLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-emerald-400/5 border border-emerald-400/10 rounded-lg hover:border-emerald-400/30 hover:bg-emerald-400/10 transition-all text-sm"
                >
                  <span className="text-emerald-400 font-mono-custom text-xs shrink-0">[{i + 1}]</span>
                  <span className="font-medium text-slate-300">{link.name}</span>
                  <span className="ml-auto text-slate-600 font-mono-custom text-xs truncate max-w-[200px]">
                    {link.url.substring(0, 40)}...
                  </span>
                  <ChevronRight size={14} className="text-emerald-400 shrink-0" />
                </a>
              ))}
            </div>
          </Section>

          {/* Comments */}
          <Section icon={<MessageSquare size={15} className="text-emerald-400" />} title={`Discussion (${comments.length})`}>
            {user ? (
              <form onSubmit={handlePostComment} className="flex flex-col gap-3 mb-6">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your experience, ask a question, or report issues..."
                  required
                  className="form-input-cyber resize-none h-20 text-sm"
                />
                <button type="submit" className="btn-cyber self-start text-xs py-2 px-5">
                  Post Comment
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2.5 bg-red-950/30 border border-red-800/30 text-red-400 text-sm font-mono-custom rounded-lg px-4 py-3 mb-6">
                <Lock size={14} />
                Please{' '}
                <button onClick={() => navigate('/login')} className="underline text-emerald-400 hover:text-emerald-300">
                  authenticate
                </button>{' '}
                to leave a comment.
              </div>
            )}

            {/* Comment list */}
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c._id} className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3">
                  <div className="flex justify-between items-center mb-1.5 text-xs">
                    <span className="text-emerald-400 font-bold font-mono-custom">{c.username}</span>
                    <span className="text-slate-600 font-mono-custom">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{c.content}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* Helper sub-section component */
function Section({ icon, title, children }) {
  return (
    <div className="mb-8">
      <h3 className="flex items-center gap-2.5 font-mono-custom text-sm text-slate-200 border-l-2 border-emerald-400 pl-3 mb-4 uppercase tracking-wide">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}
