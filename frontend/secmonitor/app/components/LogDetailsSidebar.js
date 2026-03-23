'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DetailPopup from '@/app/components/DetailPopup';
import MethodTooltip from '@/app/components/MethodTooltip';
import StatusCodeTooltip from '@/app/components/StatusCodeTooltip';
import logDetails from '@/app/lib/logDetails.json';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Terminal, 
  Shield, 
  Zap, 
  AlertCircle,
  Cpu,
  Network,
  Database,
  Code,
  Lock,
  Eye,
  Activity,
} from 'lucide-react';

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 ml-8">
      <div className="bg-black/95 backdrop-blur-xl border-l-2 border-t-2 border-b-2 border-red-500/40 rounded-r-2xl shadow-2xl w-[450px] p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="text-red-500" size={20} />
          <h3 className="text-red-500 font-mono font-bold">ERROR_LOADING_SCHEMA</h3>
        </div>
        <p className="text-red-400/80 text-sm font-mono mb-3">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md text-xs font-mono transition-all"
        >
          RETRY_CONNECTION
        </button>
      </div>
    </div>
  );
};

// Memoized Helper Components
const SystemStatCard = memo(({ icon: Icon, label, value, subtext }) => (
  <div className="border border-accent/30 rounded-lg p-3 bg-black/40 hover:border-accent/60 transition-all">
    <div className="flex items-center gap-2 mb-2">
      <Icon size={12} className="text-accent" />
      <span className="text-[8px] text-accent/80 font-mono font-bold">{label}</span>
    </div>
    <div className="text-[10px] text-accent font-mono font-bold">{value}</div>
    <div className="text-[7px] text-accent/50 font-mono mt-1">{subtext}</div>
  </div>
));

SystemStatCard.displayName = 'SystemStatCard';

const LogFieldItem = memo(({ field }) => (
  <div className="flex items-start justify-between gap-3 p-3 bg-black/40 rounded-md border-l-2 border-accent/30 hover:border-accent hover:bg-black/60 transition-all">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-accent font-mono text-[11px] font-bold tracking-wider">{field.label}</span>
        <DetailPopup label="ℹ️" details={field} />
      </div>
      <div className="text-foreground-secondary/80 text-[9px] font-mono leading-relaxed">
        {field.description}
      </div>
      {field.example && (
        <div className="mt-2 pt-1">
          <span className="text-accent/50 text-[7px] font-mono">EXAMPLE: </span>
          <span className="text-accent text-[8px] font-mono bg-black/50 px-1.5 py-0.5 rounded border border-accent/30">
            {field.example}
          </span>
        </div>
      )}
    </div>
  </div>
));

LogFieldItem.displayName = 'LogFieldItem';

