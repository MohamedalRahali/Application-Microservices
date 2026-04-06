export type DeliveryStatus =
  | 'PENDING' | 'CONFIRMED' | 'PREPARING'
  | 'PICKED_UP' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED';

/** Aligné sur `com.foodexpress.delivery.model.Delivery` (JSON camelCase). */
export interface Delivery {
  id?: number;
  orderId: string;
  customerId: string;
  /** Non présent dans l’API — enrichissement UI éventuel */
  customerName?: string;
  customerPhone?: string;
  restaurantId: string;
  restaurantName?: string;
  restaurantAddress?: string;
  restaurantPhone?: string;
  deliveryAddress: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  deliveryInstructions?: string;
  status: DeliveryStatus;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverVehicle?: string;
  driverRating?: number;
  driverAvatar?: string;
  estimatedMinutes?: number;
  /** Position tracking (API) */
  currentLatitude?: number;
  currentLongitude?: number;
  actualMinutes?: number;
  deliveryFee?: number;
  distance?: number;
  orderValue?: number;
  items?: OrderItem[];
  createdAt?: string;
  confirmedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

/** Aligné sur `com.foodexpress.delivery.model.Driver` (name, phone, avatar, vehicle, rating, available, coords). */
export interface Driver {
  id: number;
  name: string;
  phone: string;
  /** Absent côté API — ignoré à l’enregistrement */
  email?: string;
  avatar?: string;
  vehicle?: string;
  vehicleType?: 'BIKE' | 'SCOOTER' | 'CAR' | 'MOTORCYCLE';
  licensePlate?: string;
  rating: number;
  totalDeliveries?: number;
  available: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  phone: string;
  email?: string;
  cuisine?: string;
  rating?: number;
  active: boolean;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  addresses?: CustomerAddress[];
}

export interface CustomerAddress {
  id: number;
  label: string; // e.g., "Home", "Work"
  address: string;
  instructions?: string;
  isDefault: boolean;
}

export interface DeliveryStats {
  totalDeliveries: number;
  pendingDeliveries: number;
  activeDeliveries: number;
  completedDeliveries: number;
  cancelledDeliveries: number;
  totalDrivers: number;
  availableDrivers: number;
  averageDeliveryTime: number;
  totalRevenue: number;
}

export interface CreateDeliveryRequest {
  orderId?: string;
  customerId: string;
  restaurantId: string;
  deliveryAddress: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  /** Id livreur (optionnel). Vide = assignation automatique côté serveur. */
  driverId?: string;
}
