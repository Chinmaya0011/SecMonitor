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
    // If already authenticated, redirect to dashboard
    if (api.isAuthenticated()) {
      router.push('/logger');
    }
  }, [router]);

  const validatePassword = (pwd) => {
    const errors = [];
    if (pwd.length < 6) {
      errors.push('at least 6 characters');
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push('one uppercase letter');
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push('one lowercase letter');
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push('one number');
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Password strength validation
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(`Password must contain: ${passwordErrors.join(', ')}`);
      return;
    }

    setLoading(true);

    try {
      const result = await api.signup(email, password);
      
      if (result.success) {
        setSuccess('Account created successfully! Redirecting to dashboard...');
        // Redirect to dashboard after successful signup (user is automatically logged in)
        setTimeout(() => {
          router.push('/logger');
        }, 1500);
      } else {
        setError(result.error || 'Signup failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
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
            ACCESS REGISTRATION
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="border border-danger bg-danger/10 p-2 rounded">
                <span className="text-danger text-xs font-mono">[ERROR] {error}</span>
              </div>
            )}

            {success && (
              <div className="border border-success bg-success/10 p-2 rounded">
                <span className="text-success text-xs font-mono">[SUCCESS] {success}</span>
              </div>
            )}

            <div>
              <label className="block text-foreground-secondary text-xs font-mono mb-1">
                &gt; EMAIL_ADDRESS
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
                autoComplete="new-password"
              />
              <div className="text-foreground-secondary text-[9px] font-mono mt-1">
                Requirements: min 6 chars, 1 uppercase, 1 lowercase, 1 number
              </div>
            </div>

            <div>
              <label className="block text-foreground-secondary text-xs font-mono mb-1">
                &gt; CONFIRM_PASSWORD
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full terminal-input p-2 rounded text-xs font-mono"
                placeholder="********"
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            <div className="text-foreground-secondary text-[10px] font-mono">
              [SECURE ENCRYPTED REGISTRATION]
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-transparent border border-accent text-accent font-mono py-2 px-3 rounded text-sm hover:bg-accent/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '[CREATING ACCOUNT...]' : '[REGISTER & LOGIN] >_'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-foreground-secondary text-xs font-mono">
              [ALREADY REGISTERED?{' '}
              <Link href="/login" className="text-accent hover:underline">
                RETURN TO LOGIN
              </Link>
              ]
            </span>
          </div>

          {/* Security Notice */}
          <div className="mt-4 p-2 border border-border/50 rounded bg-card/50">
            <div className="text-foreground-secondary text-[9px] font-mono text-center space-y-1">
              <div>🔐 SECURE REGISTRATION</div>
              <div>• Passwords are encrypted before storage</div>
              <div>• Automatic login after successful registration</div>
              <div>• Session token stored in HTTP-only cookies</div>
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