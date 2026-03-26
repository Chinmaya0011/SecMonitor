// app/components/logger/LogCard.js
import { useState } from 'react';
import DetailPopup from '@/app/components/DetailPopup';
import MethodTooltip from '@/app/components/MethodTooltip';
import StatusCodeTooltip from '@/app/components/StatusCodeTooltip';
import { parseLogData, isRequestLog, isResponseLog, formatTimestamp, getLevelColor, getStatusColor } from '@/app/lib/logUtils';

export default function LogCard({ log, onViewDetails }) {
  const data = parseLogData(log);
  const isRequest = isRequestLog(log);
  const isResponse = isResponseLog(log);
  const dotColorClass = isRequest ? 'bg-blue-400' : (isResponse ? 'bg-green-400' : 'bg-gray-400');

  return (
    <div className="group bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5 hover:border-accent/60 hover:shadow-[0_0_15px_rgba(0,255,65,0.1)] transition-all duration-300">
      {/* Header */}
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

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {data.method && (
          <div className="flex items-baseline gap-2">
            <DetailPopup icon="!" label="[METHOD]" details="HTTP method used for the request" />
            <MethodTooltip method={data.method}>
              <span className="text-accent text-sm font-mono font-bold tracking-wide cursor-help hover:underline">
                {data.method}
              </span>
            </MethodTooltip>
          </div>
        )}
        {data.url && (
          <div className="flex items-baseline gap-2 col-span-2 md:col-span-1">
            <DetailPopup icon="!" label="[URL]" details="Request URL endpoint" />
            <span className="text-foreground text-xs font-mono break-all truncate hover:whitespace-normal transition-all">{data.url}</span>
          </div>
        )}
        {data.statusCode && (
          <div className="flex items-baseline gap-2">
            <DetailPopup icon="!" label="[STATUS]" details="HTTP status code" />
            <StatusCodeTooltip statusCode={data.statusCode}>
              <span className={`text-sm font-mono font-bold cursor-help hover:underline ${getStatusColor(data.statusCode)}`}>
                {data.statusCode}
              </span>
            </StatusCodeTooltip>
          </div>
        )}
        {data.responseTime && (
          <div className="flex items-baseline gap-2">
            <DetailPopup icon="!" label="[RESPONSE]" details="Response time in milliseconds" />
            <span className="text-info text-xs font-mono">{data.responseTime}ms</span>
          </div>
        )}
        {data.ip && (
          <div className="flex items-baseline gap-2">
            <DetailPopup icon="!" label="[IP]" details="Client IP address" />
            <span className="text-foreground text-xs font-mono">{data.ip}</span>
          </div>
        )}
        {data.contentLength && (
          <div className="flex items-baseline gap-2">
            <DetailPopup icon="!" label="[SIZE]" details="Response content length" />
            <span className="text-foreground text-xs font-mono">{data.contentLength} bytes</span>
          </div>
        )}
      </div>

      {/* User Agent */}
      {data.userAgent && (
        <div className="mb-4 p-2 bg-background/50 border-l-2 border-accent/50 rounded-r">
          <span className="text-foreground-secondary text-[10px] font-mono tracking-wider block mb-1">[USER-AGENT]</span>
          <div className="text-foreground/70 text-[10px] font-mono break-all">
            {data.userAgent}
          </div>
        </div>
      )}

      {/* Collapsible Sections */}
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

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap justify-between items-center gap-2">
        <button
          onClick={() => onViewDetails(log)}
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
}