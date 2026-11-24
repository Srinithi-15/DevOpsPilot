import React from 'react';
import { Database, Server, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function HealthBanner({ healthData, actuatorData, loading, onRefresh }) {
  const isAppUp = healthData?.status === 'UP';
  const isDbUp = actuatorData?.components?.db?.status === 'UP';

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Real-Time System Telemetry
          </h2>
          <span className="text-xs text-slate-500">• Live Spring Boot Actuator Probe</span>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-700/50 hover:bg-slate-700 px-2.5 py-1.5 rounded-md transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Spring Boot Service Status */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isAppUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Application Core</p>
              <p className="text-sm font-medium text-slate-200">
                {healthData?.application || 'devopspilot-backend'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {isAppUp ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-400/10 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> UP
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-400/10 text-rose-400">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> DOWN
              </span>
            )}
          </div>
        </div>

        {/* MySQL Database Status */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isDbUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Relational Database</p>
              <p className="text-sm font-medium text-slate-200">MySQL 8.0 (Port 3307/3306)</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {isDbUp ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-400/10 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> HEALTHY
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-400/10 text-rose-400">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> UNREACHABLE
              </span>
            )}
          </div>
        </div>

        {/* Runtime Environment Info */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Profile / Version</p>
            <p className="text-sm font-medium text-slate-200">
              {healthData?.environment ? `Profile: ${healthData.environment}` : 'dev'} • v{healthData?.version || '1.0.0'}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">
            Java 21 LTS
          </span>
        </div>
      </div>
    </div>
  );
}
