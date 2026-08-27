import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { useSelector } from 'react-redux';

const API_BASE = 'http://localhost:5000/api';

const empty = {
  title: '', originalSize: '', repackSize: '', genres: '',
  developer: '', publisher: '', releaseDate: '',
  features: '', minRequirements: '', recRequirements: '',
  coverImage: '', description: '',
  downloadLinks: [{ name: '', url: '' }],
};

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono-custom text-xs text-slate-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

export default function Admin() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  if (!user || !user.isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-20 text-center">
        <p className="text-pink-400 font-mono-custom text-sm mb-4">ACCESS DENIED — ADMIN ONLY</p>
        <button onClick={() => navigate('/')} className="btn-cyber">← Back to Home</button>
      </div>
    );
  }

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const addLink = () => setForm((f) => ({ ...f, downloadLinks: [...f.downloadLinks, { name: '', url: '' }] }));
  const removeLink = (i) => setForm((f) => ({ ...f, downloadLinks: f.downloadLinks.filter((_, idx) => idx !== i) }));
  const updateLink = (i, key, val) => {
    const links = [...form.downloadLinks];
    links[i][key] = val;
    setForm((f) => ({ ...f, downloadLinks: links }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      genres: form.genres.split(',').map((g) => g.trim()).filter(Boolean),
      features: form.features.split('\n').filter((f) => f.trim()),
      requirements: { minimum: form.minRequirements, recommended: form.recRequirements },
    };
    try {
      const res = await fetch(`${API_BASE}/repacks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert('Repack created successfully!');
        setForm(empty);
        navigate('/');
      } else {
        const err = await res.json();
        alert('Error: ' + err.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-5">
          <div>
            <h1 className="font-mono-custom text-xl font-bold text-slate-100 uppercase tracking-widest">
              Add New Repack
            </h1>
            <p className="text-xs text-slate-500 font-mono-custom mt-1">DHAMO REPACKS ADMIN CONSOLE</p>
          </div>
          <button onClick={() => navigate('/')} className="text-slate-500 hover:text-pink-400 transition-colors">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Game Title">
              <input className="form-input-cyber" value={form.title} onChange={(e) => set('title', e.target.value)} required />
            </Field>
            <Field label="Cover Image URL">
              <input className="form-input-cyber" value={form.coverImage} onChange={(e) => set('coverImage', e.target.value)} required />
            </Field>
            <Field label="Original Size (e.g., 52 GB)">
              <input className="form-input-cyber" value={form.originalSize} onChange={(e) => set('originalSize', e.target.value)} required />
            </Field>
            <Field label="Repack Size (e.g., 23 GB)">
              <input className="form-input-cyber" value={form.repackSize} onChange={(e) => set('repackSize', e.target.value)} required />
            </Field>
            <Field label="Developer">
              <input className="form-input-cyber" value={form.developer} onChange={(e) => set('developer', e.target.value)} required />
            </Field>
            <Field label="Publisher">
              <input className="form-input-cyber" value={form.publisher} onChange={(e) => set('publisher', e.target.value)} required />
            </Field>
            <Field label="Release Date">
              <input type="date" className="form-input-cyber" value={form.releaseDate} onChange={(e) => set('releaseDate', e.target.value)} required />
            </Field>
            <Field label="Genres (comma separated)">
              <input className="form-input-cyber" placeholder="Action, RPG, Open World" value={form.genres} onChange={(e) => set('genres', e.target.value)} required />
            </Field>
          </div>

          {/* Description */}
          <Field label="Game Description">
            <textarea
              className="form-input-cyber resize-none h-24"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Brief overview of the game's storyline or gameplay..."
              required
            />
          </Field>

          {/* Features */}
          <Field label="Repack Features (one per line)">
            <textarea
              className="form-input-cyber resize-none h-28 font-mono-custom text-xs"
              value={form.features}
              onChange={(e) => set('features', e.target.value)}
              placeholder={"Based on ISO release\n100% Lossless & MD5 Perfect\nNOTHING ripped or re-encoded"}
              required
            />
          </Field>

          {/* Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Minimum Requirements">
              <textarea
                className="form-input-cyber resize-none h-28 font-mono-custom text-xs"
                value={form.minRequirements}
                onChange={(e) => set('minRequirements', e.target.value)}
                required
              />
            </Field>
            <Field label="Recommended Requirements">
              <textarea
                className="form-input-cyber resize-none h-28 font-mono-custom text-xs"
                value={form.recRequirements}
                onChange={(e) => set('recRequirements', e.target.value)}
                required
              />
            </Field>
          </div>

          {/* Download Links */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="font-mono-custom text-xs text-slate-500 uppercase tracking-wide">Download Mirrors</label>
              <button type="button" onClick={addLink} className="flex items-center gap-1.5 text-xs text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded hover:bg-emerald-500/10 transition-colors font-mono-custom">
                <Plus size={13} /> Add Mirror
              </button>
            </div>
            <div className="space-y-3">
              {form.downloadLinks.map((link, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input
                    className="form-input-cyber flex-1"
                    placeholder="Mirror Name (e.g. Torrent)"
                    value={link.name}
                    onChange={(e) => updateLink(i, 'name', e.target.value)}
                    required
                  />
                  <input
                    className="form-input-cyber flex-[2]"
                    placeholder="Mirror URL"
                    value={link.url}
                    onChange={(e) => updateLink(i, 'url', e.target.value)}
                    required
                  />
                  {form.downloadLinks.length > 1 && (
                    <button type="button" onClick={() => removeLink(i)} className="text-pink-500 hover:text-pink-400 transition-colors shrink-0">
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-slate-800">
            <button type="submit" disabled={saving} className="btn-cyber flex-1 flex items-center justify-center gap-2 py-3 disabled:opacity-60">
              <Save size={16} /> {saving ? 'SAVING...' : 'SAVE REPACK'}
            </button>
            <button type="button" onClick={() => navigate('/')} className="btn-cyber-pink px-8 py-3 flex items-center gap-2">
              <X size={15} /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
