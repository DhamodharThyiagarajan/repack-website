import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LogIn, Plus, Zap } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '../redux/actions';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebase';

const API_BASE = 'http://localhost:5000/api';

export default function Header() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await firebaseSignOut(auth); } catch (_) {}
    dispatch(logoutUser());
    navigate('/');
  };

  const handleDevSignIn = async (role) => {
    const mockToken = role === 'admin' ? 'dev-admin-token' : 'dev-user-token';
    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: mockToken }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(loginUser(data));
        navigate('/');
      }
    } catch (err) {
      console.error('Dev sign-in error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md" style={{ height: 'var(--header-height)' }}>
      <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Zap size={22} className="text-pink-500 group-hover:text-pink-400 transition-colors" />
          <span className="font-mono-custom font-bold text-lg tracking-widest uppercase">
            DHAMO <span className="text-primary">REPACKS</span>
          </span>
        </Link>

        {/* Right Nav */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Username */}
              <span className="font-mono-custom text-sm text-slate-400 hidden sm:block">
                {user.isAdmin && <span className="text-primary mr-1">[ADMIN]</span>}
                {user.username}
              </span>

              {/* Dev bypass — only for dhamodhar200@gmail.com */}
              {user.email === 'dhamodhar200@gmail.com' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDevSignIn('admin')}
                    className="font-mono-custom text-xs border border-emerald-500/40 text-emerald-400 px-3 py-1.5 rounded hover:bg-emerald-500/10 transition-colors"
                    title="Switch to Admin mock account"
                  >
                    Mock Admin
                  </button>
                  <button
                    onClick={() => handleDevSignIn('user')}
                    className="font-mono-custom text-xs border border-pink-500/40 text-pink-400 px-3 py-1.5 rounded hover:bg-pink-500/10 transition-colors"
                    title="Switch to User mock account"
                  >
                    Mock User
                  </button>
                </div>
              )}

              {/* Admin add repack */}
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 font-mono-custom text-xs border border-emerald-500 text-emerald-400 px-3 py-1.5 rounded hover:bg-emerald-500 hover:text-slate-950 transition-all"
                >
                  <Plus size={14} /> Add Repack
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-pink-500 text-sm font-mono-custom hover:text-pink-400 transition-colors"
              >
                <LogOut size={15} />
                <span className="hidden sm:block">Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 font-mono-custom text-sm bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded hover:bg-emerald-300 transition-colors uppercase tracking-wide"
            >
              <LogIn size={15} /> Authenticate
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
