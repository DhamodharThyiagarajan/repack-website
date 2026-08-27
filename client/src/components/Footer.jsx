import React from 'react';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-auto">
      <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Zap size={16} className="text-pink-500" />
          <span>© 2026 <span className="text-emerald-400 font-semibold">Dhamo Repacks</span>. Built with React, Node.js, MongoDB & Firebase.</span>
        </div>
        <p className="font-mono-custom text-xs text-slate-600">
          SECURE TERMINAL // GOOGLE AUTH ACTIVE // LATENCY: 22MS
        </p>
      </div>
    </footer>
  );
}
