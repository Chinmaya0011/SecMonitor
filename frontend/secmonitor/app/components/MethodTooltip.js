'use client';

import { useState, useEffect } from 'react';

export default function MethodTooltip({ method, children }) {
  const [showTooltip, setShowTooltip] = useState(false);

  // HTTP method details
  const methodDetails = {
    GET: {
      name: "GET",
      description: "Retrieve data from the server without modifying it. GET requests should not change state on the server.",
      icon: "📥",
      color: "blue"
    },
    POST: {
      name: "POST",
      description: "Submit data to the server to create a new resource. POST requests typically modify server state.",
      icon: "📤",
      color: "green"
    },
    PUT: {
      name: "PUT",
      description: "Replace an entire resource on the server. PUT replaces the whole object with new data.",
      icon: "🔄",
      color: "orange"
    },
    PATCH: {
      name: "PATCH",
      description: "Partially modify an existing resource on the server. PATCH updates only specified fields.",
      icon: "✏️",
      color: "yellow"
    },
    DELETE: {
      name: "DELETE",
      description: "Remove a resource from the server. DELETE requests remove data permanently.",
      icon: "🗑️",
      color: "red"
    }
  };

  const details = methodDetails[method?.toUpperCase()] || methodDetails.GET;

  const handleClick = (e) => {
    e.stopPropagation();
    setShowTooltip(true);
  };

  const handleClose = () => {
    setShowTooltip(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowTooltip(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [showTooltip]);

  return (
    <>
      {/* Wrapper for children with click handler */}
      <span onClick={handleClick} className="cursor-pointer">
        {children}
      </span>

      {/* Modal Backdrop */}
      {showTooltip && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
          onClick={handleBackdropClick}
        ></div>
      )}

      {/* Center Modal Popup */}
      {showTooltip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-card/95 backdrop-blur-sm border border-accent/40 rounded-lg p-6 shadow-2xl max-w-sm w-full pointer-events-auto animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{details.icon}</span>
                <h4 className="font-bold text-accent text-lg">{details.name}</h4>
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
