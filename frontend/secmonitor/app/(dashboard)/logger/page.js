'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/api';
import DetailPopup from '@/app/components/DetailPopup';
import MethodTooltip from '@/app/components/MethodTooltip';
import StatusCodeTooltip from '@/app/components/StatusCodeTooltip';
import logDetails from '@/app/lib/logDetails.json';

export default function LoggerPage() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'request', 'response'
  const [searchTerm, setSearchTerm] = useState('');
  const [urlFilter, setUrlFilter] = useState('');
  const [activeLog, setActiveLog] = useState(null);
  const [stats, setStats] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearType, setClearType] = useState('all'); // 'all', 'old'
  const [clearDays, setClearDays] = useState(30);
  const [clearing, setClearing] = useState(false);
  const router = useRouter();

  // Helper functions - declare before useEffect hooks
  const parseLogData = (log) => {
    try {
      const normalized = {
        ...((log.meta && typeof log.meta === 'object') ? log.meta : {}),
        ...((log.metadata && typeof log.metadata === 'object') ? log.metadata : {})
      };

      if (Object.keys(normalized).length > 0) {
        return normalized;
      }

      if (log.message && typeof log.message === 'string' && log.message !== 'REQUEST_LOG' && log.message !== 'RESPONSE_LOG') {
        try {
          const parsed = JSON.parse(log.message);
          if (parsed && typeof parsed === 'object') {
            return parsed;
          }
        } catch (parseErr) {
          console.warn('Skipping invalid JSON payload in log.message:', parseErr);
        }
      }

      if (log.message === 'REQUEST_LOG' || log.message === 'RESPONSE_LOG') {
        return log.metadata || log.meta || {};
      }

      if (typeof log.message === 'object') {
        return log.message;
      }

      const fallback = {
        method: log.method || log.request?.method,
        url: log.url || log.request?.url,
        statusCode: log.statusCode || log.request?.statusCode || log.response?.statusCode,
        responseTime: log.responseTime || (log.response && log.response.time),
        ip: log.ip,
        userAgent: log.userAgent
      };

      return Object.keys(fallback).some(key => fallback[key] !== undefined) ? fallback : {};
    } catch (error) {
      console.error('Error parsing log:', error);
    }
    return {};
  };

  const isRequestLog = (log) => {
    if (log.message === 'REQUEST_LOG') return true;
    const data = parseLogData(log);
    return data.type === 'request' || (data.ip && data.headers && !data.responseTime);
  };

  const isResponseLog = (log) => {
    if (log.message === 'RESPONSE_LOG') return true;
    const data = parseLogData(log);
    return data.type === 'response' || (data.responseTime && data.contentLength);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getLevelColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'error': return 'text-danger';
      case 'warn': return 'text-warning';
      case 'info': return 'text-info';
      default: return 'text-foreground-secondary';
    }
  };

  const getStatusColor = (statusCode) => {
    if (!statusCode) return 'text-foreground-secondary';
    if (statusCode >= 200 && statusCode < 300) return 'text-success';
    if (statusCode >= 300 && statusCode < 400) return 'text-warning';
    if (statusCode >= 400 && statusCode < 500) return 'text-danger';
    if (statusCode >= 500) return 'text-danger';
    return 'text-foreground-secondary';
  };

  const fetchLogs = async () => {
    setLoading(true);
    const result = await api.getLogs();

    if (result.success) {
      setLogs(result.data);
      setError('');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const fetchStats = async () => {
    const result = await api.getLogStats();
    if (result.success) {
      setStats(result.data);
    }
  };

  const handleClearAllLogs = async () => {
    setClearing(true);
    const result = await api.clearAllLogs(true);
    
    if (result.success) {
      setShowClearModal(false);
      await fetchLogs();
      await fetchStats();
      // Show success message
      alert(`✅ Successfully cleared ${result.data.deletedCount} logs`);
    } else {
      setError(result.error);
      alert(`❌ Failed to clear logs: ${result.error}`);
    }
    setClearing(false);
  };

  const handleClearOldLogs = async () => {
    setClearing(true);
    const result = await api.clearOldLogs(clearDays);
    
    if (result.success) {
      setShowClearModal(false);
      await fetchLogs();
      await fetchStats();
      alert(`✅ Successfully cleared ${result.data.deletedCount} logs older than ${clearDays} days`);
    } else {
      setError(result.error);
      alert(`❌ Failed to clear old logs: ${result.error}`);
    }
    setClearing(false);
  };

  const handleLogout = () => {
    api.logout();
    router.push('/login');
  };

  useEffect(() => {
    // Check authentication
    if (!api.isAuthenticated()) {
      router.push('/login');
      return;
    }

    setUser(api.getUser());
    fetchLogs();
    fetchStats();
  }, [router]);

  useEffect(() => {
    // Filter logs based on type and search
    let filtered = logs;

    // Filter by type
    if (filter === 'request') {
      filtered = logs.filter(log => isRequestLog(log));
    } else if (filter === 'response') {
      filtered = logs.filter(log => isResponseLog(log));
    }

    // Filter by search term (general)
    if (searchTerm) {
      filtered = filtered.filter(log => {
        const logData = parseLogData(log);
        const searchLower = searchTerm.toLowerCase();
        return (
          logData.method?.toLowerCase().includes(searchLower) ||
          logData.url?.toLowerCase().includes(searchLower) ||
          logData.statusCode?.toString().includes(searchLower) ||
          logData.ip?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filter by selected URL (dropdown)
    if (urlFilter) {
      filtered = filtered.filter(log => {
        const logData = parseLogData(log);
        return logData.url?.toLowerCase() === urlFilter.toLowerCase();
      });
    }

    setFilteredLogs(filtered);
  }, [logs, filter, searchTerm, urlFilter]);

  const renderLogCard = (log, index) => {
    const data = parseLogData(log);
    const isRequest = isRequestLog(log);
    const isResponse = isResponseLog(log);
    
    const dotColorClass = isRequest ? 'bg-blue-400' : (isResponse ? 'bg-green-400' : 'bg-gray-400');

    return (
      <div key={log._id || index} className="group bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5 hover:border-accent/60 hover:shadow-[0_0_15px_rgba(0,255,65,0.1)] transition-all duration-300">
        {/* Header with blinking cursor effect */}
        <div className="flex justify-between items-start mb-4 pb-2 border-b border-border/50">
          <div className="flex items-center gap-3">
            <span className={`relative px-2 py-1 rounded text-xs font-mono tracking-wider ${getLevelColor(log.level)} bg-current/5 border border-current/20`}>
              <span className="relative z-10">{log.level?.toUpperCase() || 'LOG'}</span>
            </span>
            <span className={`px-2 py-1 rounded text-xs font-mono tracking-wider border ${
              isRequest ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' :
              isResponse ? 'border-green-500/30 text-green-400 bg-green-500/5' :
              'border-gray-500/30 text-gray-400 bg-gray-500/5'
            }`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${dotColorClass} ${isRequest ? 'animate-pulse' : ''}`}></span>
              {isRequest ? 'REQUEST' : isResponse ? 'RESPONSE' : 'UNKNOWN'}
            </span>
          </div>
          <div className="text-foreground-secondary text-[11px] font-mono tracking-wider">
            {formatTimestamp(log.timestamp || log.metadata?.timestamp)}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {data.method && (
            <div className="flex items-baseline gap-2">
              <DetailPopup 
                icon="!"
                label="[METHOD]"
                details={logDetails.logFields.METHOD}
              />
              <MethodTooltip method={data.method}>
                <span className="text-accent text-sm font-mono font-bold tracking-wide cursor-help hover:underline">
                  {data.method}
                </span>
              </MethodTooltip>
            </div>
          )}
          {data.url && (
            <div className="flex items-baseline gap-2 col-span-2 md:col-span-1">
              <DetailPopup 
                icon="!"
                label="[URL]"
                details={logDetails.logFields.URL}
              />
              <span className="text-foreground text-xs font-mono break-all truncate hover:whitespace-normal transition-all">{data.url}</span>
            </div>
          )}
          {data.statusCode && (
            <div className="flex items-baseline gap-2">
              <DetailPopup 
                icon="!"
                label="[STATUS]"
                details={logDetails.logFields.STATUS}
              />
              <StatusCodeTooltip statusCode={data.statusCode}>
                <span className={`text-sm font-mono font-bold cursor-help hover:underline ${getStatusColor(data.statusCode)}`}>
                  {data.statusCode}
                </span>
              </StatusCodeTooltip>
            </div>
          )}
          {data.responseTime && (
            <div className="flex items-baseline gap-2">
              <DetailPopup 
                icon="!"
                label="[RESPONSE]"
                details={logDetails.logFields.RESPONSE}
              />
              <span className="text-info text-xs font-mono">{data.responseTime}ms</span>
            </div>
          )}
          {data.ip && (
            <div className="flex items-baseline gap-2">
              <DetailPopup 
                icon="!"
                label="[IP]"
                details={logDetails.logFields.IP}
              />
              <span className="text-foreground text-xs font-mono">{data.ip}</span>
            </div>
          )}
          {data.contentLength && (
            <div className="flex items-baseline gap-2">
              <DetailPopup 
                icon="!"
                label="[SIZE]"
                details={logDetails.logFields.SIZE}
              />
              <span className="text-foreground text-xs font-mono">{data.contentLength} bytes</span>
            </div>
          )}
        </div>

        {/* User Agent with hacker styling */}
        {data.userAgent && (
          <div className="mb-4 p-2 bg-background/50 border-l-2 border-accent/50 rounded-r">
            <span className="text-foreground-secondary text-[10px] font-mono tracking-wider block mb-1">[USER-AGENT]</span>
            <div className="text-foreground/70 text-[10px] font-mono break-all">
              {data.userAgent}
            </div>
          </div>
        )}

        {/* Collapsible sections with cyber styling */}
        {data.headers && Object.keys(data.headers).length > 0 && (
          <details className="mb-3 group">
            <summary className="text-foreground-secondary text-[11px] font-mono cursor-pointer hover:text-accent transition-colors flex items-center gap-2">
              <span className="inline-block w-2 h-2 border border-current group-open:rotate-90 transition-transform"></span>
              [HEADERS] ({Object.keys(data.headers).length})
            </summary>
            <pre className="text-foreground/70 text-[10px] font-mono mt-2 bg-background/30 p-3 rounded border border-border/50 overflow-x-auto">
              {JSON.stringify(data.headers, null, 2)}
            </pre>
          </details>
        )}

        {data.body && Object.keys(data.body).length > 0 && (
          <details className="mb-3 group">
            <summary className="text-foreground-secondary text-[11px] font-mono cursor-pointer hover:text-accent transition-colors flex items-center gap-2">
              <span className="inline-block w-2 h-2 border border-current group-open:rotate-90 transition-transform"></span>
              [BODY]
            </summary>
            <pre className="text-foreground/70 text-[10px] font-mono mt-2 bg-background/30 p-3 rounded border border-border/50 overflow-x-auto">
              {JSON.stringify(data.body, null, 2)}
            </pre>
          </details>
        )}

        {/* Footer with action button */}
        <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap justify-between items-center gap-2">
          <button
            onClick={() => setActiveLog(log)}
            className="group/btn relative text-xs font-mono tracking-wider border border-accent text-accent px-4 py-1.5 rounded hover:bg-accent/10 hover:shadow-[0_0_8px_rgba(0,255,65,0.3)] transition-all duration-200 overflow-hidden"
          >
            <span className="relative z-10">[ VIEW DETAILS ]</span>
          </button>
          <div className="text-foreground-secondary/50 text-[10px] font-mono">
            {log._id ? `ID: ${log._id.slice(-8)}` : 'ID: N/A'}
          </div>
        </div>
      </div>
    );
  };

  const activeData = activeLog ? parseLogData(activeLog) : {};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-accent rounded-full animate-ping"></div>
            </div>
          </div>
          <div className="text-accent font-mono text-sm tracking-wider animate-pulse">
            <span className="inline-block w-2 h-2 bg-accent rounded-full mr-2 animate-blink"></span>
            LOADING LOGS...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-background scanline relative">
      {/* Header with hacker terminal style */}
      <div className="border-b border-accent/30 pb-4 mb-6 relative">
        <div className="absolute top-0 left-0 w-24 h-px bg-accent/50"></div>
        <div className="absolute top-0 right-0 w-24 h-px bg-accent/50"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-accent text-2xl font-mono font-bold glow-text animate-pulse">&gt;</span>
              <h1 className="text-2xl md:text-3xl font-mono text-accent tracking-wider glow-text">
                SECMONITOR_LOGGER
              </h1>
            </div>
            <div className="text-foreground-secondary text-xs font-mono tracking-wider flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>
              {user && `> USER: ${user.email} | ACCESS: GRANTED | ROLE: ADMIN`}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-foreground-secondary text-[10px] font-mono tracking-wider bg-background/50 px-3 py-1 rounded border border-border">
              <span className="text-accent">DB_TIME:</span> {new Date().toLocaleString()}
            </div>
            <button
              onClick={handleLogout}
              className="mt-2 text-xs font-mono tracking-wider text-danger border border-danger/50 px-3 py-1 rounded hover:bg-danger/10 hover:border-danger transition-all duration-200"
            >
              [ LOGOUT ]
            </button>
          </div>
        </div>
        
        {/* Terminal-style prompt line */}
        <div className="mt-3 text-foreground-secondary/40 text-[10px] font-mono">
          <span className="text-accent">$</span> logger --active-session --collection=request_logs
        </div>
      </div>

      {/* Stats Grid with cyber styling */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="border border-border bg-card/50 p-4 rounded-lg backdrop-blur-sm hover:border-accent/30 transition-all duration-200">
            <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ TOTAL_ENTRIES ]</div>
            <div className="text-2xl md:text-3xl font-mono text-accent font-bold">{stats.total}</div>
          </div>
          <div className="border border-border bg-card/50 p-4 rounded-lg backdrop-blur-sm hover:border-blue-500/30 transition-all duration-200">
            <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ REQUESTS ]</div>
            <div className="text-2xl md:text-3xl font-mono text-blue-400 font-bold">{stats.byType.request}</div>
          </div>
          <div className="border border-border bg-card/50 p-4 rounded-lg backdrop-blur-sm hover:border-green-500/30 transition-all duration-200">
            <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ RESPONSES ]</div>
            <div className="text-2xl md:text-3xl font-mono text-green-400 font-bold">{stats.byType.response}</div>
          </div>
          <div className="border border-border bg-card/50 p-4 rounded-lg backdrop-blur-sm hover:border-danger/30 transition-all duration-200">
            <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ ERRORS ]</div>
            <div className="text-2xl md:text-3xl font-mono text-danger font-bold">{stats.byLevel.error}</div>
          </div>
          <div className="border border-border bg-card/50 p-4 rounded-lg backdrop-blur-sm hover:border-warning/30 transition-all duration-200">
            <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ RECENT_24H ]</div>
            <div className="text-2xl md:text-3xl font-mono text-warning font-bold">{stats.recent}</div>
          </div>
        </div>
      )}

      {/* Controls with terminal styling */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 p-4 bg-card/30 border border-border rounded-lg backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded text-xs font-mono tracking-wider transition-all duration-200 ${
              filter === 'all'
                ? 'bg-accent text-background border border-accent shadow-[0_0_10px_rgba(0,255,65,0.3)]'
                : 'border border-border text-foreground hover:border-accent/50 hover:text-accent'
            }`}
          >
            [ ALL ({logs.length}) ]
          </button>
          <button
            onClick={() => setFilter('request')}
            className={`px-4 py-1.5 rounded text-xs font-mono tracking-wider transition-all duration-200 ${
              filter === 'request'
                ? 'bg-blue-500 text-white border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                : 'border border-border text-foreground hover:border-blue-500/50 hover:text-blue-400'
            }`}
          >
            [ REQUESTS ({stats?.byType.request || 0}) ]
          </button>
          <button
            onClick={() => setFilter('response')}
            className={`px-4 py-1.5 rounded text-xs font-mono tracking-wider transition-all duration-200 ${
              filter === 'response'
                ? 'bg-green-500 text-white border border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                : 'border border-border text-foreground hover:border-green-500/50 hover:text-green-400'
            }`}
          >
            [ RESPONSES ({stats?.byType.response || 0}) ]
          </button>
        </div>

        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-foreground-secondary text-xs font-mono">&gt;</span>
            <input
              type="text"
              placeholder="SEARCH: method, url, status, ip..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-5 pr-3 py-1.5 bg-background border border-border rounded text-xs font-mono text-foreground placeholder-foreground-secondary/50 focus:outline-none focus:border-accent focus:shadow-[0_0_8px_rgba(0,255,65,0.2)] transition-all"
            />
          </div>
          <select
            value={urlFilter}
            onChange={(e) => setUrlFilter(e.target.value)}
            className="flex-1 lg:w-48 px-3 py-1.5 bg-background border border-border rounded text-xs font-mono text-foreground focus:outline-none focus:border-accent transition-all cursor-pointer"
          >
            <option value="">[ ALL URLs ]</option>
            {Array.from(new Set(logs
              .map(log => parseLogData(log).url)
              .filter(url => typeof url === 'string' && url.trim() !== '')))
              .sort()
              .map(url => (
                <option key={url} value={url}>{url}</option>
              ))
            }
          </select>
          <button
            onClick={fetchLogs}
            className="border border-accent text-accent px-4 py-1.5 rounded text-xs font-mono tracking-wider hover:bg-accent/10 hover:shadow-[0_0_8px_rgba(0,255,65,0.3)] transition-all duration-200"
          >
            [ REFRESH ]
          </button>
          <button
            onClick={() => setShowClearModal(true)}
            className="border border-danger text-danger px-4 py-1.5 rounded text-xs font-mono tracking-wider hover:bg-danger/10 hover:shadow-[0_0_8px_rgba(220,38,38,0.3)] transition-all duration-200"
          >
            [ CLEAR LOGS ]
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="border border-danger bg-danger/5 p-3 rounded-lg mb-4 animate-pulse">
          <span className="text-danger text-xs font-mono tracking-wider">[!] ERROR: {error}</span>
        </div>
      )}

      {/* Logs Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredLogs.length === 0 ? (
          <div className="col-span-full border border-border bg-card/50 p-12 rounded-lg text-center backdrop-blur-sm">
            <div className="text-foreground-secondary font-mono text-sm tracking-wider">
              {logs.length === 0 ? (
                <>
                  <span className="text-accent block mb-2">[ NO_LOGS_FOUND ]</span>
                  <span className="text-xs">Database collection is empty. Waiting for incoming requests...</span>
                </>
              ) : (
                <>
                  <span className="text-warning block mb-2">[ NO_MATCHING_LOGS ]</span>
                  <span className="text-xs">Try adjusting your search filters or URL selection.</span>
                </>
              )}
            </div>
          </div>
        ) : (
          filteredLogs.map((log, index) => renderLogCard(log, index))
        )}
      </div>

      {/* Clear Logs Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-background border border-danger/30 rounded-xl shadow-2xl shadow-danger/20">
            <div className="border-b border-danger/30 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-danger text-xl font-mono animate-pulse">⚠</span>
                <span className="text-danger font-mono tracking-wider">CLEAR_LOGS</span>
              </div>
              <button
                onClick={() => setShowClearModal(false)}
                className="text-foreground-secondary hover:text-danger font-mono text-sm transition-colors"
              >
                [X] CLOSE
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-foreground-secondary text-xs font-mono">
                Select the type of log clearance operation:
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:border-danger/30 transition-all">
                  <input
                    type="radio"
                    name="clearType"
                    value="all"
                    checked={clearType === 'all'}
                    onChange={(e) => setClearType(e.target.value)}
                    className="text-danger"
                  />
                  <div className="flex-1">
                    <div className="font-mono text-sm text-foreground">Clear All Logs</div>
                    <div className="text-foreground-secondary text-[10px] font-mono">Delete ALL logs from the database (permanent)</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:border-danger/30 transition-all">
                  <input
                    type="radio"
                    name="clearType"
                    value="old"
                    checked={clearType === 'old'}
                    onChange={(e) => setClearType(e.target.value)}
                    className="text-danger"
                  />
                  <div className="flex-1">
                    <div className="font-mono text-sm text-foreground">Clear Old Logs</div>
                    <div className="text-foreground-secondary text-[10px] font-mono">Delete logs older than specified days</div>
                  </div>
                </label>

                {clearType === 'old' && (
                  <div className="pl-8">
                    <label className="text-foreground-secondary text-xs font-mono block mb-2">Days to keep:</label>
                    <input
                      type="number"
                      value={clearDays}
                      onChange={(e) => setClearDays(parseInt(e.target.value) || 0)}
                      min="1"
                      max="365"
                      className="w-full px-3 py-2 bg-background border border-border rounded text-xs font-mono text-foreground focus:outline-none focus:border-danger"
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 mt-2">
                <div className="text-warning text-[10px] font-mono mb-3">
                  ⚠️ WARNING: This action cannot be undone. Make sure you have a backup if needed.
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearModal(false)}
                    className="flex-1 border border-border text-foreground px-4 py-2 rounded text-xs font-mono hover:bg-card/50 transition-all"
                  >
                    [ CANCEL ]
                  </button>
                  <button
                    onClick={clearType === 'all' ? handleClearAllLogs : handleClearOldLogs}
                    disabled={clearing}
                    className="flex-1 bg-danger text-white px-4 py-2 rounded text-xs font-mono hover:bg-danger/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {clearing ? 'CLEARING...' : '[ CONFIRM CLEAR ]'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {activeLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background border border-accent/30 rounded-xl shadow-2xl shadow-accent/20">
            {/* Modal Header */}
            <div className="sticky top-0 bg-background border-b border-accent/30 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-accent text-xl font-mono animate-pulse">&gt;</span>
                <span className="text-accent font-mono tracking-wider">LOG_DETAILS</span>
                <span className="text-foreground-secondary text-[10px] font-mono">
                  {activeLog._id ? `[ID: ${activeLog._id.slice(-8)}]` : '[ID: N/A]'}
                </span>
              </div>
              <button
                onClick={() => setActiveLog(null)}
                className="text-foreground-secondary hover:text-danger font-mono text-sm transition-colors"
              >
                [X] CLOSE
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              {/* Type and Level */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-card/30 border border-border rounded-lg">
                <div>
                  <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ TYPE ]</div>
                  <div className={`font-mono text-sm font-bold ${isRequestLog(activeLog) ? 'text-blue-400' : isResponseLog(activeLog) ? 'text-green-400' : 'text-gray-400'}`}>
                    {isRequestLog(activeLog) ? 'REQUEST' : isResponseLog(activeLog) ? 'RESPONSE' : 'UNKNOWN'}
                  </div>
                </div>
                <div>
                  <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ LEVEL ]</div>
                  <div className={`font-mono text-sm font-bold ${getLevelColor(activeLog.level)}`}>
                    {activeLog.level?.toUpperCase() || 'INFO'}
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-card/30 border border-border rounded-lg">
                <div>
                  <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ METHOD ]</div>
                  <div className="text-accent font-mono text-sm">{activeData.method || '-'}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ URL ]</div>
                  <div className="text-foreground font-mono text-xs break-all bg-background/50 p-2 rounded border border-border/50">{activeData.url || '-'}</div>
                </div>
                <div>
                  <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ STATUS ]</div>
                  <div className={`font-mono text-sm font-bold ${getStatusColor(activeData.statusCode)}`}>{activeData.statusCode || '-'}</div>
                </div>
                <div>
                  <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ RESPONSE_TIME ]</div>
                  <div className="text-info font-mono text-sm">{activeData.responseTime ? `${activeData.responseTime}ms` : '-'}</div>
                </div>
              </div>

              {/* Network Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-card/30 border border-border rounded-lg">
                <div>
                  <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ IP_ADDRESS ]</div>
                  <div className="text-foreground font-mono text-xs">{activeData.ip || '-'}</div>
                </div>
                <div>
                  <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ CONTENT_LENGTH ]</div>
                  <div className="text-foreground font-mono text-xs">{activeData.contentLength ? `${activeData.contentLength} bytes` : '-'}</div>
                </div>
                <div className="md:col-span-3">
                  <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ USER_AGENT ]</div>
                  <div className="text-foreground/70 font-mono text-[10px] break-all bg-background/50 p-2 rounded border border-border/50">{activeData.userAgent || '-'}</div>
                </div>
              </div>

              {/* Collapsible Raw Data */}
              <details className="group">
                <summary className="text-accent text-xs font-mono cursor-pointer hover:text-accent-dim transition-colors flex items-center gap-2 p-2 bg-card/30 rounded-lg border border-border">
                  <span className="inline-block w-2 h-2 border border-accent group-open:rotate-90 transition-transform"></span>
                  [ PARSED_DATA ]
                </summary>
                <pre className="text-foreground/70 text-[10px] font-mono mt-2 bg-background/50 p-3 rounded border border-border/50 overflow-x-auto max-h-64">
                  {JSON.stringify(activeData, null, 2)}
                </pre>
              </details>

              <details className="group">
                <summary className="text-accent text-xs font-mono cursor-pointer hover:text-accent-dim transition-colors flex items-center gap-2 p-2 bg-card/30 rounded-lg border border-border">
                  <span className="inline-block w-2 h-2 border border-accent group-open:rotate-90 transition-transform"></span>
                  [ RAW_LOG_DATA ]
                </summary>
                <pre className="text-foreground/70 text-[10px] font-mono mt-2 bg-background/50 p-3 rounded border border-border/50 overflow-x-auto max-h-64">
                  {JSON.stringify(activeLog, null, 2)}
                </pre>
              </details>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-background border-t border-accent/30 p-3 text-center">
              <div className="text-foreground-secondary text-[9px] font-mono tracking-wider">
                <span className="text-accent">$</span> inspect --log-id={activeLog._id?.slice(-8)} --timestamp={formatTimestamp(activeLog.timestamp)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-foreground-secondary/50 text-[10px] font-mono border-t border-border/30 pt-4">
        <div className="flex flex-col md:flex-row justify-between gap-2">
          <span>SECMONITOR v2.0 | CYBERSECURITY MONITORING DASHBOARD</span>
          <span>DATABASE: MONGODB | COLLECTION: request_logs | STATUS: ACTIVE</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </div>
  );
}