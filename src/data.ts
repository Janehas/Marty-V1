import { CartItem, Aisle, RouteStop, ShoppingListItem } from './types';

// The hardcoded store layout grid (4 columns x 3 rows)
export const STORE_AISLES: Aisle[] = [
  // Row 1 (back wall) - row index 0
  { id: 'boucherie', name: 'Boucherie / Poissonnerie', emoji: '🥩', row: 0, col: 0, routeStop: 2 },
  { id: 'cremerie', name: 'Crèmerie / Fromages', emoji: '🧀', row: 0, col: 1, routeStop: 3 },
  { id: 'laitiers', name: 'Produits laitiers / Yaourts', emoji: '🥛', row: 0, col: 2 },
  { id: 'surgeles', name: 'Surgelés', emoji: '❄️', row: 0, col: 3 },

  // Row 2 (middle) - row index 1
  { id: 'epicerie_salee', name: 'Épicerie salée', emoji: '🥫', row: 1, col: 0, routeStop: 5 },
  { id: 'pates_feculents', name: 'Pâtes / Riz / Féculents', emoji: '🍝', row: 1, col: 1, routeStop: 4 },
  { id: 'epicerie_sucree', name: 'Épicerie sucrée / Biscuits', emoji: '🍬', row: 1, col: 2 },
  { id: 'boissons', name: 'Boissons / Eaux', emoji: '🧃', row: 1, col: 3 },

  // Row 3 (near entrance) - row index 2
  { id: 'fruits_legumes', name: 'Fruits & Légumes', emoji: '🍎', row: 2, col: 0, routeStop: 1 },
  { id: 'boulangerie', name: 'Boulangerie / Viennoiserie', emoji: '🥖', row: 2, col: 1 },
  { id: 'hygiene', name: 'Hygiène / Beauté', emoji: '🧴', row: 2, col: 2 },
  { id: 'entretien', name: 'Entretien / Nettoyage', emoji: '🧹', row: 2, col: 3 },
];

// Optimized route details
export const ROUTE_STOPS: RouteStop[] = [
  {
    stopNumber: 1,
    aisleId: 'fruits_legumes',
    name: 'Fruits & Légumes',
    emoji: '🍎',
    articlesCount: 2,
    itemsList: ['Oignons Jaunes', 'Ail Violet'],
  },
  {
    stopNumber: 2,
    aisleId: 'boucherie',
    name: 'Boucherie / Poissonnerie',
    emoji: '🥩',
    articlesCount: 1,
    itemsList: ['Viande Hachée 15% mg'],
  },
  {
    stopNumber: 3,
    aisleId: 'cremerie',
    name: 'Crèmerie / Fromages',
    emoji: '🧀',
    articlesCount: 3,
    itemsList: ['Mozzarella di Bufala', 'Parmesan Râpé', 'Beurre Doux'],
  },
  {
    stopNumber: 4,
    aisleId: 'pates_feculents',
    name: 'Pâtes / Riz / Féculents',
    emoji: '🍝',
    articlesCount: 1,
    itemsList: ['Pâtes Lasagnes'],
  },
  {
    stopNumber: 5,
    aisleId: 'epicerie_salee',
    name: 'Épicerie salée',
    emoji: '🥫',
    articlesCount: 2,
    itemsList: ['Sauce Tomate Basilic', 'Huile d\'Olive'],
  },
  {
    stopNumber: 6,
    aisleId: 'caisses',
    name: 'Caisses',
    emoji: '🛒',
    articlesCount: 0,
    itemsList: [],
  }
];

// Initial cart items (Total: exactly 10 articles, 11.69 €, 0.93 € savings, 3 promos)
export const INITIAL_CART: CartItem[] = [
  {
    id: 'cart-1',
    name: 'Viande Hachée 15% mg',
    brand: 'Charal 400g',
    weight: '400g',
    price: 4.90,
    originalPrice: 5.50,
    savings: 0.60,
    quantity: 1,
    promoApplied: true,
    category: 'boucherie',
  },
  {
    id: 'cart-2',
    name: 'Mozzarella di Bufala',
    brand: 'Galbani 125g',
    weight: '125g',
    price: 1.89,
    originalPrice: 2.20,
    savings: 0.31,
    quantity: 1,
    promoApplied: true,
    category: 'cremerie',
  },
  {
    id: 'cart-3',
    name: 'Pâtes Lasagnes',
    brand: 'Barilla 500g',
    weight: '500g',
    price: 1.20,
    originalPrice: 1.22,
    savings: 0.02,
    quantity: 1,
    promoApplied: true,
    category: 'pates_feculents',
  },
  {
    id: 'cart-4',
    name: 'Oignons Jaunes',
    brand: 'Bio Village',
    weight: '500g',
    price: 0.60,
    quantity: 2,
    category: 'fruits_legumes',
  },
  {
    id: 'cart-5',
    name: 'Ail Violet',
    brand: 'Terroir d\'Origine',
    weight: '3 têtes',
    price: 0.90,
    quantity: 1,
    category: 'fruits_legumes',
  },
  {
    id: 'cart-6',
    name: 'Sauce Tomate Basilic',
    brand: 'Barilla 400g',
    weight: '400g',
    price: 1.00,
    quantity: 1,
    category: 'epicerie_salee',
  },
  {
    id: 'cart-7',
    name: 'Eau de Source des Alpes',
    brand: 'Cristaline',
    weight: '1.5L',
    price: 0.20,
    quantity: 3,
    category: 'boissons',
  }
];

