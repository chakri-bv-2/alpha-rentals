export type Role = 'USER' | 'OWNER' | 'ADMIN';

export interface AuthUser {
  token: string;
  userId: number;
  fullName: string;
  email: string;
  role: Role;
}

export interface Vehicle {
  id: number;
  name: string;
  brand: string;
  model: string;
  manufactureYear: number | null;
  category: string;
  fuelType: string;
  transmission: string;
  seatingCapacity: number;
  pricePerDay: number;
  securityDeposit: number;
  city: string;
  location: string;
  imageUrl: string;
  description: string;
  available: boolean;
  approvalStatus: string;
  averageRating: number;
  reviewCount: number;
}

export interface Booking {
  id: number;
  vehicleId: number;
  vehicleName: string;
  vehicleImageUrl: string;
  vehicleYear: number | null;
  vehicleCategory: string | null;
  vehicleCity: string | null;
  pickupDate: string;
  returnDate: string;
  pickupTime: string | null;
  returnTime: string | null;
  totalDays: number;
  baseAmount: number;
  gstAmount: number;
  securityDeposit: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentReference: string;
  paymentMethod: string;
  createdAt: string;
}

export interface Review {
  id: number;
  vehicleId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
