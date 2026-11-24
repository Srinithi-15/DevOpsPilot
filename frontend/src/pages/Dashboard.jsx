import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Server, History, Shield, ArrowUpRight, Cpu, HardDrive, CheckCircle2 } from 'lucide-react';
import { getServices, getDeployments, getHealth, getActuatorHealth } from '../api/client';
import HealthBanner from '../components/HealthBanner';

export default function Dashboard() {
  const [services, setServices] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [healthData, setHealthData] = useState(null);
  const [actuatorData, setActuatorData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [svcData, depData, hData, actData] = await Promise.allSettled([
        getServices(),
        getDeployments(),
        getHealth(),
        getActuatorHealth(),
      ]);

      if (svcData.status === 'fulfilled') setServices(svcData.value);
      if (depData.status === 'fulfilled') setDeployments(depData.value);
      if (hData.status === 'fulfilled') setHealthData(hData.value);
      if (actData.status === 'fulfilled') setActuatorData(actData.value);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const latestDeployments = deployments.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner with live health data */}
      <HealthBanner
        healthData={healthData}
        actuatorData={actuatorData}
        loading={loading}
        onRefresh={fetchData}
      />

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Registered Services
            </span>
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">{services.length}</span>
            <Link to="/services" className="text-xs text-sky-400 hover:text-sky-300 flex items-center">
              View all <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Recorded Deployments
            </span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">{deployments.length}</span>
            <Link to="/deployments" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center">
              Audit log <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Monitoring Scraper
            </span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-sm font-semibold text-emerald-400 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1" /> Prometheus 2.53
            </span>
            <a
              href="http://localhost:9090"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center"
            >
              Open <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Telemetry Dashboard
            </span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-sm font-semibold text-emerald-400 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1" /> Grafana 11.1
            </span>
            <a
              href="http://localhost:3000/d/devopspilot-overview"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
            >
              Dashboards <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Registered Services & Recent Deployments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Services */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Registered Microservices</h3>
            <Link to="/services" className="text-xs text-sky-400 hover:underline">
              Manage Services
            </Link>
          </div>
          {services.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No services registered yet.</p>
          ) : (
            <div className="divide-y divide-slate-800">
              {services.slice(0, 4).map((svc) => (
                <div key={svc.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">{svc.serviceName}</h4>
                    <p className="text-xs text-slate-400 truncate max-w-xs">{svc.description || 'No description'}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-slate-800 text-sky-400 border border-slate-700">
                    {svc.environment}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Deployments */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Recent Deployments</h3>
            <Link to="/deployments" className="text-xs text-emerald-400 hover:underline">
              View History
            </Link>
          </div>
          {latestDeployments.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No deployment records found.</p>
          ) : (
            <div className="divide-y divide-slate-800">
              {latestDeployments.map((dep) => (
                <div key={dep.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-slate-200">
                        Service #{dep.serviceId}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {dep.version}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(dep.deployedAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      dep.deploymentStatus === 'DEPLOYED' || dep.deploymentStatus === 'SUCCESS'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {dep.deploymentStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
