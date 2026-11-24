import React, { useState, useEffect } from 'react';
import { History, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getDeployments, getServices, recordDeployment } from '../api/client';

export default function Deployments() {
  const [deployments, setDeployments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: '',
    version: 'v1.0.0',
    deploymentStatus: 'DEPLOYED',
    deploymentMessage: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [depData, svcData] = await Promise.all([getDeployments(), getServices()]);
      setDeployments(depData);
      setServices(svcData);
      if (svcData.length > 0 && !formData.serviceId) {
        setFormData((prev) => ({ ...prev, serviceId: svcData[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      await recordDeployment({
        ...formData,
        serviceId: Number(formData.serviceId),
      });
      setSuccessMsg('Deployment successfully logged in audit record!');
      setFormData({
        serviceId: services[0]?.id || '',
        version: 'v1.0.1',
        deploymentStatus: 'DEPLOYED',
        deploymentMessage: '',
      });
      setShowModal(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Recording deployment failed';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Deployment Audit Trail</h1>
          <p className="text-sm text-slate-400">
            Immutable history of software deliveries, versions, and deployment states in MySQL.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={services.length === 0}
          className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Log Deployment Event</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Deployment Records Table */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/80 bg-slate-900/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Deployment Message</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Loading deployment history from database...
                  </td>
                </tr>
              ) : deployments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No deployment events recorded yet.
                  </td>
                </tr>
              ) : (
                deployments.map((dep) => {
                  const matchedService = services.find((s) => s.id === dep.serviceId);
                  return (
                    <tr key={dep.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-400">#{dep.id}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-200">
                        {matchedService ? matchedService.serviceName : `Service #${dep.serviceId}`}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
                        {dep.version}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${
                            dep.deploymentStatus === 'DEPLOYED' || dep.deploymentStatus === 'SUCCESS'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {dep.deploymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-sm truncate">
                        {dep.deploymentMessage || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {new Date(dep.deployedAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deployment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2">Record Deployment Action</h3>
            <p className="text-xs text-slate-400 mb-4">
              Log a software release event linked to an existing registered microservice.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Service *
                </label>
                <select
                  required
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.serviceName} ({s.environment})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Release Version *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. v1.2.0 or commit hash"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deployment Status *
                </label>
                <select
                  value={formData.deploymentStatus}
                  onChange={(e) => setFormData({ ...formData, deploymentStatus: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="DEPLOYED">DEPLOYED</option>
                  <option value="ROLLING_UPDATE">ROLLING_UPDATE</option>
                  <option value="FAILED">FAILED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deployment Notes / Change Summary
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Automated CI/CD deployment triggered via GitHub Actions"
                  value={formData.deploymentMessage}
                  onChange={(e) => setFormData({ ...formData, deploymentMessage: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Recording...' : 'Record Deployment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
