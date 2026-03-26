// app/components/logger/LoggerControls.js
export default function LoggerControls({
  filter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  urlFilter,
  onUrlFilterChange,
  logs,
  stats,
  onRefresh,
  onClearClick
}) {
  const getUniqueUrls = () => {
    return Array.from(new Set(logs
      .map(log => {
        try {
          const data = log.metadata || log.meta || {};
          return data.url;
        } catch {
          return null;
        }
      })
      .filter(url => typeof url === 'string' && url.trim() !== '')))
      .sort();
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 p-4 bg-card/30 border border-border rounded-lg backdrop-blur-sm">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-4 py-1.5 rounded text-xs font-mono tracking-wider transition-all duration-200 ${
            filter === 'all'
              ? 'bg-accent text-background border border-accent shadow-[0_0_10px_rgba(0,255,65,0.3)]'
              : 'border border-border text-foreground hover:border-accent/50 hover:text-accent'
          }`}
        >
          [ ALL ({logs.length}) ]
        </button>
        <button
          onClick={() => onFilterChange('request')}
          className={`px-4 py-1.5 rounded text-xs font-mono tracking-wider transition-all duration-200 ${
            filter === 'request'
              ? 'bg-blue-500 text-white border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
              : 'border border-border text-foreground hover:border-blue-500/50 hover:text-blue-400'
          }`}
        >
          [ REQUESTS ({stats?.byType.request || 0}) ]
        </button>
        <button
          onClick={() => onFilterChange('response')}
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-5 pr-3 py-1.5 bg-background border border-border rounded text-xs font-mono text-foreground placeholder-foreground-secondary/50 focus:outline-none focus:border-accent focus:shadow-[0_0_8px_rgba(0,255,65,0.2)] transition-all"
          />
        </div>
        <select
          value={urlFilter}
          onChange={(e) => onUrlFilterChange(e.target.value)}
          className="flex-1 lg:w-48 px-3 py-1.5 bg-background border border-border rounded text-xs font-mono text-foreground focus:outline-none focus:border-accent transition-all cursor-pointer"
        >
          <option value="">[ ALL URLs ]</option>
          {getUniqueUrls().map(url => (
            <option key={url} value={url}>{url}</option>
          ))}
        </select>
        <button
          onClick={onRefresh}
          className="border border-accent text-accent px-4 py-1.5 rounded text-xs font-mono tracking-wider hover:bg-accent/10 hover:shadow-[0_0_8px_rgba(0,255,65,0.3)] transition-all duration-200"
        >
          [ REFRESH ]
        </button>
        <button
          onClick={onClearClick}
          className="border border-danger text-danger px-4 py-1.5 rounded text-xs font-mono tracking-wider hover:bg-danger/10 hover:shadow-[0_0_8px_rgba(220,38,38,0.3)] transition-all duration-200"
        >
          [ CLEAR LOGS ]
        </button>
      </div>
    </div>
  );
} 