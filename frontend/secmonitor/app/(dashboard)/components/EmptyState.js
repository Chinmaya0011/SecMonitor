// app/components/logger/EmptyState.js
export default function EmptyState({ hasLogs }) {
  return (
    <div className="col-span-full border border-border bg-card/50 p-12 rounded-lg text-center backdrop-blur-sm">
      <div className="text-foreground-secondary font-mono text-sm tracking-wider">
        {!hasLogs ? (
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
  );
}