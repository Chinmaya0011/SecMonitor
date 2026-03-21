'use client';

import { useState, useEffect } from 'react';

export default function DetailPopup({ icon, label, details }) {
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    // Close popup when Escape key is pressed
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [showPopup]);

  return (
    <>
      {/* Icon with click effect */}
      <span 
        className="inline-flex items-center gap-1 cursor-pointer"
        onClick={handleClick}
      >
        {label}
        <span className="text-accent text-xs font-bold hover:scale-125 transition-transform duration-200">
          {icon}
        </span>
      </span>

      {/* Modal Backdrop */}
      {showPopup && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
          onClick={handleBackdropClick}
        ></div>
      )}

      {/* Center Modal Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-card/95 backdrop-blur-sm border border-accent/40 rounded-lg p-6 shadow-2xl max-w-sm w-full pointer-events-auto animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{details.icon}</span>
                <h4 className="font-bold text-accent text-lg">{details.label}</h4>
              </div>
              <button
                onClick={handleClose}
                className="text-foreground-secondary hover:text-accent transition-colors duration-200 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-border/30 mb-4"></div>

            {/* Content */}
            <div className="space-y-3">
              <p className="text-foreground-secondary text-sm leading-relaxed">
                {details.description}
              </p>
              {details.example && (
                <div className="mt-4 pt-4 border-t border-border/30">
                  <p className="text-[11px] text-foreground-secondary font-mono">
                    <span className="text-accent font-bold">Examples:</span>
                  </p>
                  <p className="text-xs text-foreground font-mono mt-1">
                    {details.example}
                  </p>
                </div>
              )}
            </div>

            {/* Close Button at bottom */}
            <div className="mt-6 pt-4 border-t border-border/30">
              <button
                onClick={handleClose}
                className="w-full px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent font-semibold rounded-lg transition-colors duration-200"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
