import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Shield } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/actions';

const API_BASE = 'http://localhost:5000/api';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(loginUser(data));
        navigate('/');
      } else {
        setError(data.message || 'Server verification failed');
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Google Auth popup closed or failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmailLogin = async (e) => {
    e.preventDefault();
    if (!testEmail.trim()) return;
    setLoading(true);
    setError('');
    try {
      const mockToken = `dev-email-token:${testEmail.trim().toLowerCase()}`;
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: mockToken }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(loginUser(data));
        navigate('/');
      } else {
        setError(data.message || 'Mock login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to local auth server failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-4">
              <Zap size={28} className="text-emerald-400" />
            </div>
            <h1 className="font-mono-custom text-xl font-bold text-slate-100 tracking-widest uppercase">
              DHAMO REPACKS
            </h1>
            <p className="text-xs text-slate-500 font-mono-custom mt-1 tracking-wider">ACCESS PORTAL</p>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 mb-6">
            <Shield size={14} className="text-emerald-400 shrink-0" />
            <p className="text-xs text-slate-400 font-mono-custom">
              SECURE AUTH VIA GOOGLE IDENTITY PROVIDER
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-pink-950/40 border border-pink-700/40 text-pink-400 text-xs font-mono-custom rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          {/* Google Sign-in Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-semibold text-sm rounded-xl py-3.5 hover:bg-slate-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-4"
          >
            {/* Google G Icon */}
            <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            {loading ? 'Authenticating...' : 'Sign in with Google'}
          </button>

          <div className="relative flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-600 font-mono-custom">OR</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <form onSubmit={handleTestEmailLogin} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Test Email (e.g. dhamodhar200@gmail.com)"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="form-input-cyber text-center"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cyber py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed uppercase font-mono-custom tracking-wider"
            >
              {loading ? 'VERIFYING...' : 'MOCK EMAIL SIGN IN'}
            </button>
          </form>

          {/* Back link */}
          <p className="text-center text-xs text-slate-600 mt-6">
            <Link to="/" className="text-emerald-500 hover:text-emerald-400 font-mono-custom transition-colors">
              ← Cancel and go back
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
