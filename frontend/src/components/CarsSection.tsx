import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { apiErrorMessage } from '../api';
import type { Vehicle } from '../types';
import VehicleCard from './VehicleCard';
import Reveal from './Reveal';
import { SearchIcon } from './icons';

const CATEGORIES = ['HATCHBACK', 'SEDAN', 'SUV', 'MUV', 'LUXURY', 'ELECTRIC'];
const FUELS = ['PETROL', 'DIESEL', 'ELECTRIC', 'CNG', 'HYBRID'];
const TRANSMISSIONS = ['MANUAL', 'AUTOMATIC'];

export default function CarsSection({ limit }: { limit?: number }) {
  const [params] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState(params.get('q') ?? '');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ category: '', fuelType: '', transmission: '', maxPrice: '' });

  const city = params.get('city') ?? '';

  useEffect(() => {
    setLoading(true);
    const query: Record<string, string> = {};
    if (city) query.city = city;
    api
      .get<Vehicle[]>('/vehicles', { params: query })
      .then((r) => setVehicles(r.data))
      .catch((e) => setError(apiErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [city]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = vehicles.filter((v) => {
      const haystack = `${v.name} ${v.brand} ${v.model} ${v.category} ${v.fuelType} ${v.transmission} ${v.city}`.toLowerCase();
      if (term && !haystack.includes(term)) return false;
      if (filters.category && v.category !== filters.category) return false;
      if (filters.fuelType && v.fuelType !== filters.fuelType) return false;
      if (filters.transmission && v.transmission !== filters.transmission) return false;
      if (filters.maxPrice && v.pricePerDay > Number(filters.maxPrice)) return false;
      return true;
    });
    if (limit) list = list.slice(0, limit);
    return list;
  }, [vehicles, q, filters, limit]);

  const set = (k: keyof typeof filters) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    setFilters((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section className="mx-auto max-w-6xl px-4">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Available Cars</h2>
        <p className="mt-2 text-gray-500">
          Browse our selection of premium vehicles available for your next adventure.
        </p>
        <div className="relative mt-6">
          <SearchIcon className="pointer-events-none absolute left-4 top-3.5 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by make, model, or features"
            className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-12 text-sm shadow-sm focus:border-brand-500 focus:outline-none"
          />
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={`absolute right-3 top-2 rounded-full p-1.5 ${showFilters ? 'text-brand-600' : 'text-gray-400'} hover:text-brand-600`}
            aria-label="Toggle filters"
            title="Filters"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 grid grid-cols-2 gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-left md:grid-cols-4">
            <select className="input" value={filters.category} onChange={set('category')}>
              <option value="">Any Type</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input" value={filters.fuelType} onChange={set('fuelType')}>
              <option value="">Any Fuel</option>
              {FUELS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input" value={filters.transmission} onChange={set('transmission')}>
              <option value="">Any Gearbox</option>
              {TRANSMISSIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input className="input" type="number" placeholder="Max ₹/day" value={filters.maxPrice} onChange={set('maxPrice')} />
          </div>
        )}
      </Reveal>

      {error && <p className="mt-6 rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">{error}</p>}

      <p className="mb-4 mt-8 text-sm text-gray-500">
        {loading ? 'Loading…' : `Showing ${filtered.length} Car${filtered.length === 1 ? '' : 's'}`}
      </p>

      {!loading && filtered.length === 0 && !error && (
        <p className="py-10 text-center text-gray-500">No cars match your search.</p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v, i) => (
          <Reveal key={v.id} delay={(i % 3) * 80}>
            <VehicleCard vehicle={v} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
