import React from 'react';
import { ExternalLink, LineChart, Cpu, HardDrive, ShieldCheck, Activity } from 'lucide-react';

export default function Observability() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Observability & Telemetry Hub</h1>
        <p className="text-sm text-slate-400">
          Real-time metrics scraping, time-series visualization, and health telemetry operating at ₹0 cloud budget.
        </p>
      </div>

      {/* Observability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grafana Card */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  <LineChart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Grafana Dashboards</h3>
                  <p className="text-xs text-slate-400">Port 3000 • Auto-provisioned</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <p className="text-sm text-slate-300 mb-4">
              Access the customized <strong className="text-white">DevOpsPilot System Telemetry</strong> dashboard.
              Visualizes real-time JVM memory allocations (Eden/Old Gen), CPU utilization, request throughput, and HikariCP connection pool stats.
            </p>

            <ul className="text-xs text-slate-400 space-y-1.5 mb-6">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>Dashboard UID: <code className="text-slate-300">devopspilot-overview</code></span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>Default Credentials: <code className="text-slate-300">admin / admin</code></span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>Persistent Volume: <code className="text-slate-300">devopspilot_grafana_data</code></span>
              </li>
            </ul>
          </div>

          <a
            href="http://localhost:3000/d/devopspilot-overview"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm transition-colors"
          >
            <span>Launch Grafana Dashboard</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Prometheus Card */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Prometheus Server</h3>
                  <p className="text-xs text-slate-400">Port 9090 • Time-Series DB</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <p className="text-sm text-slate-300 mb-4">
              Queries metric targets scraped every 10 seconds from Spring Boot Actuator at <code className="text-xs bg-slate-900 px-1.5 py-0.5 rounded text-amber-300">/actuator/prometheus</code>.
              Execute raw PromQL queries and inspect scrape health.
            </p>

            <ul className="text-xs text-slate-400 space-y-1.5 mb-6">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Target: <code className="text-slate-300">devopspilot-backend:8080</code></span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Scrape Interval: <code className="text-slate-300">5 seconds</code></span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Persistent Volume: <code className="text-slate-300">devopspilot_prometheus_data</code></span>
              </li>
            </ul>
          </div>

          <a
            href="http://localhost:9090"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold rounded-lg text-sm transition-colors"
          >
            <span>Open Prometheus Console</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Architectural Telemetry Flow */}
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-3 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-sky-400" />
          <span>Zero-Budget Telemetry Pipeline Architecture</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          In this local DevOps setup, telemetry is generated natively by the Spring Boot 3 Micrometer registry and Actuator probe.
          Prometheus scrapes the endpoint every 5 seconds over the internal Docker network. Grafana uses auto-provisioning
          files (<code className="text-slate-300">datasources/prometheus.yml</code> and <code className="text-slate-300">dashboards/dashboards.yml</code>)
          to bootstrap without manual UI setup.
        </p>
      </div>
    </div>
  );
}
