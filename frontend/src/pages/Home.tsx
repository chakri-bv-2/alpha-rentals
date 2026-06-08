import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import CarsSection from '../components/CarsSection';

// Local (not UTC) yyyy-MM-dd to match the date picker and avoid off-by-one days.
const today = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export default function Home() {
  const navigate = useNavigate();
  const [cities, setCities] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const [pickup, setPickup] = useState(today());
  const [ret, setRet] = useState('');

  useEffect(() => {
    api.get<string[]>('/cities').then((r) => setCities(r.data)).catch(() => {});
  }, []);

  const search = (e: FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (city) p.set('city', city);
    if (pickup) p.set('pickup', pickup);
    if (ret) p.set('return', ret);
    navigate(`/cars?${p.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section style={{ backgroundColor: '#edf0f5' }}>
        <div className="mx-auto max-w-6xl px-4 pb-4 pt-12 text-center">
          <h1 className="animate-fade-up text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            Self Drive Cars on Rent
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-gray-500">
            Book self-drive cars in minutes. Transparent GST pricing, UPI &amp; card payments.
          </p>

          <form
            onSubmit={search}
            className="mx-auto mt-8 flex max-w-3xl flex-col items-stretch gap-4 rounded-3xl bg-white p-5 shadow-lg sm:flex-row sm:items-end sm:rounded-full sm:px-6"
          >
            <div className="flex-1 text-left">
              <label className="label">Pickup Location</label>
              <select className="input border-0 px-0 focus:ring-0" value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">Please select location</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="hidden w-px self-stretch bg-gray-200 sm:block" />
            <div className="flex-1 text-left">
              <label className="label">Pick-up Date</label>
              <input className="input border-0 px-0 focus:ring-0" type="date" min={today()} value={pickup} onChange={(e) => setPickup(e.target.value)} />
            </div>
            <div className="hidden w-px self-stretch bg-gray-200 sm:block" />
            <div className="flex-1 text-left">
              <label className="label">Return Date</label>
              <input className="input border-0 px-0 focus:ring-0" type="date" min={pickup} value={ret} onChange={(e) => setRet(e.target.value)} />
            </div>
            <button className="btn-primary sm:px-8">Search</button>
          </form>

          <img
            src="/cars/defender.png"
            alt="Self-drive rental car"
            className="mx-auto mt-6 w-full max-w-4xl"
            onError={(e) => ((e.target as HTMLImageElement).src = '/hero-car.svg')}
          />
        </div>
      </section>

      {/* Available cars */}
      <div className="py-14">
        <CarsSection />
      </div>
    </div>
  );
}
