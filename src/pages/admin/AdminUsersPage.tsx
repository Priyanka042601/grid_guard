import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Shield,
  UserCheck,
  Mail,
  Phone,
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { addNotification } = useApp();

  const [usersList, setUsersList] = useState([
    {
      id: 'USR-01',
      name: 'Karthik Subramanian',
      role: 'EV Driver',
      email: 'karthik.s@example.com',
      phone: '+91 98401 23456',
      vehicle: 'Tata Nexon EV (TN 09 BX 7842)',
      status: 'active',
      joined: '12 Jan 2026',
    },
    {
      id: 'USR-02',
      name: 'Ramanathan Sethuraman',
      role: 'Station Partner',
      email: 'owner@greenvolt-chennai.in',
      phone: '+91 98410 77889',
      vehicle: 'GreenVolt Anna Nagar (6 bays)',
      status: 'active',
      joined: '04 Feb 2026',
    },
    {
      id: 'USR-03',
      name: 'Ananya Ramesh',
      role: 'EV Driver',
      email: 'ananya.r@chennai.in',
      phone: '+91 98402 88990',
      vehicle: 'MG ZS EV (TN 07 CA 9012)',
      status: 'active',
      joined: '18 Mar 2026',
    },
    {
      id: 'USR-04',
      name: 'TANGEDCO GreenGrid Ltd',
      role: 'Fleet Operator',
      email: 'fleet@tangedco.gov.in',
      phone: '+91 44 2852 0131',
      vehicle: 'Guindy & OMR Hubs',
      status: 'active',
      joined: '10 Nov 2025',
    },
    {
      id: 'USR-05',
      name: 'Suresh Kumar',
      role: 'EV Driver',
      email: 'suresh.k@gmail.com',
      phone: '+91 94441 55667',
      vehicle: 'Hyundai Ioniq 5 (TN 01 DJ 3344)',
      status: 'active',
      joined: '22 Apr 2026',
    },
  ]);

  const [search, setSearch] = useState('');

  const filtered = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            User & Fleet Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered EV drivers, private charging station operators, and corporate fleet managers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700">Total Accounts:</span>
          <span className="bg-slate-100 text-slate-900 font-bold px-2.5 py-1 rounded">
            {usersList.length} Accounts
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by driver name, email or vehicle model..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded bg-white"
          />
        </div>
      </div>

      <div className="mt-4 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Vehicle / Station</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{u.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{u.name}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        u.role === 'Station Partner'
                          ? 'bg-blue-50 text-blue-800'
                          : u.role === 'Fleet Operator'
                          ? 'bg-purple-50 text-purple-800'
                          : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="block text-slate-800">{u.email}</span>
                    <span className="text-slate-400 text-[11px]">{u.phone}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{u.vehicle}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => addNotification('User Verified', `KYC re-checked for ${u.name}`, 'info')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded text-xs font-medium"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
