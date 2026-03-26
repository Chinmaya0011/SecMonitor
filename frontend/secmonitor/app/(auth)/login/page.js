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
    // Check if already authenticated
    if (api.isAuthenticated()) {
      router.push('/logger');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const result = await api.login(email, password);
      
      if (result.success) {
        // Redirect to dashboard on successful login
        router.push('/logger');
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@example.com');
    setPassword('demo123');
    // Optional: Auto-submit after setting demo credentials
    // setTimeout(() => handleSubmit(new Event('submit')), 100);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-3 scanline">
      <div className="absolute top-0 left-0 w-full p-3">
        <div className="text-accent text-xs font-mono">
          SECMONITOR v1.0 [{new Date().toLocaleTimeString()}]
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="border border-border bg-card p-5 rounded-lg glow-border relative">
          <div className="absolute -top-3 left-4 bg-card px-2 text-accent text-xs font-mono">
            SYSTEM ACCESS
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="border border-danger bg-danger/10 p-2 rounded">
                <span className="text-danger text-xs font-mono">[ERROR] {error}</span>
              </div>
            )}

            <div>
              <label className="block text-foreground-secondary text-xs font-mono mb-1">
                &gt; USERNAME_EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full terminal-input p-2 rounded text-xs font-mono"
                placeholder="user@example.com"
                disabled={loading}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-foreground-secondary text-xs font-mono mb-1">
                &gt; PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full terminal-input p-2 rounded text-xs font-mono"
                placeholder="********"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <div className="text-foreground-secondary text-[10px] font-mono flex justify-between items-center">
              <span>[SECURE ENCRYPTED CONNECTION]</span>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-accent/70 hover:text-accent transition-colors"
              >
                [DEMO LOGIN]
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-transparent border border-accent text-accent font-mono py-2 px-3 rounded text-sm hover:bg-accent/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '[AUTHENTICATING...]' : '[ACCESS SYSTEM] >_'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-foreground-secondary text-xs font-mono">
              [NO ACCESS?{' '}
              <Link href="/signup" className="text-accent hover:underline">
                REQUEST ACCESS
              </Link>
              ]
            </span>
          </div>

          {/* Security Notice */}
          <div className="mt-4 p-2 border border-border/50 rounded bg-card/50">
            <div className="text-foreground-secondary text-[9px] font-mono text-center space-y-1">
              <div>🔒 SECURE SESSION | HTTP-ONLY COOKIES | CSRF PROTECTED</div>
              <div>• Your credentials are encrypted in transit</div>
              <div>• Session token is stored securely in HTTP-only cookies</div>
              <div>• Automatic session management</div>
            </div>
          </div>

          <div className="mt-3 text-center text-[10px] text-foreground-secondary font-mono">
            =================================
          </div>
        </div>
      </div>
    </div>
  );
}