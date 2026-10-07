import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Download,
  Calendar,
  FileText,
  TrendingUp,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { ADMIN_STATS } from '../../data/mockData';

export const AdminReportsPage: React.FC = () => {
  const { addNotification } = useApp();

  const handleDownload = (reportName: string) => {
    addNotification('Report Exported', `${reportName} generated and downloaded as CSV.`, 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Platform Reports & Grid Audits
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Download monthly consumption statements, GST invoices, and uptime SLA logs for Chennai.
          </p>
        </div>

        <button
          onClick={() => handleDownload('Monthly Master Settlement Report')}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs px-3.5 py-2 rounded transition flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" />
          <span>Export Master Settlement (CSV)</span>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Energy Delivered by Zone</h3>
            <p className="text-xs text-slate-500 mt-1">
              Substation metering logs, MWh consumption, and peak load timestamps for TANGEDCO reconciliation.
            </p>
          </div>
          <button
            onClick={() => handleDownload('TANGEDCO Energy Audit')}
            className="mt-4 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2 rounded transition"
          >
            Download Energy CSV
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-800 flex items-center justify-center mb-3">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Conflict & No-Show Log</h3>
            <p className="text-xs text-slate-500 mt-1">
              Detailed timestamps of walk-in rejections, 10-minute grace timeouts, and auto-releases.
            </p>
          </div>
          <button
            onClick={() => handleDownload('Reservation Conflict Log')}
            className="mt-4 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2 rounded transition"
          >
            Download Conflict Audit
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded bg-purple-50 text-purple-800 flex items-center justify-center mb-3">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Revenue & Platform Commission</h3>
            <p className="text-xs text-slate-500 mt-1">
              Monthly turnover (₹1.24 Cr), operator payout disbursements, and GST remittances.
            </p>
          </div>
          <button
            onClick={() => handleDownload('Revenue & GST Settlement')}
            className="mt-4 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2 rounded transition"
          >
            Download Financial PDF
          </button>
        </div>
      </div>
    </div>
  );
};
