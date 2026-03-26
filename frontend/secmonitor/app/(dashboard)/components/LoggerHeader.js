// app/components/logger/LoggerHeader.js
'use client';

export default function LoggerHeader({ user, onLogout }) {
  return (
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
            onClick={onLogout}
            className="mt-2 text-xs font-mono tracking-wider text-danger border border-danger/50 px-3 py-1 rounded hover:bg-danger/10 hover:border-danger transition-all duration-200"
          >
            [ LOGOUT ]
          </button>
        </div>
      </div>
      
      <div className="mt-3 text-foreground-secondary/40 text-[10px] font-mono">
        <span className="text-accent">$</span> logger --active-session --collection=request_logs
      </div>
    </div>
  );
}