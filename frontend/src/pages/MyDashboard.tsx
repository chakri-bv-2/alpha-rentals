import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { apiErrorMessage } from '../api';
import { useAuth } from '../auth';
import type { Booking } from '../types';
import CarImage from '../components/CarImage';
import Reveal from '../components/Reveal';

interface Profile {
  fullName: string;
  email: string;
  mobile: string;
  role: string;
  licenseVerified: boolean;
}

const titleCase = (s?: string | null) => (s ? s.charAt(0) + s.slice(1).toLowerCase() : '');
const today = () => new Date().toISOString().slice(0, 10);

export default function MyDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get<Profile>('/auth/me'), api.get<Booking[]>('/bookings/mine')])
      .then(([p, b]) => {
        setProfile(p.data);
        setBookings(b.data);
      })
      .catch((e) => setError(apiErrorMessage(e)));
  }, []);

  const stats = useMemo(() => {
    const active = bookings.filter((b) => b.status === 'CONFIRMED' && b.returnDate >= today()).length;
    const completed = bookings.filter((b) => b.status === 'COMPLETED' || b.returnDate < today()).length;
    const spent = bookings
      .filter((b) => b.paymentStatus === 'PAID')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    return { total: bookings.length, active, completed, spent };
  }, [bookings]);

  const CARDS = [
    { label: 'Total Bookings', value: stats.total, icon: '📋' },
    { label: 'Active Rentals', value: stats.active, icon: '🚗' },
    { label: 'Completed', value: stats.completed, icon: '✅' },
    { label: 'Total Spent', value: `₹${stats.spent.toLocaleString('en-IN')}`, icon: '💳' },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900">
        Welcome back, {user?.fullName?.split(' ')[0]} 👋
      </h1>
      <p className="mt-1 text-gray-500">Your rental activity at a glance.</p>

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {/* Profile + stats */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-1">
          <div className="card flex h-full flex-col items-center p-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-3xl font-bold text-brand-700">
              {profile?.fullName?.charAt(0).toUpperCase() ?? user?.fullName?.charAt(0)}
            </div>
            <p className="mt-3 text-lg font-bold text-gray-900">{profile?.fullName ?? user?.fullName}</p>
            <p className="text-sm text-gray-500">{profile?.email}</p>
            <p className="text-sm text-gray-500">{profile?.mobile}</p>
            <span
              className={`mt-4 rounded-full px-3 py-1 text-xs font-medium ${
                profile?.licenseVerified ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
              }`}
            >
              {profile?.licenseVerified ? '✓ License Verified' : 'License Pending Verification'}
            </span>
            <span className="mt-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
              Role: {titleCase(profile?.role)}
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          {CARDS.map((c, i) => (
            <Reveal key={c.label} delay={i * 70}>
              <div className="card flex h-full items-center justify-between p-5">
                <div>
                  <p className="text-sm text-gray-500">{c.label}</p>
                  <p className="mt-1 text-2xl font-extrabold text-gray-900">{c.value}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-lg">
                  {c.icon}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Recent bookings */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
        <Link to="/bookings" className="text-sm font-medium text-brand-600 hover:underline">
          View all →
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="card mt-4 p-8 text-center text-gray-500">
          No bookings yet.{' '}
          <Link to="/cars" className="font-medium text-brand-600 hover:underline">
            Browse cars
          </Link>{' '}
          to get started.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {bookings.slice(0, 4).map((b) => (
            <Reveal key={b.id}>
              <Link
                to="/bookings"
                className="card flex items-center gap-4 p-4 transition hover:shadow-md"
              >
                <CarImage src={b.vehicleImageUrl} alt={b.vehicleName} className="h-16 w-24 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{b.vehicleName}</p>
                  <p className="text-sm text-gray-500">{b.pickupDate} → {b.returnDate} ({b.totalDays} days)</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-600">₹{b.totalAmount.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-400">{titleCase(b.status)}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
