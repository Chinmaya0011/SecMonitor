// app/components/logger/ClearLogsModal.js
export default function ClearLogsModal({
  isOpen,
  onClose,
  clearType,
  onClearTypeChange,
  clearDays,
  onClearDaysChange,
  onClearAll,
  onClearOld,
  clearing
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-background border border-danger/30 rounded-xl shadow-2xl shadow-danger/20">
        <div className="border-b border-danger/30 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-danger text-xl font-mono animate-pulse">⚠</span>
            <span className="text-danger font-mono tracking-wider">CLEAR_LOGS</span>
          </div>
          <button
            onClick={onClose}
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
                onChange={(e) => onClearTypeChange(e.target.value)}
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
                onChange={(e) => onClearTypeChange(e.target.value)}
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
                  onChange={(e) => onClearDaysChange(parseInt(e.target.value) || 0)}
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
                onClick={onClose}
                className="flex-1 border border-border text-foreground px-4 py-2 rounded text-xs font-mono hover:bg-card/50 transition-all"
              >
                [ CANCEL ]
              </button>
              <button
                onClick={clearType === 'all' ? onClearAll : onClearOld}
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
  );
}