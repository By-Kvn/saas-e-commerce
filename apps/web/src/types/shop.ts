import { Product, Category, CartItem } from "@saas/types";

export interface ProductWithVariants extends Product {
  selectedVariant?: string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, variantId?: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  tags: string[];
  inStock: boolean;
  featured: boolean;
}

export interface SortOption {
  value: string;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: "newest", label: "Nouveautés" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "name-asc", label: "Nom A-Z" },
  { value: "name-desc", label: "Nom Z-A" },
  { value: "featured", label: "Produits phares" },
];
