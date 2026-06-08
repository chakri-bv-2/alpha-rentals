import { Link } from 'react-router-dom';
import type { Vehicle } from '../types';
import CarImage from './CarImage';
import { FuelIcon, GearIcon, PinIcon, SeatIcon } from './icons';

const titleCase = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      to={`/vehicles/${vehicle.id}`}
      className="group card overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative">
        <CarImage
          src={vehicle.imageUrl}
          alt={vehicle.name}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {vehicle.available && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white shadow">
            Available Now
          </span>
        )}
        <span className="absolute bottom-3 right-3 rounded-lg bg-gray-900/85 px-3 py-1.5 text-sm font-bold text-white">
          ₹{vehicle.pricePerDay.toLocaleString('en-IN')}
          <span className="text-xs font-normal text-gray-300"> / day</span>
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-gray-900">{vehicle.name}</h3>
          {vehicle.reviewCount > 0 && (
            <span className="whitespace-nowrap text-sm font-medium text-amber-500">
              ★ {vehicle.averageRating}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">
          {titleCase(vehicle.category)} {vehicle.manufactureYear ? `• ${vehicle.manufactureYear}` : ''}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-y-3 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <SeatIcon className="text-gray-400" /> {vehicle.seatingCapacity} Seats
          </span>
          <span className="flex items-center gap-2">
            <FuelIcon className="text-gray-400" /> {titleCase(vehicle.fuelType)}
          </span>
          <span className="flex items-center gap-2">
            <GearIcon className="text-gray-400" /> {titleCase(vehicle.transmission)}
          </span>
          <span className="flex items-center gap-2">
            <PinIcon className="text-gray-400" /> {vehicle.city}
          </span>
        </div>
      </div>
    </Link>
  );
}
