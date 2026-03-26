// app/(pages)/logger/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/api';
import LoggerHeader from '../components/LoggerHeader';
import StatsGrid from '../components/StatsGrid';
import LoggerControls from '../components/LoggerControls';
import LogCard from '../components/LogCard';
import ClearLogsModal from '../components/ClearLogsModal';
import LogDetailModal from '../components/LogDetailModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { parseLogData, isRequestLog, isResponseLog } from '@/app/lib/logUtils';

export default function LoggerPage() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [urlFilter, setUrlFilter] = useState('');
  const [activeLog, setActiveLog] = useState(null);
  const [stats, setStats] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearType, setClearType] = useState('all');
  const [clearDays, setClearDays] = useState(30);
  const [clearing, setClearing] = useState(false);
  const router = useRouter();

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
    if (!api.isAuthenticated()) {
      router.push('/login');
      return;
    }
    setUser(api.getUser());
    fetchLogs();
    fetchStats();
  }, [router]);

  useEffect(() => {
    let filtered = logs;

    if (filter === 'request') {
      filtered = logs.filter(log => isRequestLog(log));
    } else if (filter === 'response') {
      filtered = logs.filter(log => isResponseLog(log));
    }

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

    if (urlFilter) {
      filtered = filtered.filter(log => {
        const logData = parseLogData(log);
        return logData.url?.toLowerCase() === urlFilter.toLowerCase();
      });
    }

    setFilteredLogs(filtered);
  }, [logs, filter, searchTerm, urlFilter]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-background scanline relative">
      <LoggerHeader user={user} onLogout={handleLogout} />
      
      {stats && <StatsGrid stats={stats} />}
      
      <LoggerControls
        filter={filter}
        onFilterChange={setFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        urlFilter={urlFilter}
        onUrlFilterChange={setUrlFilter}
        logs={logs}
        stats={stats}
        onRefresh={fetchLogs}
        onClearClick={() => setShowClearModal(true)}
      />
      
      {error && (
        <div className="border border-danger bg-danger/5 p-3 rounded-lg mb-4 animate-pulse">
          <span className="text-danger text-xs font-mono tracking-wider">[!] ERROR: {error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredLogs.length === 0 ? (
          <EmptyState hasLogs={logs.length > 0} />
        ) : (
          filteredLogs.map((log, index) => (
            <LogCard
              key={log._id || index}
              log={log}
              onViewDetails={setActiveLog}
            />
          ))
        )}
      </div>
      
      <ClearLogsModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        clearType={clearType}
        onClearTypeChange={setClearType}
        clearDays={clearDays}
        onClearDaysChange={setClearDays}
        onClearAll={handleClearAllLogs}
        onClearOld={handleClearOldLogs}
        clearing={clearing}
      />
      
      <LogDetailModal
        log={activeLog}
        onClose={() => setActiveLog(null)}
      />
      
      <div className="mt-8 text-center text-foreground-secondary/50 text-[10px] font-mono border-t border-border/30 pt-4">
        <div className="flex flex-col md:flex-row justify-between gap-2">
          <span>SECMONITOR v2.0 | CYBERSECURITY MONITORING DASHBOARD</span>
          <span>DATABASE: MONGODB | COLLECTION: request_logs | STATUS: ACTIVE</span>
        </div>
      </div>
    </div>
  );
}