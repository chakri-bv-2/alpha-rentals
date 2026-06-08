import { useEffect, useState } from 'react';
import api, { apiErrorMessage } from '../../api';
import type { Booking } from '../../types';

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: 'bg-green-50 text-green-700',
  PENDING: 'bg-amber-50 text-amber-700',
  CANCELLED: 'bg-red-50 text-red-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
};

export default function ManageBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');

  const load = () =>
    api.get<Booking[]>('/admin/bookings').then((r) => setBookings(r.data)).catch((e) => setError(apiErrorMessage(e)));

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id: number) => {
    if (!confirm('Cancel this booking and process a refund?')) return;
    try {
      await api.post(`/bookings/${id}/cancel`);
      load();
    } catch (e) {
      setError(apiErrorMessage(e));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900">Manage Bookings</h1>
      <p className="mt-1 text-gray-500">Track all customer bookings, process cancellations, and manage booking statuses.</p>

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 text-gray-500">
            <tr>
              <th className="p-4 font-medium">Car</th>
              <th className="p-4 font-medium">Date Range</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Payment</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">No bookings yet.</td></tr>
            )}
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-gray-50 last:border-0">
                <td className="p-4 font-medium text-gray-800">{b.vehicleName}</td>
                <td className="p-4">
                  {b.pickupDate}{b.pickupTime ? ` ${b.pickupTime.slice(0, 5)}` : ''} → {b.returnDate}{b.returnTime ? ` ${b.returnTime.slice(0, 5)}` : ''}
                </td>
                <td className="p-4">₹{b.totalAmount.toLocaleString('en-IN')}</td>
                <td className="p-4">{b.paymentMethod} · {b.paymentStatus}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[b.status] ?? ''}`}>
                    {b.status}
                  </span>
                </td>
                <td className="p-4">
                  {b.status === 'CONFIRMED' ? (
                    <button className="btn-outline px-3 py-1.5 text-xs text-red-600" onClick={() => cancel(b.id)}>
                      Cancel
                    </button>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