// Product catalog for search (Screen 3)
export interface CatalogItem {
  id: string;
  name: string;
  brand: string;
  weight: string;
  price: number;
  originalPrice?: number;
  savings?: number;
  category: string;
  aisleId: string;
  promoApplied?: boolean;
}

export const CATALOG_PRODUCTS: CatalogItem[] = [
  { id: 'cat-1', name: 'Oignons Jaunes', brand: 'Bio Village', weight: '500g', price: 0.60, category: 'Fruits & Légumes', aisleId: 'fruits_legumes' },
  { id: 'cat-2', name: 'Ail Violet', brand: 'Terroir d\'Origine', weight: '3 têtes', price: 0.90, category: 'Fruits & Légumes', aisleId: 'fruits_legumes' },
  { id: 'cat-3', name: 'Viande Hachée 15% mg', brand: 'Charal 400g', weight: '400g', price: 4.90, originalPrice: 5.50, savings: 0.60, category: 'Boucherie', aisleId: 'boucherie', promoApplied: true },
  { id: 'cat-4', name: 'Mozzarella di Bufala', brand: 'Galbani 125g', weight: '125g', price: 1.89, originalPrice: 2.20, savings: 0.31, category: 'Crèmerie', aisleId: 'cremerie', promoApplied: true },
  { id: 'cat-5', name: 'Parmesan Râpé AOP', brand: 'Galbani', weight: '60g', price: 1.45, category: 'Crèmerie', aisleId: 'cremerie' },
  { id: 'cat-6', name: 'Pâtes Lasagnes', brand: 'Barilla', weight: '500g', price: 1.20, originalPrice: 1.22, savings: 0.02, category: 'Pâtes / Féculents', aisleId: 'pates_feculents', promoApplied: true },
  { id: 'cat-7', name: 'Sauce Tomate Basilic', brand: 'Barilla', weight: '400g', price: 1.00, category: 'Épicerie salée', aisleId: 'epicerie_salee' },
  { id: 'cat-8', name: 'Huile d\'Olive Vierge', brand: 'Puget', weight: '50cl', price: 4.80, category: 'Épicerie salée', aisleId: 'epicerie_salee' },
  { id: 'cat-9', name: 'Baguette Tradition', brand: 'Boulangerie du Club', weight: '250g', price: 0.95, category: 'Boulangerie', aisleId: 'boulangerie' },
  { id: 'cat-10', name: 'Pain de Mie Nature', brand: 'Harrys', weight: '500g', price: 1.65, category: 'Boulangerie', aisleId: 'boulangerie' },
  { id: 'cat-11', name: 'Yaourt Nature x8', brand: 'Danone', weight: '1kg', price: 1.99, category: 'Produits laitiers', aisleId: 'laitiers' },
  { id: 'cat-12', name: 'Gel Douche Amande', brand: 'Le Petit Marseillais', weight: '250ml', price: 2.10, category: 'Hygiène', aisleId: 'hygiene' },
];

// Store promotions (Screen 4)
export interface PromotionOffer {
  id: string;
  title: string;
  description: string;
  discountBadge: string;
  productName: string;
  brand: string;
  pricePromo: string;
  priceNormal: string;
  aisleName: string;
}

export const STORE_PROMOTIONS: PromotionOffer[] = [
  {
    id: 'promo-1',
    title: 'Offre Spéciale Crèmerie',
    description: 'Baisse de prix immédiate sur la Mozzarella d\'origine italienne.',
    discountBadge: '−0,31 €',
    productName: 'Mozzarella di Bufala',
    brand: 'Galbani 125g',
    pricePromo: '1,89 €',
    priceNormal: '2,20 €',
    aisleName: 'Crèmerie / Fromages'
  },
  {
    id: 'promo-2',
    title: 'Promo Pur Bœuf',
    description: 'Parfait pour vos lasagnes bolognaises, qualité boucher certifiée.',
    discountBadge: '−0,60 €',
    productName: 'Viande Hachée 15% mg',
    brand: 'Charal 400g',
    pricePromo: '4,90 €',
    priceNormal: '5,50 €',
    aisleName: 'Boucherie / Poissonnerie'
  },
  {
    id: 'promo-3',
    title: 'Remise Féculents',
    description: 'Une petite remise sur vos pâtes favorites Barilla.',
    discountBadge: '−0,02 €',
    productName: 'Pâtes Lasagnes',
    brand: 'Barilla 500g',
    pricePromo: '1,20 €',
    priceNormal: '1,22 €',
    aisleName: 'Pâtes / Riz / Féculents'
  }
];

// Shopping list items (Screen 5)
export const INITIAL_SHOPPING_LIST: ShoppingListItem[] = [
  { id: 'list-1', name: 'Oignons jaunes', aisleName: 'Fruits & Légumes', isChecked: false },
  { id: 'list-2', name: "Gousses d'ail", aisleName: 'Fruits & Légumes', isChecked: false },
  { id: 'list-3', name: 'Viande hachée 500g', aisleName: 'Boucherie', isChecked: false },
  { id: 'list-4', name: 'Mozzarella 125g', aisleName: 'Crèmerie', isChecked: false },
  { id: 'list-5', name: 'Parmesan râpé', aisleName: 'Crèmerie', isChecked: false },
  { id: 'list-6', name: 'Pâtes lasagnes', aisleName: 'Pâtes / Féculents', isChecked: false },
  { id: 'list-7', name: 'Sauce tomate', aisleName: 'Épicerie salée', isChecked: false },
  { id: 'list-8', name: "Huile d'olive", aisleName: 'Épicerie salée', isChecked: false },
  { id: 'list-9', name: 'Lait entier 1L', aisleName: 'Produits laitiers', isChecked: false },
];
