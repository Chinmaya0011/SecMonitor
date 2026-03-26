// app/components/logger/LogDetailModal.js
import { parseLogData, isRequestLog, isResponseLog, formatTimestamp, getLevelColor, getStatusColor } from '@/app/lib/logUtils';

export default function LogDetailModal({ log, onClose }) {
  if (!log) return null;

  const data = parseLogData(log);
  const isRequest = isRequestLog(log);
  const isResponse = isResponseLog(log);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background border border-accent/30 rounded-xl shadow-2xl shadow-accent/20">
        {/* Modal Header */}
        <div className="sticky top-0 bg-background border-b border-accent/30 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-accent text-xl font-mono animate-pulse">&gt;</span>
            <span className="text-accent font-mono tracking-wider">LOG_DETAILS</span>
            <span className="text-foreground-secondary text-[10px] font-mono">
              {log._id ? `[ID: ${log._id.slice(-8)}]` : '[ID: N/A]'}
            </span>
          </div>
          <button
            onClick={onClose}
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
              <div className={`font-mono text-sm font-bold ${isRequest ? 'text-blue-400' : isResponse ? 'text-green-400' : 'text-gray-400'}`}>
                {isRequest ? 'REQUEST' : isResponse ? 'RESPONSE' : 'UNKNOWN'}
              </div>
            </div>
            <div>
              <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ LEVEL ]</div>
              <div className={`font-mono text-sm font-bold ${getLevelColor(log.level)}`}>
                {log.level?.toUpperCase() || 'INFO'}
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-card/30 border border-border rounded-lg">
            <div>
              <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ METHOD ]</div>
              <div className="text-accent font-mono text-sm">{data.method || '-'}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ URL ]</div>
              <div className="text-foreground font-mono text-xs break-all bg-background/50 p-2 rounded border border-border/50">{data.url || '-'}</div>
            </div>
            <div>
              <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ STATUS ]</div>
              <div className={`font-mono text-sm font-bold ${getStatusColor(data.statusCode)}`}>{data.statusCode || '-'}</div>
            </div>
            <div>
              <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ RESPONSE_TIME ]</div>
              <div className="text-info font-mono text-sm">{data.responseTime ? `${data.responseTime}ms` : '-'}</div>
            </div>
          </div>

          {/* Network Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-card/30 border border-border rounded-lg">
            <div>
              <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ IP_ADDRESS ]</div>
              <div className="text-foreground font-mono text-xs">{data.ip || '-'}</div>
            </div>
            <div>
              <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ CONTENT_LENGTH ]</div>
              <div className="text-foreground font-mono text-xs">{data.contentLength ? `${data.contentLength} bytes` : '-'}</div>
            </div>
            <div className="md:col-span-3">
              <div className="text-foreground-secondary text-[10px] font-mono tracking-wider mb-1">[ USER_AGENT ]</div>
              <div className="text-foreground/70 font-mono text-[10px] break-all bg-background/50 p-2 rounded border border-border/50">{data.userAgent || '-'}</div>
            </div>
          </div>

          {/* Collapsible Raw Data */}
          <details className="group">
            <summary className="text-accent text-xs font-mono cursor-pointer hover:text-accent-dim transition-colors flex items-center gap-2 p-2 bg-card/30 rounded-lg border border-border">
              <span className="inline-block w-2 h-2 border border-accent group-open:rotate-90 transition-transform"></span>
              [ PARSED_DATA ]
            </summary>
            <pre className="text-foreground/70 text-[10px] font-mono mt-2 bg-background/50 p-3 rounded border border-border/50 overflow-x-auto max-h-64">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>

          <details className="group">
            <summary className="text-accent text-xs font-mono cursor-pointer hover:text-accent-dim transition-colors flex items-center gap-2 p-2 bg-card/30 rounded-lg border border-border">
              <span className="inline-block w-2 h-2 border border-accent group-open:rotate-90 transition-transform"></span>
              [ RAW_LOG_DATA ]
            </summary>
            <pre className="text-foreground/70 text-[10px] font-mono mt-2 bg-background/50 p-3 rounded border border-border/50 overflow-x-auto max-h-64">
              {JSON.stringify(log, null, 2)}
            </pre>
          </details>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-background border-t border-accent/30 p-3 text-center">
          <div className="text-foreground-secondary text-[9px] font-mono tracking-wider">
            <span className="text-accent">$</span> inspect --log-id={log._id?.slice(-8)} --timestamp={formatTimestamp(log.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
}