// Main Component
export default function LogDetailsSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get all log fields from logDetails with fallbacks
  const logFields = useMemo(() => logDetails?.logFields || {}, []);
  const httpMethods = useMemo(() => logDetails?.httpMethods || {}, []);
  const statusCodes = useMemo(() => logDetails?.statusCodes || {}, []);

  // Color mapping for dynamic classes (Tailwind-safe)
  const getMethodColorClass = (color) => {
    const colorMap = {
      blue: 'border-blue-500/50 text-blue-400 hover:border-blue-400',
      green: 'border-green-500/50 text-green-400 hover:border-green-400',
      orange: 'border-orange-500/50 text-orange-400 hover:border-orange-400',
      yellow: 'border-yellow-500/50 text-yellow-400 hover:border-yellow-400',
      red: 'border-red-500/50 text-red-400 hover:border-red-400'
    };
    return colorMap[color] || 'border-accent/50 text-accent';
  };

  const getStatusColorClass = (color) => {
    const colorMap = {
      green: 'border-green-500/50 text-green-400',
      blue: 'border-blue-500/50 text-blue-400',
      orange: 'border-orange-500/50 text-orange-400',
      red: 'border-red-500/50 text-red-400'
    };
    return colorMap[color] || 'border-gray-500/50 text-gray-400';
  };

  const getStatusDotColor = (color) => {
    const colorMap = {
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  // Random glitch effect for hacker feel
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 100);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleResetError = () => {
    window.location.reload();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40">
        <div className="ml-8 bg-black/95 backdrop-blur-xl border-l-2 border-t-2 border-b-2 border-accent/40 rounded-r-2xl w-[450px] h-[90vh] animate-pulse">
          <div className="p-5 space-y-4">
            <div className="h-20 bg-accent/10 rounded-lg"></div>
            <div className="h-32 bg-accent/10 rounded-lg"></div>
            <div className="h-48 bg-accent/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleResetError}>
      <div className={`fixed left-0 top-1/2 -translate-y-1/2 z-40 ${glitchEffect ? 'animate-glitch' : ''}`}>
        {/* Toggle Button with Hacker Style */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={`${isOpen ? 'Close' : 'Open'} log details sidebar`}
          aria-expanded={isOpen}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-accent to-accent/80 text-background px-3 py-6 rounded-r-md hover:from-accent/90 hover:to-accent transition-all duration-300 font-mono text-sm shadow-lg shadow-accent/20 group focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          <div className="flex flex-col items-center gap-2">
            {isOpen ? (
              <>
                <ChevronLeft size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-bold tracking-wider rotate-90">CLOSE</span>
              </>
            ) : (
              <>
                <ChevronRight size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-bold tracking-wider rotate-90">OPEN</span>
              </>
            )}
          </div>
        </button>

        {/* Sidebar Content */}
        {isOpen && (
          <div className="ml-8 bg-black/95 backdrop-blur-xl border-l-2 border-t-2 border-b-2 border-accent/40 rounded-r-2xl shadow-2xl shadow-accent/30 w-[450px] max-h-[90vh] overflow-y-auto relative">
            {/* Animated Scanline */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent animate-scan"></div>
            </div>

            {/* Header with Matrix Style */}
            <div className="sticky top-0 bg-black/95 backdrop-blur-xl p-5 border-b-2 border-accent/40 z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <Terminal size={20} className="text-accent animate-pulse" />
                  <div className="absolute inset-0 bg-accent/20 blur-xl animate-ping"></div>
                </div>
                <h3 className="text-accent font-mono text-sm font-bold tracking-wider">
                  <span className="text-accent">&gt;</span> SECURITY_LOG_SCHEMA
                </h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={12} className="text-accent/70" />
                  <p className="text-accent/70 text-[9px] font-mono tracking-wider">
                    ENCRYPTED_REFERENCE | v2.4.7
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[8px] text-green-500/70 font-mono">ACTIVE</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-accent/20">
                <div className="text-accent/50 text-[8px] font-mono flex items-center gap-2">
                  <Code size={10} />
                  <span>interactive_mode: true | hover/click for intel</span>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* HTTP Methods Section - Cyber Style */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                <div className="border border-accent/30 rounded-lg p-4 hover:border-accent/70 transition-all duration-300 bg-black/50 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 blur-2xl"></div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-accent" />
                      <span className="text-accent font-mono text-xs font-bold tracking-wider">[HTTP_METHODS]</span>
                    </div>
                    <DetailPopup 
                      label="🔍"
                      details={{
                        label: "HTTP Methods",
                        description: "HTTP methods indicate the desired action to be performed on the identified resource. Each method serves a specific purpose in RESTful API design.",
                        icon: "Globe",
                        example: "GET, POST, PUT, PATCH, DELETE"
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(httpMethods).map(([method, data]) => (
                      <MethodTooltip key={method} method={method}>
                        <div className={`flex items-center gap-2 px-3 py-2 bg-black/50 rounded-md border ${getMethodColorClass(data.color)} hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 cursor-pointer group/method`}>
                          <span className="text-base">{data.icon}</span>
                          <span className={`text-xs font-mono font-bold tracking-wider ${getMethodColorClass(data.color).split(' ')[1]}`}>
                            {method}
                          </span>
                        </div>
                      </MethodTooltip>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Code Categories - Matrix Style */}
              <div className="group relative">
                <div className="border border-accent/30 rounded-lg p-4 hover:border-accent/70 transition-all duration-300 bg-black/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-accent" />
                      <span className="text-accent font-mono text-xs font-bold tracking-wider">[STATUS_CODES]</span>
                    </div>
                    <DetailPopup 
                      label="🔍"
                      details={{
                        label: "HTTP Status Codes",
                        description: "Status codes indicate the result of the HTTP request. They are grouped into categories based on the response type.",
                        icon: "BarChart3",
                        example: "200 Success, 404 Not Found, 500 Server Error"
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    {Object.entries(statusCodes).map(([code, data]) => (
                      <div key={code} className="flex items-center justify-between p-2 bg-black/30 rounded-md border border-border/30 hover:border-accent/30 transition-all">
                        <StatusCodeTooltip statusCode={data.range.split('-')[0]}>
                          <div className={`flex items-center gap-2 cursor-help`}>
                            <div className={`w-2 h-2 rounded-full ${getStatusDotColor(data.color)} animate-pulse`}></div>
                            <span className={`text-xs font-mono font-bold ${getStatusColorClass(data.color)}`}>
                              {data.range}
                            </span>
                          </div>
                        </StatusCodeTooltip>
                        <span className="text-foreground-secondary text-[9px] font-mono">
                          {data.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Log Fields Section - Cyberpunk Style */}
              <div className="group relative">
                <div className="border border-accent/30 rounded-lg p-4 hover:border-accent/70 transition-all duration-300 bg-black/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Database size={14} className="text-accent" />
                      <span className="text-accent font-mono text-xs font-bold tracking-wider">[LOG_FIELDS]</span>
                    </div>
                    <DetailPopup 
                      label="🔍"
                      details={{
                        label: "Log Fields",
                        description: "Each log entry contains these fields to help you understand and debug API requests. Fields are automatically populated by the logging middleware.",
                        icon: "File",
                        example: "METHOD, URL, STATUS, RESPONSE_TIME, IP, SIZE"
                      }}
                    />
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {Object.entries(logFields).map(([key, field]) => (
                      <LogFieldItem key={key} field={field} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Reference - Hacker Tips */}
              <div className="border-2 border-accent/40 rounded-lg p-4 bg-gradient-to-br from-accent/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-2xl"></div>
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={12} className="text-accent" />
                  <div className="text-accent font-mono text-[10px] font-bold tracking-wider">[SECURITY_BRIEF]</div>
                </div>
                <ul className="space-y-2 text-foreground-secondary text-[9px] font-mono">
                  <li className="flex items-start gap-2">
                    <span className="text-accent text-xs">›</span>
                    <span><span className="text-accent">🔍 CLICK</span> on any ℹ️ or 🔍 icon for detailed field intelligence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent text-xs">›</span>
                    <span><span className="text-accent">🖱️ HOVER/CLICK</span> on methods & status codes for exploitation details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent text-xs">›</span>
                    <span><span className="text-accent">⌨️ ESC</span> key or click outside to terminate popup sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent text-xs">›</span>
                    <span><span className="text-accent">⚡ REAL-TIME</span> monitoring active - all fields auto-populate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent text-xs">›</span>
                    <span><span className="text-accent">📊 STATS</span> Total logs, requests, responses, and errors displayed in dashboard</span>
                  </li>
                </ul>
              </div>

              {/* System Stats */}
              <div className="grid grid-cols-2 gap-3">
                <SystemStatCard icon={Cpu} label="SYSTEM_STATUS" value="OPERATIONAL" subtext="uptime: 99.99%" />
                <SystemStatCard icon={Network} label="ENCRYPTION" value="AES-256-GCM" subtext="tls: 1.3" />
                <SystemStatCard icon={Database} label="DB_STATUS" value="CONNECTED" subtext="mongodb: active" />
                <SystemStatCard icon={Activity} label="LOG_RATE" value="REAL-TIME" subtext="streaming: active" />
              </div>
            </div>

            {/* Footer with Matrix Code Effect */}
            <div className="sticky bottom-0 p-4 border-t-2 border-accent/40 bg-black/95 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye size={10} className="text-accent/70" />
                  <div className="text-accent/50 text-[8px] font-mono tracking-wider">
                    <span className="text-accent">$</span> monitor --log-schema --active
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-accent/50 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                  ))}
                </div>
              </div>
              <div className="mt-2 text-center">
                <div className="text-accent/30 text-[6px] font-mono tracking-wider">
                  SECMONITOR v2.0 | ENCRYPTED LOGGING SYSTEM
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add custom animations */}
        <style jsx>{`
          @keyframes scan {
            0% {
              transform: translateY(-100%);
            }
            100% {
              transform: translateY(100%);
            }
          }
          
          @keyframes glitch {
            0%, 100% {
              transform: translate(0);
            }
            25% {
              transform: translate(-2px, 1px);
            }
            75% {
              transform: translate(2px, -1px);
            }
          }
          
          .animate-scan {
            will-change: transform;
            animation: scan 3s linear infinite;
          }
          
          .animate-glitch {
            will-change: transform;
            animation: glitch 0.1s ease-in-out;
          }
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 255, 65, 0.1);
            border-radius: 4px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(0, 255, 65, 0.5);
            border-radius: 4px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 255, 65, 0.8);
          }
        `}</style>
      </div>
    </ErrorBoundary>
  );
}