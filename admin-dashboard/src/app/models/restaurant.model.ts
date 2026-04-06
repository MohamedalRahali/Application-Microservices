export interface Restaurant {
  id?: number;
  name: string;
  cuisine: string;
  rating?: number;
  ratingCount?: number;
  deliveryTime?: string;
  deliveryFee?: number;
  minOrder?: number;
  image?: string;
  promoted?: boolean;
  discount?: number;
  latitude?: number;
  longitude?: number;
  description?: string;
  categories?: string;
  active?: boolean;
}

export interface RestaurantStats {
  totalRestaurants: number;
  activeRestaurants: number;
  promotedRestaurants: number;
  totalCategories: number;
}
