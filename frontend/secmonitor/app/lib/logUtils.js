// app/lib/logUtils.js
export const parseLogData = (log) => {
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

export const isRequestLog = (log) => {
  if (log.message === 'REQUEST_LOG') return true;
  const data = parseLogData(log);
  return data.type === 'request' || (data.ip && data.headers && !data.responseTime);
};

export const isResponseLog = (log) => {
  if (log.message === 'RESPONSE_LOG') return true;
  const data = parseLogData(log);
  return data.type === 'response' || (data.responseTime && data.contentLength);
};

export const formatTimestamp = (timestamp) => {
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

export const getLevelColor = (level) => {
  switch(level?.toLowerCase()) {
    case 'error': return 'text-danger';
    case 'warn': return 'text-warning';
    case 'info': return 'text-info';
    default: return 'text-foreground-secondary';
  }
};

export const getStatusColor = (statusCode) => {
  if (!statusCode) return 'text-foreground-secondary';
  if (statusCode >= 200 && statusCode < 300) return 'text-success';
  if (statusCode >= 300 && statusCode < 400) return 'text-warning';
  if (statusCode >= 400 && statusCode < 500) return 'text-danger';
  if (statusCode >= 500) return 'text-danger';
  return 'text-foreground-secondary';
};