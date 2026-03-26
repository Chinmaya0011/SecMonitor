// app/components/logger/StatsGrid.js
export default function StatsGrid({ stats }) {
  return (
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
  );
}