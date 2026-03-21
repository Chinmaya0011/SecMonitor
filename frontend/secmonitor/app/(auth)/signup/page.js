'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/app/lib/api';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (api.isAuthenticated()) {
      router.push('/logger');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await api.signup(email, password);
    
    if (result.success) {
      setSuccess('Signup successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
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
            ACCESS REQUEST
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-mono text-accent glow-text mb-2">
              SECMONITOR
            </h1>
            <div className="text-foreground-secondary text-sm font-mono">
              REGISTRATION TERMINAL
            </div>
            <div className="mt-2 text-xs text-foreground-secondary">
              ====== NEW USER ======
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="border border-danger bg-danger/10 p-3 rounded">
                <span className="text-danger text-sm font-mono">[ERROR] {error}</span>
              </div>
            )}

            {success && (
              <div className="border border-success bg-success/10 p-3 rounded">
                <span className="text-success text-sm font-mono">[SUCCESS] {success}</span>
              </div>
            )}

            <div>
              <label className="block text-foreground-secondary text-sm font-mono mb-2">
                &gt; EMAIL_ADDRESS
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
                &gt; PASSWORD (min 6 chars)
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

            <div>
              <label className="block text-foreground-secondary text-sm font-mono mb-2">
                &gt; CONFIRM_PASSWORD
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? '[PROCESSING...]' : '[REGISTER] >_'}
              </span>
              <div className="absolute inset-0 bg-accent/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-foreground-secondary text-sm font-mono">
              [ALREADY HAVE ACCESS?{' '}
              <Link href="/login" className="text-accent hover:underline">
                LOGIN
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