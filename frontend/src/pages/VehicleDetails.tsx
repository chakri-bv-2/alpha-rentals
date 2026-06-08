import { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { apiErrorMessage } from '../api';
import { useAuth } from '../auth';
import type { Review, Vehicle } from '../types';
import CarImage from '../components/CarImage';

export default function VehicleDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const load = async () => {
    try {
      const [v, r] = await Promise.all([
        api.get<Vehicle>(`/vehicles/${id}`),
        api.get<Review[]>(`/vehicles/${id}/reviews`),
      ]);
      setVehicle(v.data);
      setReviews(r.data);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submitReview = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/vehicles/${id}/reviews`, { rating, comment });
      setComment('');
      await load();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  if (error) return <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  if (!vehicle) return <p className="text-center text-gray-500">Loading…</p>;

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <CarImage src={vehicle.imageUrl} alt={vehicle.name} className="h-72 w-full rounded-2xl object-cover" />
        <h1 className="mt-4 text-2xl font-bold">{vehicle.name}</h1>
        <p className="text-gray-500">
          {vehicle.brand} {vehicle.model} · {vehicle.category}
          {vehicle.manufactureYear ? ` · ${vehicle.manufactureYear}` : ''}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Fuel', vehicle.fuelType],
            ['Gearbox', vehicle.transmission],
            ['Seats', vehicle.seatingCapacity],
            ['City', vehicle.city],
          ].map(([k, v]) => (
            <div key={k} className="card p-3 text-center">
              <p className="text-xs text-gray-400">{k}</p>
              <p className="font-medium">{v}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-gray-600">{vehicle.description}</p>

        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">
            Reviews {vehicle.reviewCount > 0 && <span className="text-amber-600">★ {vehicle.averageRating}</span>}
          </h2>
          {reviews.length === 0 && <p className="text-sm text-gray-500">No reviews yet.</p>}
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="card p-3">
                <div className="flex justify-between">
                  <span className="font-medium">{r.userName}</span>
                  <span className="text-amber-600">{'★'.repeat(r.rating)}</span>
                </div>
                <p className="text-sm text-gray-600">{r.comment}</p>
              </div>
            ))}
          </div>

          {user && (
            <form onSubmit={submitReview} className="card mt-4 space-y-3 p-4">
              <h3 className="font-medium">Leave a review</h3>
              <select className="input" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} ★</option>
                ))}
              </select>
              <textarea
                className="input"
                rows={3}
                placeholder="Share your experience…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button className="btn-primary">Submit Review</button>
            </form>
          )}
        </section>
      </div>

      <aside>
        <div className="card sticky top-20 p-5">
          <p className="text-3xl font-bold text-brand-600">
            ₹{vehicle.pricePerDay.toLocaleString('en-IN')}
            <span className="text-base font-normal text-gray-500">/day</span>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            + 18% GST · Refundable deposit ₹{vehicle.securityDeposit?.toLocaleString('en-IN')}
          </p>
          <div className="mt-4">
            {vehicle.available ? (
              user ? (
                <Link to={`/vehicles/${vehicle.id}/book`} className="btn-primary w-full">
                  Book Now
                </Link>
              ) : (
                <Link to="/login" state={{ from: `/vehicles/${vehicle.id}/book` }} className="btn-primary w-full">
                  Login to Book
                </Link>
              )
            ) : (
              <button className="btn-outline w-full" disabled>
                Not Available
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
