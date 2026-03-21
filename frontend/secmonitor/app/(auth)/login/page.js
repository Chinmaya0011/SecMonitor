'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/app/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Redirect if already logged in
    if (api.isAuthenticated()) {
      router.push('/logger');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await api.login(email, password);
    
    if (result.success) {
      router.push('/logger');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 scanline">
      <div className="absolute top-0 left-0 w-full p-4">
        <div className="text-accent text-sm font-mono">
          SECMONITOR v1.0 [{new Date().toLocaleTimeString()}]
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="border border-border bg-card p-8 rounded-lg glow-border relative">
          <div className="absolute -top-3 left-4 bg-card px-2 text-accent text-sm font-mono">
            SECURE LOGIN
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-mono text-accent glow-text mb-2">
              SECMONITOR
            </h1>
            <div className="text-foreground-secondary text-sm font-mono">
              CYBERSECURITY DASHBOARD
            </div>
            <div className="mt-2 text-xs text-foreground-secondary">
              ====== SYSTEM ACCESS ======
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="border border-danger bg-danger/10 p-3 rounded">
                <span className="text-danger text-sm font-mono">[ERROR] {error}</span>
              </div>
            )}

            <div>
              <label className="block text-foreground-secondary text-sm font-mono mb-2">
                &gt; USERNAME_EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full terminal-input p-3 rounded font-mono text-sm"
                placeholder="user@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-foreground-secondary text-sm font-mono mb-2">
                &gt; PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full terminal-input p-3 rounded font-mono text-sm"
                placeholder="********"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-transparent border border-accent text-accent font-mono py-3 px-4 rounded hover:bg-accent/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? '[AUTHENTICATING...]' : '[LOGIN] >_'}
              </span>
              <div className="absolute inset-0 bg-accent/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-foreground-secondary text-sm font-mono">
              [NO ACCESS?{' '}
              <Link href="/signup" className="text-accent hover:underline">
                REQUEST ACCESS
              </Link>
              ]
            </span>
          </div>

          <div className="mt-4 text-center text-xs text-foreground-secondary font-mono">
            =================================
          </div>
        </div>
      </div>
    </div>
  );
}