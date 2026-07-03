export interface CartItem {
  id: string;
  name: string;
  brand: string;
  weight: string;
  price: number; // Final price
  originalPrice?: number; // Original price before promo
  savings?: number; // Positive savings value
  quantity: number;
  promoApplied?: boolean;
  category: string;
}

export interface Aisle {
  id: string;
  name: string;
  emoji: string;
  row: number; // 0-indexed (0 to 2)
  col: number; // 0-indexed (0 to 3) (A to D)
  routeStop?: number; // 1-indexed stop number if on route
}

export interface RouteStop {
  stopNumber: number;
  aisleId: string;
  name: string;
  emoji: string;
  articlesCount: number;
  itemsList: string[];
}

export interface ShoppingListItem {
  id: string;
  name: string;
  aisleName: string;
  isChecked: boolean;
}

export type ScreenId = 'panier' | 'carte' | 'chercher' | 'promos' | 'liste' | 'compte' | 'settings';
