export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  ratingCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  image: string;
  promoted: boolean;
  discount?: number;
  latitude?: number;
  longitude?: number;
  description?: string;
  categories?: string;
  active: boolean;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  restaurantCount: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  popular: boolean;
  vegetarian: boolean;
  available: boolean;
  restaurantId: number;
  menuCategoryId: number;
}

export interface MenuCategory {
  id: number;
  name: string;
  restaurantId: number;
  displayOrder: number;
  items: MenuItem[];
}

export interface MenuDto {
  restaurantId: number;
  categories: MenuCategory[];
}
