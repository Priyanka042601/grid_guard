import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Receipt,
  Download,
  Calendar,
  Zap,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  X,
} from 'lucide-react';
import { ChargingHistoryRecord } from '../../types';

export const ChargingHistoryPage: React.FC = () => {
  const { history } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState<ChargingHistoryRecord | null>(null);

  const totalKwh = history.reduce((acc, h) => acc + h.energyDeliveredKwh, 0);
  const totalSpent = history.reduce((acc, h) => acc + h.amountPaidInr, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full font-sans">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Charging History & Invoices
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Record of all completed sessions across Chennai with GST tax invoices.
        </p>
      </div>

      {/* Aggregate Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Total Energy Charged</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{totalKwh.toFixed(1)} kWh</span>
          <span className="text-[11px] text-slate-400">Equivalent to ~{(totalKwh * 7.2).toFixed(0)} km driven</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Total Platform Spend</span>
          <span className="text-2xl font-bold text-emerald-800 mt-1 block">₹{totalSpent.toFixed(2)}</span>
          <span className="text-[11px] text-slate-400">Avg ₹13.8/kWh</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Completed Sessions</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{history.length}</span>
          <span className="text-[11px] text-emerald-700 font-medium">100% successful delivery</span>
        </div>
      </div>

      {/* History Table */}
      <div className="mt-8 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Session Records</h2>
          <span className="text-xs text-slate-500">Sorted by most recent</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Station & Bay</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Energy</th>
                <th className="py-3 px-4">Tariff</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-medium text-slate-900">{record.date}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900 block">{record.stationName}</span>
                    <span className="text-slate-500 text-[11px]">{record.stationArea} • Bay {record.chargerId}</span>
                  </td>
                  <td className="py-3.5 px-4">{record.durationMinutes} min</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{record.energyDeliveredKwh} kWh</td>
                  <td className="py-3.5 px-4">₹{record.ratePerKwh}/kWh</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-800">₹{record.amountPaidInr.toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedInvoice(record)}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded font-medium text-xs border border-slate-200 transition"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-slate-200 text-slate-900 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-sm">Tax Invoice: {selectedInvoice.invoiceNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="font-medium text-slate-800">{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Station:</span>
                <span className="font-semibold text-slate-800">{selectedInvoice.stationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bay & Vehicle:</span>
                <span className="text-slate-800">{selectedInvoice.chargerId} ({selectedInvoice.vehicleName})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Energy Delivered:</span>
                <span className="font-semibold text-slate-900">{selectedInvoice.energyDeliveredKwh} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tariff:</span>
                <span className="text-slate-900">₹{selectedInvoice.ratePerKwh}/kWh</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm">
                <span>Total Paid (incl. GST):</span>
                <span className="text-emerald-800">₹{selectedInvoice.amountPaidInr.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-4 py-2 rounded flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
