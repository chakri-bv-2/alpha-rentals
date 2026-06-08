import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { apiErrorMessage } from '../api';
import type { Vehicle } from '../types';

const PAYMENT_METHODS = ['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'Credit Card', 'Debit Card', 'Net Banking'];

// Local (not UTC) yyyy-MM-dd, so it matches the date picker and the server's LocalDate.
const addDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
// Earliest selectable pickup is today (past dates are not allowed).
const today = () => addDays(0);

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [pickupDate, setPickupDate] = useState(today());
  const [returnDate, setReturnDate] = useState(today());
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnTime, setReturnTime] = useState('10:00');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<Vehicle>(`/vehicles/${id}`).then((r) => setVehicle(r.data)).catch((e) => setError(apiErrorMessage(e)));
  }, [id]);

  const quote = useMemo(() => {
    if (!vehicle || !pickupDate || !returnDate) return null;
    const diff = Math.round(
      (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / 86_400_000
    );
    if (diff < 0) return null;
    // Same-date booking counts as 1 rental day.
    const days = Math.max(1, diff);
    const base = vehicle.pricePerDay * days;
    const gst = Math.round(base * 0.18 * 100) / 100;
    const deposit = vehicle.securityDeposit ?? 0;
    return { days, base, gst, deposit, total: base + gst + deposit };
  }, [vehicle, pickupDate, returnDate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (pickupDate < today()) {
      setError('Pickup date cannot be in the past.');
      return;
    }
    if (!returnDate || returnDate < pickupDate) {
      setError('Return date cannot be before the pickup date.');
      return;
    }
    if (pickupDate === returnDate && returnTime <= pickupTime) {
      setError('Return time must be after the pickup time for a same-day rental.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/bookings', {
        vehicleId: Number(id),
        pickupDate,
        returnDate,
        pickupTime,
        returnTime,
        paymentMethod,
      });
      navigate('/bookings', { state: { justBooked: data.id } });
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) return <p className="py-16 text-center text-gray-500">Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-4 text-2xl font-bold">Book {vehicle.name}</h1>
      <form onSubmit={submit} className="card space-y-4 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Pickup Date</label>
            <input
              className="input"
              type="date"
              min={today()}
              value={pickupDate}
              onChange={(e) => {
                const v = e.target.value;
                setPickupDate(v);
                if (returnDate < v) setReturnDate(v);
              }}
              required
            />
          </div>
          <div>
            <label className="label">Return Date</label>
            <input
              className="input"
              type="date"
              min={pickupDate}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Pickup Time</label>
            <input
              className="input"
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Return Time</label>
            <input
              className="input"
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="label">Payment Method</label>
          <select className="input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {quote && (
          <div className="rounded-lg bg-gray-50 p-4 text-sm">
            <Row label={`Rental (₹${vehicle.pricePerDay.toLocaleString('en-IN')} × ${quote.days} days)`} value={quote.base} />
            <Row label="GST (18%)" value={quote.gst} />
            <Row label="Refundable Security Deposit" value={quote.deposit} />
            <div className="mt-2 border-t pt-2">
              <Row label="Total Payable" value={quote.total} bold />
            </div>
          </div>
        )}

        {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p>}

        <button className="btn-primary w-full" disabled={loading || !quote}>
          {loading ? 'Processing payment…' : `Pay & Confirm Booking`}
        </button>
        <p className="text-center text-xs text-gray-400">Payment is simulated for this demo.</p>
      </form>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? 'font-bold text-base' : 'text-gray-600'}`}>
      <span>{label}</span>
      <span>₹{value.toLocaleString('en-IN')}</span>
    </div>
  );
}
