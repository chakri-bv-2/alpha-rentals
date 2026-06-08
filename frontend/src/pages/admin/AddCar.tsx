import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { apiErrorMessage } from '../../api';

const CATEGORIES = ['HATCHBACK', 'SEDAN', 'SUV', 'MUV', 'LUXURY', 'ELECTRIC'];
const FUELS = ['PETROL', 'DIESEL', 'ELECTRIC', 'CNG', 'HYBRID'];
const TRANSMISSIONS = ['MANUAL', 'AUTOMATIC'];

const EMPTY = {
  brand: '',
  model: '',
  manufactureYear: '',
  pricePerDay: '',
  securityDeposit: '',
  category: '',
  transmission: '',
  fuelType: '',
  seatingCapacity: '',
  city: '',
  location: '',
  imageUrl: '',
  description: '',
};

export default function AddCar() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [cities, setCities] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<string[]>('/cities').then((r) => setCities(r.data)).catch(() => {});
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/vehicles', {
        brand: form.brand,
        model: form.model,
        manufactureYear: form.manufactureYear ? Number(form.manufactureYear) : null,
        pricePerDay: Number(form.pricePerDay),
        securityDeposit: form.securityDeposit ? Number(form.securityDeposit) : 0,
        category: form.category || null,
        transmission: form.transmission || null,
        fuelType: form.fuelType || null,
        seatingCapacity: Number(form.seatingCapacity) || 0,
        city: form.city,
        location: form.location,
        imageUrl: form.imageUrl,
        description: form.description,
      });
      setSuccess('Car listed! It is pending approval — approve it under Manage Cars to make it public.');
      setForm(EMPTY);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-extrabold text-gray-900">Add New Car</h1>
      <p className="mt-1 text-gray-500">
        Fill in details to list a new car for booking, including pricing, availability, and specifications.
      </p>

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {success && <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</p>}

      <form onSubmit={submit} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Brand">
            <input className="input" placeholder="e.g. Maruti, Hyundai, Honda…" value={form.brand} onChange={set('brand')} required />
          </Field>
          <Field label="Model">
            <input className="input" placeholder="e.g. Swift, Creta, City…" value={form.model} onChange={set('model')} required />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Year">
            <input className="input" type="number" placeholder="2023" value={form.manufactureYear} onChange={set('manufactureYear')} />
          </Field>
          <Field label="Daily Price (₹)">
            <input className="input" type="number" placeholder="0" value={form.pricePerDay} onChange={set('pricePerDay')} required />
          </Field>
          <Field label="Category">
            <select className="input" value={form.category} onChange={set('category')}>
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Transmission">
            <select className="input" value={form.transmission} onChange={set('transmission')}>
              <option value="">Select a transmission</option>
              {TRANSMISSIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Fuel Type">
            <select className="input" value={form.fuelType} onChange={set('fuelType')}>
              <option value="">Select a fuel type</option>
              {FUELS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Seating Capacity">
            <input className="input" type="number" placeholder="0" value={form.seatingCapacity} onChange={set('seatingCapacity')} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="City">
            <select className="input" value={form.city} onChange={set('city')} required>
              <option value="">Select a city</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Security Deposit (₹)">
            <input className="input" type="number" placeholder="0" value={form.securityDeposit} onChange={set('securityDeposit')} />
          </Field>
        </div>

        <Field label="Location / Area">
          <input className="input" placeholder="e.g. Gachibowli, Koramangala…" value={form.location} onChange={set('location')} />
        </Field>

        <Field label="Image URL (optional)">
          <input className="input" placeholder="/cars/swift.svg or https://…" value={form.imageUrl} onChange={set('imageUrl')} />
        </Field>

        <Field label="Description">
          <textarea className="input" rows={4} placeholder="e.g. A luxurious SUV with a spacious interior and a powerful engine." value={form.description} onChange={set('description')} />
        </Field>

        <div className="flex gap-3">
          <button className="btn-primary" disabled={loading}>
            {loading ? 'Listing…' : '✓ List Your Car'}
          </button>
          <button type="button" className="btn-outline" onClick={() => navigate('/admin/cars')}>
            View Listings
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
