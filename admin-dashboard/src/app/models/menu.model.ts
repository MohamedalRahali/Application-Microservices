export interface MenuItem {
  id?: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  available: boolean;
  categoryId?: number;
  categoryName?: string;
  restaurantId: number;
  restaurantName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MenuCategory {
  id?: number;
  name: string;
  /** Absent côté API Java : valeur par défaut côté front */
  description?: string;
  restaurantId: number;
  restaurantName?: string;
  displayOrder: number;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MenuStats {
  totalItems: number;
  totalCategories: number;
  availableItems: number;
  unavailableItems: number;
  averagePrice: number;
  mostExpensiveItem?: MenuItem | null;
  cheapestItem?: MenuItem | null;
}