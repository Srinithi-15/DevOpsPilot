import React from 'react';
import { ExternalLink, Activity } from 'lucide-react';

export default function Topbar({ isConnected }) {
  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-slate-300">Target Environment:</span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Local Docker Stack
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
          <Activity className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-rose-400'}`} />
          <span className={isConnected ? 'text-slate-200' : 'text-rose-300'}>
            {isConnected ? 'API Connected' : 'Connecting to Backend...'}
          </span>
        </div>

        <a
          href="http://localhost:3000/d/devopspilot-overview"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1.5 text-xs text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1.5 rounded-lg border border-sky-500/20 transition-colors"
        >
          <span>Open Grafana</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <a
          href="http://localhost:9090"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/20 transition-colors"
        >
          <span>Prometheus</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
}
