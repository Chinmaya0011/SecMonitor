// app/components/logger/LoadingSpinner.js
export default function LoadingSpinner() {
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
      <style jsx>{`
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