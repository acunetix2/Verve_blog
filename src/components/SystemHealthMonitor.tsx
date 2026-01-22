import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { circuitBreaker, requestQueue } from '@/lib/axiosConfig';

interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  checks: {
    database: string;
    api: string;
    memory: string;
  };
}

export default function SystemHealthMonitor() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [circuitState, setCircuitState] = useState('CLOSED');
  const [queueSize, setQueueSize] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/health`);
        setHealth(response.data);
      } catch (error) {
        console.error('Health check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately and then every 30 seconds
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);

    // Update circuit breaker and queue status every 5 seconds
    const statusInterval = setInterval(() => {
      setCircuitState(circuitBreaker.getState());
      setQueueSize(requestQueue.getSize());
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, []);

  if (!health) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400 text-sm">Loading health status...</p>
      </div>
    );
  }

  const isHealthy = health.status === 'OK';
  const isDegraded = health.status === 'DEGRADED';

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="space-y-4">
        {/* Main Status */}
        <div className="flex items-center gap-3">
          {isHealthy ? (
            <CheckCircle2 className="text-green-600 dark:text-green-500" size={24} />
          ) : isDegraded ? (
            <AlertTriangle className="text-yellow-600 dark:text-yellow-500" size={24} />
          ) : (
            <AlertTriangle className="text-red-600 dark:text-red-500" size={24} />
          )}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              System Status: <span className={
                isHealthy ? 'text-green-600' : isDegraded ? 'text-yellow-600' : 'text-red-600'
              }>{health.status}</span>
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {new Date(health.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Service Checks Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <p className="text-gray-600 dark:text-gray-400">Database</p>
            <p className={`font-semibold ${
              health.checks.database === 'ok' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
            }`}>{health.checks.database}</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <p className="text-gray-600 dark:text-gray-400">API</p>
            <p className="font-semibold text-green-600 dark:text-green-400">{health.checks.api}</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <p className="text-gray-600 dark:text-gray-400">Memory</p>
            <p className={`font-semibold ${
              parseInt(health.checks.memory) > 80 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
            }`}>{health.checks.memory}</p>
          </div>
        </div>

        {/* Circuit Breaker & Queue Status */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-center gap-2">
            <Zap size={14} className={
              circuitState === 'CLOSED' ? 'text-green-600' : circuitState === 'HALF_OPEN' ? 'text-yellow-600' : 'text-red-600'
            } />
            <div>
              <p className="text-gray-600 dark:text-gray-400">Circuit</p>
              <p className="font-semibold">{circuitState}</p>
            </div>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-center gap-2">
            <Activity size={14} className={queueSize > 0 ? 'text-yellow-600' : 'text-green-600'} />
            <div>
              <p className="text-gray-600 dark:text-gray-400">Queue</p>
              <p className="font-semibold">{queueSize} requests</p>
            </div>
          </div>
        </div>

        {/* Uptime */}
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Uptime: {Math.floor(health.uptime / 60)}m {Math.floor(health.uptime % 60)}s
        </p>

        {/* Warnings */}
        {isDegraded && (
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800 rounded text-xs text-yellow-800 dark:text-yellow-300">
            ⚠️ System is degraded. Check database connection and memory usage.
          </div>
        )}

        {circuitState !== 'CLOSED' && (
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-800 rounded text-xs text-orange-800 dark:text-orange-300">
            🔌 Circuit breaker is {circuitState}. Requests are being queued.
          </div>
        )}

        {queueSize > 0 && (
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-800 rounded text-xs text-blue-800 dark:text-blue-300">
            📋 {queueSize} requests queued. Will process when service recovers.
          </div>
        )}
      </div>
    </div>
  );
}
