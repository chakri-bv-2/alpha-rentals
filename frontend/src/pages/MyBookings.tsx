import { useEffect, useState } from 'react';
import api, { apiErrorMessage } from '../api';
import type { Booking } from '../types';
import CarImage from '../components/CarImage';
import Reveal from '../components/Reveal';
import { PinIcon } from '../components/icons';

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: 'bg-green-50 text-green-700',
  PENDING: 'bg-amber-50 text-amber-700',
  CANCELLED: 'bg-red-50 text-red-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
};

const titleCase = (s?: string | null) => (s ? s.charAt(0) + s.slice(1).toLowerCase() : '');

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get<Booking[]>('/bookings/mine');
      setBookings(data);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id: number) => {
    if (!confirm('Cancel this booking? A refund will be processed.')) return;
    try {
      await api.post(`/bookings/${id}/cancel`);
      await load();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  if (loading) return <p className="mx-auto max-w-6xl px-4 py-16 text-center text-gray-500">Loading…</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900">My Bookings</h1>
      <p className="mt-1 text-gray-500">View and manage all your car bookings</p>

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {bookings.length === 0 ? (
        <p className="mt-10 text-gray-500">You have no bookings yet.</p>
      ) : (
        <div className="mt-8 space-y-5">
          {bookings.map((b) => (
            <Reveal key={b.id}>
              <div className="card grid gap-5 p-5 md:grid-cols-[220px_1fr_auto]">
                <div>
                  <CarImage src={b.vehicleImageUrl} alt={b.vehicleName} className="h-36 w-full rounded-xl object-cover" />
                  <h3 className="mt-3 font-bold text-gray-900">{b.vehicleName}</h3>
                  <p className="text-sm text-gray-500">
                    {[b.vehicleYear, titleCase(b.vehicleCategory), b.vehicleCity].filter(Boolean).join(' • ')}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                      Booking #{b.id}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[b.status] ?? ''}`}>
                      {titleCase(b.status)}
                    </span>
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                      📅 Rental Period
                    </p>
                    <p className="text-sm text-gray-800">
                      {b.pickupDate}{b.pickupTime ? `, ${b.pickupTime.slice(0, 5)}` : ''} to{' '}
                      {b.returnDate}{b.returnTime ? `, ${b.returnTime.slice(0, 5)}` : ''} ({b.totalDays} {b.totalDays === 1 ? 'day' : 'days'})
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                      <PinIcon /> Pick-up Location
                    </p>
                    <p className="text-sm text-gray-800">{b.vehicleCity}</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Payment: {b.paymentMethod} · {titleCase(b.paymentStatus)} · Ref {b.paymentReference}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between gap-3 text-right">
                  <div>
                    <p className="text-sm text-gray-400">Total Price</p>
                    <p className="text-2xl font-extrabold text-brand-600">₹{b.totalAmount.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-400">Booked on {b.createdAt?.slice(0, 10)}</p>
                    <p className="text-xs text-gray-400">
                      incl. ₹{b.gstAmount.toLocaleString('en-IN')} GST · ₹{b.securityDeposit.toLocaleString('en-IN')} deposit
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-outline px-3 py-1.5 text-xs" onClick={() => window.print()}>
                      Invoice
                    </button>
                    {b.status === 'CONFIRMED' && (
                      <button className="btn-outline px-3 py-1.5 text-xs text-red-600" onClick={() => cancel(b.id)}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
