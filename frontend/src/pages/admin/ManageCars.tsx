import { useEffect, useState } from 'react';
import api, { apiErrorMessage } from '../../api';
import type { Vehicle } from '../../types';
import CarImage from '../../components/CarImage';

const STATUS_STYLES: Record<string, string> = {
  APPROVED: 'bg-green-50 text-green-700',
  PENDING: 'bg-amber-50 text-amber-700',
  REJECTED: 'bg-red-50 text-red-700',
};

export default function ManageCars() {
  const [cars, setCars] = useState<Vehicle[]>([]);
  const [error, setError] = useState('');

  const load = () =>
    api.get<Vehicle[]>('/admin/vehicles').then((r) => setCars(r.data)).catch((e) => setError(apiErrorMessage(e)));

  useEffect(() => {
    load();
  }, []);

  const setApproval = async (id: number, status: string) => {
    try {
      await api.patch(`/admin/vehicles/${id}/approval`, null, { params: { status } });
      load();
    } catch (e) {
      setError(apiErrorMessage(e));
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Remove this car from the platform?')) return;
    try {
      await api.delete(`/admin/vehicles/${id}`);
      load();
    } catch (e) {
      setError(apiErrorMessage(e));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900">Manage Cars</h1>
      <p className="mt-1 text-gray-500">View all listed cars, update their details, or remove them from the booking platform.</p>

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 text-gray-500">
            <tr>
              <th className="p-4 font-medium">Car</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-gray-400">No cars listed.</td></tr>
            )}
            {cars.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <CarImage src={c.imageUrl} alt={c.name} className="h-12 w-16 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.city}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">{c.category}</td>
                <td className="p-4">₹{c.pricePerDay.toLocaleString('en-IN')}/day</td>
                <td className="p-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[c.approvalStatus] ?? ''}`}>
                    {c.approvalStatus}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {c.approvalStatus !== 'APPROVED' && (
                      <button className="btn-outline px-3 py-1.5 text-xs text-green-600" onClick={() => setApproval(c.id, 'APPROVED')}>
                        Approve
                      </button>
                    )}
                    {c.approvalStatus !== 'REJECTED' && (
                      <button className="btn-outline px-3 py-1.5 text-xs text-amber-600" onClick={() => setApproval(c.id, 'REJECTED')}>
                        Reject
                      </button>
                    )}
                    <button className="btn-outline px-3 py-1.5 text-xs text-red-600" onClick={() => remove(c.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
