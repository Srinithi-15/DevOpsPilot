import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Server, History, LineChart, ShieldCheck } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Service Registry', path: '/services', icon: Server },
  { name: 'Deployments', path: '/deployments', icon: History },
  { name: 'Observability', path: '/observability', icon: LineChart },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 min-h-screen">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-sky-500/10 p-2 rounded-lg border border-sky-500/20 text-sky-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-wide">DevOpsPilot</h1>
          <p className="text-xs text-slate-400">Infrastructure Platform</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 space-y-1">
        <div className="flex justify-between">
          <span>Backend</span>
          <span className="text-slate-300 font-mono">Java 21</span>
        </div>
        <div className="flex justify-between">
          <span>Database</span>
          <span className="text-slate-300 font-mono">MySQL 8.0</span>
        </div>
        <div className="flex justify-between">
          <span>Infrastructure</span>
          <span className="text-emerald-400 font-mono">₹0 Local Stack</span>
        </div>
      </div>
    </aside>
  );
}
