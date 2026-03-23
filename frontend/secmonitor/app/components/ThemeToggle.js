'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let initialTheme = savedTheme;

    // If no saved theme, use system preference
    if (!localStorage.getItem('theme')) {
      initialTheme = prefersDark ? 'dark' : 'light';
    }

    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Prevent flash of incorrect theme during hydration
  if (!mounted) {
    return (
      <button
        className="fixed top-4 right-4 z-50 p-3 bg-card/90 backdrop-blur-md border border-border rounded-full shadow-lg opacity-0"
        aria-label="Theme toggle"
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 bg-card/90 backdrop-blur-md border border-border rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-accent group-hover:rotate-12 transition-transform duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-accent group-hover:rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}