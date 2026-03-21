'use client';

import { useState, useEffect } from 'react';

export default function StatusCodeTooltip({ statusCode, children }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getStatusDescription = (code) => {
    const codeNum = parseInt(code);
    const descriptions = {
      200: "OK - The request was successful and the server returned the requested data.",
      201: "Created - The request was successful and a new resource was created on the server.",
      204: "No Content - The request was successful but there's no content to return.",
      301: "Moved Permanently - The resource has been permanently moved to a new URL.",
      302: "Found - The resource has been temporarily moved to a different location.",
      304: "Not Modified - The resource hasn't changed since the client last requested it.",
      400: "Bad Request - The server couldn't understand the request due to invalid syntax.",
      401: "Unauthorized - Authentication is required to access this resource.",
      403: "Forbidden - The server understood the request but refuses to fulfill it.",
      404: "Not Found - The requested resource could not be found on the server.",
      405: "Method Not Allowed - The HTTP method used is not allowed for this resource.",
      408: "Request Timeout - The server timed out waiting for the request to complete.",
      409: "Conflict - The request conflicts with the current state of the resource.",
      429: "Too Many Requests - You've made too many requests; please slow down.",
      500: "Internal Server Error - The server encountered an unexpected condition.",
      501: "Not Implemented - The server doesn't support the requested functionality.",
      502: "Bad Gateway - The server received an invalid response from an upstream server.",
      503: "Service Unavailable - The server is temporarily unavailable for maintenance.",
      504: "Gateway Timeout - The server didn't receive a timely response from an upstream server."
    };

    return descriptions[codeNum] || `Status Code ${codeNum}`;
  };

  const getStatusType = (code) => {
    const codeNum = parseInt(code);
    if (codeNum >= 200 && codeNum < 300) return { type: "Success", icon: "✅", color: "green" };
    if (codeNum >= 300 && codeNum < 400) return { type: "Redirect", icon: "↗️", color: "blue" };
    if (codeNum >= 400 && codeNum < 500) return { type: "Client Error", icon: "⚠️", color: "orange" };
    if (codeNum >= 500) return { type: "Server Error", icon: "❌", color: "red" };
    return { type: "Unknown", icon: "❓", color: "gray" };
  };

  const statusInfo = getStatusType(statusCode);
  const description = getStatusDescription(statusCode);

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
                <span className="text-2xl">{statusInfo.icon}</span>
                <h4 className="font-bold text-accent text-lg">{statusCode} {statusInfo.type}</h4>
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
                {description}
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
