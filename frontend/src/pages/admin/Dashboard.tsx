import { useEffect, useState } from 'react';
import api, { apiErrorMessage } from '../../api';
import type { Booking } from '../../types';

interface Stats {
  totalCars: number;
  totalBookings: number;
  pending: number;
  confirmed: number;
  monthlyRevenue: number;
  recentBookings: Booking[];
}

const CARDS: { key: 'totalCars' | 'totalBookings' | 'pending' | 'confirmed'; label: string; icon: string }[] = [
  { key: 'totalCars', label: 'Total Cars', icon: '🚗' },
  { key: 'totalBookings', label: 'Total Bookings', icon: '📋' },
  { key: 'pending', label: 'Pending', icon: '⚠️' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅' },
];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<Stats>('/admin/stats').then((r) => setStats(r.data)).catch((e) => setError(apiErrorMessage(e)));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
      <p className="mt-1 max-w-2xl text-gray-500">
        Monitor overall platform performance including total cars, bookings, revenue, and recent activity.
      </p>

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CARDS.map((c) => (
          <div key={c.key} className="card flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">{c.label}</p>
              <p className="mt-1 text-3xl font-extrabold text-gray-900">{stats ? stats[c.key] : '—'}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-lg">
              {c.icon}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-bold text-gray-900">Recent Bookings</h2>
          <p className="text-sm text-gray-500">Latest customer bookings</p>
          <div className="mt-4 divide-y divide-gray-100">
            {stats?.recentBookings.length ? (
              stats.recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-800">{b.vehicleName}</p>
                    <p className="text-xs text-gray-400">{b.pickupDate} → {b.returnDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-brand-600">₹{b.totalAmount.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-400">{b.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-sm text-gray-400">No bookings yet.</p>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-gray-900">Monthly Revenue</h2>
          <p className="text-sm text-gray-500">Revenue for the current month</p>
          <p className="mt-8 text-4xl font-extrabold text-brand-600">
            ₹{stats ? stats.monthlyRevenue.toLocaleString('en-IN') : '0'}
          </p>
        </div>
      </div>
    </div>
  );
}
